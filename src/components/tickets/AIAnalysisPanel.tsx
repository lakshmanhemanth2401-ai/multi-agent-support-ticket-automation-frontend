import axios from 'axios'
import { AlertTriangle, Bot, BookOpenText, CheckCircle2, Play, RotateCw, Sparkles } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Badge } from '../common/Badge'
import { Button } from '../common/Button'
import { Card } from '../common/Card'
import { ErrorState } from '../common/ErrorState'
import { Loading } from '../common/Loading'
import { getTicket, getTicketAnalysis, runTicketAnalysis } from '../../services/endpoints/tickets'
import type { Ticket, TicketAnalysisStatus, WorkflowAnalysis } from '../../types/ticket'

function asPercent(value: number) { return `${Math.round(value * 100)}%` }

export function AIAnalysisPanel({ ticket }: { ticket: Ticket }) {
  const [analysis, setAnalysis] = useState<WorkflowAnalysis | null>(null)
  const [status, setStatus] = useState<TicketAnalysisStatus>(ticket.analysisStatus || 'not_started')
  const [threadId, setThreadId] = useState(ticket.workflowThreadId || '')
  const [loading, setLoading] = useState(status === 'queued' || status === 'running')
  const [error, setError] = useState('')
  const loadCompletedAnalysis = useCallback(async (workflowThreadId: string) => {
    setLoading(true)
    try { setAnalysis(await getTicketAnalysis(workflowThreadId)); setError('') }
    catch (requestError) { setError(axios.isAxiosError(requestError) ? requestError.response?.data?.message || requestError.message : 'Unable to load AI analysis.') }
    finally { setLoading(false) }
  }, [])
  useEffect(() => {
    if ((status === 'awaiting_review' || status === 'completed') && threadId && !analysis) void loadCompletedAnalysis(threadId)
  }, [analysis, loadCompletedAnalysis, status, threadId])
  useEffect(() => {
    if (status !== 'queued' && status !== 'running') return
    let active = true
    const poll = async () => {
      try {
        const latest = await getTicket(String(ticket.id))
        if (!active) return
        const nextStatus = latest.analysisStatus || 'not_started'
        setStatus(nextStatus); setThreadId(latest.workflowThreadId || '')
        if (nextStatus === 'failed') { setError(latest.analysisError || 'AI analysis failed.'); setLoading(false) }
      } catch (requestError) {
        if (active) { setError(axios.isAxiosError(requestError) ? requestError.response?.data?.message || requestError.message : 'Unable to refresh AI processing status.'); setLoading(false) }
      }
    }
    void poll()
    const timer = window.setInterval(() => void poll(), 5000)
    return () => { active = false; window.clearInterval(timer) }
  }, [status, ticket.id])
  async function runAnalysis() {
    setLoading(true); setError('')
    try { setAnalysis(await runTicketAnalysis(String(ticket.id))) }
    catch (requestError) {
      if (axios.isAxiosError(requestError) && requestError.response?.status === 409) { setStatus('running'); return }
      setError(axios.isAxiosError(requestError) ? requestError.response?.data?.message || requestError.message : 'AI analysis failed unexpectedly.')
    }
    finally { setLoading(false) }
  }
  if (loading || status === 'queued' || status === 'running') return <Card className="border-indigo-100"><Loading label="Agents are classifying the ticket and retrieving knowledge… This page updates automatically." /></Card>
  if (error) return <Card className="border-rose-100"><ErrorState title="AI analysis unavailable" message={error} onRetry={() => void runAnalysis()} /></Card>
  if (!analysis) return <Card className="border-indigo-100 bg-gradient-to-br from-white to-indigo-50/60 p-6"><div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center"><div className="flex gap-4"><span className="rounded-xl bg-indigo-100 p-3 text-indigo-700"><Sparkles className="h-6 w-6" /></span><div><h2 className="font-extrabold text-ink">AI Analysis</h2><p className="mt-1 max-w-xl text-sm leading-6 text-slate-500">Run the support workflow to classify this ticket, search ChromaDB knowledge, and generate a recommended solution.</p></div></div><Button icon={<Play className="h-4 w-4" />} onClick={() => void runAnalysis()}>Run analysis</Button></div></Card>

  const { classification, knowledge, solution } = analysis
  const incomplete = !classification && !knowledge && !solution
  return <Card className="overflow-hidden border-indigo-100"><div className="flex flex-col justify-between gap-4 border-b border-indigo-100 bg-indigo-50/70 px-6 py-5 sm:flex-row sm:items-center"><div className="flex items-center gap-3"><span className="rounded-lg bg-indigo-600 p-2 text-white"><Bot className="h-5 w-5" /></span><div><h2 className="font-extrabold text-ink">AI Analysis</h2><p className="text-xs text-slate-500">Thread {analysis.thread_id}</p></div></div><div className="flex items-center gap-2"><Badge tone={analysis.status === 'completed' ? 'green' : 'amber'}>{analysis.status.replace('_', ' ')}</Badge><Button variant="secondary" icon={<RotateCw className="h-4 w-4" />} onClick={() => void runAnalysis()}>Refresh analysis</Button></div></div>{analysis.response && <section className="border-b p-6"><div className="flex items-center justify-between gap-3"><p className="text-xs font-bold uppercase tracking-wider text-indigo-600">Generated response</p><Badge tone="purple">{asPercent(analysis.response.confidence)} confidence</Badge></div><h3 className="mt-3 font-bold text-slate-800">{analysis.response.subject}</h3><p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-600">{analysis.response.body}</p>{analysis.review?.id && <Link to={`/reviews/${analysis.review.id}`} className="mt-4 inline-flex"><Button>Open human review</Button></Link>}</section>}{incomplete ? <div className="flex gap-3 p-6 text-sm text-amber-800"><AlertTriangle className="h-5 w-5 shrink-0" /><div><p className="font-bold">Analysis is awaiting human review</p><p className="mt-1 text-amber-700">The generated response is ready for review. Detailed classification, knowledge, and solution fields are withheld by the current backend until completion.</p></div></div> : <div className="grid gap-0 divide-y lg:grid-cols-2 lg:divide-x lg:divide-y-0"><section className="space-y-5 p-6"><div><p className="text-xs font-bold uppercase tracking-wider text-indigo-600">Classification</p>{classification ? <div className="mt-3 grid grid-cols-2 gap-3"><div className="rounded-lg bg-slate-50 p-3"><p className="text-xs text-slate-500">Category</p><p className="mt-1 font-bold capitalize text-slate-800">{classification.category}</p></div><div className="rounded-lg bg-slate-50 p-3"><p className="text-xs text-slate-500">Priority</p><p className="mt-1 font-bold capitalize text-slate-800">{classification.priority}</p></div><div className="col-span-2"><div className="flex justify-between text-xs"><span className="font-semibold text-slate-600">Confidence</span><span className="font-bold text-indigo-700">{asPercent(classification.confidence)}</span></div><div className="mt-2 h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-indigo-500" style={{ width: asPercent(classification.confidence) }} /></div></div><p className="col-span-2 text-sm leading-6 text-slate-600">{classification.reasoning_summary}</p></div> : <p className="mt-3 text-sm text-slate-500">Classification is not available.</p>}</div><div><p className="text-xs font-bold uppercase tracking-wider text-indigo-600">Recommended solution</p><p className="mt-3 text-sm leading-6 text-slate-700">{solution?.summary || 'No recommendation is available yet.'}</p>{solution?.escalation_required && <div className="mt-3 flex gap-2 rounded-lg bg-amber-50 p-3 text-xs text-amber-800"><AlertTriangle className="h-4 w-4 shrink-0" />{solution.escalation_reason || 'Human escalation is required.'}</div>}</div>{solution?.troubleshooting_steps?.length ? <div><p className="text-xs font-bold uppercase tracking-wider text-indigo-600">Troubleshooting steps</p><ol className="mt-3 space-y-3">{solution.troubleshooting_steps.map((step, index) => <li key={`${index}-${step}`} className="flex gap-3 text-sm text-slate-700"><span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">{index + 1}</span><span className="pt-0.5 leading-5">{step}</span></li>)}</ol></div> : null}</section><section className="p-6"><div className="flex items-center gap-2"><BookOpenText className="h-4 w-4 text-indigo-600" /><p className="text-xs font-bold uppercase tracking-wider text-indigo-600">Retrieved knowledge</p></div>{knowledge?.results?.length ? <div className="mt-4 space-y-3">{knowledge.results.map((chunk, index) => <div key={`${chunk.source}-${index}`} className="rounded-lg border p-4"><div className="flex items-center justify-between gap-3"><p className="truncate text-sm font-bold text-slate-800">{chunk.metadata?.title ? String(chunk.metadata.title) : chunk.source}</p><Badge tone="purple">{asPercent(chunk.relevance_score)}</Badge></div><p className="mt-1 truncate text-xs text-slate-500">{chunk.source}</p><p className="mt-3 line-clamp-4 text-xs leading-5 text-slate-600">{chunk.content}</p></div>)}</div> : <div className="mt-6 flex gap-3 rounded-lg bg-slate-50 p-4 text-sm text-slate-500"><CheckCircle2 className="h-5 w-5 shrink-0 text-slate-400" />{knowledge?.reason || 'No supporting knowledge sources were returned.'}</div>}</section></div>}</Card>
}
