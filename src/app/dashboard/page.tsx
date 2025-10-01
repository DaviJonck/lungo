"use client";

import { useState } from "react";
import { Content, DashboardContainer } from "./styles";
import Sidebar from "./components/Sidebar";
import DashboardHeader from "./components/DashboardHeader";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import {
  Infographics,
  RemindersAndActivities,
  SummaryCards,
} from "./components/Sections";

export default function DashboardPage() {
  const [user, setUser] = useState<{ name: string; avatar: string } | null>({
    name: "Davi Jonck",
    avatar: "/Davi.png",
  });

  return (
    <ProtectedRoute>
      <DashboardContainer>
        <Sidebar />

        <Content>
          <DashboardHeader user={user} setUser={setUser} />
          <SummaryCards />
          <RemindersAndActivities />
          <Infographics />
        </Content>
      </DashboardContainer>
    </ProtectedRoute>
  );
}
