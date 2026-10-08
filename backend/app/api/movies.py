"""REST endpoints for the CineMatch movie catalogue."""

from typing import Optional

import httpx
from fastapi import APIRouter, HTTPException, Query

from app.models.movie import (
    GenresResponse,
    MovieDetail,
    PaginatedMovies,
    SearchResponse,
    SimilarMoviesResponse,
)
from app.services.movie_service import get_service
from app.services.recommendation_service import recommendation_service
from app.services.tmdb_service import tmdb_service


router = APIRouter(
    prefix="/api",
    tags=["movies"],
)


# ---------------------------------------------------------
# MOVIE LIST
# ---------------------------------------------------------

@router.get(
    "/movies",
    response_model=PaginatedMovies,
)
def list_movies(
    page: int = Query(
        1,
        ge=1,
        description="1-indexed page number",
    ),
    limit: int = Query(
        20,
        ge=1,
        le=100,
        description="Items per page",
    ),
    genre: Optional[str] = Query(
        None,
        description="Filter by genre",
    ),
    language: Optional[str] = Query(
        None,
        description="Filter by original language code",
    ),
    year_min: Optional[int] = Query(
        None,
        ge=1800,
        le=2100,
        description="Minimum release year",
    ),
    year_max: Optional[int] = Query(
        None,
        ge=1800,
        le=2100,
        description="Maximum release year",
    ),
    min_rating: Optional[float] = Query(
        None,
        ge=0,
        le=10,
        description="Minimum vote average",
    ),
    sort: Optional[str] = Query(
        None,
        description=(
            "Sort by popularity, rating, votes, "
            "newest, oldest or title"
        ),
    ),
):
    """Return filtered and paginated local movies."""

    service = get_service()

    return service.list_movies(
        page=page,
        limit=limit,
        genre=genre,
        language=language,
        year_min=year_min,
        year_max=year_max,
        min_rating=min_rating,
        sort=sort,
    )


# ---------------------------------------------------------
# SEARCH
# ---------------------------------------------------------

@router.get(
    "/search",
    response_model=SearchResponse,
)
def search_movies(
    q: str = Query(
        ...,
        description="Case-insensitive movie title search",
    ),
    page: int = Query(
        1,
        ge=1,
    ),
    limit: int = Query(
        20,
        ge=1,
        le=100,
    ),
    genre: Optional[str] = Query(
        None,
    ),
    language: Optional[str] = Query(
        None,
    ),
    year_min: Optional[int] = Query(
        None,
        ge=1800,
        le=2100,
    ),
    year_max: Optional[int] = Query(
        None,
        ge=1800,
        le=2100,
    ),
    min_rating: Optional[float] = Query(
        None,
        ge=0,
        le=10,
    ),
    sort: Optional[str] = Query(
        None,
    ),
):
    """Search movies by title with optional filters."""

    query = q.strip()

    if not query:
        raise HTTPException(
            status_code=400,
            detail=(
                "Query parameter 'q' "
                "must not be empty"
            ),
        )

    service = get_service()

    return service.search_titles(
        query=query,
        page=page,
        limit=limit,
        genre=genre,
        language=language,
        year_min=year_min,
        year_max=year_max,
        min_rating=min_rating,
        sort=sort,
    )


# ---------------------------------------------------------
# GENRES
# ---------------------------------------------------------

@router.get(
    "/genres",
    response_model=GenresResponse,
)
def get_genres():
    """Return all unique genres."""

    service = get_service()

    genres = service.list_genres()

    return {
        "count": len(genres),
        "genres": genres,
    }


# ---------------------------------------------------------
# TMDB TRENDING MOVIES
# ---------------------------------------------------------

@router.get(
    "/trending",
)
def get_trending_movies(
    limit: int = Query(
        20,
        ge=1,
        le=20,
        description="Number of trending movies",
    ),
):
    """Return live daily trending movies from TMDB."""

    try:
        movies = tmdb_service.get_trending_movies(
            limit=limit,
        )

        return {
            "count": len(movies),
            "movies": movies,
        }

    except Exception as exc:
        print(
            "TRENDING ERROR:",
            repr(exc),
        )

        raise HTTPException(
            status_code=502,
            detail=(
                f"{type(exc).__name__}: "
                f"{str(exc)}"
            ),
        ) from exc


# ---------------------------------------------------------
# TMDB MOVIE DETAILS
# ---------------------------------------------------------

@router.get(
    "/tmdb/movies/{movie_id}",
)
def get_tmdb_movie_details(
    movie_id: int,
):
    """Return live movie details from TMDB."""

    if movie_id <= 0:
        raise HTTPException(
            status_code=400,
            detail="Invalid movie id",
        )

    try:
        return tmdb_service.get_movie_details(
            movie_id,
        )

    except httpx.HTTPStatusError as exc:
        if exc.response.status_code == 404:
            raise HTTPException(
                status_code=404,
                detail=(
                    f"TMDB movie "
                    f"{movie_id} not found"
                ),
            ) from exc

        raise HTTPException(
            status_code=502,
            detail=(
                "Unable to fetch movie "
                "details from TMDB."
            ),
        ) from exc

    except Exception as exc:
        print(
            "TMDB DETAIL ERROR:",
            repr(exc),
        )

        raise HTTPException(
            status_code=502,
            detail=(
                "Unable to fetch movie "
                "details from TMDB."
            ),
        ) from exc


