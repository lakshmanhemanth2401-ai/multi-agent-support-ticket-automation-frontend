import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AuthProvider } from '../../src/contexts/AuthContext'
import { LoginPage } from '../../src/pages/Login/LoginPage'
import { ProtectedRoute } from '../../src/components/auth/ProtectedRoute'
import * as authApi from '../../src/services/endpoints/auth'

vi.mock('../../src/services/endpoints/auth', () => ({ login: vi.fn(), logout: vi.fn(), restoreSession: vi.fn() }))
const mocked = vi.mocked(authApi)

describe('authentication routes', () => {
  beforeEach(() => { vi.clearAllMocks(); mocked.restoreSession.mockResolvedValue(null) })
  it('signs in and returns to the requested protected page', async () => {
    const user = userEvent.setup(); mocked.login.mockResolvedValue({ id: 1, email: 'reviewer@example.com', role: 'reviewer', is_active: true, created_at: '2026-01-01T00:00:00Z' })
    render(<MemoryRouter initialEntries={[{ pathname: '/login', state: { from: '/tickets' } }]}><AuthProvider><Routes><Route path="login" element={<LoginPage />} /><Route path="tickets" element={<p>Ticket workspace</p>} /></Routes></AuthProvider></MemoryRouter>)
    await user.type(await screen.findByLabelText('Email'), 'reviewer@example.com'); await user.type(screen.getByLabelText('Password'), 'password123'); await user.click(screen.getByRole('button', { name: 'Sign in' }))
    expect(await screen.findByText('Ticket workspace')).toBeInTheDocument()
  })
  it('redirects anonymous users from protected routes', async () => {
    render(<MemoryRouter initialEntries={['/private']}><AuthProvider><Routes><Route element={<ProtectedRoute />}><Route path="private" element={<p>Private</p>} /></Route><Route path="login" element={<p>Login required</p>} /></Routes></AuthProvider></MemoryRouter>)
    expect(await screen.findByText('Login required')).toBeInTheDocument()
  })
})
