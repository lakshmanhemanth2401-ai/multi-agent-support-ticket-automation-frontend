import { LoaderCircle } from 'lucide-react'

export function Loading({ label = 'Loading…', fullPage = false }: { label?: string; fullPage?: boolean }) {
  return <div className={`flex items-center justify-center gap-3 text-sm font-medium text-slate-500 ${fullPage ? 'min-h-[50vh]' : 'py-12'}`} role="status"><LoaderCircle className="h-5 w-5 animate-spin text-brand-600" /><span>{label}</span></div>
}
