import { requireClient } from "@/lib/auth/roles";
import prisma from "@/lib/db/prisma";
import Link from "next/link";
import {
  FolderKanban,
  CheckSquare,
  PackageCheck,
  BarChart3,
  HelpCircle,
  Sparkles,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  PhoneCall,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function ClientDashboardPage() {
  const { user, dbUser, business } = await requireClient();

  // Fetch active project
  const activeProject = await prisma.project.findFirst({
    where: { businessId: business.id },
    include: {
      tasks: true,
      deliverables: { include: { approvals: true } },
      milestones: { orderBy: { order: "asc" } },
    },
    orderBy: { createdAt: "desc" },
  });

  // Calculate real metrics
  const totalTasks = activeProject?.tasks.length || 0;
  const completedTasks = activeProject?.tasks.filter((t) => t.status === "COMPLETED").length || 0;
  const pendingApprovals = activeProject?.deliverables.filter((d) => d.status === "PENDING_APPROVAL") || [];
  const projectProgress = activeProject?.progress || 0;

  // Latest Report
  const latestReport = await prisma.report.findFirst({
    where: { businessId: business.id },
    orderBy: { createdAt: "desc" },
  });

  const nextPendingDeliverable = pendingApprovals[0];
  const phone = process.env.NEXT_PUBLIC_SUPPORT_PHONE || "+91 98765 43210";

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-200 px-3 py-0.5 text-xs font-bold text-blue-700 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            ACTIVE CLIENT PORTAL
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {business.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Owner: <span className="font-semibold text-slate-700">{dbUser.name}</span> • Location:{" "}
            <span className="font-medium text-slate-700">{business.city}, {business.state}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Stage: {business.growthStage.replace("_", " ")}
          </span>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Project Progress</span>
            <FolderKanban className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{projectProgress}%</div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className="bg-blue-600 h-full rounded-full transition-all" style={{ width: `${projectProgress}%` }} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Pending Approvals</span>
            <PackageCheck className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-3xl font-extrabold text-amber-600">{pendingApprovals.length}</div>
          <p className="text-[11px] text-slate-400">Deliverables awaiting your review</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Tasks Progress</span>
            <CheckSquare className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">
            {completedTasks} <span className="text-base text-slate-400 font-normal">/ {totalTasks}</span>
          </div>
          <p className="text-[11px] text-slate-400">{totalTasks - completedTasks} remaining in phase</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Readiness Score</span>
            <TrendingUp className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">
            {business.digitalReadinessScore} <span className="text-base text-slate-400 font-normal">/ 100</span>
          </div>
          <p className="text-[11px] text-slate-400">Benchmark score</p>
        </div>
      </div>

      {/* Next Action Callout Banner if Pending Approval */}
      {nextPendingDeliverable && (
        <div className="rounded-2xl border-2 border-amber-400 bg-amber-50/70 p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-block bg-amber-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              Next Action Required
            </div>
            <h3 className="font-bold text-slate-900 text-base">
              Approve: {nextPendingDeliverable.name}
            </h3>
            <p className="text-xs text-slate-600">
              {nextPendingDeliverable.description || "Review this deliverable to advance project milestones."}
            </p>
          </div>
          <Link href="/client/deliverables">
            <Button variant="brand" className="bg-amber-600 hover:bg-amber-700">
              Review Deliverable
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </Link>
        </div>
      )}

      {/* Growth Journey & Active Milestones */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Active Project & Milestones */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                {activeProject?.name || "Active Growth Project"}
              </h3>
              <p className="text-xs text-slate-500">Phased delivery & milestone progress</p>
            </div>
            <Link href="/client/projects" className="text-xs font-semibold text-blue-600 hover:underline">
              View full project →
            </Link>
          </div>

          <div className="space-y-3">
            {activeProject?.milestones?.map((m: any) => (
              <div
                key={m.id}
                className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs"
              >
                <div className="flex items-center gap-3">
                  {m.status === "COMPLETED" ? (
                    <div className="h-6 w-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0">
                      ✓
                    </div>
                  ) : m.status === "IN_PROGRESS" ? (
                    <div className="h-6 w-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0 animate-pulse">
                      ●
                    </div>
                  ) : (
                    <div className="h-6 w-6 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-xs shrink-0">
                      ○
                    </div>
                  )}
                  <div>
                    <div className="font-bold text-slate-900 text-sm">{m.title}</div>
                    <div className="text-slate-500 text-[11px]">{m.description}</div>
                  </div>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    m.status === "COMPLETED"
                      ? "bg-emerald-100 text-emerald-800"
                      : m.status === "IN_PROGRESS"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {m.status.replace("_", " ")}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Growth Journey Stages */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-base">Growth Journey</h3>
            <p className="text-xs text-slate-500">Long-term roadmap trajectory</p>
          </div>

          <div className="space-y-3">
            {[
              { name: "Digital Foundation", status: "COMPLETED" },
              { name: "Website & Brand Assets", status: "COMPLETED" },
              { name: "Search Visibility & Maps", status: "CURRENT" },
              { name: "Customer Growth Funnel", status: "UPCOMING" },
              { name: "National Expansion", status: "UPCOMING" },
              { name: "Global Reach & Scale", status: "UPCOMING" },
            ].map((st, i) => (
              <div
                key={st.name}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs"
              >
                <div className="flex items-center gap-2.5">
                  {st.status === "COMPLETED" ? (
                    <span className="text-emerald-600 font-bold">✓</span>
                  ) : st.status === "CURRENT" ? (
                    <span className="text-blue-600 font-bold animate-pulse">●</span>
                  ) : (
                    <span className="text-slate-400">○</span>
                  )}
                  <span
                    className={`font-medium ${
                      st.status === "CURRENT" ? "text-blue-700 font-bold" : "text-slate-700"
                    }`}
                  >
                    {st.name}
                  </span>
                </div>
                <span
                  className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                    st.status === "COMPLETED"
                      ? "bg-emerald-100 text-emerald-800"
                      : st.status === "CURRENT"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-slate-200 text-slate-500"
                  }`}
                >
                  {st.status}
                </span>
              </div>
            ))}
          </div>

          {/* Quick Help Link */}
          <div className="pt-2 border-t border-slate-100">
            <Link
              href="/client/support"
              className="flex items-center justify-between p-3 rounded-xl bg-blue-50 text-blue-900 hover:bg-blue-100 transition text-xs font-semibold"
            >
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-blue-600" />
                <span>Need assistance? Contact support</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
