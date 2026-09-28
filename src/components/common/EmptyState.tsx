import { Inbox } from 'lucide-react'
import type { ReactNode } from 'react'

export function EmptyState({ title, message, action }: { title: string; message: string; action?: ReactNode }) {
  return <div className="flex flex-col items-center px-6 py-14 text-center"><span className="mb-4 rounded-full bg-slate-100 p-3 text-slate-500"><Inbox className="h-6 w-6" /></span><h3 className="text-base font-bold text-slate-800">{title}</h3><p className="mt-1 max-w-sm text-sm text-slate-500">{message}</p>{action && <div className="mt-5">{action}</div>}</div>
}
