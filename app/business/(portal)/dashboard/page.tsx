import { requireProspect } from "@/lib/auth/roles";
import prisma from "@/lib/db/prisma";
import Link from "next/link";
import {
  FileCheck2,
  Compass,
  ArrowRight,
  Sparkles,
  PhoneCall,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  FileText,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function BusinessDashboardPage() {
  const { user, dbUser, business } = await requireProspect();

  // Fetch latest audit and proposal for this business
  const latestAudit = await prisma.audit.findFirst({
    where: { businessId: business.id },
    orderBy: { createdAt: "desc" },
  });

  const latestProposal = await prisma.proposal.findFirst({
    where: { businessId: business.id },
    orderBy: { createdAt: "desc" },
  });

  const readinessScore = business.digitalReadinessScore || latestAudit?.overallScore || 0;
  const hasCompletedAudit = !!latestAudit;

  const phone = process.env.NEXT_PUBLIC_SUPPORT_PHONE || "+91 98765 43210";
  const whatsapp = process.env.NEXT_PUBLIC_SUPPORT_WHATSAPP || "+919876543210";

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-200 px-3 py-0.5 text-xs font-bold text-blue-700 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            GROWTH HUB
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome, {dbUser.name.split(" ")[0]} 👋
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Business: <span className="font-bold text-slate-900">{business.name}</span> • Category:{" "}
            <span className="font-medium text-slate-700">{business.category}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            Status: {business.customerStatus.replace("_", " ")}
          </span>
        </div>
      </div>

      {/* Readiness Assessment & Growth Stage Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Digital Readiness Score Card */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base">Digital Readiness Score</h3>
              <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 flex items-center gap-1">
                <Info className="w-3 h-3" />
                Assessment Engine
              </span>
            </div>

            <div className="my-6 text-center">
              <div className="inline-flex items-baseline justify-center">
                <span className="text-5xl sm:text-6xl font-extrabold text-slate-900 tracking-tight">
                  {readinessScore}
                </span>
                <span className="text-xl text-slate-400 font-semibold ml-1">/100</span>
              </div>

              <div className="w-full bg-slate-100 h-3 rounded-full mt-4 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    readinessScore >= 70
                      ? "bg-emerald-500"
                      : readinessScore >= 40
                      ? "bg-blue-500"
                      : "bg-amber-500"
                  }`}
                  style={{ width: `${Math.max(5, readinessScore)}%` }}
                />
              </div>

              <p className="text-xs text-slate-500 mt-3">
                {hasCompletedAudit
                  ? "Calculated from your submitted website, SEO, Google listing & social presence audit."
                  : "Standard baseline score. Complete your free audit to calculate exact score."}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            {hasCompletedAudit ? (
              <Link href="/business/roadmap" className="w-full block">
                <Button variant="brand" className="w-full">
                  View Growth Roadmap
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
            ) : (
              <Link href="/business/audit" className="w-full block">
                <Button variant="brand" className="w-full">
                  Start Your Digital Audit
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Right: Growth Journey Progress Tracker */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-base">Your Growth Journey</h3>
            <span className="text-xs text-slate-500">6 Stages to Pan-India Scale</span>
          </div>

          <div className="space-y-3.5">
            {[
              {
                title: "Business Profile",
                status: "COMPLETED",
                desc: "Profile & business categories configured",
              },
              {
                title: "Digital Audit",
                status: hasCompletedAudit ? "COMPLETED" : "CURRENT",
                desc: hasCompletedAudit
                  ? `Audit completed (${readinessScore}/100)`
                  : "Evaluate website, SEO & Google footprint",
              },
              {
                title: "Digital Presence & Website",
                status: latestProposal?.status === "ACCEPTED" ? "COMPLETED" : "UPCOMING",
                desc: "Mobile-first catalog website & brand assets",
              },
              {
                title: "Local SEO & Google Search",
                status: "UPCOMING",
                desc: "Google Maps & category search optimization",
              },
              {
                title: "Customer Growth & Inquiries",
                status: "UPCOMING",
                desc: "Automated review funnels & WhatsApp commerce",
              },
              {
                title: "National & Global Scale",
                status: "UPCOMING",
                desc: "Pan-India delivery marketing & export readiness",
              },
            ].map((step, idx) => (
              <div
                key={step.title}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100"
              >
                <div className="flex items-center gap-3">
                  {step.status === "COMPLETED" ? (
                    <div className="h-7 w-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0">
                      ✓
                    </div>
                  ) : step.status === "CURRENT" ? (
                    <div className="h-7 w-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0 animate-pulse">
                      ●
                    </div>
                  ) : (
                    <div className="h-7 w-7 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-xs shrink-0">
                      ○
                    </div>
                  )}
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{step.title}</h4>
                    <p className="text-xs text-slate-500">{step.desc}</p>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    step.status === "COMPLETED"
                      ? "bg-emerald-100 text-emerald-800"
                      : step.status === "CURRENT"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {step.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Active Proposal Alert if Sent */}
      {latestProposal && (
        <div className="rounded-2xl border-2 border-blue-500 bg-blue-50/60 p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-block bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
              Action Required
            </div>
            <h3 className="font-bold text-slate-900 text-base">
              You Have a Received Proposal: {latestProposal.title}
            </h3>
            <p className="text-xs text-slate-600">
              Review your customized scope of work, milestone deliverables, and one-click activation.
            </p>
          </div>
          <Link href="/business/proposals">
            <Button variant="brand">Review & Accept Quote</Button>
          </Link>
        </div>
      )}

      {/* Action Banners */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Talk to VyparX Team</h3>
              <p className="text-xs text-slate-500">Get direct guidance on your digital strategy</p>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Need clarity on timelines, pricing packages, or custom e-commerce integrations? Our growth specialists are available via direct phone or WhatsApp.
          </p>
          <div className="flex gap-3 pt-1">
            <a
              href={`tel:${phone.replace(/\s+/g, "")}`}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 transition"
            >
              Call {phone}
            </a>
            <a
              href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition"
            >
              WhatsApp Us
            </a>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Explore Growth Roadmap</h3>
              <p className="text-xs text-slate-500">Phased milestones tailored for your category</p>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Discover the exact steps required to transform your local shop into a recognizable brand across India with transparent milestones.
          </p>
          <div className="pt-1">
            <Link href="/business/roadmap">
              <Button variant="outline" size="sm">
                Open Full Roadmap
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
