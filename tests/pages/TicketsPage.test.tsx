import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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

  it('paginates long ticket lists accessibly', async () => {
    const user = userEvent.setup()
    mockedListTickets.mockResolvedValue(Array.from({ length: 11 }, (_, index) => ({ id: index + 1, title: `Ticket ${index + 1}`, description: 'Description', status: 'open' as const, priority: 'medium' as const, category: 'general', createdAt: '2026-09-29T12:00:00Z' })))
    render(<MemoryRouter><TicketsPage /></MemoryRouter>)
    expect(await screen.findByText('Ticket 1')).toBeInTheDocument()
    expect(screen.queryByText('Ticket 11')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /next tickets page/i }))
    expect(screen.getByText('Ticket 11')).toBeInTheDocument()
    expect(screen.getByLabelText('Search tickets')).toBeInTheDocument()
  })
})
