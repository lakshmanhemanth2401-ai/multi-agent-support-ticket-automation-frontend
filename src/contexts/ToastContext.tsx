import { CheckCircle2, Info, X, XCircle } from 'lucide-react'
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'

type ToastTone = 'success' | 'error' | 'info'
interface Toast { id: number; message: string; tone: ToastTone }
const ToastContext = createContext<{ notify: (message: string, tone?: ToastTone) => void } | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const dismiss = useCallback((id: number) => setToasts((items) => items.filter((item) => item.id !== id)), [])
  const notify = useCallback((message: string, tone: ToastTone = 'info') => { const id = Date.now(); setToasts((items) => [...items, { id, message, tone }]); window.setTimeout(() => dismiss(id), 4500) }, [dismiss])
  const value = useMemo(() => ({ notify }), [notify])
  const icons = { success: CheckCircle2, error: XCircle, info: Info }
  const colors = { success: 'border-success-100 bg-success-50 text-success-700', error: 'border-danger-100 bg-danger-50 text-danger-700', info: 'border-info-100 bg-info-50 text-info-700' }
  return <ToastContext.Provider value={value}>{children}<div aria-live="polite" className="fixed right-4 top-4 z-[80] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3">{toasts.map((toast) => { const Icon = icons[toast.tone]; return <div role="status" key={toast.id} className={`flex items-start gap-3 rounded-xl border p-4 shadow-elevated ${colors[toast.tone]}`}><Icon className="mt-0.5 h-5 w-5 shrink-0" /><p className="flex-1 text-sm font-semibold">{toast.message}</p><button aria-label="Dismiss notification" onClick={() => dismiss(toast.id)}><X className="h-4 w-4" /></button></div> })}</div></ToastContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useToast() { const value = useContext(ToastContext); if (!value) throw new Error('useToast must be used inside ToastProvider'); return value }
