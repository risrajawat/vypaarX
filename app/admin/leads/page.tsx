"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Label } from "@/components/ui/form-elements";
import { Modal } from "@/components/ui/dialog";
import { formatDate } from "@/lib/utils";
import {
  Users2,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Edit,
  ExternalLink,
  Phone,
  Mail,
  Building2,
  Layers,
} from "lucide-react";

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [editingLead, setEditingLead] = useState<any | null>(null);
  const [leadStatus, setLeadStatus] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const fetchLeads = () => {
    fetch("/api/leads")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setLeads(data.leads || []);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleUpdateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLead) return;

    setSaving(true);
    try {
      const res = await fetch("/api/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadId: editingLead.id,
          status: leadStatus,
          notes,
        }),
      });

      if (res.ok) {
        setMessage("Lead updated successfully!");
        setEditingLead(null);
        fetchLeads();
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const filteredLeads = leads.filter((l) => {
    const matchesSearch =
      l.business.name.toLowerCase().includes(search.toLowerCase()) ||
      l.business.owner.name.toLowerCase().includes(search.toLowerCase()) ||
      l.business.city.toLowerCase().includes(search.toLowerCase()) ||
      l.business.category.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === "ALL" || l.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return <div className="p-12 text-center text-sm text-slate-400">Loading leads database...</div>;
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="bg-slate-800/80 p-6 sm:p-8 rounded-2xl border border-slate-700 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 px-3 py-0.5 text-xs font-bold text-emerald-400 mb-2">
            <Users2 className="w-3.5 h-3.5" />
            PIPELINE & INQUIRIES
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Lead Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Track prospective businesses from initial signup through audit review and conversion.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-300 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-700">
            Total Leads: <strong className="text-white">{leads.length}</strong>
          </span>
        </div>
      </div>

      {message && (
        <div className="p-4 rounded-xl border border-emerald-600 bg-emerald-950/80 text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{message}</span>
        </div>
      )}

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Input
            placeholder="Search business, owner, city, category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="NEW">NEW</option>
            <option value="CONTACTED">CONTACTED</option>
            <option value="AUDIT_REQUESTED">AUDIT_REQUESTED</option>
            <option value="AUDIT_REVIEWED">AUDIT_REVIEWED</option>
            <option value="PROPOSAL_SENT">PROPOSAL_SENT</option>
            <option value="CONVERTED">CONVERTED</option>
            <option value="LOST">LOST</option>
          </select>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-slate-800/90 rounded-2xl border border-slate-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-700">
              <tr>
                <th className="p-4">Business & Owner</th>
                <th className="p-4">Category</th>
                <th className="p-4">Location</th>
                <th className="p-4 text-center">Score</th>
                <th className="p-4">Lead Status</th>
                <th className="p-4">Created Date</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    No leads match your search criteria.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-700/40 transition">
                    <td className="p-4">
                      <div className="font-bold text-white text-sm">{lead.business.name}</div>
                      <div className="text-slate-400 flex items-center gap-2 mt-0.5">
                        <span>{lead.business.owner.name}</span>
                        <span>•</span>
                        <span>{lead.business.phone || lead.business.owner.phone || "No phone"}</span>
                      </div>
                    </td>

                    <td className="p-4 text-slate-300">{lead.business.category}</td>
                    <td className="p-4 text-slate-300">
                      {lead.business.city}, {lead.business.state}
                    </td>

                    <td className="p-4 text-center">
                      {lead.score ? (
                        <span className="font-extrabold text-blue-400">{lead.score}/100</span>
                      ) : (
                        <span className="text-slate-500">—</span>
                      )}
                    </td>

                    <td className="p-4">
                      <span
                        className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          lead.status === "CONVERTED"
                            ? "bg-emerald-500/20 text-emerald-300"
                            : lead.status === "PROPOSAL_SENT"
                            ? "bg-purple-500/20 text-purple-300"
                            : lead.status === "AUDIT_REQUESTED"
                            ? "bg-amber-500/20 text-amber-300"
                            : "bg-blue-500/20 text-blue-300"
                        }`}
                      >
                        {lead.status.replace("_", " ")}
                      </span>
                    </td>

                    <td className="p-4 text-slate-400">{formatDate(lead.createdAt)}</td>

                    <td className="p-4 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-slate-900 border-slate-700 text-white hover:bg-slate-700"
                        onClick={() => {
                          setEditingLead(lead);
                          setLeadStatus(lead.status);
                          setNotes(lead.notes || "");
                        }}
                      >
                        <Edit className="w-3.5 h-3.5 mr-1" />
                        Manage
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Lead Modal */}
      {editingLead && (
        <Modal
          isOpen={!!editingLead}
          onClose={() => setEditingLead(null)}
          title={`Manage Lead: ${editingLead.business.name}`}
          description={`Owner: ${editingLead.business.owner.name} (${editingLead.business.owner.email})`}
        >
          <form onSubmit={handleUpdateLead} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="leadStatus">Pipeline Status</Label>
              <select
                id="leadStatus"
                value={leadStatus}
                onChange={(e) => setLeadStatus(e.target.value)}
                className="flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="NEW">NEW</option>
                <option value="CONTACTED">CONTACTED</option>
                <option value="AUDIT_REQUESTED">AUDIT_REQUESTED</option>
                <option value="AUDIT_REVIEWED">AUDIT_REVIEWED</option>
                <option value="PROPOSAL_SENT">PROPOSAL_SENT</option>
                <option value="CONVERTED">CONVERTED (Converts to Active Client)</option>
                <option value="LOST">LOST</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="leadNotes">Internal Operations Notes</Label>
              <Textarea
                id="leadNotes"
                rows={4}
                placeholder="Add notes about call discussion, requirements, or next steps..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setEditingLead(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="brand" isLoading={saving}>
                Save Lead Updates
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
