const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting VyparX database seed...');

  // Clean existing data
  await prisma.activityLog.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.supportRequest.deleteMany({});
  await prisma.approval.deleteMany({});
  await prisma.deliverable.deleteMany({});
  await prisma.task.deleteMany({});
  await prisma.milestone.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.proposalItem.deleteMany({});
  await prisma.proposal.deleteMany({});
  await prisma.roadmapStage.deleteMany({});
  await prisma.roadmap.deleteMany({});
  await prisma.audit.deleteMany({});
  await prisma.lead.deleteMany({});
  await prisma.business.deleteMany({});
  await prisma.user.deleteMany({});

  const defaultPasswordHash = await bcrypt.hash('password123', 10);

  // 1. Admin User
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@demo.vyparx.local',
      passwordHash: defaultPasswordHash,
      name: 'Rishabh (VyparX Admin)',
      phone: '+91 98765 43210',
      role: 'ADMIN',
    },
  });

  // 2. Team Member
  const teamUser = await prisma.user.create({
    data: {
      email: 'team@demo.vyparx.local',
      passwordHash: defaultPasswordHash,
      name: 'Ananya Sharma (Growth Specialist)',
      phone: '+91 98765 43211',
      role: 'TEAM_MEMBER',
    },
  });

  // 3. Prospect User (Sharma Handicrafts)
  const prospectUser = await prisma.user.create({
    data: {
      email: 'business@demo.vyparx.local',
      passwordHash: defaultPasswordHash,
      name: 'Ramesh Sharma',
      phone: '+91 98111 22334',
      role: 'CLIENT',
    },
  });

  const prospectBusiness = await prisma.business.create({
    data: {
      ownerId: prospectUser.id,
      name: 'Sharma Handicrafts & Woodcrafts',
      category: 'Handicrafts',
      description: 'Handcrafted teak wood home decor, traditional Rajasthani jaali work, and artisanal sculptures made by local master craftsmen.',
      city: 'Jaipur',
      state: 'Rajasthan',
      country: 'India',
      phone: '+91 98111 22334',
      email: 'business@demo.vyparx.local',
      website: '',
      instagram: '@sharmahandicrafts_jaipur',
      facebook: '',
      goals: JSON.stringify([
        'Build a professional website',
        'Get more customers',
        'Reach customers across India',
        'Sell online'
      ]),
      discoveryMethods: JSON.stringify([
        'Walk-in',
        'Word of mouth'
      ]),
      customerStatus: 'AUDIT_REQUESTED',
      growthStage: 'LOCAL',
      digitalReadinessScore: 64,
    },
  });

  // Create Lead for Prospect
  await prisma.lead.create({
    data: {
      businessId: prospectBusiness.id,
      ownerId: prospectUser.id,
      status: 'AUDIT_REQUESTED',
      source: 'WEBSITE_SIGNUP',
      score: 64,
      notes: 'Strong local craftsmanship, high potential for national e-commerce reach.',
    },
  });

  // Create Audit for Prospect
  const rawAuditAnswers = {
    websiteStatus: 'none',
    socialMediaPresence: 'basic',
    googleBusiness: 'claimed_unoptimized',
    onlineSelling: 'offline_only',
    brandingStatus: 'basic_logo',
    marketingBudget: 'moderate',
    primaryGoal: 'national_reach',
  };

  const auditStrengths = [
    'Authentic handcrafted product catalogue with strong local artisan heritage',
    'Active offline customer trust with positive word-of-mouth reputation',
    'Clear ambition to scale to pan-India customers'
  ];

  const auditWeaknesses = [
    'No direct-to-consumer website or online catalogue for national buyers',
    'Google Business Profile is unoptimized and missing high-resolution product photos',
    'Inconsistent social media presence with no structured content calendar'
  ];

  const auditRecommendations = [
    'Priority 1: Build a high-speed, mobile-optimized catalog website with WhatsApp inquiry integration',
    'Priority 2: Optimize Google Business Profile with local SEO keywords and customer review funnel',
    'Priority 3: Launch targeted visual branding & Instagram showcase strategy for national craft buyers'
  ];

  await prisma.audit.create({
    data: {
      businessId: prospectBusiness.id,
      status: 'SUBMITTED',
      overallScore: 64,
      websiteScore: 10,
      seoScore: 15,
      googleScore: 40,
      socialScore: 35,
      brandingScore: 50,
      salesScore: 20,
      rawAnswers: JSON.stringify(rawAuditAnswers),
      strengths: JSON.stringify(auditStrengths),
      weaknesses: JSON.stringify(auditWeaknesses),
      recommendations: JSON.stringify(auditRecommendations),
      internalNotes: 'Prospect needs digital foundation package. High conversion probability.',
    },
  });

  // Create Roadmap for Prospect
  const prospectRoadmap = await prisma.roadmap.create({
    data: {
      businessId: prospectBusiness.id,
      title: 'Sharma Handicrafts 6-Stage Digital Growth Roadmap',
      description: 'Strategic roadmap to transform local Jaipur workshop into a recognized national brand.',
    },
  });

  const stages = [
    {
      title: 'Phase 1: Digital Foundation',
      description: 'Establish official online presence with brand identity and high-converting catalog website.',
      order: 1,
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      recommendedServices: JSON.stringify(['Website Development', 'Branding & Visual Kit']),
      estimatedWeeks: 2,
    },
    {
      title: 'Phase 2: Local & Search Discoverability',
      description: 'Optimize Google Presence, local citations, and regional search visibility.',
      order: 2,
      status: 'AVAILABLE',
      priority: 'HIGH',
      recommendedServices: JSON.stringify(['Google Business Optimization', 'Local SEO']),
      estimatedWeeks: 3,
    },
    {
      title: 'Phase 3: Customer Trust & Social Proof',
      description: 'Automated review collection, verified badges, and active social showcase.',
      order: 3,
      status: 'LOCKED',
      priority: 'MEDIUM',
      recommendedServices: JSON.stringify(['Social Media Management', 'Review Funnels']),
      estimatedWeeks: 4,
    },
    {
      title: 'Phase 4: Online Sales & Direct Inquiries',
      description: 'Direct inquiry forms, WhatsApp commerce, and payment checkout capabilities.',
      order: 4,
      status: 'LOCKED',
      priority: 'MEDIUM',
      recommendedServices: JSON.stringify(['E-commerce Enablement', 'Payment Gateway Integration']),
      estimatedWeeks: 4,
    },
    {
      title: 'Phase 5: National Expansion',
      description: 'Targeted pan-India ad campaigns and multi-city delivery logistics setup.',
      order: 5,
      status: 'LOCKED',
      priority: 'MEDIUM',
      recommendedServices: JSON.stringify(['National Performance Ads', 'Logistics Partnerships']),
      estimatedWeeks: 6,
    },
    {
      title: 'Phase 6: Global Reach',
      description: 'Cross-border commerce, international shipping, and global marketplace listings.',
      order: 6,
      status: 'LOCKED',
      priority: 'LOW',
      recommendedServices: JSON.stringify(['Global SEO', 'Export Documentation Prep']),
      estimatedWeeks: 8,
    },
  ];

  for (const st of stages) {
    await prisma.roadmapStage.create({
      data: {
        roadmapId: prospectRoadmap.id,
        ...st,
      },
    });
  }

  // 4. Active Client User (Artisan Heritage Silks)
  const clientUser = await prisma.user.create({
    data: {
      email: 'client@demo.vyparx.local',
      passwordHash: defaultPasswordHash,
      name: 'Priya Iyer',
      phone: '+91 98222 33445',
      role: 'CLIENT',
    },
  });

  const clientBusiness = await prisma.business.create({
    data: {
      ownerId: clientUser.id,
      name: 'Artisan Heritage Silks',
      category: 'Fashion',
      description: 'Pure Kanchipuram and Banarasi handloom silk sarees woven directly by master weavers with silk mark certification.',
      city: 'Varanasi',
      state: 'Uttar Pradesh',
      country: 'India',
      phone: '+91 98222 33445',
      email: 'client@demo.vyparx.local',
      website: 'https://artisanheritagesilks.demo.vyparx.com',
      instagram: '@artisanheritagesilks',
      facebook: 'artisanheritagesilks',
      goals: JSON.stringify([
        'Build a website',
        'Reach customers across India',
        'Sell online',
        'Build social media presence'
      ]),
      discoveryMethods: JSON.stringify([
        'Walk-in',
        'Instagram',
        'Word of mouth'
      ]),
      customerStatus: 'ACTIVE_CLIENT',
      growthStage: 'ONLINE_DISCOVERY',
      digitalReadinessScore: 82,
    },
  });

  // Lead for Client (Converted)
  await prisma.lead.create({
    data: {
      businessId: clientBusiness.id,
      ownerId: clientUser.id,
      status: 'CONVERTED',
      source: 'DIRECT_CONTACT',
      score: 82,
      notes: 'Converted client. Active Phase 1 delivery in progress.',
    },
  });

  // Proposal for Client (Accepted)
  const clientProposal = await prisma.proposal.create({
    data: {
      businessId: clientBusiness.id,
      title: 'VyparX Growth Acceleration Package - Heritage Saree Edition',
      description: 'Complete digital foundation setup including modern brand identity, responsive high-speed catalog website, and Google Search & Maps optimization.',
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      status: 'ACCEPTED',
      totalAmount: 49999,
      currency: 'INR',
      acceptedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      clientFeedback: 'Looking forward to the website launch and reaching customers in Mumbai and Delhi!',
    },
  });

  await prisma.proposalItem.createMany({
    data: [
      {
        proposalId: clientProposal.id,
        service: 'Website & Digital Catalog Development',
        description: 'Next.js high-speed web catalog with mobile-first UI and direct WhatsApp ordering.',
        quantity: 1,
        price: 29999,
      },
      {
        proposalId: clientProposal.id,
        service: 'Google Business & Local SEO Optimization',
        description: 'Profile optimization, keyword integration, and local review acceleration funnel.',
        quantity: 1,
        price: 10000,
      },
      {
        proposalId: clientProposal.id,
        service: 'Brand Identity & Social Media Launch Kit',
        description: 'High-res logo refinement, brand color guide, and 15 custom launch post templates.',
        quantity: 1,
        price: 10000,
      },
    ],
  });

  // Active Project for Client
  const clientProject = await prisma.project.create({
    data: {
      businessId: clientBusiness.id,
      name: 'Digital Foundation & Pan-India Launch',
      description: 'End-to-end digital setup: Brand styling, custom responsive catalog, Google SEO, and WhatsApp inquiry funnel.',
      status: 'IN_PROGRESS',
      progress: 78,
      startDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    },
  });

  // Milestones
  const m1 = await prisma.milestone.create({
    data: {
      projectId: clientProject.id,
      title: '1. Brand Kit & Visual Assets',
      description: 'Logo finalize, typography, color scheme, and banner designs',
      order: 1,
      status: 'COMPLETED',
    },
  });

  const m2 = await prisma.milestone.create({
    data: {
      projectId: clientProject.id,
      title: '2. Website Design & Catalog Integration',
      description: 'UI/UX mockups, saree collection structure, and mobile checkout design',
      order: 2,
      status: 'IN_PROGRESS',
    },
  });

  const m3 = await prisma.milestone.create({
    data: {
      projectId: clientProject.id,
      title: '3. SEO & Google Business Setup',
      description: 'Local keyword injection and verified business listing setup',
      order: 3,
      status: 'AVAILABLE',
    },
  });

  const m4 = await prisma.milestone.create({
    data: {
      projectId: clientProject.id,
      title: '4. Quality Assurance & Public Launch',
      description: 'Cross-device verification, speed audit, and production domain link',
      order: 4,
      status: 'LOCKED',
    },
  });

  // Tasks
  await prisma.task.createMany({
    data: [
      {
        projectId: clientProject.id,
        title: 'Complete brand color palette and font pairing',
        description: 'Prepared royal silk gold and deep maroon styling guide.',
        assignedToId: teamUser.id,
        status: 'COMPLETED',
        priority: 'HIGH',
        isClientVisible: true,
      },
      {
        projectId: clientProject.id,
        title: 'Develop responsive homepage & product showcase',
        description: 'Implemented fast loading saree gallery with zoom and filter.',
        assignedToId: teamUser.id,
        status: 'COMPLETED',
        priority: 'HIGH',
        isClientVisible: true,
      },
      {
        projectId: clientProject.id,
        title: 'Review and approve Homepage Deliverable with client',
        description: 'Awaiting client approval on homepage wireframe and color hierarchy.',
        assignedToId: adminUser.id,
        status: 'IN_REVIEW',
        priority: 'HIGH',
        isClientVisible: true,
      },
      {
        projectId: clientProject.id,
        title: 'Configure WhatsApp direct checkout hook',
        description: 'Integrate pre-filled product SKU messages for fast mobile buyer conversion.',
        assignedToId: teamUser.id,
        status: 'IN_PROGRESS',
        priority: 'MEDIUM',
        isClientVisible: true,
      },
      {
        projectId: clientProject.id,
        title: 'Internal server configuration and SSL certificate setup',
        description: 'Deploying edge worker caching and domain DNS routing.',
        assignedToId: adminUser.id,
        status: 'TODO',
        priority: 'MEDIUM',
        isClientVisible: false, // Internal task
      },
    ],
  });

  // Deliverables
  const deliverable1 = await prisma.deliverable.create({
    data: {
      projectId: clientProject.id,
      name: 'Official Website Homepage & Catalog Mockup (v1.2)',
      description: 'Complete high-fidelity design of the homepage featuring handloom heritage storytelling, featured saree collection, and quick WhatsApp inquiry drawer.',
      fileUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80',
      previewUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80',
      deliverableType: 'WEBSITE_DESIGN',
      status: 'PENDING_APPROVAL',
      uploadedBy: 'VyparX Design Team',
    },
  });

  const deliverable2 = await prisma.deliverable.create({
    data: {
      projectId: clientProject.id,
      name: 'Refined Brand Logo & Vector Asset Pack',
      description: 'Silk Mark certified logo variants in SVG, PNG, and print-ready PDF formats with gold foil emblem.',
      fileUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      previewUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      deliverableType: 'LOGO',
      status: 'APPROVED',
      uploadedBy: 'VyparX Creative Lead',
    },
  });

  await prisma.approval.create({
    data: {
      deliverableId: deliverable2.id,
      userId: clientUser.id,
      action: 'APPROVED',
      comment: 'Loved the gold foil emblem! Matches our heritage aesthetic perfectly.',
    },
  });

  // Report for Client
  await prisma.report.create({
    data: {
      businessId: clientBusiness.id,
      title: 'October 2026 Growth & Readiness Report',
      period: 'October 2026',
      summary: 'Strong digital foundation progress. Website design is 90% finalized. Google search indexing prepared. Initial inquiries funnel ready for launch.',
      metrics: JSON.stringify({
        digitalReadinessScore: 82,
        tasksCompleted: 8,
        tasksTotal: 10,
        milestonesAchieved: 2,
        estimatedLaunchDate: '15 Nov 2026',
        projectedTrafficReach: 'Pan-India (Metro Tier 1 & 2)',
      }),
      recommendations: JSON.stringify([
        'Approve the website homepage mockup to proceed with live deployment',
        'Prepare 10 high-resolution photos of upcoming festival saree collection',
        'Finalize UPI business payment handle for direct invoice processing'
      ]),
    },
  });

  // Support Request for Client
  await prisma.supportRequest.create({
    data: {
      businessId: clientBusiness.id,
      userId: clientUser.id,
      subject: 'Inquiry regarding domain name connection',
      message: 'Hi VyparX team, we already own artisanheritagesilks.in on GoDaddy. How do we point it to the new website?',
      priority: 'MEDIUM',
      status: 'IN_PROGRESS',
      adminReply: 'Hello Priya! Our team will send you the exact DNS records (A and CNAME records) within 24 hours to link your GoDaddy domain.',
    },
  });

  // Notifications for Client
  await prisma.notification.createMany({
    data: [
      {
        userId: clientUser.id,
        title: 'Deliverable Ready for Approval',
        message: 'Your website homepage design (v1.2) is ready for review. Please approve or request changes.',
        type: 'ACTION_REQUIRED',
        link: '/client/deliverables',
        read: false,
      },
      {
        userId: clientUser.id,
        title: 'Support Ticket Updated',
        message: 'VyparX team responded to your inquiry regarding domain connection.',
        type: 'INFO',
        link: '/client/support',
        read: false,
      },
      {
        userId: prospectUser.id,
        title: 'Digital Audit Completed',
        message: 'Your Digital Readiness Score is 64/100. Check your growth roadmap.',
        type: 'SUCCESS',
        link: '/business/roadmap',
        read: false,
      },
    ],
  });

  // Activity Logs
  await prisma.activityLog.createMany({
    data: [
      {
        userId: prospectUser.id,
        businessId: prospectBusiness.id,
        action: 'BUSINESS_ONBOARDED',
        entityType: 'Business',
        entityId: prospectBusiness.id,
        metadata: JSON.stringify({ name: prospectBusiness.name, category: 'Handicrafts' }),
      },
      {
        userId: prospectUser.id,
        businessId: prospectBusiness.id,
        action: 'AUDIT_SUBMITTED',
        entityType: 'Audit',
        entityId: prospectBusiness.id,
        metadata: JSON.stringify({ score: 64 }),
      },
      {
        userId: clientUser.id,
        businessId: clientBusiness.id,
        action: 'PROPOSAL_ACCEPTED',
        entityType: 'Proposal',
        entityId: clientProposal.id,
        metadata: JSON.stringify({ totalAmount: 49999 }),
      },
      {
        userId: adminUser.id,
        businessId: clientBusiness.id,
        action: 'PROJECT_CREATED',
        entityType: 'Project',
        entityId: clientProject.id,
        metadata: JSON.stringify({ name: clientProject.name }),
      },
      {
        userId: clientUser.id,
        businessId: clientBusiness.id,
        action: 'DELIVERABLE_APPROVED',
        entityType: 'Deliverable',
        entityId: deliverable2.id,
        metadata: JSON.stringify({ deliverableName: deliverable2.name }),
      },
    ],
  });

  console.log('✅ VyparX database seeded successfully!');
  console.log('--------------------------------------------------');
  console.log('Demo Credentials:');
  console.log('1. Admin:    admin@demo.vyparx.local    / password123');
  console.log('2. Team:     team@demo.vyparx.local     / password123');
  console.log('3. Client:   client@demo.vyparx.local   / password123');
  console.log('4. Prospect: business@demo.vyparx.local / password123');
  console.log('--------------------------------------------------');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
