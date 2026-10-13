"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Label } from "@/components/ui/form-elements";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  FileText,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Calendar,
  Send,
} from "lucide-react";

export default function AdminProposalsPage() {
  const [proposals, setProposals] = useState<any[]>([]);
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    businessId: "",
    title: "",
    description: "",
    validDays: 30,
    items: [
      {
        service: "Website & Digital Catalog Development",
        description: "Next.js high-speed mobile-first web catalog with WhatsApp inquiry drawer.",
        quantity: 1,
        price: 24999,
      },
      {
        service: "Google Search & Local SEO Optimization",
        description: "Google Business profile setup, keyword tags, and review funnel.",
        quantity: 1,
        price: 9999,
      },
    ],
  });

  const fetchData = async () => {
    try {
      const [pRes, lRes] = await Promise.all([fetch("/api/proposals"), fetch("/api/leads")]);
      const pData = await pRes.json();
      const lData = await lRes.json();

      if (pData.success) setProposals(pData.proposals || []);
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

  const addItem = () => {
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        {
          service: "",
          description: "",
          quantity: 1,
          price: 5000,
        },
      ],
    });
  };

  const removeItem = (index: number) => {
    if (formData.items.length > 1) {
      setFormData({
        ...formData,
        items: formData.items.filter((_, i) => i !== index),
      });
    }
  };

  const updateItem = (index: number, field: string, value: any) => {
    const updated = [...formData.items];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, items: updated });
  };

  const totalCalculated = formData.items.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1),
    0
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("Proposal successfully generated and sent to business owner!");
        setShowCreate(false);
        fetchData();
        setTimeout(() => setMessage(null), 4000);
      } else {
        alert(data.error || "Failed to create proposal");
      }
    } catch (e) {
      alert("Network error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-sm text-slate-400">Loading proposals...</div>;
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="bg-slate-800/80 p-6 sm:p-8 rounded-2xl border border-slate-700 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/20 border border-purple-500/30 px-3 py-0.5 text-xs font-bold text-purple-400 mb-2">
            <FileText className="w-3.5 h-3.5" />
            PROPOSAL & QUOTE GENERATOR
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Proposals & Estimates
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Build itemized growth packages and send transparent quotes directly to prospect dashboards.
          </p>
        </div>

        <Button
          variant="brand"
          className="bg-purple-600 hover:bg-purple-700"
          onClick={() => setShowCreate(!showCreate)}
        >
          {showCreate ? "Close Creator" : "Create New Proposal"}
        </Button>
      </div>

      {message && (
        <div className="p-4 rounded-xl border border-emerald-600 bg-emerald-950/80 text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{message}</span>
        </div>
      )}

      {/* Proposal Creator Form */}
      {showCreate && (
        <div className="bg-slate-800/95 rounded-2xl border border-slate-700 p-6 sm:p-8 shadow-xl space-y-6 animate-in fade-in duration-200">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            Build New Growth Proposal
          </h3>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="targetBusiness" className="text-slate-200">Target Business *</Label>
                <select
                  id="targetBusiness"
                  value={formData.businessId}
                  onChange={(e) => setFormData({ ...formData, businessId: e.target.value })}
                  className="flex h-10 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {businesses.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.city} • {b.category})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="proposalTitle" className="text-slate-200">Proposal Title *</Label>
                <Input
                  id="proposalTitle"
                  required
                  placeholder="e.g. Digital Foundation & Pan-India Launch Package"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="bg-slate-900 border-slate-700 text-white text-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="proposalDesc" className="text-slate-200">Package Overview & Scope Description *</Label>
              <Textarea
                id="proposalDesc"
                required
                rows={3}
                placeholder="Explain the objectives, expected outcomes, and scope inclusions..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="bg-slate-900 border-slate-700 text-white text-xs"
              />
            </div>

            {/* Line Items */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-slate-200 text-xs uppercase tracking-wider font-bold">
                  Proposal Line Items
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addItem}
                  className="bg-slate-900 border-slate-700 text-purple-300 text-xs"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" /> Add Service
                </Button>
              </div>

              <div className="space-y-3">
                {formData.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-slate-900 border border-slate-700 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
                  >
                    <div className="sm:col-span-4 space-y-1">
                      <Label className="text-[11px] text-slate-400">Service Name</Label>
                      <Input
                        required
                        placeholder="Service name"
                        value={item.service}
                        onChange={(e) => updateItem(idx, "service", e.target.value)}
                        className="bg-slate-800 border-slate-700 text-white text-xs"
                      />
                    </div>

                    <div className="sm:col-span-5 space-y-1">
                      <Label className="text-[11px] text-slate-400">Deliverable Description</Label>
                      <Input
                        required
                        placeholder="Description"
                        value={item.description}
                        onChange={(e) => updateItem(idx, "description", e.target.value)}
                        className="bg-slate-800 border-slate-700 text-white text-xs"
                      />
                    </div>

                    <div className="sm:col-span-2 space-y-1">
                      <Label className="text-[11px] text-slate-400">Price (₹)</Label>
                      <Input
                        type="number"
                        required
                        value={item.price}
                        onChange={(e) => updateItem(idx, "price", Number(e.target.value))}
                        className="bg-slate-800 border-slate-700 text-white text-xs"
                      />
                    </div>

                    <div className="sm:col-span-1 text-right pt-4 sm:pt-0">
                      <button
                        type="button"
                        onClick={() => removeItem(idx)}
                        className="p-2 text-slate-500 hover:text-red-400 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end p-3 bg-slate-900 rounded-xl border border-slate-700 text-right">
                <div>
                  <span className="text-xs text-slate-400 mr-3">Total Investment:</span>
                  <span className="text-xl font-extrabold text-white">
                    {formatCurrency(totalCalculated)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-700">
              <Button type="button" variant="outline" onClick={() => setShowCreate(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="brand" className="bg-purple-600 hover:bg-purple-700" isLoading={saving}>
                <Send className="w-4 h-4 mr-1.5" />
                Send Proposal to Client
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Proposals List */}
      <div className="space-y-4">
        {proposals.map((p) => (
          <div key={p.id} className="bg-slate-800/90 rounded-2xl border border-slate-700 p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-700">
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                      p.status === "ACCEPTED"
                        ? "bg-emerald-500/20 text-emerald-300"
                        : p.status === "REJECTED"
                        ? "bg-red-500/20 text-red-300"
                        : "bg-purple-500/20 text-purple-300"
                    }`}
                  >
                    {p.status}
                  </span>
                  <span className="text-xs text-slate-400">Business: {p.business?.name}</span>
                </div>
                <h3 className="text-lg font-bold text-white mt-1">{p.title}</h3>
              </div>

              <div className="text-left sm:text-right">
                <div className="text-xl font-extrabold text-white">
                  {formatCurrency(p.totalAmount, p.currency)}
                </div>
                <div className="text-[10px] text-slate-400">Valid until {formatDate(p.validUntil)}</div>
              </div>
            </div>

            <p className="text-xs text-slate-300">{p.description}</p>

            <div className="pt-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Included Items ({p.items?.length || 0}):
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                {p.items?.map((item: any) => (
                  <div key={item.id} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex justify-between">
                    <div>
                      <span className="font-semibold text-white">{item.service}</span>
                      <p className="text-[11px] text-slate-400">{item.description}</p>
                    </div>
                    <span className="font-bold text-white ml-2">{formatCurrency(item.price)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
