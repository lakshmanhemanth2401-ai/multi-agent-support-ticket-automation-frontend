import { AlertTriangle } from 'lucide-react'
import { Component, type ReactNode } from 'react'
import { Button } from './Button'
import { Card } from './Card'

export class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  componentDidCatch() { /* External reporting can be connected here when configured. */ }
  render() { if (this.state.failed) return <main className="grid min-h-screen place-items-center bg-slate-50 p-4"><Card className="max-w-lg p-8 text-center"><AlertTriangle className="mx-auto h-10 w-10 text-danger-600" /><h1 className="mt-4 text-2xl font-extrabold text-ink">Something went wrong</h1><p className="mt-2 text-sm text-slate-500">The interface encountered an unexpected error. Your data was not changed.</p><Button className="mt-6" onClick={() => window.location.assign('/dashboard')}>Return to dashboard</Button></Card></main>; return this.props.children }
}
