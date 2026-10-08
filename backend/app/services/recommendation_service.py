import os

import joblib
import numpy as np
import pandas as pd
from scipy import sparse
from sklearn.metrics.pairwise import cosine_similarity

from app.utils.parsing import clean_optional, split_csv_list


BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))

MODEL_DIR = os.path.join(BASE_DIR, "models")
DATA_DIR = os.path.join(BASE_DIR, "data")

VECTORIZER_PATH = os.path.join(
    MODEL_DIR,
    "tfidf_vectorizer.pkl",
)

MATRIX_PATH = os.path.join(
    MODEL_DIR,
    "tfidf_matrix.npz",
)

MOVIES_PATH = os.path.join(
    MODEL_DIR,
    "recommendation_movies.csv",
)

CATALOG_PATH = os.path.join(
    DATA_DIR,
    "movies_cleaned_final.csv",
)


class RecommendationService:
    def __init__(self):
        self.vectorizer = None
        self.matrix = None
        self.movies = None
        self.id_to_index = None
        self.poster_map = {}

        self._load_model()
        self._load_poster_map()

    def _load_model(self):
        """Load recommendation model files once."""

        if not os.path.exists(VECTORIZER_PATH):
            raise FileNotFoundError(
                f"TF-IDF vectorizer not found: {VECTORIZER_PATH}"
            )

        if not os.path.exists(MATRIX_PATH):
            raise FileNotFoundError(
                f"TF-IDF matrix not found: {MATRIX_PATH}"
            )

        if not os.path.exists(MOVIES_PATH):
            raise FileNotFoundError(
                f"Recommendation movie metadata not found: {MOVIES_PATH}"
            )

        self.vectorizer = joblib.load(
            VECTORIZER_PATH
        )

        self.matrix = sparse.load_npz(
            MATRIX_PATH
        )

        self.movies = pd.read_csv(
            MOVIES_PATH
        ).reset_index(drop=True)

        if self.matrix.shape[0] != len(self.movies):
            raise ValueError(
                "Recommendation matrix and movie metadata row counts do not match."
            )

        self.id_to_index = pd.Series(
            self.movies.index,
            index=self.movies["id"].astype(int),
        ).to_dict()

        print(
            f"Recommendation model loaded successfully: "
            f"{len(self.movies)} movies"
        )

    def _load_poster_map(self):
        """
        Load poster paths from the full cleaned catalogue.

        recommendation_movies.csv does not contain poster_path,
        so poster metadata is attached separately using the movie id.
        """

        if not os.path.exists(CATALOG_PATH):
            print(
                f"Warning: cleaned movie catalogue not found: "
                f"{CATALOG_PATH}"
            )
            return

        try:
            catalog = pd.read_csv(
                CATALOG_PATH,
                usecols=["id", "poster_path"],
            )

            catalog = catalog.dropna(
                subset=["id"]
            )

            catalog["id"] = pd.to_numeric(
                catalog["id"],
                errors="coerce",
            )

            catalog = catalog.dropna(
                subset=["id"]
            )

            catalog["id"] = catalog[
                "id"
            ].astype(int)

            self.poster_map = {
                int(row["id"]): clean_optional(
                    row["poster_path"]
                )
                for _, row in catalog.iterrows()
            }

            print(
                f"Poster metadata loaded successfully: "
                f"{len(self.poster_map)} movies"
            )

        except Exception as exc:
            print(
                "Warning: unable to load poster metadata:",
                repr(exc),
            )
            self.poster_map = {}

    @staticmethod
    def _clean_float(value):
        """Safely convert values to float."""

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
    def _clean_int(value):
        """Safely convert values to integer."""

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

    def get_similar_movies(
        self,
        movie_id: int,
        top_n: int = 10,
    ):
        """
        Return improved content-based movie recommendations.

        Ranking combines:
        - TF-IDF cosine similarity
        - popularity
        - vote count
        - vote average
        """

        movie_id = int(movie_id)

        if movie_id not in self.id_to_index:
            return None

        idx = self.id_to_index[
            movie_id
        ]

        # --------------------------------------------------
        # Content similarity
        # --------------------------------------------------

        similarity_scores = cosine_similarity(
            self.matrix[idx],
            self.matrix,
        ).flatten()

        movies = self.movies.copy()

        movies[
            "similarity_score"
        ] = similarity_scores

        # Remove the selected movie itself
        movies = movies.drop(
            index=idx
        ).copy()

        # --------------------------------------------------
        # Popularity normalization
        # --------------------------------------------------

        max_popularity = movies[
            "popularity"
        ].max()

        if (
            pd.notna(max_popularity)
            and max_popularity > 0
        ):
            movies[
                "popularity_norm"
            ] = (
                movies[
                    "popularity"
                ].fillna(0)
                / max_popularity
            )
        else:
            movies[
                "popularity_norm"
            ] = 0.0

        # --------------------------------------------------
        # Vote count normalization
        # --------------------------------------------------

        movies[
            "vote_count_norm"
        ] = np.log1p(
            movies[
                "vote_count"
            ].fillna(0)
        )

        max_vote_count = movies[
            "vote_count_norm"
        ].max()

        if max_vote_count > 0:
            movies[
                "vote_count_norm"
            ] = (
                movies[
                    "vote_count_norm"
                ]
                / max_vote_count
            )

        # --------------------------------------------------
        # Rating normalization
        # --------------------------------------------------

        movies[
            "rating_norm"
        ] = (
            movies[
                "vote_average"
            ].fillna(0)
            / 10.0
        )

        # --------------------------------------------------
        # Final ranking score
        # --------------------------------------------------

        movies[
            "final_score"
        ] = (
            movies[
                "similarity_score"
            ] * 0.75
            + movies[
                "popularity_norm"
            ] * 0.15
            + movies[
                "vote_count_norm"
            ] * 0.20
            + movies[
                "rating_norm"
            ] * 0.10
        )

        # Remove very weak content matches
        movies = movies[
            (
                movies[
                    "similarity_score"
                ] >= 0.08
            )
            & (
                movies[
                    "vote_count"
                ] >= 50
            )
        ]

        # Rank recommendations
        movies = movies.sort_values(
            "final_score",
            ascending=False,
        ).head(top_n)

        # --------------------------------------------------
        # Build JSON-safe response
        # --------------------------------------------------

        results = []

        for _, movie in movies.iterrows():
            current_movie_id = int(
                movie["id"]
            )

            results.append(
                {
                    "id": current_movie_id,

                    "title": str(
                        movie["title"]
                    ),

                    "release_date": clean_optional(
                        movie.get(
                            "release_date"
                        )
                    ),

                    "poster_path": clean_optional(
                        self.poster_map.get(
                            current_movie_id
                        )
                    ),

                    "genres": split_csv_list(
                        movie.get(
                            "genres"
                        )
                    ),

                    "vote_average": self._clean_float(
                        movie.get(
                            "vote_average"
                        )
                    ),

                    "vote_count": self._clean_int(
                        movie.get(
                            "vote_count"
                        )
                    ),

                    "popularity": self._clean_float(
                        movie.get(
                            "popularity"
                        )
                    ),

                    "similarity_score": float(
                        movie[
                            "similarity_score"
                        ]
                    ),
                }
            )

        return results


recommendation_service = RecommendationService()