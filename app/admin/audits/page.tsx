"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea, Label } from "@/components/ui/form-elements";
import { Modal } from "@/components/ui/dialog";
import { formatDate } from "@/lib/utils";
import {
  FileCheck2,
  Search,
  CheckCircle2,
  AlertCircle,
  Eye,
  TrendingUp,
  Store,
  Sparkles,
  Layers,
} from "lucide-react";

export default function AdminAuditsPage() {
  const [audits, setAudits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAudit, setSelectedAudit] = useState<any | null>(null);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const fetchAudits = () => {
    fetch("/api/audits/me")
      .then((res) => res.json())
      .then(() => {
        // Fetch all audits via leads/businesses or direct query
        fetch("/api/leads")
          .then((res) => res.json())
          .then((data) => {
            const allAudits: any[] = [];
            data.leads?.forEach((l: any) => {
              if (l.business?.audits) {
                l.business.audits.forEach((a: any) => {
                  allAudits.push({ ...a, business: l.business });
                });
              }
            });
            setAudits(allAudits);
            setLoading(false);
          });
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchAudits();
  }, []);

  const handleSaveNotes = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAudit) return;

    setSaving(true);
    try {
      const res = await fetch(`/api/admin/audits/${selectedAudit.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "REVIEWED",
          internalNotes: notes,
        }),
      });

      if (res.ok) {
        setMessage("Audit marked as reviewed!");
        setSelectedAudit(null);
        fetchAudits();
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-sm text-slate-400">Loading digital audits...</div>;
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="bg-slate-800/80 p-6 sm:p-8 rounded-2xl border border-slate-700 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 border border-amber-500/30 px-3 py-0.5 text-xs font-bold text-amber-400 mb-2">
            <FileCheck2 className="w-3.5 h-3.5" />
            ASSESSMENT AUDITS
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Digital Readiness Audits
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Review category score breakdown, generated recommendations, and add internal notes.
          </p>
        </div>

        <span className="text-xs text-slate-300 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-700">
          Total Audits: <strong className="text-white">{audits.length}</strong>
        </span>
      </div>

      {message && (
        <div className="p-4 rounded-xl border border-emerald-600 bg-emerald-950/80 text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{message}</span>
        </div>
      )}

      {/* Audits Table */}
      <div className="bg-slate-800/90 rounded-2xl border border-slate-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-700">
              <tr>
                <th className="p-4">Business</th>
                <th className="p-4">Overall Score</th>
                <th className="p-4">Category Breakdown</th>
                <th className="p-4">Audit Status</th>
                <th className="p-4">Submitted Date</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {audits.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    No submitted audits yet.
                  </td>
                </tr>
              ) : (
                audits.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-700/40 transition">
                    <td className="p-4">
                      <div className="font-bold text-white text-sm">{a.business?.name}</div>
                      <div className="text-slate-400 text-[11px]">{a.business?.category}</div>
                    </td>

                    <td className="p-4">
                      <div className="text-base font-extrabold text-blue-400">
                        {a.overallScore} <span className="text-xs text-slate-500 font-normal">/ 100</span>
                      </div>
                    </td>

                    <td className="p-4 text-[11px] text-slate-400">
                      Web: {a.websiteScore}/20 • Google: {a.googleScore}/20 • SEO: {a.seoScore}/15 • Social: {a.socialScore}/15
                    </td>

                    <td className="p-4">
                      <span
                        className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          a.status === "REVIEWED"
                            ? "bg-emerald-500/20 text-emerald-300"
                            : "bg-amber-500/20 text-amber-300"
                        }`}
                      >
                        {a.status}
                      </span>
                    </td>

                    <td className="p-4 text-slate-400">{formatDate(a.createdAt)}</td>

                    <td className="p-4 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-slate-900 border-slate-700 text-white hover:bg-slate-700"
                        onClick={() => {
                          setSelectedAudit(a);
                          setNotes(a.internalNotes || "");
                        }}
                      >
                        <Eye className="w-3.5 h-3.5 mr-1" />
                        Inspect & Review
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect Audit Modal */}
      {selectedAudit && (
        <Modal
          isOpen={!!selectedAudit}
          onClose={() => setSelectedAudit(null)}
          title={`Digital Audit: ${selectedAudit.business?.name}`}
          description={`Overall Score: ${selectedAudit.overallScore}/100 • Category: ${selectedAudit.business?.category}`}
        >
          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
            {/* Category summary */}
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="p-2 rounded bg-slate-50 border text-center">
                <div className="text-slate-500">Website</div>
                <div className="font-bold text-slate-900">{selectedAudit.websiteScore}/20</div>
              </div>
              <div className="p-2 rounded bg-slate-50 border text-center">
                <div className="text-slate-500">Google</div>
                <div className="font-bold text-slate-900">{selectedAudit.googleScore}/20</div>
              </div>
              <div className="p-2 rounded bg-slate-50 border text-center">
                <div className="text-slate-500">SEO</div>
                <div className="font-bold text-slate-900">{selectedAudit.seoScore}/15</div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="space-y-1 text-xs">
              <span className="font-bold text-slate-900">Generated Recommendations:</span>
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 space-y-1 text-slate-700">
                {(() => {
                  try {
                    const recs = JSON.parse(selectedAudit.recommendations || "[]");
                    return recs.map((r: string, i: number) => <div key={i}>• {r}</div>);
                  } catch {
                    return <div>No recommendations parsed</div>;
                  }
                })()}
              </div>
            </div>

            <form onSubmit={handleSaveNotes} className="space-y-3 pt-2">
              <div className="space-y-1.5">
                <Label htmlFor="internalNotes">Internal Operations Notes & Proposal Scope Plan</Label>
                <Textarea
                  id="internalNotes"
                  rows={3}
                  placeholder="e.g. Plan to propose Digital Foundation (Website + Google local SEO) for ₹29,999..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setSelectedAudit(null)}>
                  Close
                </Button>
                <Button type="submit" variant="brand" isLoading={saving}>
                  Mark Audit Reviewed
                </Button>
              </div>
            </form>
          </div>
        </Modal>
      )}
    </div>
  );
}
