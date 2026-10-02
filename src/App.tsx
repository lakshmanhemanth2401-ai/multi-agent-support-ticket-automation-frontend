import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './layouts/AppLayout'
import { CreateTicketPage } from './pages/CreateTicket/CreateTicketPage'
import { DashboardPage } from './pages/Dashboard/DashboardPage'
import { KnowledgeBasePage } from './pages/KnowledgeBase/KnowledgeBasePage'
import { MonitoringPage } from './pages/Monitoring/MonitoringPage'
import { ReviewDetailsPage } from './pages/ReviewDetails/ReviewDetailsPage'
import { ReviewsPage } from './pages/Reviews/ReviewsPage'
import { TicketDetailsPage } from './pages/TicketDetails/TicketDetailsPage'
import { TicketsPage } from './pages/Tickets/TicketsPage'
import { LoginPage } from './pages/Login/LoginPage'
import { AccessDeniedPage } from './pages/AccessDenied/AccessDeniedPage'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { NotFoundPage } from './pages/NotFound/NotFoundPage'

export default function App() {
  return (
    <Routes>
      <Route path="login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
      <Route element={<AppLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="tickets" element={<TicketsPage />} />
        <Route path="tickets/new" element={<CreateTicketPage />} />
        <Route path="tickets/:ticketId" element={<TicketDetailsPage />} />
        <Route path="knowledge" element={<KnowledgeBasePage />} />
        <Route path="access-denied" element={<AccessDeniedPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
      </Route>
      <Route element={<ProtectedRoute roles={['reviewer', 'administrator']} />}><Route element={<AppLayout />}><Route path="reviews" element={<ReviewsPage />} /><Route path="reviews/:reviewId" element={<ReviewDetailsPage />} /></Route></Route>
      <Route element={<ProtectedRoute roles={['administrator']} />}><Route element={<AppLayout />}><Route path="monitoring" element={<MonitoringPage />} /></Route></Route>
    </Routes>
  )
}
