import { Card } from '../common/Card'

const statuses = [
  { label: 'Open', value: 24, total: 86, color: 'bg-blue-500' },
  { label: 'In progress', value: 18, total: 86, color: 'bg-cyan-500' },
  { label: 'Resolved', value: 36, total: 86, color: 'bg-emerald-500' },
  { label: 'Closed', value: 8, total: 86, color: 'bg-slate-400' },
]

export function StatusOverview() {
  return <Card className="p-5 sm:p-6"><div><h2 className="font-bold text-ink">Ticket status</h2><p className="mt-1 text-xs text-slate-500">Current distribution across all support queues</p></div><div className="mt-7 space-y-5">{statuses.map((status) => <div key={status.label}><div className="mb-2 flex items-center justify-between text-sm"><span className="font-semibold text-slate-600">{status.label}</span><span className="font-bold text-slate-800">{status.value}</span></div><div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full ${status.color}`} style={{ width: `${(status.value / status.total) * 100}%` }} /></div></div>)}</div><div className="mt-6 flex items-center justify-between border-t pt-4 text-sm"><span className="font-medium text-slate-500">Total tickets</span><span className="font-extrabold text-ink">86</span></div></Card>
}
