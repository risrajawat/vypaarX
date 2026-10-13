import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import prisma from "@/lib/db/prisma";
import { createTaskSchema, updateTaskStatusSchema } from "@/lib/validations";
import { logActivity } from "@/lib/services/activity-logger";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId");

    if (session.role === "ADMIN" || session.role === "TEAM_MEMBER") {
      const tasks = await prisma.task.findMany({
        where: projectId ? { projectId } : {},
        include: { project: { include: { business: true } }, assignedTo: true },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json({ success: true, tasks });
    }

    const business = await prisma.business.findUnique({
      where: { ownerId: session.id },
    });

    if (!business) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 });
    }

    // Client can ONLY view client-visible tasks of their business
    const tasks = await prisma.task.findMany({
      where: {
        isClientVisible: true,
        project: {
          businessId: business.id,
          ...(projectId ? { id: projectId } : {}),
        },
      },
      include: { project: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, tasks });
  } catch (error) {
    console.error("Get tasks error:", error);
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || (session.role !== "ADMIN" && session.role !== "TEAM_MEMBER")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const result = createTaskSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = result.data;

    const task = await prisma.task.create({
      data: {
        projectId: data.projectId,
        title: data.title,
        description: data.description || null,
        assignedToId: data.assignedToId || null,
        priority: data.priority as any,
        isClientVisible: data.isClientVisible,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
      },
      include: { project: true },
    });

    await logActivity({
      userId: session.id,
      businessId: task.project.businessId,
      action: "TASK_CREATED",
      entityType: "Task",
      entityId: task.id,
      metadata: { title: task.title },
    });

    return NextResponse.json({ success: true, task });
  } catch (error) {
    console.error("Create task error:", error);
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || (session.role !== "ADMIN" && session.role !== "TEAM_MEMBER")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const result = updateTaskStatusSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: "Invalid status update" }, { status: 400 });
    }

    const task = await prisma.task.update({
      where: { id: result.data.taskId },
      data: { status: result.data.status },
      include: { project: true },
    });

    // Recalculate project progress %
    const allTasks = await prisma.task.findMany({
      where: { projectId: task.projectId },
    });
    const completedTasks = allTasks.filter((t) => t.status === "COMPLETED").length;
    const progress = Math.round((completedTasks / (allTasks.length || 1)) * 100);

    await prisma.project.update({
      where: { id: task.projectId },
      data: { progress },
    });

    return NextResponse.json({ success: true, task, projectProgress: progress });
  } catch (error) {
    console.error("Update task error:", error);
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
  }
}
