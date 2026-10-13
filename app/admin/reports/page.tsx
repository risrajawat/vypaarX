"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Label } from "@/components/ui/form-elements";
import { Modal } from "@/components/ui/dialog";
import { formatDate } from "@/lib/utils";
import { BarChart3, Plus, Calendar, CheckCircle2, TrendingUp } from "lucide-react";

export default function AdminReportsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    businessId: "",
    title: "Monthly Growth & Readiness Audit",
    period: "November 2026",
    summary: "Strong online catalog progress. Search indexing completed. Google review funnel launched.",
    metrics: {
      digitalReadinessScore: 88,
      organicSearchViews: 450,
      inquiriesGenerated: 18,
      averageReviewRating: 4.9,
    },
    recommendations: [
      "Launch weekly social media showcase videos",
      "Connect UPI direct invoice payment gateway",
    ],
  });

  const fetchData = async () => {
    try {
      const [rRes, lRes] = await Promise.all([fetch("/api/reports"), fetch("/api/leads")]);
      const rData = await rRes.json();
      const lData = await lRes.json();

      if (rData.success) setReports(rData.reports || []);
      if (lData.success) {
        const busList = lData.leads?.map((l: any) => l.business) || [];
        setBusinesses(busList);
        if (busList.length > 0 && !formData.businessId) {
          setFormData((prev) => ({ ...prev, businessId: busList[0].id }));
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setShowModal(false);
        fetchData();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-sm text-slate-400">Loading reports...</div>;
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="bg-slate-800/80 p-6 sm:p-8 rounded-2xl border border-slate-700 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/20 border border-cyan-500/30 px-3 py-0.5 text-xs font-bold text-cyan-400 mb-2">
            <BarChart3 className="w-3.5 h-3.5" />
            CLIENT GROWTH AUDITS
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Growth & Readiness Reports
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Publish structured monthly performance updates and recommendations directly to client portals.
          </p>
        </div>

        <Button
          variant="brand"
          className="bg-cyan-600 hover:bg-cyan-700"
          onClick={() => setShowModal(true)}
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Publish New Report
        </Button>
      </div>

      <div className="space-y-4">
        {reports.map((r) => (
          <div key={r.id} className="bg-slate-800/90 rounded-2xl border border-slate-700 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-cyan-500/20 text-cyan-300">
                  {r.period}
                </span>
                <h3 className="text-lg font-bold text-white mt-1">{r.title}</h3>
                <div className="text-xs text-slate-400">Business: {r.business?.name}</div>
              </div>
              <div className="text-xs text-slate-500">{formatDate(r.createdAt)}</div>
            </div>

            <p className="text-xs text-slate-300 bg-slate-900 p-3.5 rounded-xl border border-slate-800">
              {r.summary}
            </p>
          </div>
        ))}
      </div>

      {/* Publish Modal */}
      {showModal && (
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="Publish Growth Report"
          description="Send a structured monthly report to a client."
        >
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="repBus">Target Client *</Label>
              <select
                id="repBus"
                value={formData.businessId}
                onChange={(e) => setFormData({ ...formData, businessId: e.target.value })}
                className="flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {businesses.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.city})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="repTitle">Report Title *</Label>
                <Input
                  id="repTitle"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="repPeriod">Period *</Label>
                <Input
                  id="repPeriod"
                  required
                  placeholder="e.g. November 2026"
                  value={formData.period}
                  onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="repSummary">Executive Summary *</Label>
              <Textarea
                id="repSummary"
                required
                rows={3}
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="brand" isLoading={saving}>
                Publish Report
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
