import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const onboardingSchema = z.object({
  businessName: z.string().min(2, "Business name is required").max(120),
  category: z.string().min(2, "Please select a category"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  country: z.string().default("India"),
  phone: z.string().min(8, "Valid phone number is required"),
  email: z.string().email("Valid business email is required").optional().nullable().or(z.literal("")),
  website: z.string().optional().nullable().or(z.literal("")),
  instagram: z.string().optional().nullable(),
  facebook: z.string().optional().nullable(),
  description: z.string().min(10, "Please provide a brief description (at least 10 chars)").max(1000),
  goals: z.array(z.string()).min(1, "Select at least one primary goal"),
  discoveryMethods: z.array(z.string()).min(1, "Select at least one customer discovery method"),
});

export const auditSubmissionSchema = z.object({
  businessId: z.string().uuid().or(z.string().min(1)),
  websiteStatus: z.enum(["none", "basic_outdated", "standard", "high_converting"]),
  seoPresence: z.enum(["none", "not_indexed", "ranking_some_terms", "high_visibility"]),
  googleBusiness: z.enum(["none", "claimed_unoptimized", "verified_active", "optimized_with_reviews"]),
  socialMedia: z.enum(["none", "inactive", "occasional_posts", "active_professional"]),
  branding: z.enum(["none", "simple_logo", "consistent_branding", "complete_brand_system"]),
  onlineSales: z.enum(["offline_only", "whatsapp_manual", "catalog_online", "full_ecommerce"]),
  customerAcquisition: z.enum(["walk_in_only", "word_of_mouth", "social_media", "multi_channel_digital"]),
  digitalGoals: z.array(z.string()).min(1, "Please specify your digital goals"),
});

export const updateLeadSchema = z.object({
  leadId: z.string().min(1),
  status: z.enum(["NEW", "CONTACTED", "AUDIT_REQUESTED", "AUDIT_REVIEWED", "PROPOSAL_SENT", "CONVERTED", "LOST"]),
  notes: z.string().optional(),
  score: z.number().int().min(0).max(100).optional(),
});

export const createProposalSchema = z.object({
  businessId: z.string().min(1),
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(10, "Description is required"),
  validDays: z.number().int().min(1).max(90).default(30),
  items: z.array(
    z.object({
      service: z.string().min(2, "Service name is required"),
      description: z.string().min(5, "Description is required"),
      quantity: z.number().int().min(1).default(1),
      price: z.number().min(0, "Price must be positive"),
    })
  ).min(1, "At least one proposal line item is required"),
});

export const createProjectSchema = z.object({
  businessId: z.string().min(1),
  name: z.string().min(3, "Project name is required"),
  description: z.string().optional(),
  startDate: z.string().optional(),
  dueDate: z.string().optional(),
});

export const createTaskSchema = z.object({
  projectId: z.string().min(1),
  title: z.string().min(3, "Task title is required"),
  description: z.string().optional(),
  assignedToId: z.string().optional().nullable(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).default("MEDIUM"),
  isClientVisible: z.boolean().default(true),
  dueDate: z.string().optional(),
});

export const updateTaskStatusSchema = z.object({
  taskId: z.string().min(1),
  status: z.enum(["TODO", "IN_PROGRESS", "IN_REVIEW", "COMPLETED"]),
});

export const createDeliverableSchema = z.object({
  projectId: z.string().min(1),
  name: z.string().min(3, "Deliverable name is required"),
  description: z.string().min(5, "Description is required"),
  fileUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  previewUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  deliverableType: z.enum(["WEBSITE_DESIGN", "LOGO", "BRAND_ASSET", "SEO_REPORT", "SOCIAL_CONTENT", "DOCUMENT"]),
  uploadedBy: z.string().optional(),
});

export const deliverableApprovalSchema = z.object({
  deliverableId: z.string().min(1),
  action: z.enum(["APPROVED", "REVISION_REQUESTED"]),
  comment: z.string().optional(),
});

export const createSupportTicketSchema = z.object({
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(15, "Message must be at least 15 characters"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).default("MEDIUM"),
});

export const createReportSchema = z.object({
  businessId: z.string().min(1),
  title: z.string().min(3, "Report title is required"),
  period: z.string().min(2, "Period is required (e.g. October 2026)"),
  summary: z.string().min(10, "Summary is required"),
  metrics: z.record(z.any()),
  recommendations: z.array(z.string()).min(1, "At least one recommendation is required"),
});
