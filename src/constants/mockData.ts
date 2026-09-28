import type { Ticket } from '../types/ticket'

export const mockTickets: Ticket[] = [
  { id: 'TKT-1048', title: 'Unable to export quarterly report', description: 'Export stalls at 90%.', customer: 'Olivia Martin', customerEmail: 'olivia@northstar.io', category: 'Technical', priority: 'urgent', status: 'open', createdAt: '2026-09-28T13:42:00Z', assignee: 'Maya Chen' },
  { id: 'TKT-1047', title: 'Billing address update request', description: 'Customer needs invoice details updated.', customer: 'Ethan Williams', customerEmail: 'ethan@atlas.co', category: 'Billing', priority: 'medium', status: 'in_progress', createdAt: '2026-09-28T12:08:00Z', assignee: 'Liam Brooks' },
  { id: 'TKT-1046', title: 'SSO configuration assistance', description: 'Assistance needed with SAML metadata.', customer: 'Sophia Patel', customerEmail: 'sophia@vertex.dev', category: 'Onboarding', priority: 'high', status: 'in_progress', createdAt: '2026-09-28T10:15:00Z', assignee: 'Noah Kim' },
  { id: 'TKT-1045', title: 'Duplicate notification emails', description: 'Notifications are delivered twice.', customer: 'Marcus Lee', customerEmail: 'marcus@clearpath.com', category: 'Technical', priority: 'low', status: 'resolved', createdAt: '2026-09-27T20:31:00Z', assignee: 'Maya Chen' },
  { id: 'TKT-1044', title: 'Add two users to workspace', description: 'Seats have already been purchased.', customer: 'Ava Johnson', customerEmail: 'ava@lumen.ai', category: 'Account', priority: 'medium', status: 'closed', createdAt: '2026-09-27T17:02:00Z', assignee: 'Liam Brooks' },
]
