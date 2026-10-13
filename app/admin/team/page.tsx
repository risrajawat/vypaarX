import { requireAdmin } from "@/lib/auth/roles";
import prisma from "@/lib/db/prisma";
import { ShieldCheck, Mail, Phone, UserCheck, Sparkles } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default async function AdminTeamPage() {
  const teamMembers = await prisma.user.findMany({
    where: {
      role: { in: ["ADMIN", "TEAM_MEMBER"] },
    },
    include: {
      assignedTasks: true,
    },
    orderBy: { role: "asc" },
  });

  return (
    <div className="space-y-6 pb-12">
      <div className="bg-slate-800/80 p-6 sm:p-8 rounded-2xl border border-slate-700 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/20 border border-rose-500/30 px-3 py-0.5 text-xs font-bold text-rose-400 mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            ORGANIZATION & ACCESS
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            VyparX Operations Team
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Internal architects, growth specialists, and delivery leads with system permissions.
          </p>
        </div>

        <span className="text-xs text-slate-300 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-700">
          Staff Members: <strong className="text-white">{teamMembers.length}</strong>
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {teamMembers.map((m) => (
          <div
            key={m.id}
            className="bg-slate-800/90 rounded-2xl border border-slate-700 p-6 shadow-sm space-y-4"
          >
            <div className="flex items-center justify-between">
              <span
                className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                  m.role === "ADMIN"
                    ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                    : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                }`}
              >
                {m.role.replace("_", " ")}
              </span>
              <span className="text-[10px] text-slate-500">Joined {formatDate(m.createdAt)}</span>
            </div>

            <div>
              <h3 className="text-base font-bold text-white">{m.name}</h3>
              <div className="space-y-1 mt-2 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  <span>{m.email}</span>
                </div>
                {m.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-500" />
                    <span>{m.phone}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-700 flex items-center justify-between text-xs text-slate-400">
              <span>Active Assigned Tasks:</span>
              <strong className="text-white">{m.assignedTasks.length}</strong>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
