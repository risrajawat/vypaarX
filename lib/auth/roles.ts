import { getSession, SessionUser } from "./session";
import prisma from "@/lib/db/prisma";
import { redirect } from "next/navigation";

export async function requireAuth(): Promise<{ user: SessionUser; dbUser: any }> {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: session.id },
    include: { business: true },
  });

  if (!dbUser) {
    redirect("/login");
  }

  return { user: session, dbUser };
}

export async function requireAdmin(): Promise<{ user: SessionUser; dbUser: any }> {
  const { user, dbUser } = await requireAuth();
  if (dbUser.role !== "ADMIN" && dbUser.role !== "TEAM_MEMBER") {
    redirect("/login?error=unauthorized_admin");
  }
  return { user, dbUser };
}

export async function requireClient(): Promise<{ user: SessionUser; dbUser: any; business: any }> {
  const { user, dbUser } = await requireAuth();
  
  if (dbUser.role === "ADMIN" || dbUser.role === "TEAM_MEMBER") {
    // If admin is browsing client route, check redirect or allow if view mode
    redirect("/admin/dashboard");
  }

  if (!dbUser.business) {
    redirect("/business/onboarding");
  }

  // If the customer is still a prospect, redirect to business growth hub
  if (
    dbUser.business.customerStatus !== "ACTIVE_CLIENT" &&
    dbUser.business.customerStatus !== "COMPLETED"
  ) {
    redirect("/business/dashboard");
  }

  return { user, dbUser, business: dbUser.business };
}

export async function requireProspect(): Promise<{ user: SessionUser; dbUser: any; business: any | null }> {
  const { user, dbUser } = await requireAuth();

  if (dbUser.role === "ADMIN" || dbUser.role === "TEAM_MEMBER") {
    redirect("/admin/dashboard");
  }

  if (!dbUser.business) {
    redirect("/business/onboarding");
  }

  // If already an active client, take them to the client portal
  if (
    dbUser.business.customerStatus === "ACTIVE_CLIENT" ||
    dbUser.business.customerStatus === "COMPLETED"
  ) {
    redirect("/client/dashboard");
  }

  return { user, dbUser, business: dbUser.business };
}

/**
 * Server-side verification that the authenticated user owns the given business ID
 * or is an authorized admin/team member.
 */
export async function verifyBusinessAccess(userId: string, businessId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { business: true },
  });

  if (!user) return false;
  if (user.role === "ADMIN" || user.role === "TEAM_MEMBER") return true;
  return user.business?.id === businessId;
}
