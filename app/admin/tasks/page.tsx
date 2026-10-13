"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CheckSquare, Filter, CheckCircle2, Clock } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function AdminTasksPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");

  const fetchTasks = () => {
    fetch("/api/tasks")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setTasks(data.tasks || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleUpdateStatus = async (taskId: string, newStatus: string) => {
    try {
      const res = await fetch("/api/tasks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId, status: newStatus }),
      });
      if (res.ok) fetchTasks();
    } catch (e) {
      console.error(e);
    }
  };

  const filteredTasks = tasks.filter(
    (t) => statusFilter === "ALL" || t.status === statusFilter
  );

  if (loading) {
    return <div className="p-12 text-center text-sm text-slate-400">Loading tasks...</div>;
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="bg-slate-800/80 p-6 sm:p-8 rounded-2xl border border-slate-700 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-teal-500/20 border border-teal-500/30 px-3 py-0.5 text-xs font-bold text-teal-400 mb-2">
            <CheckSquare className="w-3.5 h-3.5" />
            OPERATIONS TASK BOARD
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Global Task Board
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Track and update all project tasks across client accounts in real time.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="TODO">TODO</option>
            <option value="IN_PROGRESS">IN_PROGRESS</option>
            <option value="IN_REVIEW">IN_REVIEW</option>
            <option value="COMPLETED">COMPLETED</option>
          </select>
        </div>
      </div>

      <div className="bg-slate-800/90 rounded-2xl border border-slate-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-700">
              <tr>
                <th className="p-4">Task & Description</th>
                <th className="p-4">Project & Client</th>
                <th className="p-4">Assigned To</th>
                <th className="p-4">Priority</th>
                <th className="p-4">Visibility</th>
                <th className="p-4">Change Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {filteredTasks.map((t) => (
                <tr key={t.id} className="hover:bg-slate-700/40 transition">
                  <td className="p-4">
                    <div className="font-bold text-white text-sm">{t.title}</div>
                    <div className="text-slate-400 text-[11px] mt-0.5">{t.description || "No description"}</div>
                  </td>

                  <td className="p-4">
                    <div className="font-semibold text-white">{t.project?.name}</div>
                    <div className="text-[11px] text-slate-400">{t.project?.business?.name}</div>
                  </td>

                  <td className="p-4 text-slate-300">{t.assignedTo?.name || "Unassigned"}</td>

                  <td className="p-4">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-700">
                      {t.priority}
                    </span>
                  </td>

                  <td className="p-4">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        t.isClientVisible
                          ? "bg-blue-500/20 text-blue-300"
                          : "bg-slate-700 text-slate-400"
                      }`}
                    >
                      {t.isClientVisible ? "Client Visible" : "Internal"}
                    </span>
                  </td>

                  <td className="p-4">
                    <select
                      value={t.status}
                      onChange={(e) => handleUpdateStatus(t.id, e.target.value)}
                      className="h-8 rounded bg-slate-900 border border-slate-700 px-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="TODO">TODO</option>
                      <option value="IN_PROGRESS">IN_PROGRESS</option>
                      <option value="IN_REVIEW">IN_REVIEW</option>
                      <option value="COMPLETED">COMPLETED</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
