import Link from "next/link";
import { ArrowRight, UserCheck, Sparkles, Building2 } from "lucide-react";

export default function GetStartedPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <Link href="/" className="inline-flex items-center gap-2">
          <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-sm">
            VX
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-slate-900">
            Vypar<span className="text-blue-600">X</span>
          </span>
        </Link>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Welcome to VyparX
        </h2>
        <p className="text-sm text-slate-600">
          Are you already working with VyparX?
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg px-4">
        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl sm:px-10 border border-slate-200 space-y-6">
          {/* Option 1: Existing Customer */}
          <Link
            href="/login"
            className="group block p-5 rounded-xl border-2 border-slate-200 hover:border-blue-600 bg-white hover:bg-blue-50/40 transition duration-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-slate-100 group-hover:bg-blue-100 text-slate-700 group-hover:text-blue-600 flex items-center justify-center transition">
                  <UserCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-700">
                    Yes, I&apos;m a VyparX customer
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Access your active projects, deliverables & growth dashboard
                  </p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition" />
            </div>
          </Link>

          {/* Option 2: New Business */}
          <Link
            href="/signup"
            className="group block p-5 rounded-xl border-2 border-blue-600 bg-blue-50/40 hover:bg-blue-50 transition duration-200 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="inline-block bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide mb-1">
                    Free Business Audit
                  </div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-700">
                    No, I&apos;m new to VyparX
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Create your profile & start your free Digital Readiness Audit
                  </p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-blue-600 group-hover:translate-x-1 transition" />
            </div>
          </Link>

          <div className="pt-4 border-t border-slate-100 text-center">
            <Link href="/" className="text-xs font-medium text-slate-500 hover:text-slate-700">
              ← Back to homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
