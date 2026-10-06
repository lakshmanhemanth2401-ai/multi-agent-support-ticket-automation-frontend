import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ReviewDetailsPage } from '../../src/pages/ReviewDetails/ReviewDetailsPage'
import { getReview, getWorkflow, submitReview } from '../../src/services/endpoints/reviews'
import { getTicket } from '../../src/services/endpoints/tickets'
import { ToastProvider } from '../../src/contexts/ToastContext'

vi.mock('../../src/services/endpoints/reviews', () => ({ getReview: vi.fn(), getWorkflow: vi.fn(), submitReview: vi.fn() }))
vi.mock('../../src/services/endpoints/tickets', () => ({ getTicket: vi.fn() }))

const pendingReview = { id: 2, ticketId: 3, workflowThreadId: 'thread-3', generatedSubject: 'Support update', generatedResponse: 'Please try these steps.', status: 'pending' as const, reviewer: null, reviewerComments: null, editedSubject: null, editedResponse: null, version: 1, createdAt: '2026-09-29T12:00:00Z', updatedAt: '2026-09-29T12:00:00Z', reviewedAt: null }
const ticket = { id: 3, title: 'Login issue', description: 'Cannot access the workspace after SSO login.', status: 'open' as const, priority: 'high' as const, category: 'security', createdAt: '2026-09-29T12:00:00Z' }
const workflow = { thread_id: 'thread-3', status: 'awaiting_review' as const, review: {}, response: { subject: 'Support update', body: 'Please try these steps.', confidence: 0.8, escalation_required: false, supporting_sources: [] } }

describe('ReviewDetailsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(getReview).mockResolvedValue(pendingReview)
    vi.mocked(getTicket).mockResolvedValue(ticket)
    vi.mocked(getWorkflow).mockResolvedValue(workflow)
    vi.mocked(submitReview).mockResolvedValue({ ...workflow, status: 'completed' })
  })

  it('loads a pending review and submits approval', async () => {
    render(<MemoryRouter initialEntries={['/reviews/2']}><ToastProvider><Routes><Route path="/reviews/:reviewId" element={<ReviewDetailsPage />} /></Routes></ToastProvider></MemoryRouter>)
    expect(await screen.findByText('Please try these steps.')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Approve' }))
    expect(submitReview).toHaveBeenCalledWith('thread-3', expect.objectContaining({ action: 'approve', reviewer: 'Hemanth' }))
    expect((await screen.findAllByText(/approved successfully/i)).length).toBeGreaterThan(0)
  })

  it('requires comments before rejecting', async () => {
    render(<MemoryRouter initialEntries={['/reviews/2']}><ToastProvider><Routes><Route path="/reviews/:reviewId" element={<ReviewDetailsPage />} /></Routes></ToastProvider></MemoryRouter>)
    await screen.findByText('Please try these steps.')
    await userEvent.click(screen.getByRole('button', { name: 'Reject' }))
    expect(screen.getByText(/comments are required to reject/i)).toBeInTheDocument()
    expect(submitReview).not.toHaveBeenCalled()
  })

  it('keeps persisted review content visible when a restarted backend has lost the workflow snapshot', async () => {
    vi.mocked(getWorkflow).mockRejectedValue({ isAxiosError: true, response: { status: 404, data: { detail: 'Workflow not found' } } })
    render(<MemoryRouter initialEntries={['/reviews/2']}><ToastProvider><Routes><Route path="/reviews/:reviewId" element={<ReviewDetailsPage />} /></Routes></ToastProvider></MemoryRouter>)
    expect(await screen.findByText('Please try these steps.')).toBeInTheDocument()
    expect(screen.getByText('Workflow details unavailable')).toBeInTheDocument()
    expect(screen.getByText(/workflow snapshot was not restored/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Approve' })).toBeDisabled()
  })
})
