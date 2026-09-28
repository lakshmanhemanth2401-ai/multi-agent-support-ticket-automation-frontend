import { Badge } from '../common/Badge'
import type { ReviewStatus } from '../../types/review'

const tones = { pending: 'amber', approved: 'green', rejected: 'rose', edited: 'blue', regenerate_requested: 'purple' } as const

export function ReviewStatusBadge({ status }: { status: ReviewStatus }) {
  return <Badge tone={tones[status]} dot>{status.replace(/_/g, ' ')}</Badge>
}
