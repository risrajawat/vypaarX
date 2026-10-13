import { requireProspect } from "@/lib/auth/roles";
import Link from "next/link";
import {
  LayoutDashboard,
  Compass,
  FileCheck2,
  FileText,
  Building2,
  PhoneCall,
  LogOut,
  Sparkles,
} from "lucide-react";
import { LogoutButton } from "@/components/auth/logout-button";

export const dynamic = "force-dynamic";

export default async function BusinessPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, dbUser, business } = await requireProspect();

  const phone = process.env.NEXT_PUBLIC_SUPPORT_PHONE || "+91 98765 43210";

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0">
        <div>
          {/* Brand Header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-base shadow-sm">
                VX
              </div>
              <span className="font-extrabold text-lg tracking-tight text-slate-900">
                Vypar<span className="text-blue-600">X</span>
              </span>
            </Link>
            <span className="text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full uppercase">
              Prospect
            </span>
          </div>

          {/* Business Info snippet */}
          <div className="px-5 py-4 bg-slate-50 border-b border-slate-100">
            <div className="text-xs text-slate-500 font-medium">Active Business:</div>
            <div className="text-sm font-bold text-slate-900 truncate mt-0.5">
              {business?.name || "My Business"}
            </div>
            <div className="text-xs text-slate-500 truncate">{business?.city}, {business?.state}</div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            <Link
              href="/business/dashboard"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-blue-600 transition"
            >
              <LayoutDashboard className="w-4 h-4 text-slate-500" />
              Growth Hub
            </Link>

            <Link
              href="/business/audit"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-blue-600 transition"
            >
              <FileCheck2 className="w-4 h-4 text-slate-500" />
              Digital Audit
            </Link>

            <Link
              href="/business/roadmap"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-blue-600 transition"
            >
              <Compass className="w-4 h-4 text-slate-500" />
              Growth Roadmap
            </Link>

            <Link
              href="/business/proposals"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-blue-600 transition"
            >
              <FileText className="w-4 h-4 text-slate-500" />
              Proposals & Quotes
            </Link>

            <Link
              href="/business/profile"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-blue-600 transition"
            >
              <Building2 className="w-4 h-4 text-slate-500" />
              Business Profile
            </Link>
          </nav>
        </div>

        {/* Footer Support & User Controls */}
        <div className="p-4 border-t border-slate-100 space-y-3">
          <div className="rounded-xl bg-blue-50/70 p-3 border border-blue-100 text-xs space-y-1.5">
            <div className="font-bold text-blue-900 flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5 text-blue-600" />
              Need Growth Help?
            </div>
            <p className="text-slate-600 text-[11px]">Direct Line: {phone}</p>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-slate-800 truncate">{dbUser.name}</span>
              <span className="text-[10px] text-slate-500 truncate">{dbUser.email}</span>
            </div>
            <LogoutButton />
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
