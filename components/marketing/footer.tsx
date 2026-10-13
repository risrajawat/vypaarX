import Link from "next/link";

export function MarketingFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-white text-slate-600 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-base shadow-sm">
                VX
              </div>
              <span className="font-extrabold text-xl tracking-tight text-slate-900">
                Vypar<span className="text-blue-600">X</span>
              </span>
            </div>
            <p className="text-sm text-slate-500 max-w-sm">
              We help good local businesses get discovered, trusted, and chosen online. Your business is local. Your market doesn&apos;t have to be.
            </p>
            <div className="pt-2 text-xs text-slate-400">
              <p>Tagline: &ldquo;GROW LOCAL. GO FURTHER.&rdquo;</p>
              <p className="mt-1">Jaipur • Varanasi • Bengaluru • Pan-India</p>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-4">
              Services
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/services" className="hover:text-blue-600 transition">
                  Website Development
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-blue-600 transition">
                  Google & Local SEO
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-blue-600 transition">
                  Brand Identity
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-blue-600 transition">
                  Social Media Strategy
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-blue-600 transition">
                  Pan-India & Global Scale
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-4">
              Platform
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/get-started" className="hover:text-blue-600 transition">
                  Free Business Audit
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-blue-600 transition">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/case-studies" className="hover:text-blue-600 transition">
                  Case Studies (Demo)
                </Link>
              </li>
              <li>
                <Link href="/industries" className="hover:text-blue-600 transition">
                  Industries We Support
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-blue-600 transition">
                  Our Mission
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-4">
              Portals & Access
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/login" className="hover:text-blue-600 transition">
                  Client Portal
                </Link>
              </li>
              <li>
                <Link href="/get-started" className="hover:text-blue-600 transition">
                  New Business Onboarding
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="hover:text-blue-600 text-slate-400 transition">
                  VyparX Team Login
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-blue-600 transition">
                  Support & Inquiries
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-200 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {currentYear} VyparX Technologies. All rights reserved.</p>
          <div className="flex gap-6 mt-4 sm:mt-0">
            <Link href="/about" className="hover:underline">
              Privacy Policy
            </Link>
            <Link href="/about" className="hover:underline">
              Terms of Service
            </Link>
            <Link href="/contact" className="hover:underline">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
