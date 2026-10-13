import { requireClient } from "@/lib/auth/roles";
import prisma from "@/lib/db/prisma";
import { CheckSquare, Calendar, Clock, AlertCircle } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default async function ClientTasksPage() {
  const { business } = await requireClient();

  // Find all client visible tasks
  const tasks = await prisma.task.findMany({
    where: {
      isClientVisible: true,
      project: { businessId: business.id },
    },
    include: { project: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-semibold text-blue-700">
          <CheckSquare className="w-3.5 h-3.5" />
          PROJECT TASKS & EXECUTION
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Delivery Tasks
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Transparent view of all active work items being executed by the VyparX team.
        </p>
      </div>

      {tasks.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-sm text-slate-500">
          No tasks scheduled yet.
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 shadow-sm overflow-hidden">
          {tasks.map((t) => (
            <div key={t.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      t.status === "COMPLETED"
                        ? "bg-emerald-100 text-emerald-800"
                        : t.status === "IN_PROGRESS"
                        ? "bg-blue-100 text-blue-800"
                        : t.status === "IN_REVIEW"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {t.status.replace("_", " ")}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                    Priority: {t.priority}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm">{t.title}</h3>
                <p className="text-xs text-slate-500">{t.description}</p>
              </div>

              {t.dueDate && (
                <div className="text-xs text-slate-400 shrink-0 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  Due: {formatDate(t.dueDate)}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
