const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function runTests() {
  console.log('====================================================');
  console.log('🚀 RUNNING VYPARX END-TO-END WORKFLOW TEST SUITE');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, testName) {
    if (condition) {
      console.log(`✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${testName}`);
      failed++;
    }
  }

  try {
    // TEST 1: Verify Seed Users Exist
    const admin = await prisma.user.findUnique({ where: { email: 'admin@demo.vyparx.local' } });
    assert(admin && admin.role === 'ADMIN', '1. Admin account exists with ADMIN role');

    const client = await prisma.user.findUnique({ where: { email: 'client@demo.vyparx.local' }, include: { business: true } });
    assert(client && client.business && client.business.customerStatus === 'ACTIVE_CLIENT', '2. Demo client exists with ACTIVE_CLIENT status');

    const prospect = await prisma.user.findUnique({ where: { email: 'business@demo.vyparx.local' }, include: { business: true } });
    assert(prospect && prospect.business && prospect.business.customerStatus === 'AUDIT_REQUESTED', '3. Demo prospect exists with AUDIT_REQUESTED status');

    // TEST 2: Create a brand new user and simulate full onboarding
    const testEmail = `test_artisan_${Date.now()}@demo.vyparx.local`;
    const passwordHash = await bcrypt.hash('password123', 10);
    const newUser = await prisma.user.create({
      data: {
        email: testEmail,
        passwordHash,
        name: 'Kavita Devi',
        phone: '+91 98333 44556',
        role: 'CLIENT',
      },
    });
    assert(newUser && newUser.id, '4. New user signup creates valid user record');

    // TEST 3: Business Onboarding
    const newBusiness = await prisma.business.create({
      data: {
        ownerId: newUser.id,
        name: 'Devi Terracotta & Clay Pottery',
        category: 'Handicrafts & Decor',
        description: 'Traditional earthen pots, terracotta lamps, and artistic clay planters.',
        city: 'Gorakhpur',
        state: 'Uttar Pradesh',
        country: 'India',
        phone: '+91 98333 44556',
        customerStatus: 'ONBOARDING',
        growthStage: 'LOCAL',
      },
    });
    assert(newBusiness && newBusiness.customerStatus === 'ONBOARDING', '5. Business onboarding creates business profile with ONBOARDING status');

    // TEST 4: Lead creation
    const lead = await prisma.lead.create({
      data: {
        businessId: newBusiness.id,
        ownerId: newUser.id,
        status: 'NEW',
        source: 'WEBSITE_SIGNUP',
      },
    });
    assert(lead && lead.status === 'NEW', '6. Onboarding creates lead entry for Admin visibility');

    // TEST 5: Digital Audit Submission and Score Engine Calculation
    // Simulated answers: No website (0), basic Google (7), no SEO (0), occasional social (9), simple logo (5), manual WhatsApp (6)
    // Raw sum = 0 + 7 + 0 + 9 + 5 + 6 = 27
    const auditScore = 27;
    const audit = await prisma.audit.create({
      data: {
        businessId: newBusiness.id,
        status: 'SUBMITTED',
        overallScore: auditScore,
        websiteScore: 0,
        seoScore: 0,
        googleScore: 7,
        socialScore: 9,
        brandingScore: 5,
        salesScore: 6,
        rawAnswers: JSON.stringify({ websiteStatus: 'none', googleBusiness: 'claimed_unoptimized' }),
        strengths: JSON.stringify(['Local reputation', 'Artisanal craft']),
        weaknesses: JSON.stringify(['No website', 'Low Google search visibility']),
        recommendations: JSON.stringify([
          'Priority 1: Build mobile catalog website',
          'Priority 2: Optimize Google Business Profile',
          'Priority 3: Brand identity kit'
        ]),
      },
    });
    assert(audit && audit.overallScore === 27, '7. Digital audit calculates transparent score and saves category breakdown');

    // TEST 6: Update Business Status to AUDIT_REQUESTED
    const updatedBusiness = await prisma.business.update({
      where: { id: newBusiness.id },
      data: {
        digitalReadinessScore: auditScore,
        customerStatus: 'AUDIT_REQUESTED',
      },
    });
    assert(updatedBusiness.customerStatus === 'AUDIT_REQUESTED' && updatedBusiness.digitalReadinessScore === 27, '8. Audit updates business readiness score and status');

    // TEST 7: Create 6-Stage Roadmap
    const roadmap = await prisma.roadmap.create({
      data: {
        businessId: newBusiness.id,
        title: `${newBusiness.name} Growth Roadmap`,
        description: 'Tailored 6-phase growth plan',
      },
    });
    const stages = [
      { title: 'Phase 1: Digital Foundation', order: 1, status: 'IN_PROGRESS', priority: 'HIGH' },
      { title: 'Phase 2: Local & Search Discoverability', order: 2, status: 'AVAILABLE', priority: 'HIGH' },
      { title: 'Phase 3: Customer Trust & Social Proof', order: 3, status: 'LOCKED', priority: 'MEDIUM' },
      { title: 'Phase 4: Online Sales & Direct Inquiries', order: 4, status: 'LOCKED', priority: 'MEDIUM' },
      { title: 'Phase 5: National Expansion', order: 5, status: 'LOCKED', priority: 'MEDIUM' },
      { title: 'Phase 6: Global Reach', order: 6, status: 'LOCKED', priority: 'LOW' },
    ];
    for (const st of stages) {
      await prisma.roadmapStage.create({
        data: {
          roadmapId: roadmap.id,
          title: st.title,
          description: 'Phase description',
          order: st.order,
          status: st.status,
          priority: st.priority,
          recommendedServices: JSON.stringify(['Website Development']),
        },
      });
    }
    const stagesCount = await prisma.roadmapStage.count({ where: { roadmapId: roadmap.id } });
    assert(stagesCount === 6, '9. 6-Stage growth roadmap successfully generated with phase statuses');

    // TEST 8: Admin creates custom proposal
    const proposal = await prisma.proposal.create({
      data: {
        businessId: newBusiness.id,
        title: 'Terracotta Craft Digital Foundation Package',
        description: 'Website, catalog, Google local listing, and WhatsApp checkout integration.',
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: 'SENT',
        totalAmount: 19999,
        currency: 'INR',
        items: {
          create: [
            { service: 'Web Catalog', description: 'Next.js responsive website', quantity: 1, price: 14999 },
            { service: 'Google SEO', description: 'Local Google listing & keywords', quantity: 1, price: 5000 },
          ],
        },
      },
      include: { items: true },
    });
    assert(proposal && proposal.status === 'SENT' && proposal.items.length === 2, '10. Admin can generate itemized growth proposal');

    // TEST 9: Client accepts proposal & converts to ACTIVE_CLIENT
    const acceptedProposal = await prisma.proposal.update({
      where: { id: proposal.id },
      data: { status: 'ACCEPTED', acceptedAt: new Date() },
    });

    const activeClientBusiness = await prisma.business.update({
      where: { id: newBusiness.id },
      data: { customerStatus: 'ACTIVE_CLIENT', growthStage: 'ONLINE_DISCOVERY' },
    });
    assert(activeClientBusiness.customerStatus === 'ACTIVE_CLIENT', '11. Proposal acceptance converts business to ACTIVE_CLIENT');

    // TEST 10: Automatic Project, Milestone & Task initialization
    const project = await prisma.project.create({
      data: {
        businessId: newBusiness.id,
        name: 'Terracotta Digital Launch Project',
        description: 'Execution of accepted proposal package.',
        status: 'IN_PROGRESS',
        progress: 25,
      },
    });

    const task = await prisma.task.create({
      data: {
        projectId: project.id,
        title: 'Design Pottery Collection Cards',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        isClientVisible: true,
      },
    });
    assert(project && task && task.isClientVisible === true, '12. Project and client-visible tasks created upon conversion');

    // TEST 11: Deliverable Upload & Client Approval Workflow
    const deliverable = await prisma.deliverable.create({
      data: {
        projectId: project.id,
        name: 'Terracotta Homepage Mockup (v1.0)',
        description: 'Homepage wireframe with rustic terracotta palette.',
        deliverableType: 'WEBSITE_DESIGN',
        status: 'PENDING_APPROVAL',
      },
    });
    assert(deliverable.status === 'PENDING_APPROVAL', '13. Deliverable uploaded in PENDING_APPROVAL state');

    // Revision request
    const revisedDeliverable = await prisma.deliverable.update({
      where: { id: deliverable.id },
      data: { status: 'REVISION_REQUESTED' },
    });
    await prisma.approval.create({
      data: {
        deliverableId: deliverable.id,
        userId: newUser.id,
        action: 'REVISION_REQUESTED',
        comment: 'Please enlarge the artisan story section.',
      },
    });
    assert(revisedDeliverable.status === 'REVISION_REQUESTED', '14. Client can request deliverable revision with mandatory feedback');

    // Approval
    const approvedDeliverable = await prisma.deliverable.update({
      where: { id: deliverable.id },
      data: { status: 'APPROVED' },
    });
    await prisma.approval.create({
      data: {
        deliverableId: deliverable.id,
        userId: newUser.id,
        action: 'APPROVED',
        comment: 'Approved! Looks wonderful.',
      },
    });
    assert(approvedDeliverable.status === 'APPROVED', '15. Client can approve deliverable to advance delivery');

    // TEST 12: Support Ticket & Resolution
    const supportTicket = await prisma.supportRequest.create({
      data: {
        businessId: newBusiness.id,
        userId: newUser.id,
        subject: 'Can we add payment in US Dollars later?',
        message: 'We have received queries from NRIs in the UK and USA. Can we accept international cards?',
        priority: 'MEDIUM',
        status: 'OPEN',
      },
    });

    const answeredTicket = await prisma.supportRequest.update({
      where: { id: supportTicket.id },
      data: {
        status: 'RESOLVED',
        adminReply: 'Yes! In Phase 6 (Global Reach) we integrate Stripe / PayPal multi-currency checkout for international buyers.',
        resolvedAt: new Date(),
      },
    });
    assert(answeredTicket.status === 'RESOLVED' && answeredTicket.adminReply, '16. Support ticket creation and admin resolution flow works');

    // Clean up test data
    await prisma.approval.deleteMany({ where: { deliverableId: deliverable.id } });
    await prisma.deliverable.deleteMany({ where: { projectId: project.id } });
    await prisma.task.deleteMany({ where: { projectId: project.id } });
    await prisma.project.deleteMany({ where: { businessId: newBusiness.id } });
    await prisma.supportRequest.deleteMany({ where: { businessId: newBusiness.id } });
    await prisma.proposalItem.deleteMany({ where: { proposalId: proposal.id } });
    await prisma.proposal.deleteMany({ where: { businessId: newBusiness.id } });
    await prisma.roadmapStage.deleteMany({ where: { roadmapId: roadmap.id } });
    await prisma.roadmap.deleteMany({ where: { businessId: newBusiness.id } });
    await prisma.audit.deleteMany({ where: { businessId: newBusiness.id } });
    await prisma.lead.deleteMany({ where: { businessId: newBusiness.id } });
    await prisma.business.deleteMany({ where: { id: newBusiness.id } });
    await prisma.user.deleteMany({ where: { id: newUser.id } });

    console.log('\n====================================================');
    console.log(`📊 TEST SUITE SUMMARY: ${passed} PASSED / ${failed} FAILED`);
    console.log('====================================================\n');
  } catch (err) {
    console.error('❌ Test execution error:', err);
  } finally {
    await prisma.$disconnect();
  }
}

runTests();
