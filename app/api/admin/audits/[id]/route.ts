import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import prisma from "@/lib/db/prisma";
import { logActivity } from "@/lib/services/activity-logger";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session || (session.role !== "ADMIN" && session.role !== "TEAM_MEMBER")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const auditId = params.id;
    const body = await req.json();

    const audit = await prisma.audit.update({
      where: { id: auditId },
      data: {
        status: body.status || "REVIEWED",
        internalNotes: body.internalNotes !== undefined ? body.internalNotes : undefined,
        reviewedBy: session.name,
        reviewedAt: new Date(),
      },
      include: { business: true },
    });

    await logActivity({
      userId: session.id,
      businessId: audit.businessId,
      action: "AUDIT_REVIEWED",
      entityType: "Audit",
      entityId: audit.id,
      metadata: { status: audit.status, reviewedBy: session.name },
    });

    return NextResponse.json({ success: true, audit });
  } catch (error) {
    console.error("Update audit error:", error);
    return NextResponse.json({ error: "Failed to update audit" }, { status: 500 });
  }
}
