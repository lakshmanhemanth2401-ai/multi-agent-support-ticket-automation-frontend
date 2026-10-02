import type { ReactNode } from 'react'
import { cn } from '../../utils/cn'

type BadgeTone = 'slate' | 'blue' | 'cyan' | 'green' | 'amber' | 'rose' | 'purple'

const tones: Record<BadgeTone, string> = {
  slate: 'bg-slate-100 text-slate-700', blue: 'bg-info-50 text-info-700', cyan: 'bg-cyan-50 text-cyan-800', green: 'bg-success-50 text-success-700', amber: 'bg-warning-50 text-warning-700', rose: 'bg-danger-50 text-danger-700', purple: 'bg-purple-50 text-purple-800',
}

export function Badge({ children, tone = 'slate', dot, className }: { children: ReactNode; tone?: BadgeTone; dot?: boolean; className?: string }) {
  return <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold capitalize', tones[tone], className)}>{dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}{children}</span>
}
