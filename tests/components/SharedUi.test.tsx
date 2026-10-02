import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ConfirmDialog } from '../../src/components/common/ConfirmDialog'
import { PageSkeleton } from '../../src/components/common/Skeleton'
import { Tooltip } from '../../src/components/common/Tooltip'
import { ToastProvider, useToast } from '../../src/contexts/ToastContext'

function ToastTrigger() { const { notify } = useToast(); return <button onClick={() => notify('Ticket updated', 'success')}>Notify</button> }

describe('shared UI primitives', () => {
  it('renders an accessible loading skeleton', () => { render(<PageSkeleton />); expect(screen.getByLabelText('Loading content')).toHaveAttribute('aria-busy', 'true') })
  it('confirms or cancels destructive actions', async () => { const user = userEvent.setup(); const confirm = vi.fn(); const cancel = vi.fn(); render(<ConfirmDialog open title="Reject response?" message="This returns the response for revision." confirmLabel="Reject" danger onCancel={cancel} onConfirm={confirm} />); expect(screen.getByRole('alertdialog')).toBeInTheDocument(); await user.click(screen.getByRole('button', { name: 'Reject' })); expect(confirm).toHaveBeenCalledOnce() })
  it('announces and dismisses toast notifications', async () => { const user = userEvent.setup(); render(<ToastProvider><ToastTrigger /></ToastProvider>); await user.click(screen.getByText('Notify')); expect(screen.getByRole('status')).toHaveTextContent('Ticket updated'); await user.click(screen.getByLabelText('Dismiss notification')); expect(screen.queryByText('Ticket updated')).not.toBeInTheDocument() })
  it('provides keyboard-accessible tooltip text', () => { render(<Tooltip label="Success rate"><span>95%</span></Tooltip>); fireEvent.focus(screen.getByLabelText('Success rate')); expect(screen.getByRole('tooltip')).toHaveTextContent('Success rate') })
})
