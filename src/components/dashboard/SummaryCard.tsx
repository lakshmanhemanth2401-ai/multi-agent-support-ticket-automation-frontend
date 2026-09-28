import type { LucideIcon } from 'lucide-react'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { Card } from '../common/Card'

export function SummaryCard({ title, value, trend, trendUp, detail, icon: Icon, tone }: { title: string; value: string; trend: string; trendUp: boolean; detail: string; icon: LucideIcon; tone: 'blue' | 'amber' | 'green' | 'purple' }) {
  const colors = { blue: 'bg-blue-50 text-blue-600', amber: 'bg-amber-50 text-amber-600', green: 'bg-emerald-50 text-emerald-600', purple: 'bg-purple-50 text-purple-600' }
  return <Card className="p-5"><div className="flex items-start justify-between"><div><p className="text-sm font-medium text-slate-500">{title}</p><p className="mt-2 text-3xl font-extrabold tracking-tight text-ink">{value}</p></div><span className={`rounded-xl p-2.5 ${colors[tone]}`}><Icon className="h-5 w-5" /></span></div><div className="mt-4 flex items-center gap-2 text-xs"><span className={`inline-flex items-center gap-0.5 font-bold ${trendUp ? 'text-emerald-600' : 'text-rose-600'}`}>{trendUp ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}{trend}</span><span className="text-slate-400">{detail}</span></div></Card>
}
