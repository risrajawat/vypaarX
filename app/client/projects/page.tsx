import { requireClient } from "@/lib/auth/roles";
import prisma from "@/lib/db/prisma";
import { FolderKanban, CheckCircle2, Clock, Calendar, CheckSquare, PackageCheck } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default async function ClientProjectsPage() {
  const { business } = await requireClient();

  const projects = await prisma.project.findMany({
    where: { businessId: business.id },
    include: {
      milestones: { orderBy: { order: "asc" } },
      tasks: { where: { isClientVisible: true } },
      deliverables: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-semibold text-blue-700">
          <FolderKanban className="w-3.5 h-3.5" />
          ACTIVE CLIENT PROJECTS
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Projects & Milestones
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Track real-time progress across all active digital growth projects and phased milestones.
        </p>
      </div>

      {projects.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-sm text-slate-500">
          No active projects found.
        </div>
      ) : (
        <div className="space-y-6">
          {projects.map((proj) => (
            <div key={proj.id} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase bg-blue-100 text-blue-800">
                      {proj.status.replace("_", " ")}
                    </span>
                    {proj.dueDate && (
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> Target Launch: {formatDate(proj.dueDate)}
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 mt-1">{proj.name}</h2>
                  <p className="text-xs text-slate-600 mt-1">{proj.description}</p>
                </div>

                <div className="text-left sm:text-right shrink-0">
                  <div className="text-2xl font-extrabold text-blue-600">{proj.progress}%</div>
                  <div className="text-[11px] text-slate-400">Total Progress</div>
                </div>
              </div>

              {/* Milestones List */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Phased Project Milestones
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {proj.milestones.map((m) => (
                    <div
                      key={m.id}
                      className="p-4 rounded-xl border border-slate-100 bg-slate-50 text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{m.title}</span>
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
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
                      <p className="text-slate-500 text-[11px]">{m.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Summary Counts */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-6 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-emerald-600" />
                  <span>{proj.tasks.length} client-visible tasks tracked</span>
                </div>
                <div className="flex items-center gap-2">
                  <PackageCheck className="w-4 h-4 text-blue-600" />
                  <span>{proj.deliverables.length} deliverables uploaded</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
