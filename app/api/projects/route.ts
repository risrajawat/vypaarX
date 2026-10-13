import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import prisma from "@/lib/db/prisma";
import { createProjectSchema } from "@/lib/validations";
import { logActivity } from "@/lib/services/activity-logger";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    if (session.role === "ADMIN" || session.role === "TEAM_MEMBER") {
      const projects = await prisma.project.findMany({
        include: {
          business: true,
          milestones: { orderBy: { order: "asc" } },
          tasks: true,
          deliverables: true,
        },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json({ success: true, projects });
    }

    const business = await prisma.business.findUnique({
      where: { ownerId: session.id },
    });

    if (!business) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 });
    }

    const projects = await prisma.project.findMany({
      where: { businessId: business.id },
      include: {
        milestones: { orderBy: { order: "asc" } },
        tasks: { where: { isClientVisible: true } },
        deliverables: { include: { approvals: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, projects, business });
  } catch (error) {
    console.error("Get projects error:", error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || (session.role !== "ADMIN" && session.role !== "TEAM_MEMBER")) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const body = await req.json();
    const result = createProjectSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = result.data;

    const project = await prisma.project.create({
      data: {
        businessId: data.businessId,
        name: data.name,
        description: data.description || null,
        status: "PLANNED" as any,
        progress: 0,
        startDate: data.startDate ? new Date(data.startDate) : new Date(),
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
      },
    });

    await logActivity({
      userId: session.id,
      businessId: data.businessId,
      action: "PROJECT_CREATED",
      entityType: "Project",
      entityId: project.id,
      metadata: { name: project.name },
    });

    return NextResponse.json({ success: true, project });
  } catch (error) {
    console.error("Create project error:", error);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
