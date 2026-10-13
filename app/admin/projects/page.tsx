"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Label } from "@/components/ui/form-elements";
import { Modal } from "@/components/ui/dialog";
import { formatDate } from "@/lib/utils";
import {
  FolderKanban,
  Plus,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles,
  CheckSquare,
  PackageCheck,
} from "lucide-react";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState<any | null>(null);

  // New Project Form
  const [newProject, setNewProject] = useState({
    businessId: "",
    name: "",
    description: "",
    startDate: "",
    dueDate: "",
  });

  // New Task Form
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assignedToId: "",
    priority: "MEDIUM",
    isClientVisible: true,
  });

  const fetchData = async () => {
    try {
      const [pRes, lRes] = await Promise.all([fetch("/api/projects"), fetch("/api/leads")]);
      const pData = await pRes.json();
      const lData = await lRes.json();

      if (pData.success) setProjects(pData.projects || []);
      if (lData.success) {
        const busList = lData.leads?.map((l: any) => l.business) || [];
        setBusinesses(busList);
        if (busList.length > 0 && !newProject.businessId) {
          setNewProject((prev) => ({ ...prev, businessId: busList[0].id }));
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProject),
      });

      if (res.ok) {
        setShowCreateModal(false);
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showTaskModal) return;

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: showTaskModal.id,
          ...newTask,
        }),
      });

      if (res.ok) {
        setShowTaskModal(null);
        setNewTask({
          title: "",
          description: "",
          assignedToId: "",
          priority: "MEDIUM",
          isClientVisible: true,
        });
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-sm text-slate-400">Loading delivery projects...</div>;
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="bg-slate-800/80 p-6 sm:p-8 rounded-2xl border border-slate-700 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 px-3 py-0.5 text-xs font-bold text-indigo-400 mb-2">
            <FolderKanban className="w-3.5 h-3.5" />
            DELIVERY & EXECUTION
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Client Projects
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage project milestones, assign tasks to team members, and track completion progress.
          </p>
        </div>

        <Button
          variant="brand"
          className="bg-indigo-600 hover:bg-indigo-700"
          onClick={() => setShowCreateModal(true)}
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Create New Project
        </Button>
      </div>

      {/* Projects List */}
      <div className="space-y-6">
        {projects.map((proj) => (
          <div key={proj.id} className="bg-slate-800/90 rounded-2xl border border-slate-700 p-6 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-700">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase bg-indigo-500/20 text-indigo-300">
                    {proj.status.replace("_", " ")}
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">Client: {proj.business?.name}</span>
                </div>
                <h3 className="text-xl font-bold text-white mt-1">{proj.name}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{proj.description}</p>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-left sm:text-right">
                  <div className="text-2xl font-extrabold text-indigo-400">{proj.progress}%</div>
                  <div className="text-[10px] text-slate-400">Total Completion</div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="bg-slate-900 border-slate-700 text-white hover:bg-slate-700 text-xs"
                  onClick={() => setShowTaskModal(proj)}
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Add Task
                </Button>
              </div>
            </div>

            {/* Milestones */}
            <div className="space-y-2">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Milestones</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                {proj.milestones?.map((m: any) => (
                  <div key={m.id} className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{m.title}</span>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                          m.status === "COMPLETED"
                            ? "bg-emerald-500/20 text-emerald-300"
                            : m.status === "IN_PROGRESS"
                            ? "bg-blue-500/20 text-blue-300"
                            : "bg-slate-800 text-slate-500"
                        }`}
                      >
                        {m.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tasks */}
            <div className="space-y-2">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Tasks ({proj.tasks?.length || 0})
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {proj.tasks?.map((t: any) => (
                  <div
                    key={t.id}
                    className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between"
                  >
                    <div>
                      <span className="font-bold text-white">{t.title}</span>
                      <div className="text-[10px] text-slate-500">
                        Priority: {t.priority} • {t.isClientVisible ? "Client Visible" : "Internal"}
                      </div>
                    </div>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        t.status === "COMPLETED"
                          ? "bg-emerald-500/20 text-emerald-300"
                          : t.status === "IN_PROGRESS"
                          ? "bg-blue-500/20 text-blue-300"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {t.status.replace("_", " ")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Project Modal */}
      {showCreateModal && (
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Create New Client Project"
          description="Initialize a growth project for an active business."
        >
          <form onSubmit={handleCreateProject} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="projBus">Target Business *</Label>
              <select
                id="projBus"
                value={newProject.businessId}
                onChange={(e) => setNewProject({ ...newProject, businessId: e.target.value })}
                className="flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {businesses.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.city})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="projName">Project Name *</Label>
              <Input
                id="projName"
                required
                placeholder="e.g. Digital Foundation Launch"
                value={newProject.name}
                onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="projDesc">Description</Label>
              <Textarea
                id="projDesc"
                rows={3}
                placeholder="Summary of scope..."
                value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setShowCreateModal(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="brand">
                Create Project
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Add Task Modal */}
      {showTaskModal && (
        <Modal
          isOpen={!!showTaskModal}
          onClose={() => setShowTaskModal(null)}
          title={`Add Task to ${showTaskModal.name}`}
          description={`Client: ${showTaskModal.business?.name}`}
        >
          <form onSubmit={handleCreateTask} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="taskTitle">Task Title *</Label>
              <Input
                id="taskTitle"
                required
                placeholder="e.g. Design mobile navbar and catalog filters"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="taskDesc">Description</Label>
              <Textarea
                id="taskDesc"
                rows={2}
                placeholder="Details of task..."
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="taskPriority">Priority</Label>
                <select
                  id="taskPriority"
                  value={newTask.priority}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                  className="flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </div>

              <div className="space-y-1.5 flex flex-col justify-end">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-800 pb-3">
                  <input
                    type="checkbox"
                    checked={newTask.isClientVisible}
                    onChange={(e) => setNewTask({ ...newTask, isClientVisible: e.target.checked })}
                    className="rounded text-blue-600"
                  />
                  Client Visible Task
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setShowTaskModal(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="brand">
                Add Task
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
