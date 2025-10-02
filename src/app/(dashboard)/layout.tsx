import { Metadata } from "next";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import OnboardingRedirect from "./components/OnboardingRedirect";

export const metadata: Metadata = {
  title: "Dashboard - LunGo",
  description: "Painel principal da LunGo",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <OnboardingRedirect />
      {children}
    </ProtectedRoute>
  );
}
