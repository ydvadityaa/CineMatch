import os
import time
from typing import Any

import httpx
from dotenv import load_dotenv

load_dotenv()

TMDB_ACCESS_TOKEN = os.getenv("TMDB_ACCESS_TOKEN")

TMDB_BASE_URL = "https://api.themoviedb.org/3"
TMDB_POSTER_BASE_URL = "https://image.tmdb.org/t/p/w500"
TMDB_BACKDROP_BASE_URL = "https://image.tmdb.org/t/p/w1280"


class TMDBService:
    def __init__(self):
        if not TMDB_ACCESS_TOKEN:
            raise ValueError(
                "TMDB_ACCESS_TOKEN is missing from the .env file."
            )

        self.headers = {
            "Authorization": f"Bearer {TMDB_ACCESS_TOKEN}",
            "accept": "application/json",
        }

        self._trending_cache: list[dict[str, Any]] = []
        self._trending_cache_time: float = 0.0

        self._trending_cache_ttl = 30 * 60

    # ---------------------------------------------------------
    # HTTP CLIENT
    # ---------------------------------------------------------

    def _get_client(self) -> httpx.Client:
        timeout = httpx.Timeout(
            connect=20.0,
            read=30.0,
            write=30.0,
            pool=30.0,
        )

        transport = httpx.HTTPTransport(
            retries=2,
            local_address="0.0.0.0",
        )

        return httpx.Client(
            headers=self.headers,
            timeout=timeout,
            transport=transport,
            follow_redirects=True,
            http2=False,
        )

    # ---------------------------------------------------------
    # SAFE REQUEST WITH RETRIES
    # ---------------------------------------------------------

    def _request_json(
        self,
        url: str,
        *,
        params: dict[str, Any] | None = None,
        attempts: int = 4,
    ) -> dict[str, Any]:
        last_error: Exception | None = None

        retryable_errors = (
            httpx.ConnectError,
            httpx.ConnectTimeout,
            httpx.ReadTimeout,
            httpx.WriteTimeout,
            httpx.PoolTimeout,
            httpx.RemoteProtocolError,
        )

        for attempt in range(1, attempts + 1):
            try:
                with self._get_client() as client:
                    response = client.get(
                        url,
                        params=params,
                    )

                    response.raise_for_status()

                    return response.json()

            except retryable_errors as exc:
                last_error = exc

                print(
                    f"TMDB connection attempt "
                    f"{attempt}/{attempts} failed: "
                    f"{type(exc).__name__}: {exc}"
                )

            except httpx.HTTPStatusError as exc:
                status_code = exc.response.status_code

                if status_code >= 500:
                    last_error = exc

                    print(
                        f"TMDB HTTP attempt "
                        f"{attempt}/{attempts} failed: "
                        f"{status_code}"
                    )
                else:
                    raise

            if attempt < attempts:
                time.sleep(attempt)

        if last_error:
            raise last_error

        raise RuntimeError(
            "TMDB request failed."
        )

    # ---------------------------------------------------------
    # IMAGE HELPERS
    # ---------------------------------------------------------

    @staticmethod
    def _poster_url(
        poster_path: str | None,
    ) -> str | None:
        if not poster_path:
            return None

        return (
            f"{TMDB_POSTER_BASE_URL}"
            f"{poster_path}"
        )

    @staticmethod
    def _backdrop_url(
        backdrop_path: str | None,
    ) -> str | None:
        if not backdrop_path:
            return None

        return (
            f"{TMDB_BACKDROP_BASE_URL}"
            f"{backdrop_path}"
        )

    # ---------------------------------------------------------
    # TRENDING
    # ---------------------------------------------------------

    def get_trending_movies(
        self,
        limit: int = 20,
    ):
        url = (
            f"{TMDB_BASE_URL}"
            "/trending/movie/day"
        )

        try:
            data = self._request_json(
                url,
                attempts=4,
            )

            movies = []

            for movie in data.get(
                "results",
                [],
            )[:limit]:
                movies.append(
                    {
                        "id": movie.get("id"),
                        "title": movie.get(
                            "title"
                        ),
                        "original_title": movie.get(
                            "original_title"
                        ),
                        "overview": movie.get(
                            "overview"
                        ),
                        "release_date": movie.get(
                            "release_date"
                        ),
                        "vote_average": movie.get(
                            "vote_average"
                        ),
                        "vote_count": movie.get(
                            "vote_count"
                        ),
                        "popularity": movie.get(
                            "popularity"
                        ),
                        "original_language": movie.get(
                            "original_language"
                        ),
                        "poster_url": self._poster_url(
                            movie.get(
                                "poster_path"
                            )
                        ),
                        "backdrop_url": self._backdrop_url(
                            movie.get(
                                "backdrop_path"
                            )
                        ),
                    }
                )

            if movies:
                self._trending_cache = movies
                self._trending_cache_time = time.time()

            return movies

        except Exception as exc:
            print(
                "TRENDING ERROR:",
                repr(exc),
            )

            if self._trending_cache:
                cache_age = (
                    time.time()
                    - self._trending_cache_time
                )

                print(
                    "Using cached trending movies. "
                    f"Cache age: "
                    f"{int(cache_age)} seconds"
                )

                return self._trending_cache[
                    :limit
                ]

            raise

    # ---------------------------------------------------------
    # MOVIE DETAILS
    # ---------------------------------------------------------

    def get_movie_details(
        self,
        movie_id: int,
    ):
        url = (
            f"{TMDB_BASE_URL}"
            f"/movie/{movie_id}"
        )

        movie = self._request_json(
            url,
            attempts=4,
        )

        return {
            "id": movie.get("id"),
            "title": movie.get(
                "title"
            ),
            "original_title": movie.get(
                "original_title"
            ),
            "overview": movie.get(
                "overview"
            ),
            "release_date": movie.get(
                "release_date"
            ),
            "runtime": movie.get(
                "runtime"
            ),
            "vote_average": movie.get(
                "vote_average"
            ),
            "vote_count": movie.get(
                "vote_count"
            ),
            "popularity": movie.get(
                "popularity"
            ),
            "original_language": movie.get(
                "original_language"
            ),
            "status": movie.get(
                "status"
            ),
            "tagline": movie.get(
                "tagline"
            ),
            "genres": [
                genre.get("name")
                for genre in movie.get(
                    "genres",
                    [],
                )
                if genre.get("name")
            ],
            "poster_url": self._poster_url(
                movie.get(
                    "poster_path"
                )
            ),
            "backdrop_url": self._backdrop_url(
                movie.get(
                    "backdrop_path"
                )
            ),
        }

    # ---------------------------------------------------------
    # TMDB RECOMMENDATIONS
    # ---------------------------------------------------------

    def get_movie_recommendations(
        self,
        movie_id: int,
        limit: int = 20,
    ):
        url = (
            f"{TMDB_BASE_URL}"
            f"/movie/{movie_id}"
            "/recommendations"
        )

        data = self._request_json(
            url,
            attempts=4,
        )

        movies = []

        for movie in data.get(
            "results",
            [],
        )[:limit]:
            movies.append(
                {
                    "id": movie.get(
                        "id"
                    ),
                    "title": movie.get(
                        "title"
                    ),
                    "original_title": movie.get(
                        "original_title"
                    ),
                    "overview": movie.get(
                        "overview"
                    ),
                    "release_date": movie.get(
                        "release_date"
                    ),
                    "vote_average": movie.get(
                        "vote_average"
                    ),
                    "vote_count": movie.get(
                        "vote_count"
                    ),
                    "popularity": movie.get(
                        "popularity"
                    ),
                    "original_language": movie.get(
                        "original_language"
                    ),
                    "poster_url": self._poster_url(
                        movie.get(
                            "poster_path"
                        )
                    ),
                    "backdrop_url": self._backdrop_url(
                        movie.get(
                            "backdrop_path"
                        )
                    ),
                }
            )

        return movies

    # ---------------------------------------------------------
    # TRAILERS / VIDEOS
    # ---------------------------------------------------------

    def get_movie_videos(
        self,
        movie_id: int,
    ):
        url = (
            f"{TMDB_BASE_URL}"
            f"/movie/{movie_id}"
            "/videos"
        )

        data = self._request_json(
            url,
            attempts=4,
        )

        videos = data.get(
            "results",
            [],
        )

        official_trailers = [
            video
            for video in videos
            if (
                video.get("site")
                == "YouTube"
                and video.get("type")
                == "Trailer"
                and video.get(
                    "official"
                )
                is True
            )
        ]

        trailers = (
            official_trailers
            or [
                video
                for video in videos
                if (
                    video.get("site")
                    == "YouTube"
                    and video.get(
                        "type"
                    )
                    == "Trailer"
                )
            ]
        )

        if not trailers:
            return {
                "trailer": None
            }

        trailer = trailers[0]

        trailer_key = trailer.get(
            "key"
        )

        return {
            "trailer": {
                "id": trailer.get(
                    "id"
                ),
                "name": trailer.get(
                    "name"
                ),
                "key": trailer_key,
                "site": trailer.get(
                    "site"
                ),
                "type": trailer.get(
                    "type"
                ),
                "official": trailer.get(
                    "official",
                    False,
                ),
                "youtube_url": (
                    "https://www.youtube.com/"
                    f"watch?v={trailer_key}"
                    if trailer_key
                    else None
                ),
                "embed_url": (
                    "https://www.youtube.com/"
                    f"embed/{trailer_key}"
                    if trailer_key
                    else None
                ),
            }
        }

    # ---------------------------------------------------------
    # SCREENSHOT
    # ---------------------------------------------------------
    
    def get_movie_images(
        self,
        movie_id: int,
        limit: int = 12,
    ):
        url = (
            f"{TMDB_BASE_URL}"
            f"/movie/{movie_id}"
            "/images"
        )

        data = self._request_json(
            url,
            attempts=4,
        )

        backdrops = []

        for image in data.get(
            "backdrops",
            [],
        )[:limit]:
            file_path = image.get(
                "file_path"
            )

            if not file_path:
                continue

            backdrops.append(
                {
                    "file_path": file_path,
                    "width": image.get(
                        "width"
                    ),
                    "height": image.get(
                        "height"
                    ),
                    "aspect_ratio": image.get(
                        "aspect_ratio"
                    ),
                    "vote_average": image.get(
                        "vote_average"
                    ),
                    "image_url": (
                        f"{TMDB_BACKDROP_BASE_URL}"
                        f"{file_path}"
                    ),
                }
            )

        return {
            "count": len(backdrops),
            "images": backdrops,
        }

tmdb_service = TMDBService()