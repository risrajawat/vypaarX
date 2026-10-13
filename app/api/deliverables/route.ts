import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import prisma from "@/lib/db/prisma";
import { createDeliverableSchema } from "@/lib/validations";
import { logActivity } from "@/lib/services/activity-logger";
import { createNotification } from "@/lib/services/notification-service";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    if (session.role === "ADMIN" || session.role === "TEAM_MEMBER") {
      const deliverables = await prisma.deliverable.findMany({
        include: {
          project: { include: { business: true } },
          approvals: { include: { user: true }, orderBy: { createdAt: "desc" } },
        },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json({ success: true, deliverables });
    }

    const business = await prisma.business.findUnique({
      where: { ownerId: session.id },
    });

    if (!business) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 });
    }

    const deliverables = await prisma.deliverable.findMany({
      where: {
        project: { businessId: business.id },
      },
      include: {
        project: true,
        approvals: { orderBy: { createdAt: "desc" } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, deliverables });
  } catch (error) {
    console.error("Get deliverables error:", error);
    return NextResponse.json({ error: "Failed to fetch deliverables" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || (session.role !== "ADMIN" && session.role !== "TEAM_MEMBER")) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const body = await req.json();
    const result = createDeliverableSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = result.data;

    const project = await prisma.project.findUnique({
      where: { id: data.projectId },
      include: { business: true },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const deliverable = await prisma.deliverable.create({
      data: {
        projectId: data.projectId,
        name: data.name,
        description: data.description,
        fileUrl: data.fileUrl || null,
        previewUrl: data.previewUrl || data.fileUrl || null,
        deliverableType: data.deliverableType,
        status: "PENDING_APPROVAL" as any,
        uploadedBy: data.uploadedBy || session.name,
      },
    });

    // Notify client that deliverable is ready for review
    await createNotification({
      userId: project.business.ownerId,
      title: "Deliverable Ready for Review",
      message: `New deliverable '${deliverable.name}' is waiting for your review and approval.`,
      type: "ACTION_REQUIRED",
      link: "/client/deliverables",
    });

    await logActivity({
      userId: session.id,
      businessId: project.businessId,
      action: "DELIVERABLE_UPLOADED",
      entityType: "Deliverable",
      entityId: deliverable.id,
      metadata: { name: deliverable.name },
    });

    return NextResponse.json({ success: true, deliverable });
  } catch (error) {
    console.error("Create deliverable error:", error);
    return NextResponse.json({ error: "Failed to create deliverable" }, { status: 500 });
  }
}
