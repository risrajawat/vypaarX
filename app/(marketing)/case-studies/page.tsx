import Link from "next/link";
import { ArrowRight, AlertTriangle } from "lucide-react";

export default function CaseStudiesPage() {
  const caseStudies = [
    {
      title: "Sharma Handicrafts & Woodcrafts",
      location: "Jaipur, Rajasthan",
      sector: "Handicrafts & Home Decor",
      summary: "Traditional teak wood craftsmen transitioned from walk-in only sales to a pan-India catalog with WhatsApp checkout.",
      readinessBefore: 28,
      readinessAfter: 84,
      deliverables: ["Custom Next.js Web Catalog", "Google Business 360 Verification", "Jaipur Teak Craft Brand Kit"],
      keyOutcome: "Simulated result: Received inquiries from interior designers in Mumbai and Bangalore within 30 days of Google optimization.",
    },
    {
      title: "Artisan Heritage Silks",
      location: "Varanasi, Uttar Pradesh",
      sector: "Fashion & Handlooms",
      summary: "Master handloom weaver cooperative built a direct-to-consumer digital identity to reduce dependence on tourist wholesale agents.",
      readinessBefore: 35,
      readinessAfter: 89,
      deliverables: ["Silk Mark Verified Digital Store", "Banarasi Saree Lookbook", "Instagram Launch Strategy"],
      keyOutcome: "Simulated result: Increased direct bridal saree inquiries and eliminated 25% middleman commission markups.",
    },
    {
      title: "Malabar Spice & Ayurvedic Naturals",
      location: "Kochi, Kerala",
      sector: "Organic Food & Wellness",
      summary: "Single-origin organic spice farm scaled from local grocery supply to interstate subscription gift boxes.",
      readinessBefore: 42,
      readinessAfter: 92,
      deliverables: ["E-Commerce Direct Ordering", "FSSAI & Organic Certification Highlights", "National SEO Funnel"],
      keyOutcome: "Simulated result: Expanded customer base across 14 Indian states with recurring quarterly kitchen supply orders.",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-50 px-4 py-1 text-xs font-bold text-amber-800">
          <AlertTriangle className="w-3.5 h-3.5" />
          CLEARLY MARKED DEMO / SAMPLE CASE STUDIES
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Simulated Case Studies
        </h1>
        <p className="text-base sm:text-lg text-slate-600">
          These case studies represent representative development simulations illustrating the VyparX growth methodology and delivery model.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {caseStudies.map((cs) => (
          <div key={cs.title} className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">{cs.sector}</span>
              <h3 className="text-xl font-bold text-slate-900 mt-1">{cs.title}</h3>
              <p className="text-xs text-slate-500">{cs.location}</p>
              <p className="text-sm text-slate-600 mt-4 leading-relaxed">{cs.summary}</p>

              <div className="mt-6 rounded-xl bg-slate-50 p-4 border border-slate-100">
                <div className="text-xs font-semibold text-slate-700 mb-2">Simulated Readiness Score:</div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Before: {cs.readinessBefore}/100</span>
                  <span className="font-bold text-blue-600">→</span>
                  <span className="font-bold text-emerald-600">After: {cs.readinessAfter}/100</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full mt-2 overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${cs.readinessAfter}%` }} />
                </div>
              </div>

              <div className="mt-6">
                <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-2">VyparX Deliverables</h4>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  {cs.deliverables.map((d, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <span className="text-blue-600 font-bold">✓</span> {d}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500 italic bg-amber-50/50 p-3 rounded-lg border border-amber-100">
              {cs.keyOutcome}
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-blue-600 text-white p-8 text-center sm:p-12 space-y-4">
        <h2 className="text-2xl sm:text-3xl font-bold">Want to see your business simulated roadmap?</h2>
        <p className="text-blue-100 text-sm max-w-xl mx-auto">
          Complete the digital readiness assessment to get your customized score and roadmap in under 2 minutes.
        </p>
        <div className="pt-2">
          <Link
            href="/get-started"
            className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-blue-900 hover:bg-blue-50 transition shadow-sm"
          >
            Start Free Assessment
            <ArrowRight className="w-4 h-4 text-blue-600" />
          </Link>
        </div>
      </div>
    </div>
  );
}
