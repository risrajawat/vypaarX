import { requireAdmin } from "@/lib/auth/roles";
import prisma from "@/lib/db/prisma";
import Link from "next/link";
import {
  Users2,
  Building2,
  FileCheck2,
  FileText,
  FolderKanban,
  PackageCheck,
  HelpCircle,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const { user, dbUser } = await requireAdmin();

  // Calculate live database counts
  const totalLeads = await prisma.lead.count();
  const activeClients = await prisma.business.count({
    where: { customerStatus: "ACTIVE_CLIENT" },
  });
  const pendingAudits = await prisma.audit.count({
    where: { status: "SUBMITTED" },
  });
  const proposalsSent = await prisma.proposal.count({
    where: { status: "SENT" },
  });
  const activeProjects = await prisma.project.count({
    where: { status: "IN_PROGRESS" },
  });
  const pendingApprovals = await prisma.deliverable.count({
    where: { status: "PENDING_APPROVAL" },
  });
  const openSupportTickets = await prisma.supportRequest.count({
    where: { status: "OPEN" },
  });

  // Recent leads
  const recentLeads = await prisma.lead.findMany({
    include: { business: { include: { owner: true } } },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  // Recent submitted audits
  const recentAudits = await prisma.audit.findMany({
    include: { business: true },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="bg-slate-800/80 p-6 sm:p-8 rounded-2xl border border-slate-700 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/20 border border-blue-500/30 px-3 py-0.5 text-xs font-bold text-blue-400 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            OPERATIONS CONTROL CENTER
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            VyparX Executive Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time pipeline metrics, audit scoring submissions, and project delivery monitoring.
          </p>
        </div>

        <div className="text-xs text-slate-400 bg-slate-900 px-3 py-2 rounded-xl border border-slate-800">
          Operator: <span className="font-bold text-white">{dbUser.name}</span>
        </div>
      </div>

      {/* 6 Key Operational Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <Link
          href="/admin/leads"
          className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 hover:border-emerald-500 transition group"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total Leads</span>
            <Users2 className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition" />
          </div>
          <div className="text-2xl font-extrabold text-white mt-2">{totalLeads}</div>
        </Link>

        <Link
          href="/admin/clients"
          className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 hover:border-blue-500 transition group"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Active Clients</span>
            <Building2 className="w-4 h-4 text-blue-400 group-hover:scale-110 transition" />
          </div>
          <div className="text-2xl font-extrabold text-white mt-2">{activeClients}</div>
        </Link>

        <Link
          href="/admin/audits"
          className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 hover:border-amber-500 transition group"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Pending Audits</span>
            <FileCheck2 className="w-4 h-4 text-amber-400 group-hover:scale-110 transition" />
          </div>
          <div className="text-2xl font-extrabold text-amber-400 mt-2">{pendingAudits}</div>
        </Link>

        <Link
          href="/admin/proposals"
          className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 hover:border-purple-500 transition group"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Proposals Sent</span>
            <FileText className="w-4 h-4 text-purple-400 group-hover:scale-110 transition" />
          </div>
          <div className="text-2xl font-extrabold text-white mt-2">{proposalsSent}</div>
        </Link>

        <Link
          href="/admin/projects"
          className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 hover:border-indigo-500 transition group"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Active Projects</span>
            <FolderKanban className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition" />
          </div>
          <div className="text-2xl font-extrabold text-white mt-2">{activeProjects}</div>
        </Link>

        <Link
          href="/admin/support"
          className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 hover:border-yellow-500 transition group"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Open Tickets</span>
            <HelpCircle className="w-4 h-4 text-yellow-400 group-hover:scale-110 transition" />
          </div>
          <div className="text-2xl font-extrabold text-yellow-400 mt-2">{openSupportTickets}</div>
        </Link>
      </div>

      {/* Grid: Recent Leads & Recent Audits */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Leads */}
        <div className="bg-slate-800/80 rounded-2xl border border-slate-700 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-700">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Users2 className="w-4 h-4 text-emerald-400" />
              Recent Prospect Inquiries
            </h3>
            <Link href="/admin/leads" className="text-xs text-blue-400 hover:underline">
              View all leads →
            </Link>
          </div>

          <div className="space-y-3">
            {recentLeads.map((lead) => (
              <div
                key={lead.id}
                className="p-3.5 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="font-bold text-white">{lead.business.name}</div>
                  <div className="text-slate-400 text-[11px]">
                    {lead.business.owner.name} • {lead.business.city}, {lead.business.category}
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      lead.status === "CONVERTED"
                        ? "bg-emerald-500/20 text-emerald-300"
                        : lead.status === "AUDIT_REQUESTED"
                        ? "bg-amber-500/20 text-amber-300"
                        : "bg-blue-500/20 text-blue-300"
                    }`}
                  >
                    {lead.status.replace("_", " ")}
                  </span>
                  <div className="text-[10px] text-slate-500 mt-0.5">{formatDate(lead.createdAt)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Audits */}
        <div className="bg-slate-800/80 rounded-2xl border border-slate-700 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-700">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-amber-400" />
              Latest Digital Audits
            </h3>
            <Link href="/admin/audits" className="text-xs text-blue-400 hover:underline">
              Review all audits →
            </Link>
          </div>

          <div className="space-y-3">
            {recentAudits.map((audit) => (
              <div
                key={audit.id}
                className="p-3.5 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="font-bold text-white">{audit.business.name}</div>
                  <div className="text-slate-400 text-[11px]">
                    Category: {audit.business.category} • Status: {audit.status}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-base font-extrabold text-blue-400">
                    {audit.overallScore} <span className="text-xs text-slate-500">/ 100</span>
                  </div>
                  <div className="text-[10px] text-slate-500">{formatDate(audit.createdAt)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
