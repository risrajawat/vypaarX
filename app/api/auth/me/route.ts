import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import prisma from "@/lib/db/prisma";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: session.id },
    include: { business: true },
  });

  if (!dbUser) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      id: dbUser.id,
      email: dbUser.email,
      name: dbUser.name,
      role: dbUser.role,
      phone: dbUser.phone,
      business: dbUser.business
        ? {
            id: dbUser.business.id,
            name: dbUser.business.name,
            customerStatus: dbUser.business.customerStatus,
            growthStage: dbUser.business.growthStage,
            digitalReadinessScore: dbUser.business.digitalReadinessScore,
          }
        : null,
    },
  });
}
