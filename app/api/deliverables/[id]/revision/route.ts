import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import prisma from "@/lib/db/prisma";
import { logActivity } from "@/lib/services/activity-logger";

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
    const body = await req.json();

    if (!body.comment || body.comment.trim().length < 5) {
      return NextResponse.json(
        { error: "A comment explaining requested revisions is required (at least 5 characters)." },
        { status: 400 }
      );
    }

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

    if (
      deliverable.project.business.ownerId !== session.id &&
      session.role !== "ADMIN"
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Update deliverable status to REVISION_REQUESTED
    const updated = await prisma.deliverable.update({
      where: { id: deliverable.id },
      data: { status: "REVISION_REQUESTED" as any },
    });

    // Record revision approval entry
    await prisma.approval.create({
      data: {
        deliverableId: deliverable.id,
        userId: session.id,
        action: "REVISION_REQUESTED" as any,
        comment: body.comment.trim(),
      },
    });

    await logActivity({
      userId: session.id,
      businessId: deliverable.project.businessId,
      action: "DELIVERABLE_REVISION_REQUESTED",
      entityType: "Deliverable",
      entityId: deliverable.id,
      metadata: { comment: body.comment.trim() },
    });

    return NextResponse.json({ success: true, deliverable: updated });
  } catch (error) {
    console.error("Revision request error:", error);
    return NextResponse.json({ error: "Failed to submit revision request" }, { status: 500 });
  }
}
