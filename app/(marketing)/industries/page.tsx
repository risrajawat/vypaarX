import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function IndustriesPage() {
  const industries = [
    {
      title: "Handicrafts & Artisanal Decor",
      challenge: "High artistic value and heritage appeal, but limited to local street tourists or unfair middleman commissions.",
      solution: "High-resolution digital catalog with artisan storytelling, pan-India direct WhatsApp ordering, and heritage branding.",
    },
    {
      title: "Fashion, Sarees & Handlooms",
      challenge: "Master weavers and boutique stores lose out to mass-produced fast fashion brands with modern websites.",
      solution: "Silk mark certification highlights, collection lookbooks, Instagram product showcases, and metro customer targeting.",
    },
    {
      title: "Food, Sweets & Organic Produce",
      challenge: "Famous local taste and recipes cannot reach NRI family orders or interstate gifting customers.",
      solution: "Festival gift hampers catalog, pre-booking inquiry forms, shelf-life and hygienic packaging highlights.",
    },
    {
      title: "Manufacturing, Fabrication & B2B",
      challenge: "Local workshops producing quality machine parts or packaging remain invisible on Google B2B searches.",
      solution: "Technical capability spec sheets, request-for-quote (RFQ) inquiry forms, and pan-India industrial SEO.",
    },
    {
      title: "Retail Stores & Traditional Jewelry",
      challenge: "Neighborhood customers check online designs first before visiting physical jewelry stores.",
      solution: "Google Business 360 virtual tour, review generation funnel, and WhatsApp video shopping appointment bookings.",
    },
    {
      title: "Beauty, Wellness & Salons",
      challenge: "Losing high-value bridal and organic spa bookings to chains with slick appointment booking engines.",
      solution: "Before/after visual portfolios, verified Google customer reviews, and instant appointment booking funnels.",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-16">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Tailored by Sector</span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Industries We Empower
        </h1>
        <p className="text-base sm:text-lg text-slate-600">
          Every industry has distinct buyer behaviors. We build custom growth playbooks for each category.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {industries.map((ind) => (
          <div key={ind.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">{ind.title}</h3>
              <div className="mt-4 space-y-3 text-xs">
                <div className="rounded-lg bg-red-50 p-3 text-slate-700">
                  <span className="font-bold text-red-600 block mb-1">Local Challenge:</span>
                  {ind.challenge}
                </div>
                <div className="rounded-lg bg-blue-50 p-3 text-slate-700">
                  <span className="font-bold text-blue-600 block mb-1">VyparX Solution:</span>
                  {ind.solution}
                </div>
              </div>
            </div>
            <Link
              href="/get-started"
              className="mt-6 flex items-center justify-between text-xs font-semibold text-blue-600 hover:text-blue-700 pt-3 border-t border-slate-100"
            >
              <span>Audit your {ind.title.split("&")[0]} business</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
