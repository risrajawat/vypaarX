import { requireAuth } from "@/lib/auth/roles";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { dbUser } = await requireAuth();

  // If the user already has a business created, redirect them to their dashboard
  if (dbUser.business) {
    if (
      dbUser.business.customerStatus === "ACTIVE_CLIENT" ||
      dbUser.business.customerStatus === "COMPLETED"
    ) {
      redirect("/client/dashboard");
    } else {
      redirect("/business/dashboard");
    }
  }

  return <>{children}</>;
}
