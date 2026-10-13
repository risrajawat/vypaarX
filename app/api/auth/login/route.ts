import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import bcrypt from "bcryptjs";
import { loginSchema } from "@/lib/validations";
import { setSessionCookie } from "@/lib/auth/session";
import { logActivity } from "@/lib/services/activity-logger";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = loginSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Please enter a valid email and password." },
        { status: 400 }
      );
    }

    const { email, password } = result.data;
    const normalizedEmail = email.toLowerCase().trim();

    // Find User
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      include: { business: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    // Verify Password
    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    // Set Session
    await setSessionCookie({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      businessId: user.business?.id,
      customerStatus: user.business?.customerStatus,
    });

    // Determine target redirect based on role and customer status
    let nextUrl = "/business/dashboard";
    if (user.role === "ADMIN" || user.role === "TEAM_MEMBER") {
      nextUrl = "/admin/dashboard";
    } else if (!user.business) {
      nextUrl = "/business/onboarding";
    } else if (
      user.business.customerStatus === "ACTIVE_CLIENT" ||
      user.business.customerStatus === "COMPLETED"
    ) {
      nextUrl = "/client/dashboard";
    } else {
      nextUrl = "/business/dashboard";
    }

    // Log Activity
    await logActivity({
      userId: user.id,
      businessId: user.business?.id,
      action: "USER_LOGIN",
      entityType: "User",
      entityId: user.id,
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        business: user.business
          ? {
              id: user.business.id,
              name: user.business.name,
              customerStatus: user.business.customerStatus,
            }
          : null,
      },
      nextUrl,
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "A server error occurred during login. Please try again." },
      { status: 500 }
    );
  }
}
