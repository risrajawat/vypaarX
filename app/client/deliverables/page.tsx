"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/dialog";
import { Textarea, Label } from "@/components/ui/form-elements";
import { formatDate } from "@/lib/utils";
import {
  PackageCheck,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  MessageSquare,
  Sparkles,
  Layers,
  ArrowRight,
} from "lucide-react";

export default function ClientDeliverablesPage() {
  const [deliverables, setDeliverables] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeModal, setActiveModal] = useState<{
    type: "approve" | "revision";
    deliverable: any;
  } | null>(null);
  const [comment, setComment] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const fetchDeliverables = () => {
    fetch("/api/deliverables")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setDeliverables(data.deliverables || []);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchDeliverables();
  }, []);

  const handleApprove = async (deliverableId: string) => {
    setActionLoading(true);
    setStatusMessage(null);

    try {
      const res = await fetch(`/api/deliverables/${deliverableId}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comment }),
      });

      const data = await res.json();
      if (!res.ok) {
        setStatusMessage({ type: "error", text: data.error || "Failed to approve deliverable." });
      } else {
        setStatusMessage({ type: "success", text: "Deliverable approved successfully!" });
        setActiveModal(null);
        setComment("");
        fetchDeliverables();
      }
    } catch (e) {
      setStatusMessage({ type: "error", text: "Network error. Please try again." });
    } finally {
      setActionLoading(false);
    }
  };

  const handleRevision = async (deliverableId: string) => {
    if (!comment || comment.trim().length < 5) {
      setStatusMessage({
        type: "error",
        text: "Please provide detailed revision instructions (at least 5 characters).",
      });
      return;
    }

    setActionLoading(true);
    setStatusMessage(null);

    try {
      const res = await fetch(`/api/deliverables/${deliverableId}/revision`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comment }),
      });

      const data = await res.json();
      if (!res.ok) {
        setStatusMessage({ type: "error", text: data.error || "Failed to request revision." });
      } else {
        setStatusMessage({
          type: "success",
          text: "Revision requested. The VyparX team has been notified.",
        });
        setActiveModal(null);
        setComment("");
        fetchDeliverables();
      }
    } catch (e) {
      setStatusMessage({ type: "error", text: "Network error. Please try again." });
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-sm text-slate-500">Loading deliverables...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-semibold text-blue-700">
          <PackageCheck className="w-3.5 h-3.5" />
          DELIVERABLES & APPROVAL WORKFLOW
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Project Deliverables
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Review design files, website mockups, and brand assets. Approve deliverables to proceed or request revisions with direct feedback.
        </p>
      </div>

      {statusMessage && (
        <div
          className={`p-4 rounded-xl border text-xs font-medium flex items-center gap-2.5 animate-in fade-in duration-200 ${
            statusMessage.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-red-50 text-red-800 border-red-200"
          }`}
        >
          {statusMessage.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {deliverables.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-sm text-slate-500">
          No deliverables uploaded yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {deliverables.map((d) => {
            const isPending = d.status === "PENDING_APPROVAL";
            const isApproved = d.status === "APPROVED";
            const isRevision = d.status === "REVISION_REQUESTED";

            return (
              <div
                key={d.id}
                className={`bg-white rounded-2xl border p-6 shadow-sm flex flex-col justify-between transition ${
                  isPending
                    ? "border-amber-300 ring-1 ring-amber-300/30"
                    : isApproved
                    ? "border-emerald-200 bg-emerald-50/10"
                    : "border-slate-200"
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                        isApproved
                          ? "bg-emerald-100 text-emerald-800"
                          : isPending
                          ? "bg-amber-100 text-amber-800 animate-pulse"
                          : isRevision
                          ? "bg-purple-100 text-purple-800"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {d.status.replace("_", " ")}
                    </span>
                    <span className="text-[11px] text-slate-400">{formatDate(d.createdAt)}</span>
                  </div>

                  {d.previewUrl && (
                    <div className="relative rounded-xl overflow-hidden border border-slate-100 bg-slate-100 aspect-video group">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={d.previewUrl}
                        alt={d.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                    </div>
                  )}

                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{d.name}</h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{d.description}</p>
                  </div>

                  {d.approvals && d.approvals.length > 0 && (
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1 text-xs">
                      <div className="font-semibold text-slate-700 flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                        Latest Review Note:
                      </div>
                      <p className="text-slate-600 italic">&ldquo;{d.approvals[0].comment}&rdquo;</p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                  {d.fileUrl && (
                    <a
                      href={d.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
                    >
                      View Full File <ExternalLink className="w-3 h-3" />
                    </a>
                  )}

                  {isPending && (
                    <div className="flex items-center gap-2 ml-auto">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setComment("");
                          setActiveModal({ type: "revision", deliverable: d });
                        }}
                      >
                        Request Revision
                      </Button>
                      <Button
                        variant="brand"
                        size="sm"
                        className="bg-emerald-600 hover:bg-emerald-700"
                        onClick={() => {
                          setComment("");
                          setActiveModal({ type: "approve", deliverable: d });
                        }}
                      >
                        Approve
                      </Button>
                    </div>
                  )}

                  {isApproved && (
                    <div className="text-xs font-bold text-emerald-700 flex items-center gap-1 ml-auto">
                      <CheckCircle2 className="w-4 h-4" /> Approved
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Review / Approval Modal */}
      {activeModal && (
        <Modal
          isOpen={!!activeModal}
          onClose={() => setActiveModal(null)}
          title={
            activeModal.type === "approve"
              ? `Approve Deliverable: ${activeModal.deliverable.name}`
              : `Request Revision: ${activeModal.deliverable.name}`
          }
          description={
            activeModal.type === "approve"
              ? "Confirming approval moves this deliverable to final deployment status."
              : "Please specify exact adjustments, color changes, or content modifications needed."
          }
        >
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="modalComment">
                {activeModal.type === "approve"
                  ? "Approval Note (Optional)"
                  : "Revision Feedback *"}
              </Label>
              <Textarea
                id="modalComment"
                rows={4}
                required={activeModal.type === "revision"}
                placeholder={
                  activeModal.type === "approve"
                    ? "Looks fantastic! Ready to launch."
                    : "e.g. Please change the headline font and enlarge our logo badge on the hero section."
                }
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setActiveModal(null)}>
                Cancel
              </Button>
              {activeModal.type === "approve" ? (
                <Button
                  variant="brand"
                  className="bg-emerald-600 hover:bg-emerald-700"
                  isLoading={actionLoading}
                  onClick={() => handleApprove(activeModal.deliverable.id)}
                >
                  Confirm Approval
                </Button>
              ) : (
                <Button
                  variant="destructive"
                  isLoading={actionLoading}
                  onClick={() => handleRevision(activeModal.deliverable.id)}
                >
                  Submit Revision Request
                </Button>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
