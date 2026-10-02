import { Activity, Bot, BookOpenText, CircleGauge, FileCheck2, LogOut, Menu, Plus, Ticket, X } from 'lucide-react'
import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Button } from '../components/common/Button'
import { ConfirmDialog } from '../components/common/ConfirmDialog'
import { cn } from '../utils/cn'
import { useAuth } from '../contexts/AuthContext'
import type { UserRole } from '../types/auth'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: CircleGauge, roles: ['support_agent', 'reviewer', 'administrator'] as UserRole[] },
  { to: '/tickets', label: 'Tickets', icon: Ticket, roles: ['support_agent', 'reviewer', 'administrator'] as UserRole[] },
  { to: '/reviews', label: 'Reviews', icon: FileCheck2, roles: ['reviewer', 'administrator'] as UserRole[] },
  { to: '/knowledge', label: 'Knowledge Base', icon: BookOpenText, roles: ['support_agent', 'reviewer', 'administrator'] as UserRole[] },
  { to: '/monitoring', label: 'Monitoring', icon: Activity, roles: ['administrator'] as UserRole[] },
]

function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { user } = useAuth()
  return <><div className="flex h-16 items-center gap-3 border-b px-5"><span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-600 text-white"><Bot className="h-5 w-5" /></span><div><p className="font-extrabold leading-none text-ink">SupportFlow</p><p className="mt-1 text-[10px] font-bold uppercase tracking-[.16em] text-brand-600">Agent workspace</p></div></div><nav className="flex-1 space-y-1 p-3">{navItems.filter((item) => user && item.roles.includes(user.role)).map(({ to, label, icon: Icon }) => <NavLink key={to} to={to} onClick={onNavigate} className={({ isActive }) => cn('flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition', isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900')}><Icon className="h-[18px] w-[18px]" />{label}</NavLink>)}</nav></>
}

export function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [confirmLogout, setConfirmLogout] = useState(false)
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  return <div className="min-h-screen bg-slate-50"><aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r bg-white lg:flex"><Sidebar /></aside>{mobileOpen && <div className="fixed inset-0 z-40 lg:hidden"><button className="absolute inset-0 bg-slate-950/30" aria-label="Close menu" onClick={() => setMobileOpen(false)} /><aside className="relative flex h-full w-72 flex-col bg-white shadow-xl"><button aria-label="Close navigation" className="absolute right-3 top-4 rounded-lg p-2 text-slate-500 hover:bg-slate-100" onClick={() => setMobileOpen(false)}><X className="h-5 w-5" /></button><Sidebar onNavigate={() => setMobileOpen(false)} /></aside></div>}<div className="lg:pl-64"><header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8"><button className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Open navigation"><Menu className="h-5 w-5" /></button><div className="ml-auto flex items-center gap-2"><Button className="hidden sm:inline-flex" icon={<Plus className="h-4 w-4" />} onClick={() => navigate('/tickets/new')}>New ticket</Button><div className="hidden text-right md:block"><p className="text-xs font-bold text-slate-800">{user?.email}</p><p className="text-[10px] capitalize text-slate-500">{user?.role.replace('_', ' ')}</p></div><Button variant="ghost" aria-label="Sign out" icon={<LogOut className="h-4 w-4" />} onClick={() => setConfirmLogout(true)}>Sign out</Button></div></header><main className="p-4 sm:p-6 lg:p-8"><Outlet /></main></div><ConfirmDialog open={confirmLogout} title="Sign out?" message="You will need to sign in again to access the support workspace." confirmLabel="Sign out" onCancel={() => setConfirmLogout(false)} onConfirm={() => void logout()} /></div>
}
