import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import prisma from "@/lib/db/prisma";
import { createNotification } from "@/lib/services/notification-service";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session || (session.role !== "ADMIN" && session.role !== "TEAM_MEMBER")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const ticketId = params.id;
    const body = await req.json();

    const ticket = await prisma.supportRequest.update({
      where: { id: ticketId },
      data: {
        adminReply: body.adminReply !== undefined ? body.adminReply : undefined,
        status: body.status !== undefined ? body.status : undefined,
        resolvedAt: body.status === "RESOLVED" ? new Date() : undefined,
      },
      include: { user: true },
    });

    if (body.adminReply) {
      await createNotification({
        userId: ticket.userId,
        title: "VyparX Support Response",
        message: `Response added to your ticket: "${ticket.subject}".`,
        type: "INFO",
        link: "/client/support",
      });
    }

    return NextResponse.json({ success: true, ticket });
  } catch (error) {
    console.error("Update support ticket error:", error);
    return NextResponse.json({ error: "Failed to update support request" }, { status: 500 });
  }
}
