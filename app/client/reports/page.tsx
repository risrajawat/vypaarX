import { requireClient } from "@/lib/auth/roles";
import prisma from "@/lib/db/prisma";
import { BarChart3, Calendar, CheckCircle2, TrendingUp, Sparkles, FileText } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default async function ClientReportsPage() {
  const { business } = await requireClient();

  const reports = await prisma.report.findMany({
    where: { businessId: business.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-semibold text-blue-700">
          <BarChart3 className="w-3.5 h-3.5" />
          GROWTH & READINESS REPORTING
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Performance & Growth Reports
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Structured monthly performance audits, readiness metrics, and prioritized optimization recommendations.
        </p>
      </div>

      {reports.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-sm text-slate-500">
          No monthly reports published yet. The first report is generated after milestone 2 completion.
        </div>
      ) : (
        <div className="space-y-6">
          {reports.map((r) => {
            let metrics: Record<string, any> = {};
            let recommendations: string[] = [];

            try {
              metrics = JSON.parse(r.metrics || "{}");
              recommendations = JSON.parse(r.recommendations || "[]");
            } catch (e) {}

            return (
              <div key={r.id} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
                  <div>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase bg-blue-100 text-blue-800">
                      {r.period}
                    </span>
                    <h2 className="text-xl font-bold text-slate-900 mt-1">{r.title}</h2>
                  </div>
                  <div className="text-xs text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    Published: {formatDate(r.createdAt)}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Executive Summary</h3>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                    {r.summary}
                  </p>
                </div>

                {/* Key Metrics Grid */}
                {Object.keys(metrics).length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Key Tracked Metrics</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {Object.entries(metrics).map(([key, val]) => (
                        <div key={key} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                          <div className="text-[11px] text-slate-500 capitalize">
                            {key.replace(/([A-Z])/g, " $1")}
                          </div>
                          <div className="text-base font-bold text-slate-900 mt-0.5">
                            {typeof val === "boolean" ? (val ? "Yes" : "No") : String(val)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommendations */}
                {recommendations.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-blue-700 flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4" />
                      Priority Recommendations for Next Period
                    </h3>
                    <div className="space-y-2">
                      {recommendations.map((rec, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-slate-700 bg-blue-50/60 p-3 rounded-xl border border-blue-100">
                          <span className="font-bold text-blue-600 shrink-0">{i + 1}.</span>
                          <span>{rec}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
