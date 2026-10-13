import prisma from "@/lib/db/prisma";

export async function logActivity(params: {
  userId?: string | null;
  businessId?: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  metadata?: Record<string, any>;
}) {
  try {
    await prisma.activityLog.create({
      data: {
        userId: params.userId || null,
        businessId: params.businessId || null,
        action: params.action,
        entityType: params.entityType,
        entityId: params.entityId || null,
        metadata: params.metadata ? JSON.stringify(params.metadata) : null,
      },
    });
  } catch (error) {
    console.error("Failed to write activity log:", error);
  }
}
