import { requireAdmin } from "@/lib/auth/roles";
import Link from "next/link";
import {
  LayoutDashboard,
  Users2,
  FileCheck2,
  FileText,
  Building2,
  FolderKanban,
  CheckSquare,
  PackageCheck,
  BarChart3,
  HelpCircle,
  ShieldCheck,
  History,
  Settings,
  Sparkles,
} from "lucide-react";
import { LogoutButton } from "@/components/auth/logout-button";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, dbUser } = await requireAdmin();

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-slate-950 border-r border-slate-800 flex flex-col justify-between shrink-0">
        <div>
          {/* Header */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-base shadow-sm">
                VX
              </div>
              <span className="font-extrabold text-lg tracking-tight text-white">
                Vypar<span className="text-blue-500">X</span>
              </span>
            </Link>
            <span className="text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded-full uppercase">
              {dbUser.role}
            </span>
          </div>

          {/* User info */}
          <div className="px-5 py-3 bg-slate-900/80 border-b border-slate-800 text-xs">
            <div className="text-slate-400 font-medium">Logged in Operator:</div>
            <div className="font-bold text-white truncate mt-0.5">{dbUser.name}</div>
            <div className="text-[11px] text-slate-400 truncate">{dbUser.email}</div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-0.5 text-xs font-medium text-slate-300">
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-800 hover:text-white transition"
            >
              <LayoutDashboard className="w-4 h-4 text-blue-400" />
              Overview
            </Link>

            <Link
              href="/admin/leads"
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-800 hover:text-white transition"
            >
              <Users2 className="w-4 h-4 text-emerald-400" />
              Leads Management
            </Link>

            <Link
              href="/admin/audits"
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-800 hover:text-white transition"
            >
              <FileCheck2 className="w-4 h-4 text-amber-400" />
              Digital Audits
            </Link>

            <Link
              href="/admin/proposals"
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-800 hover:text-white transition"
            >
              <FileText className="w-4 h-4 text-purple-400" />
              Proposals & Quotes
            </Link>

            <Link
              href="/admin/clients"
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-800 hover:text-white transition"
            >
              <Building2 className="w-4 h-4 text-blue-400" />
              Active Clients
            </Link>

            <Link
              href="/admin/projects"
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-800 hover:text-white transition"
            >
              <FolderKanban className="w-4 h-4 text-indigo-400" />
              Projects & Delivery
            </Link>

            <Link
              href="/admin/tasks"
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-800 hover:text-white transition"
            >
              <CheckSquare className="w-4 h-4 text-teal-400" />
              Task Board
            </Link>

            <Link
              href="/admin/deliverables"
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-800 hover:text-white transition"
            >
              <PackageCheck className="w-4 h-4 text-pink-400" />
              Deliverables & QA
            </Link>

            <Link
              href="/admin/reports"
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-800 hover:text-white transition"
            >
              <BarChart3 className="w-4 h-4 text-cyan-400" />
              Monthly Reports
            </Link>

            <Link
              href="/admin/support"
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-800 hover:text-white transition"
            >
              <HelpCircle className="w-4 h-4 text-yellow-400" />
              Support Inbox
            </Link>

            <Link
              href="/admin/team"
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-800 hover:text-white transition"
            >
              <ShieldCheck className="w-4 h-4 text-rose-400" />
              Team Directory
            </Link>

            <Link
              href="/admin/activity-logs"
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-800 hover:text-white transition"
            >
              <History className="w-4 h-4 text-slate-400" />
              Activity Logs
            </Link>

            <Link
              href="/admin/settings"
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-800 hover:text-white transition"
            >
              <Settings className="w-4 h-4 text-slate-400" />
              System Settings
            </Link>
          </nav>
        </div>

        {/* Footer controls */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-between">
          <div className="text-[11px] text-slate-400">
            <div>VyparX Operations</div>
            <div className="text-slate-500">v0.1.0 MVP</div>
          </div>
          <LogoutButton className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition" />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full bg-slate-900 text-slate-100 min-w-0">
        {children}
      </main>
    </div>
  );
}
