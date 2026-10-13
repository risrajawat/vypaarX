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
    });

    if (!business) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 });
    }

    const roadmap = await prisma.roadmap.findFirst({
      where: { businessId: business.id },
      include: {
        stages: {
          orderBy: { order: "asc" },
        },
      },
    });

    return NextResponse.json({ success: true, roadmap, business });
  } catch (error) {
    console.error("Get roadmap error:", error);
    return NextResponse.json({ error: "Failed to fetch roadmap" }, { status: 500 });
  }
}
