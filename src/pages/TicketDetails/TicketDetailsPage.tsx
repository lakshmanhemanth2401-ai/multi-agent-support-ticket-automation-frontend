import axios from "axios";
import { Calendar, RefreshCw, Tag } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Breadcrumbs } from "../../components/common/Breadcrumbs";
import { AIAnalysisPanel } from "../../components/tickets/AIAnalysisPanel";
import { AuditTrail } from "../../components/tickets/AuditTrail";
import { Button } from "../../components/common/Button";
import { Card } from "../../components/common/Card";
import { ErrorState } from "../../components/common/ErrorState";
import { Loading } from "../../components/common/Loading";
import {
  PriorityBadge,
  StatusBadge,
} from "../../components/tickets/TicketBadges";
import { getTicket } from "../../services/endpoints/tickets";
import type { Ticket } from "../../types/ticket";

export function TicketDetailsPage() {
  const { ticketId = "" } = useParams();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const loadTicket = useCallback(
    async (refresh = false) => {
      if (refresh) setRefreshing(true);
      else setLoading(true);
      setError("");
      try {
        setTicket(await getTicket(ticketId));
      } catch (requestError) {
        setError(
          axios.isAxiosError(requestError)
            ? requestError.response?.data?.message || requestError.message
            : "Unable to load this ticket.",
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [ticketId],
  );
  useEffect(() => {
    void loadTicket();
  }, [loadTicket]);
  if (loading) return <Loading fullPage label="Loading ticket details…" />;
  if (error || !ticket)
    return (
      <Card className="mx-auto max-w-4xl">
        <ErrorState
          title="Ticket unavailable"
          message={error || "The ticket was not found."}
          onRetry={() => void loadTicket()}
        />
      </Card>
    );
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <Breadcrumbs items={[{ label: "Tickets", to: "/tickets" }, { label: `Ticket #${ticket.id}` }]} />
        <Button
          variant="secondary"
          loading={refreshing}
          icon={<RefreshCw className="h-4 w-4" />}
          onClick={() => void loadTicket(true)}
        >
          Refresh
        </Button>
      </div>
      <Card className="p-6 sm:p-8">
        <div className="flex flex-col justify-between gap-5 border-b pb-6 sm:flex-row sm:items-start">
          <div>
            <p className="text-sm font-bold text-brand-600">
              Ticket #{ticket.id}
            </p>
            <h1 className="mt-2 text-2xl font-extrabold text-ink">
              {ticket.title}
            </h1>
            <div className="mt-4 flex flex-wrap gap-2">
              <PriorityBadge priority={ticket.priority} />
              <StatusBadge status={ticket.status} />
            </div>
          </div>
          <div className="text-sm text-slate-500">
            <p className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {new Date(ticket.createdAt).toLocaleString()}
            </p>
            <p className="mt-2 flex items-center gap-2">
              <Tag className="h-4 w-4" />
              {ticket.category || "Uncategorized"}
            </p>
          </div>
        </div>
        <section className="py-7">
          <h2 className="font-bold text-ink">Description</h2>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-600">
            {ticket.description}
          </p>
        </section>
      </Card>
      <AIAnalysisPanel ticket={ticket} />
      <AuditTrail ticketId={ticketId} />
    </div>
  );
}
