import Link from "next/link";
import { ArrowRight, Target, Shield, HeartHandshake, Compass } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-16">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Our Mission</span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Grow Local. Go Further.
        </h1>
        <p className="text-base sm:text-lg text-slate-600">
          We believe India&apos;s best products and crafts shouldn&apos;t remain trapped in local streets simply because digital agencies charge fortune fees or speak in confusing tech jargon.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Bridging the Digital Divide for Real Business Owners
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Local business owners are masters of product quality, client relationships, and craftsmanship. But they are often overwhelmed by complex web hosting, confusing SEO checklists, expensive ad agencies, and fragmented freelance contractors.
          </p>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            VyparX was founded to solve this single problem: provide an honest, end-to-end digital growth operating system where local businesses get assessed transparently, receive predictable roadmap deliverables, and scale with total peace of mind.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm space-y-3">
            <Target className="w-8 h-8 text-blue-600" />
            <h3 className="font-bold text-slate-900 text-base">Outcome Driven</h3>
            <p className="text-xs text-slate-500">We prioritize actual buyer inquiries over vanity clicks and confusing metrics.</p>
          </div>
          <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm space-y-3">
            <Shield className="w-8 h-8 text-blue-600" />
            <h3 className="font-bold text-slate-900 text-base">Zero Tech Jargon</h3>
            <p className="text-xs text-slate-500">Every deliverable and report is written in plain, human-friendly terms.</p>
          </div>
          <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm space-y-3">
            <HeartHandshake className="w-8 h-8 text-blue-600" />
            <h3 className="font-bold text-slate-900 text-base">Total Ownership</h3>
            <p className="text-xs text-slate-500">You own 100% of your domain, website assets, and customer databases.</p>
          </div>
          <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm space-y-3">
            <Compass className="w-8 h-8 text-blue-600" />
            <h3 className="font-bold text-slate-900 text-base">Pan-India Vision</h3>
            <p className="text-xs text-slate-500">Building bridges from regional workshops to metropolitan and global markets.</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-8 sm:p-12 text-center space-y-4">
        <h3 className="text-2xl font-bold text-slate-900">Ready to start your growth journey?</h3>
        <p className="text-slate-600 text-sm max-w-xl mx-auto">
          Join hundreds of local businesses discovering their full market potential online.
        </p>
        <div className="pt-2">
          <Link
            href="/get-started"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition"
          >
            Get Started with VyparX
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
