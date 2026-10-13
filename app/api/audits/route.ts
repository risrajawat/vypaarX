import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import prisma from "@/lib/db/prisma";
import { auditSubmissionSchema } from "@/lib/validations";
import { calculateDigitalReadiness, AuditInput } from "@/lib/services/audit-engine";
import { generateBusinessRoadmap } from "@/lib/services/roadmap-generator";
import { logActivity } from "@/lib/services/activity-logger";
import { createNotification } from "@/lib/services/notification-service";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    const body = await req.json();
    const result = auditSubmissionSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const inputData = result.data;

    // Verify user owns business or is admin
    const business = await prisma.business.findUnique({
      where: { id: inputData.businessId },
    });

    if (!business) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 });
    }

    if (business.ownerId !== session.id && session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized access to business" }, { status: 403 });
    }

    // Run transparent Scoring Engine
    const auditEngineInput: AuditInput = {
      websiteStatus: inputData.websiteStatus,
      seoPresence: inputData.seoPresence,
      googleBusiness: inputData.googleBusiness,
      socialMedia: inputData.socialMedia,
      branding: inputData.branding,
      onlineSales: inputData.onlineSales,
      customerAcquisition: inputData.customerAcquisition,
      digitalGoals: inputData.digitalGoals,
    };

    const scoringResult = calculateDigitalReadiness(auditEngineInput);

    // Save Audit record
    const audit = await prisma.audit.create({
      data: {
        businessId: business.id,
        status: "SUBMITTED" as any,
        overallScore: scoringResult.overallScore,
        websiteScore: scoringResult.websiteScore,
        seoScore: scoringResult.seoScore,
        googleScore: scoringResult.googleScore,
        socialScore: scoringResult.socialScore,
        brandingScore: scoringResult.brandingScore,
        salesScore: scoringResult.salesScore,
        rawAnswers: JSON.stringify(inputData),
        strengths: JSON.stringify(scoringResult.strengths),
        weaknesses: JSON.stringify(scoringResult.weaknesses),
        recommendations: JSON.stringify(scoringResult.recommendations),
      },
    });

    // Update Business readiness score & customer status
    await prisma.business.update({
      where: { id: business.id },
      data: {
        digitalReadinessScore: scoringResult.overallScore,
        customerStatus: "AUDIT_REQUESTED" as any,
      },
    });

    // Update or Create Lead
    const lead = await prisma.lead.findFirst({
      where: { businessId: business.id },
    });

    if (lead) {
      await prisma.lead.update({
        where: { id: lead.id },
        data: {
          status: "AUDIT_REQUESTED" as any,
          score: scoringResult.overallScore,
          notes: `Audit submitted. Score: ${scoringResult.overallScore}/100. Recommendations: ${scoringResult.recommendations[0]}`,
        },
      });
    } else {
      await prisma.lead.create({
        data: {
          businessId: business.id,
          ownerId: session.id,
          status: "AUDIT_REQUESTED" as any,
          score: scoringResult.overallScore,
          source: "AUDIT_FORM",
        },
      });
    }

    // Generate Custom 6-Stage Roadmap
    await generateBusinessRoadmap(business.id, business.name, scoringResult);

    // Create In-App Notification
    await createNotification({
      userId: session.id,
      title: "Digital Audit Completed",
      message: `Your Digital Readiness Score is ${scoringResult.overallScore}/100. Your custom roadmap is ready.`,
      type: "SUCCESS",
      link: "/business/roadmap",
    });

    // Log Activity
    await logActivity({
      userId: session.id,
      businessId: business.id,
      action: "AUDIT_SUBMITTED",
      entityType: "Audit",
      entityId: audit.id,
      metadata: { overallScore: scoringResult.overallScore },
    });

    return NextResponse.json({
      success: true,
      audit,
      scoringResult,
      nextUrl: "/business/roadmap",
    });
  } catch (error) {
    console.error("Audit submission error:", error);
    return NextResponse.json(
      { error: "Failed to process digital audit. Please try again." },
      { status: 500 }
    );
  }
}
