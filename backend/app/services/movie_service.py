"""Movie data service.

Loads ``movies_cleaned_final.csv`` once at application start-up and keeps it
in memory so API handlers can serve pagination, filtering, sorting, lookup,
search and genre queries without repeatedly reading the CSV.
"""

from __future__ import annotations

import logging
import math
from pathlib import Path
from typing import Dict, List, Optional

import pandas as pd

from app.models.movie import MovieDetail, MovieSummary
from app.utils.parsing import clean_optional, split_csv_list


logger = logging.getLogger(__name__)


EXPECTED_COLUMNS = [
    "id",
    "title",
    "vote_average",
    "vote_count",
    "release_date",
    "runtime",
    "adult",
    "backdrop_path",
    "original_language",
    "overview",
    "popularity",
    "poster_path",
    "tagline",
    "genres",
    "production_companies",
    "keywords",
]


class MovieService:
    def __init__(self, csv_path: Path):
        self.csv_path = csv_path

        self._df: Optional[pd.DataFrame] = None

        self._id_to_index: Dict[int, int] = {}

        self._title_lower: Optional[pd.Series] = None

        self._unique_genres: List[str] = []

    # ---------------------------------------------------------
    # LOAD
    # ---------------------------------------------------------

    def load(self) -> None:
        if not self.csv_path.exists():
            raise FileNotFoundError(
                f"CSV not found at {self.csv_path}"
            )

        logger.info(
            "Loading movies CSV from %s",
            self.csv_path,
        )

        dtype = {
            "id": "Int64",
            "title": "string",
            "vote_average": "float64",
            "vote_count": "Int64",
            "release_date": "string",
            "runtime": "Int64",
            "original_language": "string",
            "overview": "string",
            "popularity": "float64",
            "poster_path": "string",
            "backdrop_path": "string",
            "tagline": "string",
            "genres": "string",
            "production_companies": "string",
            "keywords": "string",
        }

        df = pd.read_csv(
            self.csv_path,
            dtype=dtype,
            low_memory=False,
        )

        # Ensure all expected columns exist.
        for column in EXPECTED_COLUMNS:
            if column not in df.columns:
                df[column] = pd.NA

        # Remove unusable records.
        df = df.dropna(
            subset=["id", "title"]
        ).copy()

        df["id"] = df[
            "id"
        ].astype("int64")

        # -----------------------------------------------------
        # Internal helper columns
        # -----------------------------------------------------

        df["_title_lower"] = (
            df["title"]
            .astype("string")
            .str.lower()
        )

        # Extract release year for filtering.
        df["_release_year"] = pd.to_numeric(
            df["release_date"]
            .astype("string")
            .str.slice(0, 4),
            errors="coerce",
        )

        # Pre-compute normalized genres.
        df["_genre_list"] = df[
            "genres"
        ].apply(
            lambda value: [
                genre.strip().lower()
                for genre in split_csv_list(value)
            ]
        )

        df.reset_index(
            drop=True,
            inplace=True,
        )

        self._title_lower = df[
            "_title_lower"
        ]

        # id -> row index
        self._id_to_index = {
            int(movie_id): index
            for index, movie_id
            in enumerate(df["id"].tolist())
        }

        # Unique genres
        genre_set = set()

        for cell in df[
            "genres"
        ].dropna().tolist():
            for genre in split_csv_list(cell):
                genre_set.add(genre)

        self._unique_genres = sorted(
            genre_set,
            key=str.lower,
        )

        self._df = df

        logger.info(
            "Loaded %d movies, %d unique genres",
            len(df),
            len(self._unique_genres),
        )

    # ---------------------------------------------------------
    # HELPERS
    # ---------------------------------------------------------

    @property
    def df(self) -> pd.DataFrame:
        if self._df is None:
            raise RuntimeError(
                "MovieService.load() has not been called"
            )

        return self._df

    def count(self) -> int:
        if self._df is None:
            return 0

        return int(
            len(self._df)
        )

    @staticmethod
    def _to_float(value) -> Optional[float]:
        if value is None:
            return None

        try:
            if pd.isna(value):
                return None
        except (TypeError, ValueError):
            pass

        try:
            return float(value)
        except (TypeError, ValueError):
            return None

    @staticmethod
    def _to_int(value) -> Optional[int]:
        if value is None:
            return None

        try:
            if pd.isna(value):
                return None
        except (TypeError, ValueError):
            pass

        try:
            return int(value)
        except (TypeError, ValueError):
            return None

    def _row_to_summary(
        self,
        row: pd.Series,
    ) -> MovieSummary:
        return MovieSummary(
            id=int(row["id"]),
            title=str(row["title"]),
            release_date=clean_optional(
                row.get("release_date")
            ),
            vote_average=self._to_float(
                row.get("vote_average")
            ),
            vote_count=self._to_int(
                row.get("vote_count")
            ),
            popularity=self._to_float(
                row.get("popularity")
            ),
            original_language=clean_optional(
                row.get("original_language")
            ),
            poster_path=clean_optional(
                row.get("poster_path")
            ),
            backdrop_path=clean_optional(
                row.get("backdrop_path")
            ),
            genres=split_csv_list(
                row.get("genres")
            ),
        )

    def _row_to_detail(
        self,
        row: pd.Series,
    ) -> MovieDetail:
        summary = self._row_to_summary(
            row
        )

        adult_value = row.get(
            "adult"
        )

        if isinstance(
            adult_value,
            str,
        ):
            adult_bool: Optional[bool] = (
                adult_value
                .strip()
                .lower()
                == "true"
            )

        elif pd.isna(
            adult_value
        ):
            adult_bool = None

        else:
            adult_bool = bool(
                adult_value
            )

        return MovieDetail(
            **summary.model_dump(),
            runtime=self._to_int(
                row.get("runtime")
            ),
            adult=adult_bool,
            overview=clean_optional(
                row.get("overview")
            ),
            tagline=clean_optional(
                row.get("tagline")
            ),
            production_companies=split_csv_list(
                row.get(
                    "production_companies"
                )
            ),
            keywords=split_csv_list(
                row.get("keywords")
            ),
        )

    # ---------------------------------------------------------
    # FILTERING
    # ---------------------------------------------------------

    def _apply_filters(
        self,
        dataframe: pd.DataFrame,
        genre: Optional[str] = None,
        language: Optional[str] = None,
        year_min: Optional[int] = None,
        year_max: Optional[int] = None,
        min_rating: Optional[float] = None,
    ) -> pd.DataFrame:

        result = dataframe

        # -----------------------------------------------------
        # Genre
        # -----------------------------------------------------

        if genre:
            normalized_genre = (
                genre
                .strip()
                .lower()
                .replace("-", " ")
            )

            result = result[
                result["_genre_list"].apply(
                    lambda genres:
                    normalized_genre in genres
                )
            ]

        # -----------------------------------------------------
        # Language
        # -----------------------------------------------------

        if language:
            normalized_language = (
                language
                .strip()
                .lower()
            )

            result = result[
                result[
                    "original_language"
                ]
                .fillna("")
                .astype(str)
                .str.lower()
                == normalized_language
            ]

        # -----------------------------------------------------
        # Minimum year
        # -----------------------------------------------------

        if year_min is not None:
            result = result[
                result[
                    "_release_year"
                ] >= year_min
            ]

        # -----------------------------------------------------
        # Maximum year
        # -----------------------------------------------------

        if year_max is not None:
            result = result[
                result[
                    "_release_year"
                ] <= year_max
            ]

        # -----------------------------------------------------
        # Minimum rating
        # -----------------------------------------------------

        if min_rating is not None:
            result = result[
                result[
                    "vote_average"
                ].fillna(0)
                >= min_rating
            ]

        return result

    # ---------------------------------------------------------
    # SORTING
    # ---------------------------------------------------------

    def _apply_sort(
        self,
        dataframe: pd.DataFrame,
        sort: Optional[str],
    ) -> pd.DataFrame:

        if not sort:
            return dataframe

        normalized = (
            sort
            .strip()
            .lower()
            .replace("-", "_")
        )

        # Popular movies
        if normalized in {
            "popular",
            "popularity",
            "most_popular",
        }:
            return dataframe.sort_values(
                by=[
                    "popularity",
                    "vote_count",
                ],
                ascending=[
                    False,
                    False,
                ],
                na_position="last",
            )

        # Top rated
        if normalized in {
            "rating",
            "top_rated",
            "vote_average",
        }:
            return dataframe.sort_values(
                by=[
                    "vote_average",
                    "vote_count",
                    "popularity",
                ],
                ascending=[
                    False,
                    False,
                    False,
                ],
                na_position="last",
            )

        # Most voted
        if normalized in {
            "votes",
            "vote_count",
            "most_voted",
        }:
            return dataframe.sort_values(
                by=[
                    "vote_count",
                    "vote_average",
                ],
                ascending=[
                    False,
                    False,
                ],
                na_position="last",
            )

        # Newest
        if normalized in {
            "newest",
            "release_date",
            "latest",
        }:
            return dataframe.sort_values(
                by=[
                    "_release_year",
                    "popularity",
                ],
                ascending=[
                    False,
                    False,
                ],
                na_position="last",
            )

        # Oldest
        if normalized == "oldest":
            return dataframe.sort_values(
                by="_release_year",
                ascending=True,
                na_position="last",
            )

        # Alphabetical
        if normalized in {
            "title",
            "alphabetical",
            "a_z",
        }:
            return dataframe.sort_values(
                by="_title_lower",
                ascending=True,
                na_position="last",
            )

        # Unknown sort value:
        # return original dataframe instead of crashing.
        return dataframe

    # ---------------------------------------------------------
    # PAGINATION
    # ---------------------------------------------------------

    def _paginate(
        self,
        dataframe: pd.DataFrame,
        page: int,
        limit: int,
    ) -> Dict:

        total = int(
            len(dataframe)
        )

        total_pages = (
            math.ceil(
                total / limit
            )
            if limit and total
            else 0
        )

        start = (
            page - 1
        ) * limit

        end = (
            start + limit
        )

        page_df = dataframe.iloc[
            start:end
        ]

        items = [
            self._row_to_summary(row)
            for _, row
            in page_df.iterrows()
        ]

        return {
            "page": page,
            "limit": limit,
            "total": total,
            "total_pages": total_pages,
            "count": len(items),
            "items": items,
        }

    # ---------------------------------------------------------
    # MOVIE LIST
    # ---------------------------------------------------------

    def list_movies(
        self,
        page: int,
        limit: int,
        genre: Optional[str] = None,
        language: Optional[str] = None,
        year_min: Optional[int] = None,
        year_max: Optional[int] = None,
        min_rating: Optional[float] = None,
        sort: Optional[str] = None,
    ) -> Dict:

        movies = self.df

        movies = self._apply_filters(
            movies,
            genre=genre,
            language=language,
            year_min=year_min,
            year_max=year_max,
            min_rating=min_rating,
        )

        movies = self._apply_sort(
            movies,
            sort=sort,
        )

        return self._paginate(
            movies,
            page=page,
            limit=limit,
        )

    # ---------------------------------------------------------
    # MOVIE DETAIL
    # ---------------------------------------------------------

    def get_movie(
        self,
        movie_id: int,
    ) -> Optional[MovieDetail]:

        index = self._id_to_index.get(
            int(movie_id)
        )

        if index is None:
            return None

        return self._row_to_detail(
            self.df.iloc[index]
        )

    # ---------------------------------------------------------
    # SEARCH
    # ---------------------------------------------------------

    def search_titles(
        self,
        query: str,
        page: int,
        limit: int,
        genre: Optional[str] = None,
        language: Optional[str] = None,
        year_min: Optional[int] = None,
        year_max: Optional[int] = None,
        min_rating: Optional[float] = None,
        sort: Optional[str] = None,
    ) -> Dict:

        needle = (
            query
            .strip()
            .lower()
        )

        movies = self.df[
            self.df[
                "_title_lower"
            ].str.contains(
                needle,
                na=False,
                regex=False,
            )
        ]

        movies = self._apply_filters(
            movies,
            genre=genre,
            language=language,
            year_min=year_min,
            year_max=year_max,
            min_rating=min_rating,
        )

        movies = self._apply_sort(
            movies,
            sort=sort,
        )

        result = self._paginate(
            movies,
            page=page,
            limit=limit,
        )

        result["query"] = query

        return result

    # ---------------------------------------------------------
    # GENRES
    # ---------------------------------------------------------

    def list_genres(
        self,
    ) -> List[str]:

        return list(
            self._unique_genres
        )


# -------------------------------------------------------------
# SINGLETON
# -------------------------------------------------------------

_service: Optional[
    MovieService
] = None


def init_service(
    csv_path: Path,
) -> MovieService:

    global _service

    service = MovieService(
        csv_path
    )

    service.load()

    _service = service

    return service


def get_service() -> MovieService:

    if _service is None:
        raise RuntimeError(
            "MovieService is not initialised"
        )

    return _service