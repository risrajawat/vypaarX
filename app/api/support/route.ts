import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import prisma from "@/lib/db/prisma";
import { createSupportTicketSchema } from "@/lib/validations";
import { logActivity } from "@/lib/services/activity-logger";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    if (session.role === "ADMIN" || session.role === "TEAM_MEMBER") {
      const tickets = await prisma.supportRequest.findMany({
        include: { business: true, user: true },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json({ success: true, tickets });
    }

    const business = await prisma.business.findUnique({
      where: { ownerId: session.id },
    });

    if (!business) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 });
    }

    const tickets = await prisma.supportRequest.findMany({
      where: { businessId: business.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, tickets });
  } catch (error) {
    console.error("Get support error:", error);
    return NextResponse.json({ error: "Failed to fetch tickets" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    const body = await req.json();
    const result = createSupportTicketSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const business = await prisma.business.findUnique({
      where: { ownerId: session.id },
    });

    if (!business) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 });
    }

    const ticket = await prisma.supportRequest.create({
      data: {
        businessId: business.id,
        userId: session.id,
        subject: result.data.subject,
        message: result.data.message,
        priority: result.data.priority as any,
        status: "OPEN" as any,
      },
    });

    await logActivity({
      userId: session.id,
      businessId: business.id,
      action: "SUPPORT_TICKET_CREATED",
      entityType: "SupportRequest",
      entityId: ticket.id,
      metadata: { subject: ticket.subject },
    });

    return NextResponse.json({ success: true, ticket });
  } catch (error) {
    console.error("Create support ticket error:", error);
    return NextResponse.json({ error: "Failed to create support request" }, { status: 500 });
  }
}
