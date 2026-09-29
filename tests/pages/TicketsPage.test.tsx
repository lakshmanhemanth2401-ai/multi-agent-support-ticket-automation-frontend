import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { TicketsPage } from '../../src/pages/Tickets/TicketsPage'
import { listTickets } from '../../src/services/endpoints/tickets'

vi.mock('../../src/services/endpoints/tickets', () => ({ listTickets: vi.fn() }))
const mockedListTickets = vi.mocked(listTickets)

describe('TicketsPage', () => {
  beforeEach(() => vi.clearAllMocks())

  it('shows loading then backend tickets', async () => {
    mockedListTickets.mockResolvedValue([{ id: 7, title: 'Cannot sign in', description: 'SSO failed', status: 'open', priority: 'high', category: 'security', createdAt: '2026-09-29T12:00:00Z' }])
    render(<MemoryRouter><TicketsPage /></MemoryRouter>)
    expect(screen.getByText(/loading tickets/i)).toBeInTheDocument()
    expect(await screen.findByText('Cannot sign in')).toBeInTheDocument()
    expect(screen.getByText(/security/)).toBeInTheDocument()
  })

  it('shows a retryable error state', async () => {
    mockedListTickets.mockRejectedValue(new Error('offline'))
    render(<MemoryRouter><TicketsPage /></MemoryRouter>)
    expect(await screen.findByText(/unexpected error occurred/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument()
  })
})
