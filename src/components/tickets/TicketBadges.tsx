import { Badge } from '../common/Badge'
import type { TicketPriority, TicketStatus } from '../../types/ticket'

const statusTone = { open: 'blue', in_progress: 'cyan', resolved: 'green', closed: 'slate' } as const
const priorityTone = { low: 'slate', medium: 'blue', high: 'amber', urgent: 'rose' } as const

export function StatusBadge({ status }: { status: TicketStatus }) {
  return <Badge tone={statusTone[status]} dot>{status.replace('_', ' ')}</Badge>
}

export function PriorityBadge({ priority }: { priority: TicketPriority }) {
  return <Badge tone={priorityTone[priority]}>{priority}</Badge>
}
