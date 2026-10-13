import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import prisma from "@/lib/db/prisma";
import { logActivity } from "@/lib/services/activity-logger";
import { createNotification } from "@/lib/services/notification-service";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    const deliverableId = params.id;
    const body = await req.json().catch(() => ({}));

    const deliverable = await prisma.deliverable.findUnique({
      where: { id: deliverableId },
      include: {
        project: {
          include: { business: true },
        },
      },
    });

    if (!deliverable) {
      return NextResponse.json({ error: "Deliverable not found" }, { status: 404 });
    }

    // Verify ownership
    if (
      deliverable.project.business.ownerId !== session.id &&
      session.role !== "ADMIN"
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Update deliverable status to APPROVED
    const updated = await prisma.deliverable.update({
      where: { id: deliverable.id },
      data: { status: "APPROVED" as any },
    });

    // Record approval entry
    await prisma.approval.create({
      data: {
        deliverableId: deliverable.id,
        userId: session.id,
        action: "APPROVED" as any,
        comment: body.comment || "Approved by client",
      },
    });

    // Activity Log
    await logActivity({
      userId: session.id,
      businessId: deliverable.project.businessId,
      action: "DELIVERABLE_APPROVED",
      entityType: "Deliverable",
      entityId: deliverable.id,
      metadata: { deliverableName: deliverable.name },
    });

    return NextResponse.json({ success: true, deliverable: updated });
  } catch (error) {
    console.error("Approve deliverable error:", error);
    return NextResponse.json({ error: "Failed to approve deliverable" }, { status: 500 });
  }
}
