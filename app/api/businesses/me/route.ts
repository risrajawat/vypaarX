import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import prisma from "@/lib/db/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    const business = await prisma.business.findUnique({
      where: { ownerId: session.id },
      include: {
        audits: { orderBy: { createdAt: "desc" }, take: 1 },
        roadmaps: {
          include: { stages: { orderBy: { order: "asc" } } },
          take: 1,
        },
        proposals: { orderBy: { createdAt: "desc" }, include: { items: true } },
      },
    });

    if (!business) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, business });
  } catch (error) {
    console.error("Get business error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    const business = await prisma.business.findUnique({
      where: { ownerId: session.id },
    });

    if (!business) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 });
    }

    const body = await req.json();

    const updated = await prisma.business.update({
      where: { id: business.id },
      data: {
        name: body.name !== undefined ? body.name : undefined,
        category: body.category !== undefined ? body.category : undefined,
        description: body.description !== undefined ? body.description : undefined,
        city: body.city !== undefined ? body.city : undefined,
        state: body.state !== undefined ? body.state : undefined,
        phone: body.phone !== undefined ? body.phone : undefined,
        website: body.website !== undefined ? body.website : undefined,
        instagram: body.instagram !== undefined ? body.instagram : undefined,
        facebook: body.facebook !== undefined ? body.facebook : undefined,
      },
    });

    return NextResponse.json({ success: true, business: updated });
  } catch (error) {
    console.error("Update business error:", error);
    return NextResponse.json({ error: "Failed to update business" }, { status: 500 });
  }
}
