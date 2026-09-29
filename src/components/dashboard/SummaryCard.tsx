import type { LucideIcon } from 'lucide-react'
import { Card } from '../common/Card'

export function SummaryCard({ title, value, detail, icon: Icon, tone }: { title: string; value: string; detail: string; icon: LucideIcon; tone: 'blue' | 'amber' | 'green' | 'purple' }) {
  const colors = { blue: 'bg-blue-50 text-blue-600', amber: 'bg-amber-50 text-amber-600', green: 'bg-emerald-50 text-emerald-600', purple: 'bg-purple-50 text-purple-600' }
  return <Card className="p-5"><div className="flex items-start justify-between"><div><p className="text-sm font-medium text-slate-500">{title}</p><p className="mt-2 text-3xl font-extrabold tracking-tight text-ink">{value}</p></div><span className={`rounded-xl p-2.5 ${colors[tone]}`}><Icon className="h-5 w-5" /></span></div><p className="mt-4 text-xs text-slate-400">{detail}</p></Card>
}
