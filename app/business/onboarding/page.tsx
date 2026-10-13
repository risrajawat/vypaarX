"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Label } from "@/components/ui/form-elements";
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
  Instagram,
  CheckCircle2,
  ArrowRight,
  AlertCircle,
  Sparkles,
  Target,
  Compass,
} from "lucide-react";

export default function BusinessOnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    businessName: "",
    category: "Handicrafts",
    city: "",
    state: "",
    country: "India",
    phone: "",
    email: "",
    website: "",
    instagram: "",
    facebook: "",
    description: "",
    goals: ["Build a website", "Get more customers", "Reach customers across India"] as string[],
    discoveryMethods: ["Walk-in", "Word of mouth"] as string[],
  });

  const categories = [
    "Handicrafts & Decor",
    "Fashion & Handlooms",
    "Food & Sweet Shops",
    "Manufacturing & B2B",
    "Retail & Jewelry",
    "Beauty & Wellness",
    "Home Services",
    "Professional Services",
    "Other",
  ];

  const availableGoals = [
    "Build a website",
    "Get more customers",
    "Improve Google visibility",
    "Improve SEO",
    "Build social media presence",
    "Sell online",
    "Reach customers outside my city",
    "Reach customers across India",
    "Reach international customers",
  ];

  const availableDiscoveryMethods = [
    "Walk-in",
    "Word of mouth",
    "Instagram",
    "Google",
    "WhatsApp",
    "Marketplace",
    "Other",
  ];

  const toggleGoal = (goal: string) => {
    if (formData.goals.includes(goal)) {
      if (formData.goals.length > 1) {
        setFormData({ ...formData, goals: formData.goals.filter((g) => g !== goal) });
      }
    } else {
      setFormData({ ...formData, goals: [...formData.goals, goal] });
    }
  };

  const toggleDiscovery = (method: string) => {
    if (formData.discoveryMethods.includes(method)) {
      if (formData.discoveryMethods.length > 1) {
        setFormData({
          ...formData,
          discoveryMethods: formData.discoveryMethods.filter((m) => m !== method),
        });
      }
    } else {
      setFormData({ ...formData, discoveryMethods: [...formData.discoveryMethods, method] });
    }
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (!formData.businessName || !formData.city || !formData.state || !formData.phone) {
        setError("Please fill in all required fields (Business Name, City, State, Phone).");
        return;
      }
      setError("");
      setStep(2);
    } else if (step === 2) {
      if (!formData.description || formData.description.length < 10) {
        setError("Please provide at least a short 10-character description of your products or craft.");
        return;
      }
      setError("");
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/businesses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create business profile. Please review the form.");
        setLoading(false);
        return;
      }

      router.push(data.nextUrl || "/business/dashboard");
      router.refresh();
    } catch (err) {
      setError("An unexpected network error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Progress Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-semibold text-blue-700">
            <Sparkles className="w-3.5 h-3.5" />
            BUSINESS ONBOARDING WIZARD
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Tell Us About Your Business
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            This information configures your personalized Digital Readiness Audit and growth roadmap.
          </p>

          <div className="flex items-center justify-center gap-3 pt-3">
            <div className={`h-2 w-24 rounded-full ${step >= 1 ? "bg-blue-600" : "bg-slate-200"}`} />
            <div className={`h-2 w-24 rounded-full ${step >= 2 ? "bg-blue-600" : "bg-slate-200"}`} />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 sm:p-10">
          {error && (
            <div className="mb-6 rounded-lg bg-red-50 p-3.5 border border-red-200 flex items-start gap-2.5 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleNext} className="space-y-6">
            {step === 1 && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <Building2 className="w-5 h-5 text-blue-600" />
                  <h2 className="font-bold text-slate-900 text-base">Basic Business Information</h2>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="businessName">Business / Brand Name *</Label>
                  <Input
                    id="businessName"
                    required
                    placeholder="e.g. Sharma Handicrafts & Woodcrafts"
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="category">Business Category *</Label>
                    <select
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {categories.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="phone">Phone / WhatsApp *</Label>
                    <Input
                      id="phone"
                      required
                      placeholder="+91 98111 22334"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      required
                      placeholder="e.g. Jaipur"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      required
                      placeholder="e.g. Rajasthan"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      disabled
                      value={formData.country}
                      className="bg-slate-50 text-slate-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="website">Existing Website (Optional)</Label>
                    <Input
                      id="website"
                      placeholder="https://..."
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="instagram">Instagram Handle (Optional)</Label>
                    <Input
                      id="instagram"
                      placeholder="@sharmahandicrafts"
                      value={formData.instagram}
                      onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <Button type="submit" variant="brand">
                    Continue to Goals & Discovery
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <Target className="w-5 h-5 text-blue-600" />
                  <h2 className="font-bold text-slate-900 text-base">Growth Goals & Channels</h2>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="description">Tell us briefly about what you make or sell *</Label>
                  <Textarea
                    id="description"
                    required
                    rows={3}
                    placeholder="e.g. We craft premium teak wood home decor, traditional jali panels, and custom furniture using master Rajasthani techniques."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>What do you want to achieve with VyparX? (Select all that apply)</Label>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {availableGoals.map((g) => {
                      const selected = formData.goals.includes(g);
                      return (
                        <button
                          key={g}
                          type="button"
                          onClick={() => toggleGoal(g)}
                          className={`text-xs px-3 py-2 rounded-lg border font-medium transition ${
                            selected
                              ? "border-blue-600 bg-blue-50 text-blue-700 font-semibold"
                              : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                          }`}
                        >
                          {selected ? "✓ " : "+ "}
                          {g}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>How do customers currently find you? (Select all that apply)</Label>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {availableDiscoveryMethods.map((m) => {
                      const selected = formData.discoveryMethods.includes(m);
                      return (
                        <button
                          key={m}
                          type="button"
                          onClick={() => toggleDiscovery(m)}
                          className={`text-xs px-3 py-2 rounded-lg border font-medium transition ${
                            selected
                              ? "border-emerald-600 bg-emerald-50 text-emerald-800 font-semibold"
                              : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                          }`}
                        >
                          {selected ? "✓ " : "+ "}
                          {m}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                  <Button type="button" variant="outline" onClick={() => setStep(1)}>
                    ← Back
                  </Button>
                  <Button type="submit" variant="brand" isLoading={loading}>
                    Finish Onboarding & Open Growth Hub
                    <CheckCircle2 className="w-4 h-4 ml-1.5" />
                  </Button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
