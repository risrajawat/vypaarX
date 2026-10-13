"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/form-elements";
import { AlertCircle, ArrowRight, Lock, Mail, ShieldAlert, ShieldCheck } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Invalid administrator credentials.");
        setLoading(false);
        return;
      }

      if (data.user?.role !== "ADMIN" && data.user?.role !== "TEAM_MEMBER") {
        setError("This account does not have internal team or administrator privileges.");
        setLoading(false);
        return;
      }

      router.push("/admin/dashboard");
      router.refresh();
    } catch (err) {
      setError("An unexpected network error occurred. Please try again.");
      setLoading(false);
    }
  };

  const fillDemo = (roleEmail: string) => {
    setEmail(roleEmail);
    setPassword("password123");
    setError("");
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <Link href="/" className="inline-flex items-center gap-2">
          <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
            VX
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-white">
            Vypar<span className="text-blue-500">X</span>
          </span>
        </Link>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-800 border border-slate-700 px-3 py-1 text-xs font-semibold text-blue-400">
          <ShieldAlert className="w-3.5 h-3.5" />
          INTERNAL ADMINISTRATION PORTAL
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-white mt-1">
          VyparX Operations Access
        </h2>
        <p className="text-xs text-slate-400">
          Authorized personnel only: Lead management, client delivery & project controls
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-slate-800/90 py-8 px-6 shadow-2xl rounded-2xl sm:px-10 border border-slate-700 space-y-6">
          {error && (
            <div className="rounded-lg bg-red-950/80 p-3.5 border border-red-800 flex items-start gap-2.5 text-xs text-red-300">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-slate-200">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-slate-200">Admin / Team Email</Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  required
                  placeholder="admin@demo.vyparx.local"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9 bg-slate-900/90 border-slate-700 text-white placeholder:text-slate-500"
                />
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-slate-200">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9 bg-slate-900/90 border-slate-700 text-white placeholder:text-slate-500"
                />
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              </div>
            </div>

            <Button type="submit" variant="brand" className="w-full bg-blue-600 hover:bg-blue-500" isLoading={loading}>
              Sign In to Admin Operations
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </form>

          {/* Quick Demo Credentials */}
          <div className="pt-4 border-t border-slate-700">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Demo Operations Accounts
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => fillDemo("admin@demo.vyparx.local")}
                className="text-left p-2.5 rounded-lg border border-slate-700 bg-slate-900/80 hover:bg-slate-700 text-xs transition"
              >
                <div className="font-bold text-white flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                  Admin
                </div>
                <div className="text-[10px] text-slate-400 truncate">Rishabh (Full Access)</div>
              </button>

              <button
                type="button"
                onClick={() => fillDemo("team@demo.vyparx.local")}
                className="text-left p-2.5 rounded-lg border border-slate-700 bg-slate-900/80 hover:bg-slate-700 text-xs transition"
              >
                <div className="font-bold text-white flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Team Member
                </div>
                <div className="text-[10px] text-slate-400 truncate">Ananya (Delivery)</div>
              </button>
            </div>
          </div>

          <div className="text-center pt-2 text-xs text-slate-400">
            Client or prospect?{" "}
            <Link href="/login" className="text-blue-400 font-semibold hover:underline">
              Go to Client Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
