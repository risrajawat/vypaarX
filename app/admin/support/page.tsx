"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea, Label } from "@/components/ui/form-elements";
import { Modal } from "@/components/ui/dialog";
import { formatDate } from "@/lib/utils";
import { HelpCircle, MessageSquare, CheckCircle2, AlertCircle, Phone, Mail } from "lucide-react";

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTicket, setActiveTicket] = useState<any | null>(null);
  const [replyText, setReplyText] = useState("");
  const [status, setStatus] = useState("IN_PROGRESS");
  const [saving, setSaving] = useState(false);

  const fetchTickets = () => {
    fetch("/api/support")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setTickets(data.tickets || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTicket) return;

    setSaving(true);
    try {
      const res = await fetch(`/api/support/${activeTicket.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminReply: replyText,
          status,
        }),
      });

      if (res.ok) {
        setActiveTicket(null);
        fetchTickets();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-sm text-slate-400">Loading support inbox...</div>;
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="bg-slate-800/80 p-6 sm:p-8 rounded-2xl border border-slate-700 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-yellow-500/20 border border-yellow-500/30 px-3 py-0.5 text-xs font-bold text-yellow-400 mb-2">
            <HelpCircle className="w-3.5 h-3.5" />
            SUPPORT HELPDESK
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Client Support Tickets
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Respond to technical questions, domain connection requests, and client growth inquiries.
          </p>
        </div>

        <span className="text-xs text-slate-300 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-700">
          Open Tickets: <strong className="text-yellow-400">{tickets.filter((t) => t.status === "OPEN").length}</strong>
        </span>
      </div>

      <div className="space-y-4">
        {tickets.map((t) => (
          <div key={t.id} className="bg-slate-800/90 rounded-2xl border border-slate-700 p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-700">
              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                    t.status === "RESOLVED"
                      ? "bg-emerald-500/20 text-emerald-300"
                      : t.status === "IN_PROGRESS"
                      ? "bg-blue-500/20 text-blue-300"
                      : "bg-yellow-500/20 text-yellow-300"
                  }`}
                >
                  {t.status.replace("_", " ")}
                </span>
                <span className="text-xs text-slate-400">
                  Client: <strong>{t.business?.name}</strong> ({t.user?.name})
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[10px] font-semibold text-slate-400">
                  Priority: {t.priority}
                </span>
                <span className="text-xs text-slate-500">{formatDate(t.createdAt)}</span>
              </div>
            </div>

            <div>
              <h3 className="text-base font-bold text-white">{t.subject}</h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">{t.message}</p>
            </div>

            {t.adminReply && (
              <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 space-y-1 text-xs">
                <div className="font-semibold text-blue-400 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5" />
                  Your Response:
                </div>
                <p className="text-slate-300">{t.adminReply}</p>
              </div>
            )}

            <div className="pt-2 border-t border-slate-700 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                className="bg-slate-900 border-slate-700 text-white hover:bg-slate-700 text-xs"
                onClick={() => {
                  setActiveTicket(t);
                  setReplyText(t.adminReply || "");
                  setStatus(t.status === "OPEN" ? "IN_PROGRESS" : t.status);
                }}
              >
                {t.adminReply ? "Edit Response" : "Respond to Ticket"}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Reply Modal */}
      {activeTicket && (
        <Modal
          isOpen={!!activeTicket}
          onClose={() => setActiveTicket(null)}
          title={`Respond to: ${activeTicket.subject}`}
          description={`From ${activeTicket.business?.name} (${activeTicket.user?.email})`}
        >
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="p-3 bg-slate-50 rounded-xl border text-xs text-slate-700">
              <span className="font-bold block mb-1">Client Message:</span>
              {activeTicket.message}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="supportReply">Admin Response Message *</Label>
              <Textarea
                id="supportReply"
                required
                rows={4}
                placeholder="Write resolution steps or response..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="ticketStatus">Ticket Status</Label>
              <select
                id="ticketStatus"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="OPEN">OPEN</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
                <option value="RESOLVED">RESOLVED</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setActiveTicket(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="brand" isLoading={saving}>
                Send Response
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
