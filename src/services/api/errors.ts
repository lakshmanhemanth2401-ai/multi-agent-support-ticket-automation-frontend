import axios from 'axios'

export function apiErrorMessage(error: unknown, fallback = 'The request failed unexpectedly.') {
  if (!axios.isAxiosError(error)) return fallback
  if (!error.response) return 'The service is unreachable. Confirm the backend is running and CORS is configured.'
  const detail = error.response.data?.detail ?? error.response.data?.message
  return typeof detail === 'string' ? detail : `The service returned ${error.response.status}.`
}
