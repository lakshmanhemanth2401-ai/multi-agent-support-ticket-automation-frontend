import { expect, test } from '@playwright/test'

const user = { id: 1, email: 'reviewer@example.com', role: 'reviewer', is_active: true, created_at: '2026-01-01T00:00:00Z' }
const ticket = { id: 42, title: 'Cannot access SSO', description: 'SSO returns an access error.', status: 'open', priority: 'high', category: 'account', created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' }

test('login and ticket creation flow', async ({ page }) => {
  await page.route('**/api/v1/**', async (route) => {
    const url = route.request().url(); const method = route.request().method()
    if (url.endsWith('/auth/login')) return route.fulfill({ json: { access_token: 'test-access', refresh_token: 'test-refresh-token-value', token_type: 'bearer', expires_in: 900, user } })
    if (url.endsWith('/tickets') && method === 'GET') return route.fulfill({ json: { items: [], pagination: { offset: 0, limit: 100, total: 0 } } })
    if (url.endsWith('/tickets') && method === 'POST') return route.fulfill({ status: 201, json: ticket })
    if (url.endsWith('/tickets/42/audit')) return route.fulfill({ json: { items: [], pagination: { offset: 0, limit: 100, total: 0 } } })
    if (url.endsWith('/tickets/42')) return route.fulfill({ json: ticket })
    return route.fulfill({ status: 404, json: { detail: 'Not mocked' } })
  })
  await page.goto('/login', { waitUntil: 'domcontentloaded' })
  await page.getByLabel('Email').fill('reviewer@example.com')
  await page.getByLabel('Password').fill('password123')
  await page.getByRole('button', { name: 'Sign in' }).click()
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()
  await page.getByRole('button', { name: 'New ticket' }).click()
  await page.getByLabel('Subject').fill('Cannot access SSO')
  await page.getByLabel('Description').fill('SSO returns an access error.')
  await page.getByLabel('Customer').fill('Example customer')
  await page.getByLabel('Category').selectOption({ label: 'Account' })
  await page.getByRole('button', { name: /create ticket/i }).click()
  await expect(page.getByText('Ticket #42')).toBeVisible()
  await expect(page.getByText('SSO returns an access error.')).toBeVisible()
})
