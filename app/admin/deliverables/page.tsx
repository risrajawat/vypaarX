"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Label } from "@/components/ui/form-elements";
import { Modal } from "@/components/ui/dialog";
import { formatDate } from "@/lib/utils";
import {
  PackageCheck,
  Plus,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  MessageSquare,
  Sparkles,
} from "lucide-react";

export default function AdminDeliverablesPage() {
  const [deliverables, setDeliverables] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    projectId: "",
    name: "",
    description: "",
    fileUrl: "",
    previewUrl: "",
    deliverableType: "WEBSITE_DESIGN",
  });

  const fetchData = async () => {
    try {
      const [dRes, pRes] = await Promise.all([fetch("/api/deliverables"), fetch("/api/projects")]);
      const dData = await dRes.json();
      const pData = await pRes.json();

      if (dData.success) setDeliverables(dData.deliverables || []);
      if (pData.success) {
        setProjects(pData.projects || []);
        if (pData.projects?.length > 0 && !formData.projectId) {
          setFormData((prev) => ({ ...prev, projectId: pData.projects[0].id }));
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

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/deliverables", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setShowUploadModal(false);
        setFormData({
          projectId: projects[0]?.id || "",
          name: "",
          description: "",
          fileUrl: "",
          previewUrl: "",
          deliverableType: "WEBSITE_DESIGN",
        });
        fetchData();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-sm text-slate-400">Loading deliverables...</div>;
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="bg-slate-800/80 p-6 sm:p-8 rounded-2xl border border-slate-700 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-pink-500/20 border border-pink-500/30 px-3 py-0.5 text-xs font-bold text-pink-400 mb-2">
            <PackageCheck className="w-3.5 h-3.5" />
            QA & ASSET DELIVERY
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Deliverables & Approvals
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Upload client mockups, track pending reviews, and view revision feedback.
          </p>
        </div>

        <Button
          variant="brand"
          className="bg-pink-600 hover:bg-pink-700"
          onClick={() => setShowUploadModal(true)}
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Upload New Deliverable
        </Button>
      </div>

      {/* Deliverables Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {deliverables.map((d) => {
          const isPending = d.status === "PENDING_APPROVAL";
          const isApproved = d.status === "APPROVED";
          const isRevision = d.status === "REVISION_REQUESTED";

          return (
            <div
              key={d.id}
              className="bg-slate-800/90 rounded-2xl border border-slate-700 p-6 shadow-sm space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                      isApproved
                        ? "bg-emerald-500/20 text-emerald-300"
                        : isPending
                        ? "bg-amber-500/20 text-amber-300"
                        : isRevision
                        ? "bg-purple-500/20 text-purple-300"
                        : "bg-slate-700 text-slate-300"
                    }`}
                  >
                    {d.status.replace("_", " ")}
                  </span>
                  <span className="text-xs text-slate-400">{d.project?.business?.name}</span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white">{d.name}</h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">{d.description}</p>
                </div>

                {d.approvals && d.approvals.length > 0 && (
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1 text-xs">
                    <div className="font-semibold text-slate-300 flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
                      Client Feedback ({d.approvals[0].action}):
                    </div>
                    <p className="text-slate-400 italic">&ldquo;{d.approvals[0].comment}&rdquo;</p>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-700 flex items-center justify-between text-xs">
                <span className="text-slate-400">Type: {d.deliverableType}</span>
                {d.fileUrl && (
                  <a
                    href={d.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline flex items-center gap-1 font-semibold"
                  >
                    View Asset <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <Modal
          isOpen={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          title="Upload Project Deliverable"
          description="Make an asset, website prototype, or branding pack available for client review."
        >
          <form onSubmit={handleUpload} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="delProj">Target Project *</Label>
              <select
                id="delProj"
                value={formData.projectId}
                onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                className="flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.business?.name})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="delName">Deliverable Name *</Label>
              <Input
                id="delName"
                required
                placeholder="e.g. Official Website Homepage Mockup (v1.0)"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="delType">Deliverable Type</Label>
              <select
                id="delType"
                value={formData.deliverableType}
                onChange={(e) => setFormData({ ...formData, deliverableType: e.target.value })}
                className="flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="WEBSITE_DESIGN">WEBSITE_DESIGN</option>
                <option value="LOGO">LOGO</option>
                <option value="BRAND_ASSET">BRAND_ASSET</option>
                <option value="SEO_REPORT">SEO_REPORT</option>
                <option value="SOCIAL_CONTENT">SOCIAL_CONTENT</option>
                <option value="DOCUMENT">DOCUMENT</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="delUrl">File / Preview URL</Label>
              <Input
                id="delUrl"
                placeholder="https://..."
                value={formData.fileUrl}
                onChange={(e) =>
                  setFormData({ ...formData, fileUrl: e.target.value, previewUrl: e.target.value })
                }
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="delDesc">Description & Instructions</Label>
              <Textarea
                id="delDesc"
                required
                rows={3}
                placeholder="Explain what the client is reviewing..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setShowUploadModal(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="brand" isLoading={saving}>
                Publish Deliverable
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
