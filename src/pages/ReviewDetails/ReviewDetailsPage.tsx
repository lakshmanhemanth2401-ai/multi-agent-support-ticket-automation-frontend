import axios from "axios";
import {
  AlertTriangle,
  BookOpenText,
  Bot,
  Check,
  Edit3,
  RefreshCw,
  RotateCcw,
  Send,
  Ticket as TicketIcon,
  X,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Breadcrumbs } from "../../components/common/Breadcrumbs";
import { Badge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";
import { Card } from "../../components/common/Card";
import { ErrorState } from "../../components/common/ErrorState";
import { Input } from "../../components/common/Input";
import { Loading } from "../../components/common/Loading";
import { ReviewStatusBadge } from "../../components/reviews/ReviewStatusBadge";
import {
  PriorityBadge,
  StatusBadge,
} from "../../components/tickets/TicketBadges";
import {
  getReview,
  getWorkflow,
  submitReview,
} from "../../services/endpoints/reviews";
import { getTicket } from "../../services/endpoints/tickets";
import type { Review, ReviewAction, WorkflowDetail } from "../../types/review";
import type { Ticket } from "../../types/ticket";
import { useToast } from "../../contexts/ToastContext";

function message(error: unknown) {
  return axios.isAxiosError(error)
    ? error.response?.data?.message || error.message
    : "The review request failed unexpectedly.";
}
function percent(value: number) {
  return `${Math.round(value * 100)}%`;
}

export function ReviewDetailsPage() {
  const { notify } = useToast();
  const { reviewId = "" } = useParams();
  const [review, setReview] = useState<Review | null>(null);
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [workflow, setWorkflow] = useState<WorkflowDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [workflowError, setWorkflowError] = useState("");
  const [reviewer, setReviewer] = useState("Hemanth");
  const [comments, setComments] = useState("");
  const [editing, setEditing] = useState(false);
  const [editedSubject, setEditedSubject] = useState("");
  const [editedResponse, setEditedResponse] = useState("");
  const [actionError, setActionError] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");
  const [submitting, setSubmitting] = useState<ReviewAction | null>(null);

  const load = useCallback(
    async (refresh = false) => {
      if (refresh) setRefreshing(true);
      else setLoading(true);
      setError("");
      setWorkflowError("");
      try {
        const nextReview = await getReview(reviewId);
        setReview(nextReview);
        const nextTicket = await getTicket(String(nextReview.ticketId));
        setTicket(nextTicket);
        setEditedSubject(
          nextReview.editedSubject || nextReview.generatedSubject || "",
        );
        setEditedResponse(
          nextReview.editedResponse || nextReview.generatedResponse || "",
        );
        if (nextReview.workflowThreadId) {
          try {
            setWorkflow(await getWorkflow(nextReview.workflowThreadId));
          } catch (workflowRequestError) {
            setWorkflowError(message(workflowRequestError));
          }
        }
      } catch (requestError) {
        setError(message(requestError));
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [reviewId],
  );
  useEffect(() => {
    void load();
  }, [load]);

  async function handleAction(action: ReviewAction) {
    if (!review?.workflowThreadId) {
      setActionError("This review has no workflow thread.");
      return;
    }
    if (!reviewer.trim()) {
      setActionError("Reviewer name is required.");
      return;
    }
    if ((action === "reject" || action === "regenerate") && !comments.trim()) {
      setActionError(`Comments are required to ${action} a response.`);
      return;
    }
    if (action === "edit" && !editedResponse.trim()) {
      setActionError("The edited response cannot be empty.");
      return;
    }
    if (
      (action === "reject" || action === "regenerate") &&
      !window.confirm(
        action === "reject"
          ? "Reject this response and return it for revision?"
          : "Regenerate this response using the current ticket evidence?",
      )
    )
      return;
    setSubmitting(action);
    setActionError("");
    setActionSuccess("");
    try {
      const result = await submitReview(review.workflowThreadId, {
        action,
        reviewer: reviewer.trim(),
        comments: comments.trim() || undefined,
        edited_subject:
          action === "edit" ? editedSubject.trim() || undefined : undefined,
        edited_response: action === "edit" ? editedResponse.trim() : undefined,
      });
      const successMessage = `Review ${action === "regenerate" ? "regeneration requested" : `${action}d`} successfully.`;
      setWorkflow(result);
      setActionSuccess(successMessage);
      notify(successMessage, "success");
      setEditing(false);
      setReview(await getReview(reviewId));
    } catch (requestError) {
      setActionError(message(requestError));
    } finally {
      setSubmitting(null);
    }
  }

  if (loading) return <Loading fullPage label="Loading review and workflow…" />;
  if (error || !review || !ticket)
    return (
      <Card className="mx-auto max-w-4xl">
        <ErrorState
          title="Review unavailable"
          message={error || "The review was not found."}
          onRetry={() => void load()}
        />
      </Card>
    );
  const pending = review.status === "pending";
  const classification = workflow?.classification;
  const knowledge = workflow?.knowledge;
  const solution = workflow?.solution;
  const generatedBody =
    review.editedResponse ||
    review.generatedResponse ||
    workflow?.response?.body ||
    "No generated response is available.";

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex items-center justify-between">
        <Breadcrumbs items={[{ label: "Reviews", to: "/reviews" }, { label: `Review #${review.id}` }]} />
        <Button
          variant="secondary"
          loading={refreshing}
          icon={<RefreshCw className="h-4 w-4" />}
          onClick={() => void load(true)}
        >
          Refresh
        </Button>
      </div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-bold text-brand-600">
              Review #{review.id}
            </p>
            <ReviewStatusBadge status={review.status} />
            {workflow && (
              <Badge tone={workflow.status === "completed" ? "green" : "amber"}>
                {workflow.status.replace(/_/g, " ")}
              </Badge>
            )}
          </div>
          <h1 className="mt-2 text-2xl font-extrabold text-ink">
            {review.generatedSubject || ticket.title}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Ticket #{ticket.id} · Response version {review.version}
          </p>
        </div>
      </div>
      {actionSuccess && (
        <div className="flex gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          <Check className="h-5 w-5 shrink-0" />
          {actionSuccess}
        </div>
      )}
      {actionError && (
        <div className="flex gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          {actionError}
        </div>
      )}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-2">
              <TicketIcon className="h-5 w-5 text-brand-600" />
              <h2 className="font-extrabold text-ink">Ticket information</h2>
            </div>
            <h3 className="mt-5 text-lg font-bold text-slate-800">
              {ticket.title}
            </h3>
            <div className="mt-3 flex flex-wrap gap-2">
              <PriorityBadge priority={ticket.priority} />
              <StatusBadge status={ticket.status} />
              <Badge>{ticket.category || "Uncategorized"}</Badge>
            </div>
            <p className="mt-5 whitespace-pre-wrap text-sm leading-7 text-slate-600">
              {ticket.description}
            </p>
          </Card>
          <Card className="overflow-hidden">
            <div className="flex items-center justify-between border-b bg-indigo-50/60 px-6 py-5">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-indigo-600" />
                <h2 className="font-extrabold text-ink">
                  AI-generated response
                </h2>
              </div>
              {workflow?.response && (
                <Badge tone="purple">
                  {percent(workflow.response.confidence)} confidence
                </Badge>
              )}
            </div>
            <div className="p-6">
              {editing ? (
                <div className="space-y-4">
                  <Input
                    label="Response subject"
                    value={editedSubject}
                    onChange={(event) => setEditedSubject(event.target.value)}
                  />
                  <div>
                    <label
                      className="mb-1.5 block text-sm font-semibold text-slate-700"
                      htmlFor="edited-response"
                    >
                      Response
                    </label>
                    <textarea
                      id="edited-response"
                      rows={12}
                      value={editedResponse}
                      onChange={(event) =>
                        setEditedResponse(event.target.value)
                      }
                      className="w-full rounded-lg border p-3 text-sm leading-6 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <h3 className="font-bold text-slate-800">
                    {review.editedSubject ||
                      review.generatedSubject ||
                      workflow?.response?.subject}
                  </h3>
                  <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-600">
                    {generatedBody}
                  </p>
                </>
              )}
            </div>
          </Card>
          {workflowError ? (
            <Card>
              <ErrorState
                title="Workflow details unavailable"
                message={workflowError}
                onRetry={() => void load(true)}
              />
            </Card>
          ) : (
            <Card className="p-6">
              <div className="flex items-center gap-2">
                <BookOpenText className="h-5 w-5 text-indigo-600" />
                <h2 className="font-extrabold text-ink">
                  AI evidence and solution
                </h2>
              </div>
              {classification || knowledge || solution ? (
                <div className="mt-5 space-y-6">
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-lg bg-slate-50 p-4">
                      <p className="text-xs text-slate-500">Classification</p>
                      <p className="mt-1 font-bold capitalize text-slate-800">
                        {classification?.category || "Unavailable"}
                      </p>
                    </div>
                    <div className="rounded-lg bg-slate-50 p-4">
                      <p className="text-xs text-slate-500">AI priority</p>
                      <p className="mt-1 font-bold capitalize text-slate-800">
                        {classification?.priority || "Unavailable"}
                      </p>
                    </div>
                    <div className="rounded-lg bg-slate-50 p-4">
                      <p className="text-xs text-slate-500">Confidence</p>
                      <p className="mt-1 font-bold text-indigo-700">
                        {classification
                          ? percent(classification.confidence)
                          : "Unavailable"}
                      </p>
                    </div>
                  </div>
                  {solution && (
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                        Recommended solution
                      </p>
                      <p className="mt-2 text-sm leading-6 text-slate-700">
                        {solution.summary}
                      </p>
                      {solution.troubleshooting_steps.length > 0 && (
                        <ol className="mt-4 space-y-2">
                          {solution.troubleshooting_steps.map((step, index) => (
                            <li
                              className="flex gap-3 text-sm text-slate-600"
                              key={`${index}-${step}`}
                            >
                              <span className="font-bold text-indigo-600">
                                {index + 1}.
                              </span>
                              {step}
                            </li>
                          ))}
                        </ol>
                      )}
                    </div>
                  )}
                  {knowledge?.results?.length ? (
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                        Knowledge sources
                      </p>
                      <div className="mt-3 space-y-2">
                        {knowledge.results.map((source, index) => (
                          <div
                            className="flex items-center justify-between gap-3 rounded-lg border p-3"
                            key={`${source.source}-${index}`}
                          >
                            <p className="truncate text-sm font-semibold text-slate-700">
                              {source.metadata?.title
                                ? String(source.metadata.title)
                                : source.source}
                            </p>
                            <Badge tone="purple">
                              {percent(source.relevance_score)}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : (
                <div className="mt-5 rounded-lg bg-amber-50 p-4 text-sm leading-6 text-amber-800">
                  Detailed classification, knowledge, and solution data is not
                  included by the backend while this workflow is awaiting
                  review.
                </div>
              )}
            </Card>
          )}
        </div>
        <aside className="space-y-5">
          <Card className="p-5">
            <h2 className="font-extrabold text-ink">Review decision</h2>
            {pending ? (
              <div className="mt-5 space-y-4">
                <Input
                  label="Reviewer"
                  value={reviewer}
                  onChange={(event) => setReviewer(event.target.value)}
                  placeholder="Reviewer name"
                />
                <div>
                  <label
                    htmlFor="review-comments"
                    className="mb-1.5 block text-sm font-semibold text-slate-700"
                  >
                    Reviewer comments
                  </label>
                  <textarea
                    id="review-comments"
                    rows={5}
                    value={comments}
                    onChange={(event) => {
                      setComments(event.target.value);
                      setActionError("");
                    }}
                    className="w-full rounded-lg border p-3 text-sm outline-none placeholder:text-slate-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
                    placeholder="Add decision context. Required for reject and regenerate."
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    loading={submitting === "approve"}
                    icon={<Check className="h-4 w-4" />}
                    onClick={() => void handleAction("approve")}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="secondary"
                    icon={<Edit3 className="h-4 w-4" />}
                    onClick={() => setEditing((value) => !value)}
                  >
                    {editing ? "Cancel edit" : "Edit"}
                  </Button>
                  <Button
                    variant="danger"
                    loading={submitting === "reject"}
                    icon={<X className="h-4 w-4" />}
                    onClick={() => void handleAction("reject")}
                  >
                    Reject
                  </Button>
                  <Button
                    variant="secondary"
                    loading={submitting === "regenerate"}
                    icon={<RotateCcw className="h-4 w-4" />}
                    onClick={() => void handleAction("regenerate")}
                  >
                    Regenerate
                  </Button>
                </div>
                {editing && (
                  <Button
                    className="w-full"
                    loading={submitting === "edit"}
                    icon={<Send className="h-4 w-4" />}
                    onClick={() => void handleAction("edit")}
                  >
                    Submit edited response
                  </Button>
                )}
              </div>
            ) : (
              <div className="mt-5 space-y-3 text-sm">
                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">Final decision</p>
                  <div className="mt-2">
                    <ReviewStatusBadge status={review.status} />
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                    Reviewer
                  </p>
                  <p className="mt-1 font-semibold text-slate-700">
                    {review.reviewer || "Not recorded"}
                  </p>
                </div>
                {review.reviewerComments && (
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                      Comments
                    </p>
                    <p className="mt-1 leading-6 text-slate-600">
                      {review.reviewerComments}
                    </p>
                  </div>
                )}
              </div>
            )}
          </Card>
          <Card className="p-5 text-xs text-slate-500">
            <p className="font-bold text-slate-700">Review metadata</p>
            <dl className="mt-3 space-y-2">
              <div className="flex justify-between gap-4">
                <dt>Created</dt>
                <dd className="text-right">
                  {new Date(review.createdAt).toLocaleString()}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt>Updated</dt>
                <dd className="text-right">
                  {new Date(review.updatedAt).toLocaleString()}
                </dd>
              </div>
              {review.reviewedAt && (
                <div className="flex justify-between gap-4">
                  <dt>Reviewed</dt>
                  <dd className="text-right">
                    {new Date(review.reviewedAt).toLocaleString()}
                  </dd>
                </div>
              )}
            </dl>
          </Card>
        </aside>
      </div>
    </div>
  );
}
