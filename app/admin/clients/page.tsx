import { requireAdmin } from "@/lib/auth/roles";
import prisma from "@/lib/db/prisma";
import Link from "next/link";
import { Building2, CheckCircle2, FolderKanban, ArrowRight, ExternalLink } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default async function AdminClientsPage() {
  const clients = await prisma.business.findMany({
    where: {
      customerStatus: { in: ["ACTIVE_CLIENT", "COMPLETED"] },
    },
    include: {
      owner: true,
      projects: true,
      reports: { take: 1, orderBy: { createdAt: "desc" } },
    },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="space-y-6 pb-12">
      <div className="bg-slate-800/80 p-6 sm:p-8 rounded-2xl border border-slate-700 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/20 border border-blue-500/30 px-3 py-0.5 text-xs font-bold text-blue-400 mb-2">
            <Building2 className="w-3.5 h-3.5" />
            CONVERTED ACCOUNTS
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Active Client Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage ongoing client relationships, active growth stages, and launched digital assets.
          </p>
        </div>

        <span className="text-xs text-slate-300 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-700">
          Active Clients: <strong className="text-white">{clients.length}</strong>
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {clients.length === 0 ? (
          <div className="md:col-span-2 rounded-2xl border border-slate-700 bg-slate-800/80 p-12 text-center text-xs text-slate-500">
            No active converted clients yet. When a prospect accepts a proposal, they appear here.
          </div>
        ) : (
          clients.map((c) => (
            <div
              key={c.id}
              className="bg-slate-800/90 rounded-2xl border border-slate-700 p-6 shadow-sm space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase bg-emerald-500/20 text-emerald-300">
                    {c.growthStage.replace("_", " ")}
                  </span>
                  <span className="text-xs text-slate-400">Owner: {c.owner.name}</span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white">{c.name}</h3>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {c.category} • {c.city}, {c.state} • Phone: {c.phone || c.owner.phone}
                  </div>
                  {c.description && (
                    <p className="text-xs text-slate-300 mt-2 leading-relaxed line-clamp-2">
                      {c.description}
                    </p>
                  )}
                </div>

                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1.5 text-xs text-slate-300">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Digital Readiness:</span>
                    <strong className="text-blue-400 font-extrabold">{c.digitalReadinessScore}/100</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Active Projects:</span>
                    <strong className="text-white">{c.projects.length}</strong>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-700 flex items-center justify-between">
                {c.website ? (
                  <a
                    href={c.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-400 hover:underline flex items-center gap-1"
                  >
                    View Website <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="text-xs text-slate-500">Website: In Production</span>
                )}

                <Link
                  href={`/admin/projects`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-white bg-slate-700 hover:bg-slate-600 px-3 py-1.5 rounded-lg transition"
                >
                  Manage Projects <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
