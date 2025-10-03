"use client";

import { ReactNode } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Sidebar from "./components/Sidebar";
import { Content, DashboardContainer } from "./styles";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute>
      <DashboardContainer>
        <Sidebar />
        <Content>{children}</Content>
      </DashboardContainer>
    </ProtectedRoute>
  );
}
