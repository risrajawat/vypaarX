import Link from "next/link";
import {
  ArrowRight,
  Globe,
  Search,
  CheckCircle2,
  TrendingUp,
  Store,
  Layers,
  ShoppingBag,
  BarChart3,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  HelpCircle,
  Package,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="space-y-24 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 md:pt-20 lg:pt-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-4 py-1.5 text-xs font-semibold text-blue-700">
              <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
              DIGITAL GROWTH PLATFORM FOR LOCAL & SMALL BUSINESSES
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
              Your Business Is Local. <br className="hidden sm:inline" />
              <span className="text-blue-600">Your Market Doesn&apos;t Have To Be.</span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto font-normal">
              We help good local businesses get discovered, trusted, and chosen online. Transform your local workshop or store into a pan-India brand.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/get-started"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3.5 text-base font-semibold text-white shadow-md hover:bg-blue-700 transition"
              >
                Get Started
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/how-it-works"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-6 py-3.5 text-base font-medium text-slate-700 hover:bg-slate-50 transition"
              >
                See How It Works
              </Link>
            </div>

            <div className="pt-8 flex items-center justify-center gap-8 text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Zero Technical Jargon</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Actionable Growth Engine</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Transparent Delivery</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE PROBLEM */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-red-100 bg-red-50/50 p-8 sm:p-12">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-wider text-red-600">The Problem</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2">
              Why Great Local Businesses Remain Digitally Invisible
            </h2>
            <p className="text-slate-600 mt-3 text-base">
              Thousands of local workshops, manufacturers, and retailers produce exceptional products with deep local reputation. Yet 90% are trapped inside a 3-kilometer radius because they lack:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <div className="font-semibold text-slate-900 flex items-center gap-2">
                <span className="text-red-500 font-bold">✕</span> No Modern Website
              </div>
              <p className="text-sm text-slate-500 mt-2">
                Customers outside your neighborhood cannot view your catalogue, pricing, or craft history.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <div className="font-semibold text-slate-900 flex items-center gap-2">
                <span className="text-red-500 font-bold">✕</span> Poor Google Discoverability
              </div>
              <p className="text-sm text-slate-500 mt-2">
                When buyers search for your product category, competitors with basic websites take all the inquiries.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <div className="font-semibold text-slate-900 flex items-center gap-2">
                <span className="text-red-500 font-bold">✕</span> No Online Inquiry Pipeline
              </div>
              <p className="text-sm text-slate-500 mt-2">
                Revenue stops the moment your physical store shutter closes for the evening.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. THE SOLUTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">The Solution</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            How VyparX Powers Your Digital Transformation
          </h2>
          <p className="text-slate-600 text-base">
            We don&apos;t just sell isolated tools or generic templates. We provide an end-to-end growth platform that takes you from a local shop to a national brand.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm hover:shadow-md transition">
            <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl mb-6">
              1
            </div>
            <h3 className="text-xl font-bold text-slate-900">Understand Your Digital Gap</h3>
            <p className="text-slate-600 text-sm mt-3 leading-relaxed">
              Take our structured Digital Readiness Audit. We evaluate your website, SEO, Google listing, and social proof to calculate your exact readiness score.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm hover:shadow-md transition">
            <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl mb-6">
              2
            </div>
            <h3 className="text-xl font-bold text-slate-900">Custom 6-Stage Roadmap</h3>
            <p className="text-slate-600 text-sm mt-3 leading-relaxed">
              Receive a step-by-step phased execution plan tailored to your business category and budget—from digital foundation to national marketing.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm hover:shadow-md transition">
            <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl mb-6">
              3
            </div>
            <h3 className="text-xl font-bold text-slate-900">Transparent Delivery & Portal</h3>
            <p className="text-slate-600 text-sm mt-3 leading-relaxed">
              Track project milestones, approve website designs, review deliverables, and see transparent progress reports in your dedicated client portal.
            </p>
          </div>
        </div>
      </section>

      {/* 4. GROWTH JOURNEY */}
      <section className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">The VyparX Framework</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold">The 6-Stage Growth Journey</h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Moving your business systematically from street-level to pan-India and global scale.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mt-12">
            {[
              { step: "01", name: "LOCAL", desc: "Physical reputation in home city" },
              { step: "02", name: "DIGITAL", desc: "Official website & brand identity" },
              { step: "03", name: "DISCOVERABLE", desc: "Top Google & search rankings" },
              { step: "04", name: "TRUSTED", desc: "Reviews, badges & social proof" },
              { step: "05", name: "NATIONAL", desc: "Pan-India orders & ad campaigns" },
              { step: "06", name: "GLOBAL", desc: "Cross-border export & scale" },
            ].map((stage, idx) => (
              <div
                key={stage.name}
                className="rounded-xl border border-slate-800 bg-slate-800/50 p-4 text-center relative overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <span className="text-xs font-mono text-blue-400 font-bold">{stage.step}</span>
                  <h4 className="text-base font-bold text-white mt-1">{stage.name}</h4>
                </div>
                <p className="text-xs text-slate-400 mt-2">{stage.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. SERVICES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Our Services</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            Everything Your Business Needs to Grow Online
          </h2>
          <p className="text-slate-600 text-base">
            Modular growth services designed specifically for small business unit economics.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {[
            { icon: Store, title: "Website Development", desc: "High-speed, mobile-first web catalog with direct WhatsApp orders." },
            { icon: Search, title: "Google & Local SEO", desc: "Rank at the top for local 'near me' and product category searches." },
            { icon: ShieldCheck, title: "Google Business Optimization", desc: "Verified listing, geo-tagged photos, and review acceleration funnels." },
            { icon: Layers, title: "Brand Identity", desc: "Professional logos, color palettes, and social media template kits." },
            { icon: Sparkles, title: "Social Media Strategy", desc: "Content calendars, reels strategy, and visual product showcases." },
            { icon: ShoppingBag, title: "Online Sales & Inquiries", desc: "Direct ordering drawers, catalog downloads, and payment links." },
            { icon: BarChart3, title: "Growth Analytics", desc: "Clear monthly reports on traffic, leads, and customer inquiries." },
            { icon: Globe, title: "Global Expansion", desc: "Export preparation, international SEO, and multi-currency readiness." },
          ].map((srv) => (
            <div
              key={srv.title}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:border-blue-400 hover:shadow-md transition flex flex-col"
            >
              <div className="h-10 w-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                <srv.icon className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">{srv.title}</h3>
              <p className="text-sm text-slate-500 mt-2 flex-1">{srv.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. INDUSTRIES */}
      <section className="bg-slate-100/70 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Industries</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Built for India&apos;s Real Economic Backbone
            </h2>
            <p className="text-slate-600 text-base">
              Customized digital strategies tailored to how buyers in each industry make purchasing decisions.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12">
            {[
              { name: "Handicrafts & Decor", desc: "Artisans, woodwork, jaali & ceramics" },
              { name: "Fashion & Handlooms", desc: "Silk sarees, ethnic wear & textiles" },
              { name: "Food & Sweet Shops", desc: "Local eateries, sweets & organic foods" },
              { name: "Manufacturing & B2B", desc: "Machinery, packaging & fabrication" },
              { name: "Retail & Jewelry", desc: "Traditional jewelry & boutique retail" },
              { name: "Beauty & Wellness", desc: "Salons, spas & organic cosmetics" },
              { name: "Home Services", desc: "Interior design, plumbing & carpentry" },
              { name: "Professional Services", desc: "Consultants, clinics & regional agencies" },
            ].map((ind) => (
              <div key={ind.name} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <h4 className="font-bold text-slate-900 text-sm">{ind.name}</h4>
                <p className="text-xs text-slate-500 mt-1">{ind.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">The Process</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            How Working With VyparX Works
          </h2>
          <p className="text-slate-600 text-base">
            5 clear steps with 100% visibility from Day 1.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mt-12">
          {[
            { step: "01", title: "Discover", desc: "Complete business profile & take free audit" },
            { step: "02", title: "Plan", desc: "Review growth roadmap & transparent proposal" },
            { step: "03", title: "Build", desc: "We design website, brand kit & Google presence" },
            { step: "04", title: "Optimize", desc: "Approve deliverables & launch SEO funnels" },
            { step: "05", title: "Expand", desc: "Track growth reports & scale to new markets" },
          ].map((item) => (
            <div key={item.step} className="rounded-xl border border-slate-200 bg-white p-5 text-center flex flex-col items-center">
              <span className="text-xs font-bold font-mono text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                Step {item.step}
              </span>
              <h4 className="font-bold text-slate-900 mt-3">{item.title}</h4>
              <p className="text-xs text-slate-500 mt-2">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 8. SAMPLE / DEMO CASE STUDIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-blue-200 bg-blue-50/40 p-8 sm:p-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="inline-block rounded bg-amber-100 border border-amber-300 px-2 py-0.5 text-[11px] font-bold text-amber-800 uppercase tracking-wide">
                DEMO / SAMPLE CASE STUDIES ONLY
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2">
                Simulated Transformation Journeys
              </h2>
              <p className="text-slate-600 text-sm mt-1">
                Illustrative examples showing how local businesses scale with VyparX.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <span className="text-xs font-semibold text-blue-600">Sample: Jaipur Handicrafts Workshop</span>
              <h3 className="text-lg font-bold text-slate-900 mt-1">Sharma Handicrafts & Woodcrafts</h3>
              <p className="text-sm text-slate-600 mt-2">
                <strong>Before:</strong> Walk-in buyers only, no website, zero inquiries outside Jaipur. <br />
                <strong>After VyparX:</strong> Mobile catalog website, #1 Google Maps ranking in category, pan-India WhatsApp orders.
              </p>
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Category: Handicrafts</span>
                <span className="font-semibold text-emerald-600">Simulated Readiness Score: 64 → 91</span>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <span className="text-xs font-semibold text-blue-600">Sample: Varanasi Handloom Weavers</span>
              <h3 className="text-lg font-bold text-slate-900 mt-1">Artisan Heritage Silks</h3>
              <p className="text-sm text-slate-600 mt-2">
                <strong>Before:</strong> Dependent on physical middlemen with high commission cuts. <br />
                <strong>After VyparX:</strong> Direct brand website, Silk Mark certified visual kit, direct retail inquiries from Delhi & Mumbai.
              </p>
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Category: Fashion & Textiles</span>
                <span className="font-semibold text-emerald-600">Simulated Readiness Score: 82/100</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. PRICING PACKAGES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Transparent Pricing</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            Simple Service Packages
          </h2>
          <p className="text-slate-600 text-base">
            No hidden costs. Built specifically for local business growth budgets.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {/* Starter */}
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Digital Foundation</h3>
              <p className="text-xs text-slate-500 mt-1">For businesses starting their online presence</p>
              <div className="mt-4 flex items-baseline">
                <span className="text-3xl font-extrabold text-slate-900">₹14,999</span>
                <span className="text-xs text-slate-500 ml-1">one-time</span>
              </div>
              <ul className="mt-6 space-y-3 text-sm text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  <span>Responsive 5-Page Catalog Website</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  <span>WhatsApp Direct Inquiry Drawer</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  <span>Google Business Profile Setup</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  <span>High-Res Logo & Social Assets</span>
                </li>
              </ul>
            </div>
            <Link
              href="/get-started"
              className="mt-8 block text-center rounded-lg border border-slate-300 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50 transition"
            >
              Get Started
            </Link>
          </div>

          {/* Growth - Highlighted */}
          <div className="rounded-2xl border-2 border-blue-600 bg-white p-8 shadow-lg flex flex-col justify-between relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[11px] font-bold px-3 py-0.5 rounded-full uppercase">
              Most Popular
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Local & National Growth</h3>
              <p className="text-xs text-slate-500 mt-1">For businesses aiming to scale pan-India</p>
              <div className="mt-4 flex items-baseline">
                <span className="text-3xl font-extrabold text-slate-900">₹29,999</span>
                <span className="text-xs text-slate-500 ml-1">one-time + setup</span>
              </div>
              <ul className="mt-6 space-y-3 text-sm text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  <span>Everything in Foundation package</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  <span>Comprehensive Local & National SEO</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  <span>Automated Customer Review Funnel</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  <span>Monthly Growth & Analytics Reports</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  <span>Dedicated VyparX Account Manager</span>
                </li>
              </ul>
            </div>
            <Link
              href="/get-started"
              className="mt-8 block text-center rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition shadow-sm"
            >
              Start Free Audit
            </Link>
          </div>

          {/* Scale */}
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Global & E-Commerce</h3>
              <p className="text-xs text-slate-500 mt-1">Custom multi-currency & export expansion</p>
              <div className="mt-4 flex items-baseline">
                <span className="text-3xl font-extrabold text-slate-900">Custom</span>
                <span className="text-xs text-slate-500 ml-1">based on scope</span>
              </div>
              <ul className="mt-6 space-y-3 text-sm text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  <span>Full E-commerce & Payment Integration</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  <span>Cross-Border Logistics & Shipping</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  <span>Global Search Visibility Strategy</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  <span>Custom CRM & Inventory Linkage</span>
                </li>
              </ul>
            </div>
            <Link
              href="/contact"
              className="mt-8 block text-center rounded-lg border border-slate-300 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50 transition"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      {/* 10. FAQ */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Common Questions</span>
          <h2 className="text-3xl font-bold text-slate-900">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4">
          {[
            {
              q: "I don't know anything about technology. Can I still use VyparX?",
              a: "Absolutely. VyparX is built specifically for business owners who want results without having to learn coding, SEO jargon, or server setups. Our team and platform handle the heavy lifting while you review and approve everything via your simple client portal.",
            },
            {
              q: "How does the Free Business Audit work?",
              a: "You answer a few simple questions about your current business presence (website, Google, social media, customer discovery). Our scoring engine analyzes your answers and instantly gives you a Digital Readiness Score (0-100) along with a prioritized 6-stage growth roadmap.",
            },
            {
              q: "How long does it take to launch my website?",
              a: "Most Phase 1 Digital Foundation projects are launched within 10 to 14 business days after you approve the initial design and brand kit.",
            },
            {
              q: "Do I own my domain and website?",
              a: "Yes, 100%. All brand assets, domain names, content, and catalog data belong entirely to you.",
            },
          ].map((faq, i) => (
            <div key={i} className="rounded-xl border border-slate-200 bg-white p-5">
              <h4 className="font-bold text-slate-900 text-base">{faq.q}</h4>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 11. FINAL CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-slate-900 text-white p-8 sm:p-14 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Ready to Take Your Business Pan-India?
          </h2>
          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto">
            Find out where your business stands today and get your personalized growth roadmap.
          </p>
          <div className="pt-2">
            <Link
              href="/get-started"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-4 text-base font-bold text-white shadow-lg hover:bg-blue-700 transition transform hover:-translate-y-0.5"
            >
              <Sparkles className="w-5 h-5" />
              Get Your Free Business Audit
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
