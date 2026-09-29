import { Card } from '../common/Card'

export function StatusOverview({ counts }: { counts: { open: number; inProgress: number; resolved: number; closed: number } }) {
  const total = counts.open + counts.inProgress + counts.resolved + counts.closed
  const statuses = [
    { label: 'Open', value: counts.open, color: 'bg-blue-500' },
    { label: 'In progress', value: counts.inProgress, color: 'bg-cyan-500' },
    { label: 'Resolved', value: counts.resolved, color: 'bg-emerald-500' },
    { label: 'Closed', value: counts.closed, color: 'bg-slate-400' },
  ]
  return <Card className="p-5 sm:p-6"><div><h2 className="font-bold text-ink">Ticket status</h2><p className="mt-1 text-xs text-slate-500">Current distribution across all support queues</p></div><div className="mt-7 space-y-5">{statuses.map((status) => <div key={status.label}><div className="mb-2 flex items-center justify-between text-sm"><span className="font-semibold text-slate-600">{status.label}</span><span className="font-bold text-slate-800">{status.value}</span></div><div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full ${status.color}`} style={{ width: `${total ? (status.value / total) * 100 : 0}%` }} /></div></div>)}</div><div className="mt-6 flex items-center justify-between border-t pt-4 text-sm"><span className="font-medium text-slate-500">Total tickets</span><span className="font-extrabold text-ink">{total}</span></div></Card>
}
