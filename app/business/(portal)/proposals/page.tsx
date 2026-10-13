"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  FileText,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Layers,
} from "lucide-react";

export default function BusinessProposalsPage() {
  const router = useRouter();
  const [proposals, setProposals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchProposals = () => {
    fetch("/api/proposals")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProposals(data.proposals || []);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load proposals:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProposals();
  }, []);

  const handleAccept = async (proposalId: string) => {
    setActionLoading(proposalId);
    setMessage(null);

    try {
      const res = await fetch(`/api/proposals/${proposalId}/accept`, {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage({ type: "error", text: data.error || "Failed to accept proposal." });
        setActionLoading(null);
        return;
      }

      setMessage({
        type: "success",
        text: "Proposal accepted! You are now an active client. Redirecting to Client Dashboard...",
      });

      setTimeout(() => {
        router.push("/client/dashboard");
        router.refresh();
      }, 1200);
    } catch (err) {
      setMessage({ type: "error", text: "Network error. Please try again." });
      setActionLoading(null);
    }
  };

  const handleReject = async (proposalId: string) => {
    const feedback = prompt("Please let us know what modifications or budget adjustments you would like:");
    if (feedback === null) return;

    setActionLoading(proposalId);
    try {
      const res = await fetch(`/api/proposals/${proposalId}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feedback }),
      });

      if (res.ok) {
        setMessage({ type: "success", text: "Feedback sent to VyparX team. We will adjust the scope." });
        fetchProposals();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-500 text-sm">
        Loading proposals...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-semibold text-blue-700">
          <FileText className="w-3.5 h-3.5" />
          GROWTH PROPOSALS & ITEMIZATION
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Received Proposals & Estimates
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Transparent, fixed-scope proposals detailing deliverables, milestones, and timelines for your digital expansion.
        </p>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl border text-xs font-medium flex items-center gap-2.5 animate-in fade-in duration-200 ${
            message.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-red-50 text-red-800 border-red-200"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {proposals.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center space-y-4">
          <div className="h-12 w-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-lg">No Proposals Yet</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Once you submit your digital audit, the VyparX operations team creates your tailored growth package proposal.
          </p>
          <div className="pt-2">
            <Button variant="brand" onClick={() => router.push("/business/audit")}>
              Complete Digital Audit
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {proposals.map((p) => {
            const isAccepted = p.status === "ACCEPTED";
            const isRejected = p.status === "REJECTED";
            const isPending = p.status === "SENT" || p.status === "VIEWED" || p.status === "DRAFT";

            return (
              <div
                key={p.id}
                className={`bg-white rounded-2xl border p-6 sm:p-8 shadow-sm space-y-6 transition ${
                  isAccepted
                    ? "border-emerald-300 bg-emerald-50/10"
                    : "border-slate-200 hover:border-blue-300"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                          isAccepted
                            ? "bg-emerald-100 text-emerald-800"
                            : isRejected
                            ? "bg-red-100 text-red-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {p.status}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Valid Until: {formatDate(p.validUntil)}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mt-1">{p.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-600">{p.description}</p>
                  </div>

                  <div className="text-left sm:text-right shrink-0">
                    <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                      {formatCurrency(p.totalAmount, p.currency)}
                    </div>
                    <div className="text-[11px] text-slate-400">Total Fixed Investment</div>
                  </div>
                </div>

                {/* Line Items Table */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                    Included Growth Deliverables
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border border-slate-100 rounded-xl overflow-hidden">
                      <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-100">
                        <tr>
                          <th className="p-3">Service / Scope</th>
                          <th className="p-3">Deliverable Description</th>
                          <th className="p-3 text-center">Qty</th>
                          <th className="p-3 text-right">Investment</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-800">
                        {p.items?.map((item: any) => (
                          <tr key={item.id} className="hover:bg-slate-50/50">
                            <td className="p-3 font-semibold text-slate-900">{item.service}</td>
                            <td className="p-3 text-slate-600">{item.description}</td>
                            <td className="p-3 text-center text-slate-500">{item.quantity}</td>
                            <td className="p-3 text-right font-medium text-slate-900">
                              {formatCurrency(item.price * item.quantity, p.currency)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100">
                  <div className="text-xs text-slate-500 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Includes 100% IP ownership & dedicated milestone tracking</span>
                  </div>

                  {isPending && (
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReject(p.id)}
                        disabled={!!actionLoading}
                      >
                        Request Changes
                      </Button>
                      <Button
                        variant="brand"
                        onClick={() => handleAccept(p.id)}
                        isLoading={actionLoading === p.id}
                        className="w-full sm:w-auto"
                      >
                        Accept Proposal & Start Project
                        <ArrowRight className="w-4 h-4 ml-1.5" />
                      </Button>
                    </div>
                  )}

                  {isAccepted && (
                    <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Accepted on {formatDate(p.acceptedAt)}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
