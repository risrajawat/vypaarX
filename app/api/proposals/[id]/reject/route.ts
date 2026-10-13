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

    const proposalId = params.id;
    const body = await req.json().catch(() => ({}));

    const proposal = await prisma.proposal.findUnique({
      where: { id: proposalId },
      include: { business: true },
    });

    if (!proposal) {
      return NextResponse.json({ error: "Proposal not found" }, { status: 404 });
    }

    if (proposal.business.ownerId !== session.id && session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const updated = await prisma.proposal.update({
      where: { id: proposalId },
      data: {
        status: "REJECTED" as any,
        rejectedAt: new Date(),
        clientFeedback: body.feedback || "Client requested changes or declined.",
      },
    });

    await logActivity({
      userId: session.id,
      businessId: proposal.businessId,
      action: "PROPOSAL_REJECTED",
      entityType: "Proposal",
      entityId: proposal.id,
      metadata: { feedback: body.feedback },
    });

    return NextResponse.json({ success: true, proposal: updated });
  } catch (error) {
    console.error("Proposal reject error:", error);
    return NextResponse.json({ error: "Failed to update proposal" }, { status: 500 });
  }
}
