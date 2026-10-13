import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import prisma from "@/lib/db/prisma";
import { logActivity } from "@/lib/services/activity-logger";
import { createNotification } from "@/lib/services/notification-service";
import { sendEmail } from "@/lib/services/email-service";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    const proposalId = params.id;

    // Find proposal with business & owner
    const proposal = await prisma.proposal.findUnique({
      where: { id: proposalId },
      include: {
        business: {
          include: { owner: true },
        },
        items: true,
      },
    });

    if (!proposal) {
      return NextResponse.json({ error: "Proposal not found" }, { status: 404 });
    }

    // Security check: Must belong to authenticated business owner or admin
    if (proposal.business.ownerId !== session.id && session.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized access to proposal" },
        { status: 403 }
      );
    }

    if (proposal.status === "ACCEPTED") {
      return NextResponse.json(
        { error: "This proposal has already been accepted." },
        { status: 400 }
      );
    }

    // Transactional Conversion Workflow
    const result = await prisma.$transaction(async (tx) => {
      // 1. Update proposal status
      const updatedProposal = await tx.proposal.update({
        where: { id: proposal.id },
        data: {
          status: "ACCEPTED" as any,
          acceptedAt: new Date(),
        },
      });

      // 2. Convert business to ACTIVE_CLIENT
      const updatedBusiness = await tx.business.update({
        where: { id: proposal.businessId },
        data: {
          customerStatus: "ACTIVE_CLIENT" as any,
          growthStage: "ONLINE_DISCOVERY" as any,
        },
      });

      // 3. Update Lead status to CONVERTED
      await tx.lead.updateMany({
        where: { businessId: proposal.businessId },
        data: {
          status: "CONVERTED" as any,
          notes: `Converted to Active Client upon accepting proposal: ${proposal.title}`,
        },
      });

      // 4. Create Initial Project if none exists
      let project = await tx.project.findFirst({
        where: { businessId: proposal.businessId },
      });

      if (!project) {
        project = await tx.project.create({
          data: {
            businessId: proposal.businessId,
            name: `${proposal.business.name} — Digital Foundation Launch`,
            description: `Active onboarding & delivery for accepted growth package. Scope: ${proposal.items.map((i) => i.service).join(", ")}.`,
            status: "IN_PROGRESS" as any,
            progress: 15,
            startDate: new Date(),
            dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 3 weeks
          },
        });

        // 5. Create default milestones
        await tx.milestone.createMany({
          data: [
            {
              projectId: project.id,
              title: "1. Brand Styling & Assets",
              description: "Logo finalize, color palettes, and typography guide",
              order: 1,
              status: "IN_PROGRESS" as any,
            },
            {
              projectId: project.id,
              title: "2. Website & Catalog Prototype",
              description: "Responsive wireframe, catalog structure, and WhatsApp checkout",
              order: 2,
              status: "AVAILABLE" as any,
            },
            {
              projectId: project.id,
              title: "3. Google Search & Maps Verification",
              description: "Local SEO citations and business profile optimization",
              order: 3,
              status: "LOCKED" as any,
            },
            {
              projectId: project.id,
              title: "4. Quality Review & Live Launch",
              description: "Cross-device testing, domain DNS setup, and public launch",
              order: 4,
              status: "LOCKED" as any,
            },
          ],
        });

        // 6. Create initial client-visible tasks
        await tx.task.createMany({
          data: [
            {
              projectId: project.id,
              title: "Review business catalog and product photos",
              description: "VyparX creative team is assembling high-res collection cards.",
              status: "IN_PROGRESS" as any,
              priority: "HIGH" as any,
              isClientVisible: true,
            },
            {
              projectId: project.id,
              title: "Prepare responsive website design mockup",
              description: "Drafting mobile-first homepage layout.",
              status: "TODO" as any,
              priority: "HIGH" as any,
              isClientVisible: true,
            },
            {
              projectId: project.id,
              title: "Google Business Profile location audit",
              description: "Verifying pin accuracy and category tags.",
              status: "TODO" as any,
              priority: "MEDIUM" as any,
              isClientVisible: true,
            },
          ],
        });

        // 7. Create initial deliverable for client review
        await tx.deliverable.create({
          data: {
            projectId: project.id,
            name: "Initial Brand Identity & Color Palette Kit",
            description: "Proposed logo refinements, primary brand palette, and typography pairing.",
            fileUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
            previewUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
            deliverableType: "BRAND_ASSET",
            status: "PENDING_APPROVAL" as any,
            uploadedBy: "VyparX Design Lead",
          },
        });
      }

      return { updatedProposal, updatedBusiness, project };
    });

    // 8. Notifications
    await createNotification({
      userId: proposal.business.ownerId,
      title: "Welcome to Active Client Status!",
      message: `Your project '${result.project?.name}' is now active. Access your Client Portal for deliverables and approvals.`,
      type: "SUCCESS",
      link: "/client/dashboard",
    });

    // 9. Send Email
    await sendEmail({
      to: proposal.business.owner.email,
      subject: `Proposal Accepted — Welcome to VyparX Active Growth!`,
      html: `<h2>Welcome to VyparX!</h2><p>Your proposal <strong>${proposal.title}</strong> is accepted. Your project is now underway.</p>`,
      text: `Welcome to VyparX! Your proposal ${proposal.title} is accepted and your project is active.`,
    });

    // 10. Log Activity
    await logActivity({
      userId: session.id,
      businessId: proposal.businessId,
      action: "PROPOSAL_ACCEPTED",
      entityType: "Proposal",
      entityId: proposal.id,
      metadata: { totalAmount: proposal.totalAmount, title: proposal.title },
    });

    return NextResponse.json({
      success: true,
      message: "Proposal accepted! You are now an active client.",
      nextUrl: "/client/dashboard",
    });
  } catch (error) {
    console.error("Proposal accept error:", error);
    return NextResponse.json(
      { error: "Failed to accept proposal. Please try again." },
      { status: 500 }
    );
  }
}
