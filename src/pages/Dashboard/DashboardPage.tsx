import { CheckCircle2, Clock3, LifeBuoy, Timer } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '../../components/common/Button'
import { Card } from '../../components/common/Card'
import { EmptyState } from '../../components/common/EmptyState'
import { ErrorState } from '../../components/common/ErrorState'
import { Loading } from '../../components/common/Loading'
import { RecentTicketsTable } from '../../components/dashboard/RecentTicketsTable'
import { StatusOverview } from '../../components/dashboard/StatusOverview'
import { SummaryCard } from '../../components/dashboard/SummaryCard'
import { mockTickets } from '../../constants/mockData'

type ViewState = 'ready' | 'loading' | 'empty' | 'error'

export function DashboardPage() {
  const [viewState, setViewState] = useState<ViewState>('loading')
  useEffect(() => { const timer = window.setTimeout(() => setViewState('ready'), 450); return () => window.clearTimeout(timer) }, [])
  if (viewState === 'loading') return <Loading fullPage label="Preparing your dashboard…" />
  if (viewState === 'error') return <Card><ErrorState message="We couldn't load dashboard data. Check your connection and try again." onRetry={() => setViewState('ready')} /></Card>
  if (viewState === 'empty') return <Card><EmptyState title="Your workspace is ready" message="Create your first ticket to start tracking support activity." /></Card>
  return <div className="mx-auto max-w-[1500px] space-y-6"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-sm font-semibold text-brand-600">Monday, September 28</p><h1 className="mt-1 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">Good morning, Hemanth</h1><p className="mt-2 text-sm text-slate-500">Here’s what’s happening with your support operation today.</p></div><div className="flex gap-2"><Button variant="secondary" onClick={() => setViewState('empty')}>Preview empty</Button><Button variant="secondary" onClick={() => setViewState('error')}>Preview error</Button></div></div><section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><SummaryCard title="Total tickets" value="86" trend="12.5%" trendUp detail="vs last week" icon={LifeBuoy} tone="blue" /><SummaryCard title="Awaiting response" value="24" trend="4.2%" trendUp={false} detail="vs last week" icon={Clock3} tone="amber" /><SummaryCard title="Resolved today" value="18" trend="8.1%" trendUp detail="vs yesterday" icon={CheckCircle2} tone="green" /><SummaryCard title="Avg. response time" value="8m" trend="2m" trendUp detail="faster this week" icon={Timer} tone="purple" /></section><section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_330px]"><RecentTicketsTable tickets={mockTickets} /><StatusOverview /></section></div>
}
