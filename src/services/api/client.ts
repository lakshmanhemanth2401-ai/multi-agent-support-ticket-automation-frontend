import axios, { type InternalAxiosRequestConfig } from 'axios'
import type { TokenPair } from '../../types/auth'

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'
const REFRESH_KEY = 'supportflow.refresh-token'
let accessToken = ''
let refreshPromise: Promise<string> | null = null
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
})

export function storedRefreshToken() { return sessionStorage.getItem(REFRESH_KEY) }
export function setSession(tokens: Pick<TokenPair, 'access_token' | 'refresh_token'>) { accessToken = tokens.access_token; sessionStorage.setItem(REFRESH_KEY, tokens.refresh_token) }
export function clearSession() { accessToken = ''; sessionStorage.removeItem(REFRESH_KEY) }

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => { if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`; return config })
apiClient.interceptors.response.use(undefined, async (error) => {
  const original = error.config as (InternalAxiosRequestConfig & { _retried?: boolean }) | undefined
  if (error.response?.status !== 401 || !original || original._retried || original.url?.startsWith('/auth/')) return Promise.reject(error)
  original._retried = true
  try {
    refreshPromise ??= (async () => { const token = storedRefreshToken(); if (!token) throw new Error('No refresh session'); const { data } = await axios.post<TokenPair>(`${API_BASE_URL}/auth/refresh`, { refresh_token: token }); setSession(data); return data.access_token })().finally(() => { refreshPromise = null })
    original.headers.Authorization = `Bearer ${await refreshPromise}`
    return apiClient(original)
  } catch (refreshError) {
    clearSession(); window.dispatchEvent(new Event('supportflow:session-expired')); return Promise.reject(refreshError)
  }
})
