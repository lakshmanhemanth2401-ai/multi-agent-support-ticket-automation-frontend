export type UserRole = 'support_agent' | 'reviewer' | 'administrator'
export interface AuthUser { id: number; email: string; role: UserRole; is_active: boolean; created_at: string }
export interface TokenPair { access_token: string; refresh_token: string; token_type: 'bearer'; expires_in: number; user: AuthUser }
