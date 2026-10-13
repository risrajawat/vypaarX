import { requireClient } from "@/lib/auth/roles";
import Link from "next/link";
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  PackageCheck,
  BarChart3,
  HelpCircle,
  Building2,
  PhoneCall,
  Sparkles,
  Compass,
  Bell,
} from "lucide-react";
import { LogoutButton } from "@/components/auth/logout-button";
import { ClientNotificationBell } from "@/components/client/notification-bell";

export const dynamic = "force-dynamic";

export default async function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, dbUser, business } = await requireClient();
  const phone = process.env.NEXT_PUBLIC_SUPPORT_PHONE || "+91 98765 43210";

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-900 text-white flex flex-col justify-between shrink-0">
        <div>
          {/* Brand Header */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-base shadow-sm">
                VX
              </div>
              <span className="font-extrabold text-lg tracking-tight text-white">
                Vypar<span className="text-blue-400">X</span>
              </span>
            </Link>
            <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full uppercase">
              Client
            </span>
          </div>

          {/* Active Client Business Snippet */}
          <div className="px-5 py-3.5 bg-slate-800/60 border-b border-slate-800">
            <div className="text-[11px] text-slate-400 font-medium">Active Portal:</div>
            <div className="text-sm font-bold text-white truncate mt-0.5">
              {business.name}
            </div>
            <div className="text-xs text-blue-400 font-medium mt-0.5 flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Stage: {business.growthStage?.replace("_", " ")}
            </div>
          </div>

          {/* Nav items */}
          <nav className="p-3 space-y-1 text-slate-300">
            <Link
              href="/client/dashboard"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 hover:text-white transition"
            >
              <LayoutDashboard className="w-4 h-4 text-blue-400" />
              Overview
            </Link>

            <Link
              href="/client/projects"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 hover:text-white transition"
            >
              <FolderKanban className="w-4 h-4 text-blue-400" />
              Projects
            </Link>

            <Link
              href="/client/tasks"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 hover:text-white transition"
            >
              <CheckSquare className="w-4 h-4 text-blue-400" />
              Tasks & Progress
            </Link>

            <Link
              href="/client/deliverables"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 hover:text-white transition"
            >
              <PackageCheck className="w-4 h-4 text-blue-400" />
              Deliverables & Approvals
            </Link>

            <Link
              href="/client/reports"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 hover:text-white transition"
            >
              <BarChart3 className="w-4 h-4 text-blue-400" />
              Growth Reports
            </Link>

            <Link
              href="/client/support"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 hover:text-white transition"
            >
              <HelpCircle className="w-4 h-4 text-blue-400" />
              Support & Helpdesk
            </Link>

            <Link
              href="/client/profile"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 hover:text-white transition"
            >
              <Building2 className="w-4 h-4 text-blue-400" />
              My Business Profile
            </Link>
          </nav>
        </div>

        {/* Support Callout & User Footer */}
        <div className="p-4 border-t border-slate-800 space-y-3">
          <div className="rounded-xl bg-slate-800 p-3 border border-slate-700 text-xs space-y-1">
            <div className="font-bold text-white flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5 text-blue-400" />
              Dedicated Manager
            </div>
            <p className="text-slate-400 text-[11px]">{phone}</p>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-white truncate">{dbUser.name}</span>
              <span className="text-[10px] text-slate-400 truncate">{dbUser.email}</span>
            </div>
            <LogoutButton className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition" />
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar with notification bell */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-slate-800">
              {business.name}
            </h2>
            <span className="text-xs text-slate-400 hidden sm:inline">• Active Client Portal</span>
          </div>
          <ClientNotificationBell />
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
