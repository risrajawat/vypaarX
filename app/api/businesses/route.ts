import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import prisma from "@/lib/db/prisma";
import { onboardingSchema } from "@/lib/validations";
import { logActivity } from "@/lib/services/activity-logger";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthenticated. Please log in." }, { status: 401 });
    }

    const body = await req.json();
    const result = onboardingSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = result.data;

    // Check if business already exists for this user
    let business = await prisma.business.findUnique({
      where: { ownerId: session.id },
    });

    if (business) {
      // Update existing business
      business = await prisma.business.update({
        where: { id: business.id },
        data: {
          name: data.businessName,
          category: data.category,
          city: data.city,
          state: data.state,
          country: data.country || "India",
          phone: data.phone,
          email: data.email || null,
          website: data.website || null,
          instagram: data.instagram || null,
          facebook: data.facebook || null,
          description: data.description,
          goals: JSON.stringify(data.goals),
          discoveryMethods: JSON.stringify(data.discoveryMethods),
          customerStatus: "ONBOARDING" as any,
        },
      });
    } else {
      // Create new business
      business = await prisma.business.create({
        data: {
          ownerId: session.id,
          name: data.businessName,
          category: data.category,
          city: data.city,
          state: data.state,
          country: data.country || "India",
          phone: data.phone,
          email: data.email || null,
          website: data.website || null,
          instagram: data.instagram || null,
          facebook: data.facebook || null,
          description: data.description,
          goals: JSON.stringify(data.goals),
          discoveryMethods: JSON.stringify(data.discoveryMethods),
          customerStatus: "ONBOARDING" as any,
          growthStage: "LOCAL" as any,
        },
      });

      // Create initial Lead record for Admin visibility
      await prisma.lead.create({
        data: {
          businessId: business.id,
          ownerId: session.id,
          status: "NEW" as any,
          source: "WEBSITE_SIGNUP",
          notes: `New onboarding completed. Category: ${data.category}, City: ${data.city}.`,
        },
      });
    }

    // Log Activity
    await logActivity({
      userId: session.id,
      businessId: business.id,
      action: "BUSINESS_ONBOARDED",
      entityType: "Business",
      entityId: business.id,
      metadata: { name: business.name, category: business.category },
    });

    return NextResponse.json({
      success: true,
      business,
      nextUrl: "/business/dashboard",
    });
  } catch (error) {
    console.error("Business onboarding error:", error);
    return NextResponse.json(
      { error: "Failed to save business profile. Please try again." },
      { status: 500 }
    );
  }
}
