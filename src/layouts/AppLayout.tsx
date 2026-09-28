import { Bell, Bot, ChevronDown, CircleGauge, FileCheck2, Menu, Plus, Search, Ticket, X } from 'lucide-react'
import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Button } from '../components/common/Button'
import { cn } from '../utils/cn'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: CircleGauge },
  { to: '/tickets', label: 'Tickets', icon: Ticket },
  { to: '/reviews', label: 'Reviews', icon: FileCheck2 },
]

function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  return <><div className="flex h-16 items-center gap-3 border-b px-5"><span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-600 text-white"><Bot className="h-5 w-5" /></span><div><p className="font-extrabold leading-none text-ink">SupportFlow</p><p className="mt-1 text-[10px] font-bold uppercase tracking-[.16em] text-brand-600">Agent workspace</p></div></div><nav className="flex-1 space-y-1 p-3">{navItems.map(({ to, label, icon: Icon }) => <NavLink key={to} to={to} onClick={onNavigate} className={({ isActive }) => cn('flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition', isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900')}><Icon className="h-[18px] w-[18px]" />{label}</NavLink>)}</nav><div className="m-3 rounded-xl bg-slate-900 p-4 text-white"><p className="text-xs font-bold text-blue-300">AUTOMATION STATUS</p><p className="mt-2 text-sm font-semibold">All agents operational</p><div className="mt-3 flex items-center gap-2 text-xs text-slate-300"><span className="h-2 w-2 rounded-full bg-emerald-400" />4 agents online</div></div></>
}

export function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()
  return <div className="min-h-screen bg-slate-50"><aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r bg-white lg:flex"><Sidebar /></aside>{mobileOpen && <div className="fixed inset-0 z-40 lg:hidden"><button className="absolute inset-0 bg-slate-950/30" aria-label="Close menu" onClick={() => setMobileOpen(false)} /><aside className="relative flex h-full w-72 flex-col bg-white shadow-xl"><button className="absolute right-3 top-4 rounded-lg p-2 text-slate-500 hover:bg-slate-100" onClick={() => setMobileOpen(false)}><X className="h-5 w-5" /></button><Sidebar onNavigate={() => setMobileOpen(false)} /></aside></div>}<div className="lg:pl-64"><header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8"><button className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Open navigation"><Menu className="h-5 w-5" /></button><div className="relative hidden max-w-md flex-1 sm:block"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input className="h-10 w-full rounded-lg border-0 bg-slate-100 pl-10 pr-4 text-sm outline-none ring-brand-200 placeholder:text-slate-400 focus:ring-2" placeholder="Search tickets, customers…" /></div><div className="ml-auto flex items-center gap-2"><Button className="hidden sm:inline-flex" icon={<Plus className="h-4 w-4" />} onClick={() => navigate('/tickets/new')}>New ticket</Button><button className="relative rounded-lg p-2.5 text-slate-500 hover:bg-slate-100" aria-label="Notifications"><Bell className="h-5 w-5" /><span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-rose-500" /></button><button className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-slate-100"><span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-xs font-bold text-white">HM</span><span className="hidden text-left md:block"><span className="block text-xs font-bold text-slate-800">Hemanth</span><span className="block text-[10px] text-slate-500">Administrator</span></span><ChevronDown className="hidden h-4 w-4 text-slate-400 md:block" /></button></div></header><main className="p-4 sm:p-6 lg:p-8"><Outlet /></main></div></div>
}
