"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  FileCheck2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  TrendingUp,
  ShieldAlert,
  Info,
  Layers,
  Search,
  Store,
  Compass,
} from "lucide-react";

export default function DigitalAuditPage() {
  const router = useRouter();
  const [business, setBusiness] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [auditResult, setAuditResult] = useState<any>(null);

  const [formData, setFormData] = useState({
    websiteStatus: "none",
    seoPresence: "none",
    googleBusiness: "claimed_unoptimized",
    socialMedia: "occasional_posts",
    branding: "simple_logo",
    onlineSales: "whatsapp_manual",
    customerAcquisition: "word_of_mouth",
    digitalGoals: ["Build a website", "Reach customers across India"],
  });

  useEffect(() => {
    fetch("/api/businesses/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.business) {
          setBusiness(data.business);
          if (data.business.audits && data.business.audits.length > 0) {
            const latest = data.business.audits[0];
            try {
              setAuditResult({
                overallScore: latest.overallScore,
                websiteScore: latest.websiteScore,
                seoScore: latest.seoScore,
                googleScore: latest.googleScore,
                socialScore: latest.socialScore,
                brandingScore: latest.brandingScore,
                salesScore: latest.salesScore,
                strengths: JSON.parse(latest.strengths || "[]"),
                weaknesses: JSON.parse(latest.weaknesses || "[]"),
                recommendations: JSON.parse(latest.recommendations || "[]"),
              });
            } catch (e) {
              console.error("Failed to parse audit details:", e);
            }
          }
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch business:", err);
        setLoading(false);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!business) return;

    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/audits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessId: business.id,
          ...formData,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to submit digital audit.");
        setSubmitting(false);
        return;
      }

      setAuditResult(data.scoringResult);
      setSubmitting(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError("An unexpected network error occurred.");
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-500 text-sm">
        Loading audit engine...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-semibold text-blue-700">
          <Sparkles className="w-3.5 h-3.5" />
          DIGITAL READINESS SCORING ENGINE
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Digital Presence & Growth Audit
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Our scoring engine benchmarks your website, search visibility, Google footprint, and customer channels into a transparent 0-100 score.
        </p>
      </div>

      {/* Result Card if Submitted */}
      {auditResult && (
        <div className="bg-white rounded-2xl border-2 border-blue-600 p-6 sm:p-8 shadow-lg space-y-8 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full uppercase tracking-wide mb-2">
                <Info className="w-3.5 h-3.5 text-amber-600" />
                Assessment Result (Simulated Scoring Engine)
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                Your Digital Readiness Score
              </h2>
              <p className="text-xs text-slate-500">
                Business: <span className="font-semibold text-slate-800">{business?.name}</span>
              </p>
            </div>

            <div className="text-center sm:text-right">
              <div className="inline-flex items-baseline">
                <span className="text-5xl font-extrabold text-blue-600 tracking-tight">
                  {auditResult.overallScore}
                </span>
                <span className="text-xl text-slate-400 font-bold ml-1">/100</span>
              </div>
              <div className="text-xs font-semibold text-slate-600 mt-0.5">Overall Readiness</div>
            </div>
          </div>

          {/* Category Breakdown */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
              Category Score Breakdown
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                <div className="text-xs text-slate-500">Website & Speed</div>
                <div className="text-lg font-bold text-slate-900 mt-1">{auditResult.websiteScore} <span className="text-xs text-slate-400 font-normal">/ 20</span></div>
              </div>
              <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                <div className="text-xs text-slate-500">Google & Maps</div>
                <div className="text-lg font-bold text-slate-900 mt-1">{auditResult.googleScore} <span className="text-xs text-slate-400 font-normal">/ 20</span></div>
              </div>
              <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                <div className="text-xs text-slate-500">SEO & Discoverability</div>
                <div className="text-lg font-bold text-slate-900 mt-1">{auditResult.seoScore} <span className="text-xs text-slate-400 font-normal">/ 15</span></div>
              </div>
              <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                <div className="text-xs text-slate-500">Social Media Proof</div>
                <div className="text-lg font-bold text-slate-900 mt-1">{auditResult.socialScore} <span className="text-xs text-slate-400 font-normal">/ 15</span></div>
              </div>
              <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                <div className="text-xs text-slate-500">Brand Identity</div>
                <div className="text-lg font-bold text-slate-900 mt-1">{auditResult.brandingScore} <span className="text-xs text-slate-400 font-normal">/ 15</span></div>
              </div>
              <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                <div className="text-xs text-slate-500">Online Sales Funnel</div>
                <div className="text-lg font-bold text-slate-900 mt-1">{auditResult.salesScore} <span className="text-xs text-slate-400 font-normal">/ 15</span></div>
              </div>
            </div>
          </div>

          {/* Strengths & Weaknesses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-xl bg-emerald-50/70 border border-emerald-200 p-5 space-y-3">
              <h4 className="text-sm font-bold text-emerald-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                Current Business Strengths
              </h4>
              <ul className="space-y-2 text-xs text-emerald-950">
                {auditResult.strengths?.map((s: string, i: number) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="font-bold text-emerald-700">•</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl bg-red-50/70 border border-red-200 p-5 space-y-3">
              <h4 className="text-sm font-bold text-red-900 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-red-700" />
                Key Digital Bottlenecks
              </h4>
              <ul className="space-y-2 text-xs text-red-950">
                {auditResult.weaknesses?.map((w: string, i: number) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="font-bold text-red-700">•</span>
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Actionable Recommendations */}
          <div className="rounded-xl bg-blue-50/80 border border-blue-200 p-6 space-y-4">
            <h4 className="text-sm font-bold text-blue-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-700" />
              Prioritized Action Recommendations
            </h4>
            <div className="space-y-2.5">
              {auditResult.recommendations?.map((rec: string, i: number) => (
                <div
                  key={i}
                  className="rounded-lg bg-white p-3 border border-blue-100 text-xs text-slate-800 font-medium flex items-center gap-2.5"
                >
                  <span className="h-5 w-5 rounded-full bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <Button
              variant="outline"
              onClick={() => {
                setAuditResult(null);
              }}
              size="sm"
            >
              Re-take Digital Audit
            </Button>

            <Button
              variant="brand"
              onClick={() => router.push("/business/roadmap")}
              className="w-full sm:w-auto"
            >
              View Generated 6-Stage Roadmap
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </div>
        </div>
      )}

      {/* Audit Questionnaire Form */}
      {!auditResult && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          {error && (
            <div className="mb-6 rounded-lg bg-red-50 p-3.5 border border-red-200 flex items-start gap-2.5 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* 1. Website Status */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Store className="w-4 h-4 text-blue-600" />
                <label className="text-sm font-bold text-slate-900">
                  1. What is your current website status?
                </label>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { value: "none", label: "No website at all", desc: "0 / 20 points" },
                  { value: "basic_outdated", label: "Basic / outdated website", desc: "8 / 20 points" },
                  { value: "standard", label: "Standard working website", desc: "15 / 20 points" },
                  { value: "high_converting", label: "Fast, mobile-optimized catalog", desc: "20 / 20 points" },
                ].map((opt) => (
                  <label
                    key={opt.value}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition ${
                      formData.websiteStatus === opt.value
                        ? "border-blue-600 bg-blue-50/60 ring-1 ring-blue-600"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="websiteStatus"
                      value={opt.value}
                      checked={formData.websiteStatus === opt.value}
                      onChange={(e) => setFormData({ ...formData, websiteStatus: e.target.value })}
                      className="mt-1 text-blue-600"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-900">{opt.label}</div>
                      <div className="text-[11px] text-slate-500">{opt.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* 2. Google Business Profile */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-blue-600" />
                <label className="text-sm font-bold text-slate-900">
                  2. Google Search & Google Maps Presence
                </label>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { value: "none", label: "No Google listing", desc: "0 / 20 points" },
                  { value: "claimed_unoptimized", label: "Claimed but not optimized", desc: "7 / 20 points" },
                  { value: "verified_active", label: "Verified with basic info", desc: "14 / 20 points" },
                  { value: "optimized_with_reviews", label: "Top ranked with 50+ reviews", desc: "20 / 20 points" },
                ].map((opt) => (
                  <label
                    key={opt.value}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition ${
                      formData.googleBusiness === opt.value
                        ? "border-blue-600 bg-blue-50/60 ring-1 ring-blue-600"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="googleBusiness"
                      value={opt.value}
                      checked={formData.googleBusiness === opt.value}
                      onChange={(e) => setFormData({ ...formData, googleBusiness: e.target.value })}
                      className="mt-1 text-blue-600"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-900">{opt.label}</div>
                      <div className="text-[11px] text-slate-500">{opt.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* 3. SEO Presence */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-blue-600" />
                <label className="text-sm font-bold text-slate-900">
                  3. SEO & Organic Discoverability
                </label>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { value: "none", label: "Not indexed on Google", desc: "0 / 15 points" },
                  { value: "not_indexed", label: "Only shows for exact brand name", desc: "4 / 15 points" },
                  { value: "ranking_some_terms", label: "Ranks for some local keywords", desc: "10 / 15 points" },
                  { value: "high_visibility", label: "Top 3 rankings for key products", desc: "15 / 15 points" },
                ].map((opt) => (
                  <label
                    key={opt.value}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition ${
                      formData.seoPresence === opt.value
                        ? "border-blue-600 bg-blue-50/60 ring-1 ring-blue-600"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="seoPresence"
                      value={opt.value}
                      checked={formData.seoPresence === opt.value}
                      onChange={(e) => setFormData({ ...formData, seoPresence: e.target.value })}
                      className="mt-1 text-blue-600"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-900">{opt.label}</div>
                      <div className="text-[11px] text-slate-500">{opt.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* 4. Social Media */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <label className="text-sm font-bold text-slate-900">
                  4. Social Media & Instagram Showcase
                </label>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { value: "none", label: "No social profiles", desc: "0 / 15 points" },
                  { value: "inactive", label: "Inactive (no posts in 3+ months)", desc: "4 / 15 points" },
                  { value: "occasional_posts", label: "Occasional photos without calendar", desc: "9 / 15 points" },
                  { value: "active_professional", label: "Active weekly reels & product posts", desc: "15 / 15 points" },
                ].map((opt) => (
                  <label
                    key={opt.value}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition ${
                      formData.socialMedia === opt.value
                        ? "border-blue-600 bg-blue-50/60 ring-1 ring-blue-600"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="socialMedia"
                      value={opt.value}
                      checked={formData.socialMedia === opt.value}
                      onChange={(e) => setFormData({ ...formData, socialMedia: e.target.value })}
                      className="mt-1 text-blue-600"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-900">{opt.label}</div>
                      <div className="text-[11px] text-slate-500">{opt.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* 5. Branding */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-600" />
                <label className="text-sm font-bold text-slate-900">
                  5. Brand Identity & Visual Assets
                </label>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { value: "none", label: "No logo or visual kit", desc: "0 / 15 points" },
                  { value: "simple_logo", label: "Basic logo only", desc: "5 / 15 points" },
                  { value: "consistent_branding", label: "Consistent logo, colors & banners", desc: "10 / 15 points" },
                  { value: "complete_brand_system", label: "Complete brand guidelines & packaging", desc: "15 / 15 points" },
                ].map((opt) => (
                  <label
                    key={opt.value}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition ${
                      formData.branding === opt.value
                        ? "border-blue-600 bg-blue-50/60 ring-1 ring-blue-600"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="branding"
                      value={opt.value}
                      checked={formData.branding === opt.value}
                      onChange={(e) => setFormData({ ...formData, branding: e.target.value })}
                      className="mt-1 text-blue-600"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-900">{opt.label}</div>
                      <div className="text-[11px] text-slate-500">{opt.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* 6. Online Sales Channel */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <label className="text-sm font-bold text-slate-900">
                  6. Online Ordering & Inquiry Channel
                </label>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { value: "offline_only", label: "In-store cash only", desc: "0 / 15 points" },
                  { value: "whatsapp_manual", label: "Manual WhatsApp chats", desc: "6 / 15 points" },
                  { value: "catalog_online", label: "Online catalog with inquiry forms", desc: "11 / 15 points" },
                  { value: "full_ecommerce", label: "Direct payment checkout & cart", desc: "15 / 15 points" },
                ].map((opt) => (
                  <label
                    key={opt.value}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition ${
                      formData.onlineSales === opt.value
                        ? "border-blue-600 bg-blue-50/60 ring-1 ring-blue-600"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="onlineSales"
                      value={opt.value}
                      checked={formData.onlineSales === opt.value}
                      onChange={(e) => setFormData({ ...formData, onlineSales: e.target.value })}
                      className="mt-1 text-blue-600"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-900">{opt.label}</div>
                      <div className="text-[11px] text-slate-500">{opt.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <Button type="submit" variant="brand" isLoading={submitting} className="w-full sm:w-auto">
                Calculate Digital Readiness & Generate Roadmap
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
