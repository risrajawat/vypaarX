import { requireAdmin } from "@/lib/auth/roles";
import prisma from "@/lib/db/prisma";
import { History, Activity, ShieldAlert, Sparkles } from "lucide-react";
import { formatDateTime } from "@/lib/utils";

export default async function AdminActivityLogsPage() {
  const logs = await prisma.activityLog.findMany({
    include: {
      user: true,
      business: true,
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div className="space-y-6 pb-12">
      <div className="bg-slate-800/80 p-6 sm:p-8 rounded-2xl border border-slate-700 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-700 px-3 py-0.5 text-xs font-bold text-slate-300 mb-2">
            <History className="w-3.5 h-3.5" />
            AUDIT TRAILS & SECURITY LOGS
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            System Activity Logs
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Immutable log of key platform events, logins, proposals, approvals, and state conversions.
          </p>
        </div>

        <span className="text-xs text-slate-300 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-700">
          Last 50 Events Tracked
        </span>
      </div>

      <div className="bg-slate-800/90 rounded-2xl border border-slate-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-700">
              <tr>
                <th className="p-4">Action Event</th>
                <th className="p-4">Entity Type</th>
                <th className="p-4">User</th>
                <th className="p-4">Business</th>
                <th className="p-4">Metadata</th>
                <th className="p-4 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-700/40 transition">
                  <td className="p-4">
                    <span className="font-bold text-white font-mono">{log.action}</span>
                  </td>
                  <td className="p-4 text-slate-400">{log.entityType}</td>
                  <td className="p-4 text-white font-medium">{log.user?.name || log.user?.email || "System"}</td>
                  <td className="p-4 text-slate-300">{log.business?.name || "—"}</td>
                  <td className="p-4 text-slate-400 font-mono text-[11px] max-w-xs truncate">
                    {log.metadata || "—"}
                  </td>
                  <td className="p-4 text-right text-slate-400">{formatDateTime(log.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
