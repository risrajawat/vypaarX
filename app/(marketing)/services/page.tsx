import Link from "next/link";
import { Store, Search, ShieldCheck, Layers, Sparkles, ShoppingBag, BarChart3, Globe, ArrowRight } from "lucide-react";

export default function ServicesPage() {
  const services = [
    {
      icon: Store,
      title: "Website & Digital Catalog Development",
      badge: "Foundation",
      description: "High-speed, responsive websites tailored for local and regional businesses with WhatsApp ordering, product galleries, and mobile optimization.",
      features: ["Custom domain setup & SSL", "Mobile-first responsive UI", "WhatsApp direct inquiry integration", "Fast loading CDN deployment"],
    },
    {
      icon: Search,
      title: "Google Search & Local SEO",
      badge: "Discoverability",
      description: "Dominate search engine results in your target city and adjacent districts when customers look for your product category.",
      features: ["Local keyword optimization", "Google search console setup", "On-page metadata & schema", "Regional ranking strategy"],
    },
    {
      icon: ShieldCheck,
      title: "Google Business Profile Optimization",
      badge: "Trust & Maps",
      description: "Claim, verify, and optimize your Google Maps presence to capture high-intent local 'near me' searches.",
      features: ["Geo-tagged product photos", "Review generation funnels", "Business hours & direct call button", "Weekly Google updates"],
    },
    {
      icon: Layers,
      title: "Brand Identity & Visual Kit",
      badge: "Branding",
      description: "Elevate your visual perception from a local vendor to a trustworthy, premium consumer brand.",
      features: ["Logo refinement & vector files", "Brand color & typography guidelines", "Visiting card & letterhead designs", "Packaging & label consultation"],
    },
    {
      icon: Sparkles,
      title: "Social Media Strategy & Content",
      badge: "Engagement",
      description: "Build an active social presence that showcases your craftsmanship, behind-the-scenes stories, and product collections.",
      features: ["Monthly content calendar", "Product showcase templates", "Reels & video guidance", "Audience engagement playbook"],
    },
    {
      icon: ShoppingBag,
      title: "Online Sales & Inquiries Pipeline",
      badge: "Conversion",
      description: "Capture revenue 24/7 with seamless digital inquiry forms, payment gateway links, and catalog downloads.",
      features: ["UPI & Card payment links", "Lead notification to your phone", "Customer inquiry tracker", "Automated inquiry acknowledgment"],
    },
    {
      icon: BarChart3,
      title: "Growth Analytics & Monthly Reporting",
      badge: "Intelligence",
      description: "Transparent, easy-to-understand monthly reports that show you exactly how many people viewed, searched, and contacted your business.",
      features: ["Monthly performance report", "Search query insights", "Inquiry volume tracking", "Quarterly growth recommendations"],
    },
    {
      icon: Globe,
      title: "Pan-India & Global Expansion",
      badge: "Scale",
      description: "Take your products to buyers across all major Indian states and prepare for international export opportunities.",
      features: ["Multi-state shipping setup guidance", "International currency display", "Export documentation readiness", "Global marketplace onboarding"],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-16">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Modular Growth Services</span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Services Built for Local Business Realities
        </h1>
        <p className="text-base sm:text-lg text-slate-600">
          We combine technology, branding, and search visibility into transparent packages designed for real return on investment.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {services.map((srv) => (
          <div key={srv.title} className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <srv.icon className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
                  {srv.badge}
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mt-5">{srv.title}</h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">{srv.description}</p>
              <div className="mt-6 pt-6 border-t border-slate-100">
                <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-3">Key Deliverables</h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                  {srv.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <span className="text-blue-600 font-bold">✓</span> {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-slate-900 text-white p-8 text-center sm:p-12 space-y-4">
        <h2 className="text-2xl sm:text-3xl font-bold">Unsure which services your business needs first?</h2>
        <p className="text-slate-300 text-sm max-w-xl mx-auto">
          Take the 2-minute Digital Readiness Audit to discover your exact priority action steps.
        </p>
        <div className="pt-2">
          <Link
            href="/get-started"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition"
          >
            Start Free Audit
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
