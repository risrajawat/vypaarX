"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Label } from "@/components/ui/form-elements";
import { formatDate } from "@/lib/utils";
import {
  HelpCircle,
  PhoneCall,
  MessageSquare,
  CheckCircle2,
  Clock,
  AlertCircle,
  Phone,
  Mail,
} from "lucide-react";

export default function ClientSupportPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [formData, setFormData] = useState({
    subject: "",
    message: "",
    priority: "MEDIUM",
  });

  const phone = process.env.NEXT_PUBLIC_SUPPORT_PHONE || "+91 98765 43210";
  const email = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@vyparx.com";
  const whatsapp = process.env.NEXT_PUBLIC_SUPPORT_WHATSAPP || "+919876543210";

  const fetchTickets = () => {
    fetch("/api/support")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setTickets(data.tickets || []);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage({ type: "error", text: data.error || "Failed to submit ticket." });
      } else {
        setMessage({ type: "success", text: "Support request created! Our team will respond shortly." });
        setFormData({ subject: "", message: "", priority: "MEDIUM" });
        setShowForm(false);
        fetchTickets();
      }
    } catch (e) {
      setMessage({ type: "error", text: "Network error occurred." });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-sm text-slate-500">Loading support desk...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-semibold text-blue-700 mb-2">
            <HelpCircle className="w-3.5 h-3.5" />
            CLIENT HELPDESK & CONCIERGE
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Support Desk
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Open a support ticket or reach your dedicated growth manager directly.
          </p>
        </div>

        <Button variant="brand" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Close Ticket Form" : "Create New Support Ticket"}
        </Button>
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

      {/* Immediate Contact Callout */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <a
          href={`tel:${phone.replace(/\s+/g, "")}`}
          className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3 hover:border-blue-300 transition"
        >
          <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Phone className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] text-slate-400">Direct Phone</div>
            <div className="text-xs font-bold text-slate-900 truncate">{phone}</div>
          </div>
        </a>

        <a
          href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3 hover:border-emerald-300 transition"
        >
          <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] text-slate-400">WhatsApp Desk</div>
            <div className="text-xs font-bold text-slate-900 truncate">{phone}</div>
          </div>
        </a>

        <a
          href={`mailto:${email}`}
          className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3 hover:border-blue-300 transition"
        >
          <div className="h-10 w-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Mail className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] text-slate-400">Email Support</div>
            <div className="text-xs font-bold text-slate-900 truncate">{email}</div>
          </div>
        </a>
      </div>

      {/* Ticket Creation Form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-md space-y-4 animate-in fade-in duration-200">
          <h3 className="font-bold text-slate-900 text-base">Open a New Support Ticket</h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2 space-y-1.5">
                <Label htmlFor="subject">Subject *</Label>
                <Input
                  id="subject"
                  required
                  placeholder="e.g. Question regarding domain connection"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="priority">Priority</Label>
                <select
                  id="priority"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="message">Message Details *</Label>
              <Textarea
                id="message"
                required
                rows={4}
                placeholder="Explain the question, issue, or change request with as much detail as possible..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="brand" isLoading={submitting}>
                Submit Support Ticket
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Ticket History */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Your Support Ticket History
        </h3>

        {tickets.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-xs text-slate-500">
            No support tickets submitted yet.
          </div>
        ) : (
          tickets.map((t) => (
            <div key={t.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                      t.status === "RESOLVED"
                        ? "bg-emerald-100 text-emerald-800"
                        : t.status === "IN_PROGRESS"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {t.status.replace("_", " ")}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                    Priority: {t.priority}
                  </span>
                </div>
                <div className="text-xs text-slate-400">{formatDate(t.createdAt)}</div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm">{t.subject}</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{t.message}</p>
              </div>

              {t.adminReply && (
                <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-100 space-y-1 text-xs">
                  <div className="font-bold text-blue-900 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                    VyparX Team Response:
                  </div>
                  <p className="text-slate-700">{t.adminReply}</p>
                  {t.resolvedAt && (
                    <div className="text-[10px] text-slate-400 pt-1">
                      Resolved on {formatDate(t.resolvedAt)}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
