"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function LogoutButton({ className }: { className?: string }) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      title="Sign Out"
      className={className || "p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-slate-100 transition"}
    >
      <LogOut className="w-4 h-4" />
    </button>
  );
}
