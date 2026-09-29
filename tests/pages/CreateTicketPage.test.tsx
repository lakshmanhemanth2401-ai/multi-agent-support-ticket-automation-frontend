import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { CreateTicketPage } from '../../src/pages/CreateTicket/CreateTicketPage'
import { createTicket } from '../../src/services/endpoints/tickets'

vi.mock('../../src/services/endpoints/tickets', () => ({ createTicket: vi.fn() }))
const mockedCreateTicket = vi.mocked(createTicket)

function renderPage() {
  return render(<MemoryRouter initialEntries={['/tickets/new']}><Routes><Route path="/tickets/new" element={<CreateTicketPage />} /><Route path="/tickets/:ticketId" element={<p>Ticket destination</p>} /></Routes></MemoryRouter>)
}

describe('CreateTicketPage', () => {
  beforeEach(() => vi.clearAllMocks())

  it('validates required ticket fields', async () => {
    renderPage()
    await userEvent.click(screen.getByRole('button', { name: /^create ticket$/i }))
    expect(await screen.findByText('Subject is required.')).toBeInTheDocument()
    expect(screen.getByText('Description is required.')).toBeInTheDocument()
    expect(mockedCreateTicket).not.toHaveBeenCalled()
  })

  it('creates a ticket and displays success', async () => {
    mockedCreateTicket.mockResolvedValue({ id: 12, title: 'Billing issue', description: 'Duplicate charge appeared on the latest invoice.', status: 'open', priority: 'high', category: 'Billing', createdAt: '2026-09-29T12:00:00Z' })
    renderPage()
    await userEvent.type(screen.getByLabelText('Subject'), 'Billing issue')
    await userEvent.type(screen.getByLabelText('Customer'), 'Northstar Ltd')
    await userEvent.selectOptions(screen.getByLabelText('Category'), 'Billing')
    await userEvent.type(screen.getByLabelText('Description'), 'Duplicate charge appeared on the latest invoice.')
    await userEvent.click(screen.getByLabelText('high'))
    await userEvent.click(screen.getByRole('button', { name: /^create ticket$/i }))
    expect(await screen.findByText('Ticket created successfully')).toBeInTheDocument()
    expect(mockedCreateTicket).toHaveBeenCalledWith(expect.objectContaining({ subject: 'Billing issue', priority: 'high' }))
  })
})
