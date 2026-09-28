import axios from 'axios'
import { AlertCircle, ArrowLeft, CheckCircle2, Send } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../../components/common/Button'
import { Card } from '../../components/common/Card'
import { Input } from '../../components/common/Input'
import { createTicket } from '../../services/endpoints/tickets'
import type { CreateTicketPayload, TicketPriority } from '../../types/ticket'
import { cn } from '../../utils/cn'

type Errors = Partial<Record<keyof CreateTicketPayload, string>>
const initialForm: CreateTicketPayload = { subject: '', description: '', customer: '', category: '', priority: 'medium' }

function validate(form: CreateTicketPayload): Errors {
  const errors: Errors = {}
  if (!form.subject.trim()) errors.subject = 'Subject is required.'
  else if (form.subject.trim().length < 5) errors.subject = 'Subject must be at least 5 characters.'
  if (!form.description.trim()) errors.description = 'Description is required.'
  else if (form.description.trim().length < 20) errors.description = 'Please provide at least 20 characters.'
  if (!form.customer.trim()) errors.customer = 'Customer name or email is required.'
  if (!form.category) errors.category = 'Select a category.'
  return errors
}

export function CreateTicketPage() {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState<Errors>({})
  const [submitting, setSubmitting] = useState(false)
  const [serverError, setServerError] = useState('')
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()
  const update = <K extends keyof CreateTicketPayload>(key: K, value: CreateTicketPayload[K]) => { setForm((current) => ({ ...current, [key]: value })); setErrors((current) => ({ ...current, [key]: undefined })); setServerError('') }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const nextErrors = validate(form)
    if (Object.keys(nextErrors).length) { setErrors(nextErrors); return }
    setSubmitting(true); setServerError('')
    try {
      const ticket = await createTicket({ ...form, subject: form.subject.trim(), description: form.description.trim(), customer: form.customer.trim() })
      setSuccess(true)
      window.setTimeout(() => navigate(`/tickets/${ticket.id}`), 700)
    } catch (error) {
      if (axios.isAxiosError(error)) setServerError(error.response?.data?.message || error.message || 'The ticket could not be created.')
      else setServerError('An unexpected error occurred. Please try again.')
    } finally { setSubmitting(false) }
  }

  return <div className="mx-auto max-w-4xl"><Link to="/tickets" className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800"><ArrowLeft className="h-4 w-4" />Back to tickets</Link><div className="mb-6"><h1 className="text-2xl font-extrabold text-ink">Create a new ticket</h1><p className="mt-1 text-sm text-slate-500">Capture the issue clearly so the right agent can start quickly.</p></div>{success && <div className="mb-5 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800" role="status"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" /><div><p className="text-sm font-bold">Ticket created successfully</p><p className="mt-0.5 text-xs">Opening the ticket details…</p></div></div>}{serverError && <div className="mb-5 flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-800" role="alert"><AlertCircle className="mt-0.5 h-5 w-5 shrink-0" /><div><p className="text-sm font-bold">Unable to create ticket</p><p className="mt-0.5 text-xs">{serverError}</p></div></div>}<form onSubmit={handleSubmit} noValidate><Card className="p-5 sm:p-7"><div className="grid gap-6 sm:grid-cols-2"><div className="sm:col-span-2"><Input label="Subject" name="subject" value={form.subject} onChange={(event) => update('subject', event.target.value)} error={errors.subject} placeholder="Brief summary of the customer issue" maxLength={120} /></div><Input label="Customer" name="customer" value={form.customer} onChange={(event) => update('customer', event.target.value)} error={errors.customer} placeholder="Customer name or email" /><div className="space-y-1.5"><label htmlFor="category" className="block text-sm font-semibold text-slate-700">Category</label><select id="category" value={form.category} onChange={(event) => update('category', event.target.value)} className={cn('h-11 w-full rounded-lg border bg-white px-3 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100', errors.category && 'border-rose-400')}><option value="">Select a category</option><option>Technical</option><option>Billing</option><option>Account</option><option>Onboarding</option><option>Feature request</option><option>Other</option></select>{errors.category && <p className="text-xs font-medium text-rose-600">{errors.category}</p>}</div><div className="sm:col-span-2 space-y-1.5"><label htmlFor="description" className="block text-sm font-semibold text-slate-700">Description</label><textarea id="description" rows={6} value={form.description} onChange={(event) => update('description', event.target.value)} className={cn('w-full resize-y rounded-lg border bg-white px-3 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-100', errors.description && 'border-rose-400')} placeholder="Describe the issue, expected behavior, and any troubleshooting already attempted." /><div className="flex justify-between"><span>{errors.description && <span className="text-xs font-medium text-rose-600">{errors.description}</span>}</span><span className="text-xs text-slate-400">{form.description.length} characters</span></div></div><fieldset className="sm:col-span-2"><legend className="text-sm font-semibold text-slate-700">Priority</legend><div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-4">{(['low', 'medium', 'high', 'urgent'] as TicketPriority[]).map((priority) => <label key={priority} className={cn('cursor-pointer rounded-lg border px-4 py-3 text-center text-sm font-semibold capitalize transition', form.priority === priority ? 'border-brand-500 bg-brand-50 text-brand-700 ring-1 ring-brand-500' : 'bg-white text-slate-600 hover:bg-slate-50')}><input className="sr-only" type="radio" name="priority" value={priority} checked={form.priority === priority} onChange={() => update('priority', priority)} />{priority}</label>)}</div></fieldset></div><div className="mt-8 flex flex-col-reverse justify-end gap-3 border-t pt-6 sm:flex-row"><Link to="/tickets"><Button type="button" variant="secondary" className="w-full sm:w-auto">Cancel</Button></Link><Button type="submit" className="w-full sm:w-auto" loading={submitting} icon={<Send className="h-4 w-4" />}>{submitting ? 'Creating ticket…' : 'Create ticket'}</Button></div></Card></form></div>
}
