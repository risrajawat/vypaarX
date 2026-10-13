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

    const audits = await prisma.audit.findMany({
      where: { businessId: business.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, audits, business });
  } catch (error) {
    console.error("Get audit error:", error);
    return NextResponse.json({ error: "Failed to fetch audit" }, { status: 500 });
  }
}
