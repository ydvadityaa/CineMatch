/**
 * Central runtime configuration.
 *
 * NEXT_PUBLIC_API_BASE_URL
 * Base URL of the CineMatch FastAPI backend.
 *
 * NEXT_PUBLIC_USE_MOCK_API
 * Set to "false" to use the real FastAPI backend.
 */

export const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  'http://127.0.0.1:8000'
).replace(/\/$/, '')

export const USE_MOCK_API =
  process.env.NEXT_PUBLIC_USE_MOCK_API !== 'false'

export const PAGE_SIZE = 24

export const RAIL_SIZE = 20