import { requireAdmin } from "@/lib/auth/roles";
import { Settings, Phone, Mail, MessageSquare, Database, ShieldCheck, Server } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function AdminSettingsPage() {
  const { user } = await requireAdmin();

  const phone = process.env.NEXT_PUBLIC_SUPPORT_PHONE || "+91 98765 43210";
  const email = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@vyparx.com";
  const whatsapp = process.env.NEXT_PUBLIC_SUPPORT_WHATSAPP || "+919876543210";

  return (
    <div className="max-w-4xl space-y-6 pb-12">
      <div className="bg-slate-800/80 p-6 sm:p-8 rounded-2xl border border-slate-700 shadow-sm space-y-2">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-700 px-3 py-0.5 text-xs font-bold text-slate-300">
          <Settings className="w-3.5 h-3.5" />
          SYSTEM CONFIGURATION
        </div>
        <h1 className="text-2xl font-bold text-white">Platform Settings & Integrations</h1>
        <p className="text-xs text-slate-400">
          Environment configuration, contact points, and future service integrations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Support Points */}
        <div className="bg-slate-800/90 p-6 rounded-2xl border border-slate-700 space-y-4">
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <Phone className="w-4 h-4 text-blue-400" />
            Central Support Contacts
          </h3>
          <p className="text-xs text-slate-400">Configured via system environment variables.</p>

          <div className="space-y-2 text-xs">
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex justify-between">
              <span className="text-slate-400">Direct Phone:</span>
              <strong className="text-white">{phone}</strong>
            </div>
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex justify-between">
              <span className="text-slate-400">WhatsApp Desk:</span>
              <strong className="text-white">{whatsapp}</strong>
            </div>
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex justify-between">
              <span className="text-slate-400">Support Email:</span>
              <strong className="text-white">{email}</strong>
            </div>
          </div>
        </div>

        {/* Database & Security */}
        <div className="bg-slate-800/90 p-6 rounded-2xl border border-slate-700 space-y-4">
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-400" />
            Database & ORM Status
          </h3>
          <p className="text-xs text-slate-400">Prisma ORM with PostgreSQL & SQLite adapters.</p>

          <div className="space-y-2 text-xs">
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex justify-between">
              <span className="text-slate-400">Session Mode:</span>
              <span className="text-emerald-400 font-bold">Encrypted JWT (Jose)</span>
            </div>
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex justify-between">
              <span className="text-slate-400">RBAC Enforcement:</span>
              <span className="text-emerald-400 font-bold">Server-Side Verified</span>
            </div>
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex justify-between">
              <span className="text-slate-400">Transaction Email:</span>
              <span className="text-blue-400 font-bold">Resend Integration Ready</span>
            </div>
          </div>
        </div>
      </div>

      {/* Future Integrations Checklist */}
      <div className="bg-slate-800/90 p-6 rounded-2xl border border-slate-700 space-y-4">
        <h3 className="font-bold text-white text-base flex items-center gap-2">
          <Server className="w-4 h-4 text-purple-400" />
          Future Service Abstraction Points
        </h3>
        <p className="text-xs text-slate-400">
          Clean service adapters designed for seamless API connection in Phase 2.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          {[
            { name: "Google Business API", status: "Coming Soon" },
            { name: "Google Search Console", status: "Coming Soon" },
            { name: "Instagram Graph API", status: "Coming Soon" },
            { name: "WhatsApp Cloud API", status: "Coming Soon" },
            { name: "Razorpay / Stripe Payments", status: "Coming Soon" },
            { name: "Shiprocket Logistics", status: "Coming Soon" },
            { name: "IndiaMART Webhooks", status: "Coming Soon" },
            { name: "AI Growth Engine (Gemini)", status: "Architecture Ready" },
          ].map((item) => (
            <div key={item.name} className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
              <div className="font-bold text-slate-200">{item.name}</div>
              <div className="text-[10px] text-blue-400">{item.status}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
