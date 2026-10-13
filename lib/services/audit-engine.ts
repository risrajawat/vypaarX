export interface AuditInput {
  websiteStatus: "none" | "basic_outdated" | "standard" | "high_converting";
  seoPresence: "none" | "not_indexed" | "ranking_some_terms" | "high_visibility";
  googleBusiness: "none" | "claimed_unoptimized" | "verified_active" | "optimized_with_reviews";
  socialMedia: "none" | "inactive" | "occasional_posts" | "active_professional";
  branding: "none" | "simple_logo" | "consistent_branding" | "complete_brand_system";
  onlineSales: "offline_only" | "whatsapp_manual" | "catalog_online" | "full_ecommerce";
  customerAcquisition: "walk_in_only" | "word_of_mouth" | "social_media" | "multi_channel_digital";
  digitalGoals: string[];
}

export interface AuditResult {
  overallScore: number;
  websiteScore: number;
  seoScore: number;
  googleScore: number;
  socialScore: number;
  brandingScore: number;
  salesScore: number;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

export function calculateDigitalReadiness(input: AuditInput): AuditResult {
  // 1. Website Scoring (0-20 points)
  let websiteScore = 0;
  if (input.websiteStatus === "none") websiteScore = 0;
  else if (input.websiteStatus === "basic_outdated") websiteScore = 8;
  else if (input.websiteStatus === "standard") websiteScore = 15;
  else if (input.websiteStatus === "high_converting") websiteScore = 20;

  // 2. SEO Scoring (0-15 points)
  let seoScore = 0;
  if (input.seoPresence === "none") seoScore = 0;
  else if (input.seoPresence === "not_indexed") seoScore = 4;
  else if (input.seoPresence === "ranking_some_terms") seoScore = 10;
  else if (input.seoPresence === "high_visibility") seoScore = 15;

  // 3. Google Presence (0-20 points)
  let googleScore = 0;
  if (input.googleBusiness === "none") googleScore = 0;
  else if (input.googleBusiness === "claimed_unoptimized") googleScore = 7;
  else if (input.googleBusiness === "verified_active") googleScore = 14;
  else if (input.googleBusiness === "optimized_with_reviews") googleScore = 20;

  // 4. Social Media (0-15 points)
  let socialScore = 0;
  if (input.socialMedia === "none") socialScore = 0;
  else if (input.socialMedia === "inactive") socialScore = 4;
  else if (input.socialMedia === "occasional_posts") socialScore = 9;
  else if (input.socialMedia === "active_professional") socialScore = 15;

  // 5. Branding (0-15 points)
  let brandingScore = 0;
  if (input.branding === "none") brandingScore = 0;
  else if (input.branding === "simple_logo") brandingScore = 5;
  else if (input.branding === "consistent_branding") brandingScore = 10;
  else if (input.branding === "complete_brand_system") brandingScore = 15;

  // 6. Online Sales / Conversion (0-15 points)
  let salesScore = 0;
  if (input.onlineSales === "offline_only") salesScore = 0;
  else if (input.onlineSales === "whatsapp_manual") salesScore = 6;
  else if (input.onlineSales === "catalog_online") salesScore = 11;
  else if (input.onlineSales === "full_ecommerce") salesScore = 15;

  // Normalize Total Score (Total max = 100)
  const rawTotal = websiteScore + seoScore + googleScore + socialScore + brandingScore + salesScore;
  const overallScore = Math.min(100, Math.max(0, Math.round(rawTotal)));

  // Generate Strengths
  const strengths: string[] = [];
  if (input.googleBusiness === "optimized_with_reviews" || input.googleBusiness === "verified_active") {
    strengths.push("Active Google Business Profile that establishes initial local verification and search presence.");
  }
  if (input.branding === "consistent_branding" || input.branding === "complete_brand_system") {
    strengths.push("Recognizable visual identity and branding that inspires buyer confidence.");
  }
  if (input.customerAcquisition === "word_of_mouth" || input.customerAcquisition === "multi_channel_digital") {
    strengths.push("Established offline trust and customer satisfaction that is ready to be amplified digitally.");
  }
  if (input.onlineSales === "whatsapp_manual" || input.onlineSales === "catalog_online" || input.onlineSales === "full_ecommerce") {
    strengths.push("Existing readiness to handle incoming online queries and orders.");
  }
  if (strengths.length === 0) {
    strengths.push("High growth potential: Clean slate with huge upside for digital market capture.");
    strengths.push("Authentic local business reputation ready to be transformed into an online brand.");
  }

  // Generate Weaknesses
  const weaknesses: string[] = [];
  if (input.websiteStatus === "none" || input.websiteStatus === "basic_outdated") {
    weaknesses.push("Missing or outdated website, preventing discovery by customers searching beyond your immediate street.");
  }
  if (input.googleBusiness === "none" || input.googleBusiness === "claimed_unoptimized") {
    weaknesses.push("Google Business Profile is missing or unoptimized, losing high-intent local 'near me' searchers.");
  }
  if (input.socialMedia === "none" || input.socialMedia === "inactive") {
    weaknesses.push("Dormant social presence, failing to build trust with modern buyers who check social media first.");
  }
  if (input.onlineSales === "offline_only") {
    weaknesses.push("No digital inquiry or ordering pipeline, leaving zero revenue capture outside physical store hours.");
  }
  if (weaknesses.length === 0) {
    weaknesses.push("National scale readiness: Current channels need unified conversion tracking and national SEO expansion.");
  }

  // Generate Prioritized Actionable Recommendations
  const recommendations: string[] = [];
  if (websiteScore < 15) {
    recommendations.push("Priority 1: Build a high-speed, mobile-responsive catalog website with direct WhatsApp inquiry integration.");
  } else {
    recommendations.push("Priority 1: Enhance web page load speed and implement structured schema markup for rich search snippets.");
  }

  if (googleScore < 15 || seoScore < 10) {
    recommendations.push("Priority 2: Optimize Google Business Profile with localized category keywords and automated customer review generation.");
  } else {
    recommendations.push("Priority 2: Scale local search rankings across adjacent cities and regional target markets.");
  }

  if (socialScore < 10 || brandingScore < 10) {
    recommendations.push("Priority 3: Develop a professional brand design kit and consistent weekly social media showcase.");
  } else {
    recommendations.push("Priority 3: Run targeted performance ad campaigns to drive direct inquiries from pan-India buyers.");
  }

  return {
    overallScore,
    websiteScore,
    seoScore,
    googleScore,
    socialScore,
    brandingScore,
    salesScore,
    strengths,
    weaknesses,
    recommendations,
  };
}
