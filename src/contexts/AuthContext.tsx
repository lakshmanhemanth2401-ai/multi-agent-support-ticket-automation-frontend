import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { login as loginRequest, logout as logoutRequest, restoreSession } from '../services/endpoints/auth'
import type { AuthUser, UserRole } from '../types/auth'

interface AuthValue { user: AuthUser | null; loading: boolean; login: (email: string, password: string) => Promise<void>; logout: () => Promise<void>; hasRole: (...roles: UserRole[]) => boolean }
const AuthContext = createContext<AuthValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    let active = true
    void restoreSession().then((value) => { if (active) setUser(value) }).catch(() => { if (active) setUser(null) }).finally(() => { if (active) setLoading(false) })
    const expired = () => setUser(null)
    window.addEventListener('supportflow:session-expired', expired)
    return () => { active = false; window.removeEventListener('supportflow:session-expired', expired) }
  }, [])
  const login = useCallback(async (email: string, password: string) => setUser(await loginRequest(email, password)), [])
  const logout = useCallback(async () => { await logoutRequest(); setUser(null) }, [])
  const value = useMemo(() => ({ user, loading, login, logout, hasRole: (...roles: UserRole[]) => Boolean(user && roles.includes(user.role)) }), [loading, login, logout, user])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Context and provider intentionally share this small module.
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() { const value = useContext(AuthContext); if (!value) throw new Error('useAuth must be used inside AuthProvider'); return value }