# ---------------------------------------------------------
# TMDB RECOMMENDATIONS
# ---------------------------------------------------------

@router.get(
    "/tmdb/movies/{movie_id}/recommendations",
)
def get_tmdb_movie_recommendations(
    movie_id: int,
    limit: int = Query(
        20,
        ge=1,
        le=20,
        description="Number of TMDB recommendations",
    ),
):
    """Return movie recommendations from TMDB."""

    if movie_id <= 0:
        raise HTTPException(
            status_code=400,
            detail="Invalid movie id",
        )

    try:
        movies = tmdb_service.get_movie_recommendations(
            movie_id=movie_id,
            limit=limit,
        )

        return {
            "count": len(movies),
            "movies": movies,
        }

    except httpx.HTTPStatusError as exc:
        if exc.response.status_code == 404:
            raise HTTPException(
                status_code=404,
                detail=(
                    f"TMDB movie "
                    f"{movie_id} not found"
                ),
            ) from exc

        raise HTTPException(
            status_code=502,
            detail=(
                "Unable to fetch TMDB "
                "recommendations."
            ),
        ) from exc

    except Exception as exc:
        print(
            "TMDB RECOMMENDATIONS ERROR:",
            repr(exc),
        )

        raise HTTPException(
            status_code=502,
            detail=(
                "Unable to fetch TMDB "
                "recommendations."
            ),
        ) from exc


# ---------------------------------------------------------
# TMDB VIDEOS / TRAILER
# ---------------------------------------------------------

@router.get(
    "/tmdb/movies/{movie_id}/videos",
)
def get_tmdb_movie_videos(
    movie_id: int,
):
    """Return the preferred TMDB trailer for a movie."""

    if movie_id <= 0:
        raise HTTPException(
            status_code=400,
            detail="Invalid movie id",
        )

    try:
        return tmdb_service.get_movie_videos(
            movie_id=movie_id,
        )

    except httpx.HTTPStatusError as exc:
        if exc.response.status_code == 404:
            raise HTTPException(
                status_code=404,
                detail=(
                    f"TMDB movie "
                    f"{movie_id} not found"
                ),
            ) from exc

        raise HTTPException(
            status_code=502,
            detail=(
                "Unable to fetch TMDB "
                "videos."
            ),
        ) from exc

    except Exception as exc:
        print(
            "TMDB VIDEOS ERROR:",
            repr(exc),
        )

        raise HTTPException(
            status_code=502,
            detail=(
                "Unable to fetch TMDB "
                "videos."
            ),
        ) from exc


# ---------------------------------------------------------
# TMDB SCREENSHOT
# ---------------------------------------------------------
@router.get(
    "/tmdb/movies/{movie_id}/images",
)
def get_tmdb_movie_images(
    movie_id: int,
    limit: int = Query(
        12,
        ge=1,
        le=20,
        description="Number of movie still images",
    ),
):
    """Return TMDB backdrop/still images."""

    if movie_id <= 0:
        raise HTTPException(
            status_code=400,
            detail="Invalid movie id",
        )

    try:
        return tmdb_service.get_movie_images(
            movie_id=movie_id,
            limit=limit,
        )

    except httpx.HTTPStatusError as exc:
        if exc.response.status_code == 404:
            raise HTTPException(
                status_code=404,
                detail=(
                    f"TMDB movie "
                    f"{movie_id} not found"
                ),
            ) from exc

        raise HTTPException(
            status_code=502,
            detail=(
                "Unable to fetch TMDB "
                "movie images."
            ),
        ) from exc

    except Exception as exc:
        print(
            "TMDB IMAGES ERROR:",
            repr(exc),
        )

        raise HTTPException(
            status_code=502,
            detail=(
                "Unable to fetch TMDB "
                "movie images."
            ),
        ) from exc


    
# ---------------------------------------------------------
# SIMILAR MOVIES - LOCAL RECOMMENDATION ENGINE
# ---------------------------------------------------------

@router.get(
    "/movies/{movie_id}/similar",
    response_model=SimilarMoviesResponse,
)
def get_similar_movies(
    movie_id: int,
    limit: int = Query(
        10,
        ge=1,
        le=20,
        description="Number of similar movies",
    ),
):
    """Return content-based local recommendations."""

    if movie_id <= 0:
        raise HTTPException(
            status_code=400,
            detail="Invalid movie id",
        )

    recommendations = (
        recommendation_service
        .get_similar_movies(
            movie_id=movie_id,
            top_n=limit,
        )
    )

    if recommendations is None:
        raise HTTPException(
            status_code=404,
            detail=(
                f"Movie {movie_id} "
                "not found"
            ),
        )

    return {
        "movie_id": movie_id,
        "count": len(
            recommendations
        ),
        "recommendations": recommendations,
    }


# ---------------------------------------------------------
# LOCAL MOVIE DETAILS
# ---------------------------------------------------------

@router.get(
    "/movies/{movie_id}",
    response_model=MovieDetail,
)
def get_movie_by_id(
    movie_id: int,
):
    """Return movie details from the local dataset."""

    if movie_id <= 0:
        raise HTTPException(
            status_code=400,
            detail="Invalid movie id",
        )

    service = get_service()

    movie = service.get_movie(
        movie_id,
    )

    if movie is None:
        raise HTTPException(
            status_code=404,
            detail=(
                f"Movie {movie_id} "
                "not found"
            ),
        )

    return movie