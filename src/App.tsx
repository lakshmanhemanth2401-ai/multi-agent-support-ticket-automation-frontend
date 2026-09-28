import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './layouts/AppLayout'
import { CreateTicketPage } from './pages/CreateTicket/CreateTicketPage'
import { DashboardPage } from './pages/Dashboard/DashboardPage'
import { KnowledgeBasePage } from './pages/KnowledgeBase/KnowledgeBasePage'
import { ReviewDetailsPage } from './pages/ReviewDetails/ReviewDetailsPage'
import { ReviewsPage } from './pages/Reviews/ReviewsPage'
import { TicketDetailsPage } from './pages/TicketDetails/TicketDetailsPage'
import { TicketsPage } from './pages/Tickets/TicketsPage'

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="tickets" element={<TicketsPage />} />
        <Route path="tickets/new" element={<CreateTicketPage />} />
        <Route path="tickets/:ticketId" element={<TicketDetailsPage />} />
        <Route path="reviews" element={<ReviewsPage />} />
        <Route path="reviews/:reviewId" element={<ReviewDetailsPage />} />
        <Route path="knowledge" element={<KnowledgeBasePage />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  )
}
