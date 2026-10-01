import type { AuthUser, TokenPair } from '../../types/auth'
import { apiClient, clearSession, setSession, storedRefreshToken } from '../api/client'

export async function login(email: string, password: string) { const { data } = await apiClient.post<TokenPair>('/auth/login', { email, password }); setSession(data); return data.user }
export async function restoreSession() { const token = storedRefreshToken(); if (!token) return null; const { data } = await apiClient.post<TokenPair>('/auth/refresh', { refresh_token: token }); setSession(data); return data.user }
export async function currentUser() { const { data } = await apiClient.get<AuthUser>('/auth/me'); return data }
export async function logout() { const token = storedRefreshToken(); try { if (token) await apiClient.post('/auth/logout', { refresh_token: token }) } finally { clearSession() } }
