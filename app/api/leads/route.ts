import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import prisma from "@/lib/db/prisma";
import { updateLeadSchema } from "@/lib/validations";
import { logActivity } from "@/lib/services/activity-logger";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || (session.role !== "ADMIN" && session.role !== "TEAM_MEMBER")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const leads = await prisma.lead.findMany({
      include: {
        business: {
          include: { owner: true, audits: { take: 1, orderBy: { createdAt: "desc" } } },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, leads });
  } catch (error) {
    console.error("Get leads error:", error);
    return NextResponse.json({ error: "Failed to fetch leads" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || (session.role !== "ADMIN" && session.role !== "TEAM_MEMBER")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const result = updateLeadSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { leadId, status, notes, score } = result.data;

    const lead = await prisma.lead.update({
      where: { id: leadId },
      data: {
        status,
        notes: notes !== undefined ? notes : undefined,
        score: score !== undefined ? score : undefined,
      },
      include: { business: true },
    });

    // Update business status if converted
    if (status === "CONVERTED") {
      await prisma.business.update({
        where: { id: lead.businessId },
        data: { customerStatus: "ACTIVE_CLIENT" },
      });
    }

    await logActivity({
      userId: session.id,
      businessId: lead.businessId,
      action: "LEAD_STATUS_UPDATED",
      entityType: "Lead",
      entityId: lead.id,
      metadata: { status, notes },
    });

    return NextResponse.json({ success: true, lead });
  } catch (error) {
    console.error("Update lead error:", error);
    return NextResponse.json({ error: "Failed to update lead" }, { status: 500 });
  }
}
