"""Pydantic response models for CineMatch movie endpoints.

Fields mirror the actual columns present in ``movies_cleaned_final.csv``:
    id, title, vote_average, vote_count, release_date, runtime, adult,
    backdrop_path, original_language, overview, popularity, poster_path,
    tagline, genres, production_companies, keywords
"""
from __future__ import annotations

from typing import List, Optional

from pydantic import BaseModel, ConfigDict, Field


class MovieSummary(BaseModel):
    """Lightweight movie representation used in list / search endpoints."""

    model_config = ConfigDict(extra="ignore")

    id: int
    title: str
    release_date: Optional[str] = None
    vote_average: Optional[float] = None
    vote_count: Optional[int] = None
    popularity: Optional[float] = None
    original_language: Optional[str] = None
    poster_path: Optional[str] = None
    backdrop_path: Optional[str] = None
    genres: List[str] = Field(default_factory=list)


class MovieDetail(MovieSummary):
    """Full movie details returned by ``GET /api/movies/{movie_id}``."""

    runtime: Optional[int] = None
    adult: Optional[bool] = None
    overview: Optional[str] = None
    tagline: Optional[str] = None
    production_companies: List[str] = Field(default_factory=list)
    keywords: List[str] = Field(default_factory=list)


class PaginatedMovies(BaseModel):
    page: int
    limit: int
    total: int
    total_pages: int
    count: int
    items: List[MovieSummary]


class SearchResponse(BaseModel):
    query: str
    page: int
    limit: int
    total: int
    total_pages: int
    count: int
    items: List[MovieSummary]


class GenresResponse(BaseModel):
    count: int
    genres: List[str]


class RecommendedMovie(BaseModel):
    """Movie returned by the content-based recommendation engine."""

    id: int
    title: str
    release_date: Optional[str] = None
    poster_path: Optional[str] = None
    genres: List[str] = Field(default_factory=list)
    vote_average: Optional[float] = None
    vote_count: Optional[int] = None
    popularity: Optional[float] = None
    similarity_score: float

class SimilarMoviesResponse(BaseModel):
    """Response model for GET /api/movies/{movie_id}/similar."""

    movie_id: int
    count: int
    recommendations: List[RecommendedMovie]


class HealthResponse(BaseModel):
    status: str
    message: str
    movies_loaded: int
