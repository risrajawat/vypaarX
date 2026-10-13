import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export function MarketingNavbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
            VX
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-xl tracking-tight text-slate-900 leading-none">
              Vypar<span className="text-blue-600">X</span>
            </span>
            <span className="text-[10px] text-slate-500 font-medium tracking-wide">
              GROW LOCAL. GO FURTHER.
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <Link href="/services" className="hover:text-blue-600 transition">
            Services
          </Link>
          <Link href="/how-it-works" className="hover:text-blue-600 transition">
            How It Works
          </Link>
          <Link href="/industries" className="hover:text-blue-600 transition">
            Industries
          </Link>
          <Link href="/case-studies" className="hover:text-blue-600 transition">
            Case Studies
          </Link>
          <Link href="/about" className="hover:text-blue-600 transition">
            About
          </Link>
          <Link href="/contact" className="hover:text-blue-600 transition">
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm font-medium text-slate-700 hover:text-blue-600 px-3 py-2 transition"
          >
            Client Login
          </Link>
          <Link
            href="/get-started"
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition"
          >
            <Sparkles className="w-4 h-4" />
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}
