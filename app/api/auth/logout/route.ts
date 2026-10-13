import { NextRequest, NextResponse } from "next/server";
import { clearSessionCookie, getSession } from "@/lib/auth/session";
import { logActivity } from "@/lib/services/activity-logger";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (session) {
    await logActivity({
      userId: session.id,
      action: "USER_LOGOUT",
      entityType: "User",
      entityId: session.id,
    });
  }
  await clearSessionCookie();
  return NextResponse.json({ success: true, message: "Logged out successfully" });
}
