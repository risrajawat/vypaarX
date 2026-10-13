import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import prisma from "@/lib/db/prisma";
import { createProposalSchema } from "@/lib/validations";
import { logActivity } from "@/lib/services/activity-logger";
import { createNotification } from "@/lib/services/notification-service";
import { sendEmail } from "@/lib/services/email-service";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    if (session.role === "ADMIN" || session.role === "TEAM_MEMBER") {
      const proposals = await prisma.proposal.findMany({
        include: { business: true, items: true },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json({ success: true, proposals });
    }

    const business = await prisma.business.findUnique({
      where: { ownerId: session.id },
    });

    if (!business) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 });
    }

    const proposals = await prisma.proposal.findMany({
      where: { businessId: business.id },
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, proposals });
  } catch (error) {
    console.error("Get proposals error:", error);
    return NextResponse.json({ error: "Failed to fetch proposals" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || (session.role !== "ADMIN" && session.role !== "TEAM_MEMBER")) {
      return NextResponse.json({ error: "Unauthorized. Admin privileges required." }, { status: 403 });
    }

    const body = await req.json();
    const result = createProposalSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = result.data;

    // Calculate total amount
    const totalAmount = data.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const validUntil = new Date(Date.now() + (data.validDays || 30) * 24 * 60 * 60 * 1000);

    const business = await prisma.business.findUnique({
      where: { id: data.businessId },
      include: { owner: true },
    });

    if (!business) {
      return NextResponse.json({ error: "Target business not found" }, { status: 404 });
    }

    const proposal = await prisma.proposal.create({
      data: {
        businessId: data.businessId,
        title: data.title,
        description: data.description,
        validUntil,
        status: "SENT" as any,
        totalAmount,
        currency: "INR",
        items: {
          create: data.items.map((i) => ({
            service: i.service,
            description: i.description,
            quantity: i.quantity,
            price: i.price,
          })),
        },
      },
      include: { items: true },
    });

    // Update business & lead status
    await prisma.business.update({
      where: { id: business.id },
      data: { customerStatus: "PROPOSAL_SENT" as any },
    });

    await prisma.lead.updateMany({
      where: { businessId: business.id },
      data: { status: "PROPOSAL_SENT" as any, notes: `Proposal '${proposal.title}' sent. Total: ₹${totalAmount}` },
    });

    // In-app notification to business owner
    await createNotification({
      userId: business.ownerId,
      title: "New Growth Proposal Received",
      message: `VyparX has sent you a custom proposal: '${proposal.title}' for ₹${totalAmount.toLocaleString('en-IN')}.`,
      type: "ACTION_REQUIRED",
      link: "/business/proposals",
    });

    // Email
    await sendEmail({
      to: business.owner.email,
      subject: `New Growth Proposal: ${proposal.title} — VyparX`,
      html: `<h2>You have received a new proposal from VyparX</h2><p>Title: <strong>${proposal.title}</strong></p><p>Total: ₹${totalAmount.toLocaleString('en-IN')}</p><p>Review and accept your quote in the VyparX portal.</p>`,
      text: `You have received a new proposal from VyparX: ${proposal.title}. Total: ₹${totalAmount.toLocaleString('en-IN')}.`,
    });

    // Activity Log
    await logActivity({
      userId: session.id,
      businessId: business.id,
      action: "PROPOSAL_CREATED",
      entityType: "Proposal",
      entityId: proposal.id,
      metadata: { totalAmount, title: proposal.title },
    });

    return NextResponse.json({ success: true, proposal });
  } catch (error) {
    console.error("Create proposal error:", error);
    return NextResponse.json({ error: "Failed to create proposal" }, { status: 500 });
  }
}
