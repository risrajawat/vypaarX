"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Compass,
  CheckCircle2,
  Clock,
  Lock,
  ArrowRight,
  Sparkles,
  Layers,
  FileText,
  PhoneCall,
} from "lucide-react";

export default function BusinessRoadmapPage() {
  const [roadmap, setRoadmap] = useState<any>(null);
  const [business, setBusiness] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/roadmap/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setRoadmap(data.roadmap);
          setBusiness(data.business);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load roadmap:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-500 text-sm">
        Loading growth roadmap...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-semibold text-blue-700">
          <Compass className="w-3.5 h-3.5" />
          6-STAGE EXECUTION BLUEPRINT
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {roadmap?.title || `${business?.name || "Business"} Growth Roadmap`}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          {roadmap?.description ||
            "Your tailored step-by-step transformation path from local presence to pan-India market discovery."}
        </p>
      </div>

      {/* Roadmap Stages */}
      <div className="space-y-4">
        {roadmap?.stages?.map((stage: any, idx: number) => {
          let recommendedServices = [];
          try {
            recommendedServices = JSON.parse(stage.recommendedServices || "[]");
          } catch (e) {}

          const isCompleted = stage.status === "COMPLETED";
          const isInProgress = stage.status === "IN_PROGRESS";
          const isAvailable = stage.status === "AVAILABLE";
          const isLocked = stage.status === "LOCKED";

          return (
            <div
              key={stage.id}
              className={`rounded-2xl border p-6 transition bg-white ${
                isInProgress
                  ? "border-blue-500 shadow-md ring-1 ring-blue-500/20"
                  : isCompleted
                  ? "border-emerald-200 bg-emerald-50/20"
                  : "border-slate-200 opacity-95"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div
                    className={`h-9 w-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                      isCompleted
                        ? "bg-emerald-100 text-emerald-700"
                        : isInProgress
                        ? "bg-blue-600 text-white"
                        : isAvailable
                        ? "bg-blue-100 text-blue-700"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {isCompleted ? "✓" : isLocked ? <Lock className="w-4 h-4" /> : stage.order}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{stage.title}</h3>
                    <div className="text-[11px] text-slate-500">
                      Est. Execution Timeline: ~{stage.estimatedWeeks || 2} weeks
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                      isCompleted
                        ? "bg-emerald-100 text-emerald-800"
                        : isInProgress
                        ? "bg-blue-100 text-blue-800 animate-pulse"
                        : isAvailable
                        ? "bg-indigo-100 text-indigo-800"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {stage.status.replace("_", " ")}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                    Priority: {stage.priority}
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 mt-4 leading-relaxed">
                {stage.description}
              </p>

              {recommendedServices.length > 0 && (
                <div className="mt-4 pt-3 border-t border-slate-50 flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] font-semibold text-slate-500 mr-1">
                    Recommended Services:
                  </span>
                  {recommendedServices.map((srv: string, i: number) => (
                    <span
                      key={i}
                      className="text-[11px] font-medium bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md border border-slate-200"
                    >
                      {srv}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Action CTA */}
      <div className="rounded-2xl bg-slate-900 text-white p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="font-bold text-lg">Ready to Execute Phase 1?</h3>
          <p className="text-xs text-slate-300">
            Review your custom proposal quote and activate your dedicated project delivery.
          </p>
        </div>
        <Link href="/business/proposals">
          <Button variant="brand" className="whitespace-nowrap">
            View Received Proposals
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
