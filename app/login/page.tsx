"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/form-elements";
import { AlertCircle, ArrowRight, Lock, Mail, ShieldAlert, Sparkles, UserCheck } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(
    searchParams.get("error") === "unauthorized_admin"
      ? "Admin access required. Please use the Admin Portal."
      : ""
  );

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
        setError(data.error || "Login failed. Please verify your credentials.");
        setLoading(false);
        return;
      }

      router.push(data.nextUrl || "/business/dashboard");
      router.refresh();
    } catch (err) {
      setError("An unexpected network error occurred. Please try again.");
      setLoading(false);
    }
  };

  const fillDemo = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("password123");
    setError("");
  };

  return (
    <div className="bg-white py-8 px-6 shadow-xl rounded-2xl sm:px-10 border border-slate-200 space-y-6">
      {error && (
        <div className="rounded-lg bg-red-50 p-3.5 border border-red-200 flex items-start gap-2.5 text-xs text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email Address</Label>
          <div className="relative">
            <Input
              id="email"
              type="email"
              required
              placeholder="name@business.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-9"
            />
            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link href="/forgot-password" className="text-xs text-blue-600 hover:underline">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-9"
            />
            <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          </div>
        </div>

        <Button type="submit" variant="brand" className="w-full" isLoading={loading}>
          Sign In
          <ArrowRight className="w-4 h-4 ml-1.5" />
        </Button>
      </form>

      {/* Demo Quick-Fill Helpers for Testing */}
      <div className="pt-4 border-t border-slate-100">
        <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
          Demo Quick-Fill Credentials
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => fillDemo("client@demo.vyparx.local")}
            className="text-left p-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 text-xs transition"
          >
            <div className="font-bold text-slate-800">Active Client</div>
            <div className="text-[10px] text-slate-500 truncate">Artisan Heritage Silks</div>
          </button>

          <button
            type="button"
            onClick={() => fillDemo("business@demo.vyparx.local")}
            className="text-left p-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 text-xs transition"
          >
            <div className="font-bold text-slate-800">New Prospect</div>
            <div className="text-[10px] text-slate-500 truncate">Sharma Handicrafts</div>
          </button>
        </div>
      </div>

      <div className="text-center pt-2 text-xs text-slate-500">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-blue-600 font-semibold hover:underline">
          Start Free Business Onboarding
        </Link>
      </div>

      <div className="border-t border-slate-100 pt-3 text-center">
        <Link
          href="/admin/login"
          className="text-[11px] text-slate-400 hover:text-slate-600 flex items-center justify-center gap-1"
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          VyparX Internal Team / Admin Login
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <Link href="/" className="inline-flex items-center gap-2">
          <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-sm">
            VX
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-slate-900">
            Vypar<span className="text-blue-600">X</span>
          </span>
        </Link>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Client & Business Login
        </h2>
        <p className="text-xs text-slate-500">
          Sign in to access your business growth hub or client project dashboard
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <Suspense fallback={<div className="p-8 text-center text-sm text-slate-400">Loading login...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
