import prisma from "@/lib/db/prisma";
import { AuditResult } from "./audit-engine";

export async function generateBusinessRoadmap(businessId: string, businessName: string, auditResult: AuditResult) {
  // Check if roadmap already exists
  const existing = await prisma.roadmap.findFirst({
    where: { businessId },
  });

  if (existing) {
    // Delete existing stages to rebuild fresh roadmap
    await prisma.roadmapStage.deleteMany({
      where: { roadmapId: existing.id },
    });
    await prisma.roadmap.delete({
      where: { id: existing.id },
    });
  }

  const roadmap = await prisma.roadmap.create({
    data: {
      businessId,
      title: `${businessName} Growth Roadmap`,
      description: `Tailored 6-phase digital transformation and scaling roadmap based on Digital Readiness Score (${auditResult.overallScore}/100).`,
    },
  });

  const stages = [
    {
      title: "Phase 1: Digital Foundation",
      description: "Establish your official online home with brand styling, domain setup, and a high-converting responsive website.",
      order: 1,
      status: auditResult.websiteScore < 15 ? "IN_PROGRESS" : "COMPLETED",
      priority: "HIGH",
      recommendedServices: JSON.stringify(["Website Development", "Brand Identity Kit", "Domain & Hosting Setup"]),
      estimatedWeeks: 2,
    },
    {
      title: "Phase 2: Local & Search Discoverability",
      description: "Dominate Google search results and local Maps so nearby customers and regional searchers find you first.",
      order: 2,
      status: auditResult.websiteScore >= 15 && auditResult.googleScore < 15 ? "IN_PROGRESS" : "AVAILABLE",
      priority: "HIGH",
      recommendedServices: JSON.stringify(["Google Business Optimization", "Local SEO", "Keyword Targeting"]),
      estimatedWeeks: 3,
    },
    {
      title: "Phase 3: Customer Trust & Social Proof",
      description: "Build an authentic brand reputation with verified reviews, customer testimonials, and an active social presence.",
      order: 3,
      status: "LOCKED",
      priority: "MEDIUM",
      recommendedServices: JSON.stringify(["Social Media Management", "Review Automation", "Trust Badges"]),
      estimatedWeeks: 4,
    },
    {
      title: "Phase 4: Online Sales & Direct Inquiries",
      description: "Turn visitors into paying buyers with direct WhatsApp inquiry funnels, online catalogs, and digital payments.",
      order: 4,
      status: "LOCKED",
      priority: "MEDIUM",
      recommendedServices: JSON.stringify(["WhatsApp Commerce", "E-commerce Catalog", "Payment Gateway"]),
      estimatedWeeks: 4,
    },
    {
      title: "Phase 5: National Expansion",
      description: "Scale beyond your home city to acquire customers across India through targeted growth campaigns.",
      order: 5,
      status: "LOCKED",
      priority: "MEDIUM",
      recommendedServices: JSON.stringify(["National Ads", "Pan-India Shipping Integration", "Marketplace Expansion"]),
      estimatedWeeks: 6,
    },
    {
      title: "Phase 6: Global Reach",
      description: "Unlock international buyers with global SEO, export compliance preparation, and cross-border digital presence.",
      order: 6,
      status: "LOCKED",
      priority: "LOW",
      recommendedServices: JSON.stringify(["Global SEO", "International Currency & Shipping", "Export Marketing"]),
      estimatedWeeks: 8,
    },
  ];

  for (const stage of stages) {
    await prisma.roadmapStage.create({
      data: {
        roadmapId: roadmap.id,
        title: stage.title,
        description: stage.description,
        order: stage.order,
        status: stage.status as any,
        priority: stage.priority as any,
        recommendedServices: stage.recommendedServices,
        estimatedWeeks: stage.estimatedWeeks,
      },
    });
  }

  return roadmap;
}
