# CineMatch Backend

Backend foundation for **CineMatch**, a movie recommendation app. This phase
only sets up the FastAPI service, in-memory dataset loading and the core
read-only endpoints. No database, authentication, or recommendation engine
is included yet.

## Stack
- Python 3 / FastAPI
- pandas (CSV load + in-memory indexing)
- Pydantic (response models & validation)
- Uvicorn (managed by supervisor)

## Folder Structure
```
backend/
  app/
    api/
      movies.py          # /api/movies, /api/movies/{id}, /api/search, /api/genres
    models/
      movie.py           # Pydantic response models
    services/
      movie_service.py   # Loads CSV once, serves list/get/search/genres
    utils/
      parsing.py         # CSV list-cell parsers
    main.py              # FastAPI app factory, CORS, startup, /health
  data/
    movies_cleaned_final.csv
  server.py              # Supervisor entrypoint (re-exports app.main.app)
  requirements.txt
  README.md
```

## Data Loading
`movies_cleaned_final.csv` (~76k rows, ~40 MB) is loaded **once** on FastAPI
startup via `MovieService.load()`. A row index keyed by movie `id` and a
lowercase title series are precomputed so every request serves from memory.

Dataset columns actually used (nothing invented):
`id, title, vote_average, vote_count, release_date, runtime, adult,
backdrop_path, original_language, overview, popularity, poster_path,
tagline, genres, production_companies, keywords`.

## API Routes
| Method | Path                        | Description                                  |
|--------|-----------------------------|----------------------------------------------|
| GET    | `/health`                   | Liveness + number of movies loaded           |
| GET    | `/api/health`               | Same as `/health`, served under `/api`       |
| GET    | `/api/movies?page&limit`    | Paginated movie list (default 20, max 100)   |
| GET    | `/api/movies/{movie_id}`    | Full details for one movie (integer id)      |
| GET    | `/api/search?q&page&limit`  | Case-insensitive title substring search      |
| GET    | `/api/genres`               | Sorted list of unique genres                 |

### Error Handling
- `400` on empty `q`, non-positive `movie_id`
- `404` when a `movie_id` does not exist
- `422` from FastAPI/Pydantic for invalid pagination (`page < 1`, `limit` out of range)

## Running Locally
Supervisor already runs the backend on port `8001` with:
```
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```
Logs: `/var/log/supervisor/backend.*.log`.

## Environment
- `CORS_ORIGINS` — comma-separated list of allowed origins (default `*`)
- `MOVIES_CSV_PATH` — optional override for the CSV location
