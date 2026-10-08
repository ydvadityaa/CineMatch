# CineMatch

CineMatch is a full-stack movie discovery and recommendation platform built using a local TMDB-based movie dataset, a custom TF-IDF recommendation engine, and live TMDB media integration.

The project combines a large cleaned movie catalogue with machine learning-based similarity recommendations, live trailers, movie stills, trending content, search, filtering, authentication, profile management, and personal movie lists.

---

## Features

- Movie catalogue with more than 76,000 cleaned movie records
- Content-based movie recommendation system using TF-IDF
- Similar movie recommendations from the local dataset
- Live TMDB trending movies
- TMDB movie details
- Official trailers through TMDB and YouTube
- Movie stills and gallery images
- Search by movie title
- Genre-based browsing
- Rating, year, language, and popularity filters
- Responsive movie detail pages
- User sign-up and login
- Profile management
- My List feature
- Like functionality
- Share functionality
- Responsive dark streaming-style interface

---

## Project Architecture

CineMatch uses a hybrid architecture that combines a local movie dataset, a machine learning recommendation system, and live TMDB API integration.

### Local Dataset

The main movie catalogue is based on a cleaned TMDB dataset containing more than 76,000 movies.

Local data is used for:

- Movie titles
- Genres
- Overviews
- Ratings
- Vote counts
- Release dates
- Runtime
- Languages
- Keywords
- Production companies
- Poster and backdrop paths
- Recommendation generation

### Machine Learning Recommendation System

CineMatch uses a content-based recommendation engine built with TF-IDF.

The recommendation system uses movie information such as:

- Overview
- Genres
- Keywords

The TF-IDF matrix is used to calculate similarity between movies and return relevant recommendations.

### TMDB API

The TMDB API is used for live and media-related content such as:

- Trending movies
- Movie trailers
- Movie stills
- Additional movie details
- TMDB recommendations

---

## Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- Lucide React
- SWR
- Next.js App Router

### Backend

- Python
- FastAPI
- Uvicorn
- Pandas
- Scikit-learn
- HTTPX
- Pydantic

### Machine Learning

- TF-IDF Vectorizer
- Similarity scoring
- Scikit-learn
- Sparse matrices

### Data

- TMDB Movies Dataset
- 76K+ cleaned movie records
- Pandas-based preprocessing

---

## Folder Structure

```text
CineMatch/
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── models/
│   │   ├── services/
│   │   └── utils/
│   │
│   ├── data/
│   │   ├── 01_tmdb_dataset_cleaning.ipynb
│   │   └── movies_cleaned_final.csv
│   │
│   ├── models/
│   │   ├── recommendation_movies.csv
│   │   ├── tfidf_matrix.npz
│   │   └── tfidf_vectorizer.pkl
│   │
│   ├── requirements.txt
│   └── server.py
│
├── cine-match-frontend-development/
│   ├── public/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── services/
│   │   ├── types/
│   │   └── utils/
│   │
│   ├── package.json
│   ├── package-lock.json
│   └── next.config.mjs
│
├── .gitignore
└── README.md
```

---

## Backend Setup

Open a terminal and navigate to the backend directory:

```bash
cd backend
```

Create and activate a virtual environment if required.

Install all backend dependencies:

```bash
pip install -r requirements.txt
```

Create a `.env` file inside the `backend` folder and add your TMDB access token:

```env
MONGO_URL="mongodb://localhost:27017"
DB_NAME="test_database"
CORS_ORIGINS="*"
TMDB_ACCESS_TOKEN=your_tmdb_access_token
```

Start the FastAPI backend server:

```bash
python -m uvicorn app.main:app --reload
```

The backend will run at:

```text
http://127.0.0.1:8000
```

---

## Frontend Setup

Open another terminal and navigate to the frontend directory:

```bash
cd cine-match-frontend-development
```

Install the required frontend dependencies:

```bash
npm install
```

Create a `.env.local` file inside the frontend folder:

```text
.env.local
```

Add the following environment variables:

```env
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000
NEXT_PUBLIC_USE_MOCK_API=false
```

Start the Next.js development server:

```bash
npm run dev
```

The frontend will run at:

```text
http://localhost:3000
```

---

## Main API Endpoints

### Local Movie Catalogue

```text
GET /api/movies
```

Supports filtering and sorting options such as:

- Genre
- Language
- Minimum year
- Maximum year
- Minimum rating
- Popularity
- Rating
- Vote count
- Release year

### Local Movie Details

```text
GET /api/movies/{movie_id}
```

Returns movie information from the cleaned local dataset.

### Local Similar Movies

```text
GET /api/movies/{movie_id}/similar
```

Returns similar movies using the CineMatch TF-IDF recommendation engine.

### Search

```text
GET /api/search
```

Supports case-insensitive movie title searches.

### Genres

```text
GET /api/genres
```

Returns the available movie genres from the local dataset.

### Trending Movies

```text
GET /api/trending
```

Returns live trending movie data using the TMDB API.

### TMDB Movie Details

```text
GET /api/tmdb/movies/{movie_id}
```

Returns additional movie information from TMDB.

### TMDB Movie Recommendations

```text
GET /api/tmdb/movies/{movie_id}/recommendations
```

Returns movie recommendations provided by TMDB.

### Movie Trailer

