import Link from "next/link";
import { ArrowRight, CheckCircle2, ChevronRight, Sparkles } from "lucide-react";

export default function HowItWorksPage() {
  const steps = [
    {
      num: "01",
      title: "Discover & Assess",
      subtitle: "The Digital Readiness Audit",
      description: "You share details about your business, current customers, and growth goals. Our transparent scoring engine benchmarks your digital maturity from 0 to 100.",
      details: ["2-minute non-technical questionnaire", "Transparent point scoring engine", "Identification of top 3 revenue bottlenecks"],
    },
    {
      num: "02",
      title: "Strategy & Roadmap",
      subtitle: "Custom 6-Stage Execution Plan",
      description: "Based on your readiness score, VyparX automatically generates a custom 6-stage roadmap. You receive an itemized proposal with clear deliverables and pricing.",
      details: ["6-stage transformation milestones", "Fixed scope and transparent pricing", "One-click proposal review and acceptance"],
    },
    {
      num: "03",
      title: "Build & Establish Foundation",
      subtitle: "Professional Execution",
      description: "Our team designs and deploys your modern responsive website, refines your brand assets, and sets up your verified Google search and maps profile.",
      details: ["Mobile-first catalog website", "WhatsApp ordering integration", "Brand kit & Google Business optimization"],
    },
    {
      num: "04",
      title: "Client Portal & Approvals",
      subtitle: "You Are in Total Control",
      description: "Log into your dedicated VyparX client dashboard. View tasks, review visual mockups, approve deliverables with a single click, or request revisions with direct feedback.",
      details: ["Real-time milestone tracking", "One-click deliverable approval workflow", "Dedicated support ticket desk"],
    },
    {
      num: "05",
      title: "Grow, Report & Scale",
      subtitle: "Pan-India and Global Reach",
      description: "We deliver monthly performance reports detailing customer inquiries, search rankings, and traffic growth, guiding you on how to scale into national markets.",
      details: ["Monthly growth & inquiry reports", "Local & national SEO acceleration", "Cross-border export scaling guidance"],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-16">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600">The 5-Step Process</span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          How VyparX Works
        </h1>
        <p className="text-base sm:text-lg text-slate-600">
          A predictable, transparent system that turns local businesses into online market leaders.
        </p>
      </div>

      <div className="space-y-8 max-w-4xl mx-auto">
        {steps.map((s, idx) => (
          <div
            key={s.num}
            className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row gap-6 items-start"
          >
            <div className="h-14 w-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-extrabold text-xl shrink-0 shadow-md">
              {s.num}
            </div>
            <div className="space-y-3 flex-1">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">{s.subtitle}</span>
                <h3 className="text-xl font-bold text-slate-900 mt-0.5">{s.title}</h3>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">{s.description}</p>
              <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-600">
                {s.details.map((d, i) => (
                  <div key={i} className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>{d}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center pt-6">
        <Link
          href="/get-started"
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-4 text-base font-bold text-white shadow-lg hover:bg-blue-700 transition"
        >
          <Sparkles className="w-5 h-5" />
          Start Step 1: Free Business Audit
        </Link>
      </div>
    </div>
  );
}
