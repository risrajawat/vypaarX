import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import prisma from "@/lib/db/prisma";
import { createReportSchema } from "@/lib/validations";
import { logActivity } from "@/lib/services/activity-logger";
import { createNotification } from "@/lib/services/notification-service";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    if (session.role === "ADMIN" || session.role === "TEAM_MEMBER") {
      const reports = await prisma.report.findMany({
        include: { business: true },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json({ success: true, reports });
    }

    const business = await prisma.business.findUnique({
      where: { ownerId: session.id },
    });

    if (!business) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 });
    }

    const reports = await prisma.report.findMany({
      where: { businessId: business.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, reports });
  } catch (error) {
    console.error("Get reports error:", error);
    return NextResponse.json({ error: "Failed to fetch reports" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || (session.role !== "ADMIN" && session.role !== "TEAM_MEMBER")) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const body = await req.json();
    const result = createReportSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = result.data;

    const business = await prisma.business.findUnique({
      where: { id: data.businessId },
    });

    if (!business) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 });
    }

    const report = await prisma.report.create({
      data: {
        businessId: data.businessId,
        title: data.title,
        period: data.period,
        summary: data.summary,
        metrics: JSON.stringify(data.metrics),
        recommendations: JSON.stringify(data.recommendations),
      },
    });

    // Notify client
    await createNotification({
      userId: business.ownerId,
      title: "New Growth Report Available",
      message: `Your growth report for ${report.period} is ready for review.`,
      type: "INFO",
      link: "/client/reports",
    });

    await logActivity({
      userId: session.id,
      businessId: business.id,
      action: "REPORT_CREATED",
      entityType: "Report",
      entityId: report.id,
      metadata: { title: report.title, period: report.period },
    });

    return NextResponse.json({ success: true, report });
  } catch (error) {
    console.error("Create report error:", error);
    return NextResponse.json({ error: "Failed to create report" }, { status: 500 });
  }
}