```text
GET /api/tmdb/movies/{movie_id}/videos
```

Returns the most relevant available YouTube trailer for a movie.

### Movie Stills

```text
GET /api/tmdb/movies/{movie_id}/images
```

Returns movie stills and backdrop images from TMDB.

---

## Recommendation Workflow

CineMatch uses a content-based recommendation approach.

```text
Movie
  ↓
Overview + Genres + Keywords
  ↓
Text Preprocessing
  ↓
TF-IDF Vectorisation
  ↓
Similarity Scoring
  ↓
Ranking
  ↓
Recommended Movies
```

The recommendation system is built using the project's own cleaned local movie dataset instead of relying only on external recommendation APIs.

---

## Movie Detail Experience

CineMatch combines local movie data with TMDB media integration to provide a richer movie detail experience.

```text
Local Movie Dataset
        +
TF-IDF Recommendation Engine
        +
TMDB Media Integration
```

A local movie detail page can include:

- Movie poster
- Backdrop image
- Movie title
- Rating
- Vote count
- Release date
- Runtime
- Language
- Genres
- Overview
- Keywords
- Production companies
- Official trailer
- Movie stills
- Similar movie recommendations

---

## Data Processing

The original TMDB dataset contained more than 1.5 million movie records.

The data cleaning and preparation process included:

- Handling missing values
- Removing duplicate movie IDs
- Validating movie IDs
- Processing release dates
- Parsing genres
- Parsing keywords
- Parsing production companies
- Applying vote-count filters
- Removing incomplete or invalid records
- Preparing data for recommendation modelling

The final cleaned dataset contains approximately:

```text
76,129 movies
```

The cleaned dataset is used by the FastAPI backend for browsing, searching, filtering, movie details, and recommendation generation.

---

## Machine Learning Recommendation System

CineMatch uses a content-based movie recommendation system built with TF-IDF.

The recommendation model uses movie information such as:

- Overview
- Genres
- Keywords

The processed movie text is converted into TF-IDF feature vectors.

The recommendation service then calculates movie similarity and ranks the most relevant titles.

Model-related files include:

```text
recommendation_movies.csv
tfidf_matrix.npz
tfidf_vectorizer.pkl
```

This allows CineMatch to generate recommendations directly from the local movie dataset.

---

## TMDB Integration

The TMDB API is used to enrich the local movie experience with live and media-based content.

TMDB integration is used for:

- Trending movies
- Movie details
- Movie trailers
- Movie stills
- Backdrop images
- TMDB recommendations

The TMDB access token is stored securely in the backend `.env` file and is not committed to GitHub.

---

## Authentication and User Features

CineMatch includes a lightweight authentication system for the current version of the project.

Available user features include:

- Sign up
- Sign in
- Sign out
- User profile
- Username updates
- Gender-based avatar display
- My List
- Like functionality
- Share functionality

User session data is handled on the client side in the current implementation.

---

## Security

Sensitive configuration files and development-only files are excluded from version control.

The following files are ignored by Git:

```text
backend/.env
cine-match-frontend-development/.env.local
```

Large raw datasets and development-generated files are also excluded from the repository.

Examples include:

```text
backend/data/TMDB_movie_dataset_v11.csv
backend/data/movies_cleaned.csv
cine-match-frontend-development/node_modules/
cine-match-frontend-development/.next/
test_reports/
```

This helps keep the repository secure, lightweight, and suitable for GitHub.

---

## Repository Structure

```text
CineMatch/
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── models/
│   │   ├── services/
│   │   └── utils/
│   │
│   ├── data/
│   │   ├── 01_tmdb_dataset_cleaning.ipynb
│   │   └── movies_cleaned_final.csv
│   │
│   ├── models/
│   │   ├── recommendation_movies.csv
│   │   ├── tfidf_matrix.npz
│   │   └── tfidf_vectorizer.pkl
│   │
│   ├── requirements.txt
│   └── server.py
│
├── cine-match-frontend-development/
│   ├── public/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── services/
│   │   ├── types/
│   │   └── utils/
│   │
│   ├── package.json
│   ├── package-lock.json
│   ├── next.config.mjs
│   └── tsconfig.json
│
├── .gitignore
└── README.md
```

---

## Future Improvements

Possible future enhancements include:

- Persistent database-based authentication
- User watch history
- Collaborative filtering
- Hybrid recommendation models
- Personalised recommendations based on user activity
- Recommendation evaluation metrics
- Advanced search ranking
- Improved recommendation explainability
- Cloud deployment
- Database-backed user profiles
- Persistent My List storage

---

## Project Status

The core development of CineMatch is complete.

The current implementation includes:

- 76K+ cleaned movie catalogue
- Local movie browsing
- Search functionality
- Genre-based browsing
- Rating and year filters
- Sorting options
- Local movie detail pages
- TF-IDF recommendation system
- Similar movie recommendations
- Live TMDB trending movies
- TMDB movie details
- Official trailers
- Movie stills
- TMDB recommendations
- User authentication
- Profile management
- My List
- Like functionality
- Share functionality
- Responsive user interface
- GitHub-ready project structure

---

## Author

**Aditya Yadav**

GitHub:  
https://github.com/ydvadityaa

---

## Project Link

**CineMatch GitHub Repository**

https://github.com/ydvadityaa/CineMatch
