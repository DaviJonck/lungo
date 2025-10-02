"use client";

import { Content, DashboardContainer } from "./styles";
import Sidebar from "./components/Sidebar";
import DashboardHeader from "./components/DashboardHeader";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import {
  Infographics,
  RemindersAndActivities,
  SummaryCards,
} from "./components/Sections";
import { useUserData } from "@/hooks/useUserData";
import { useProfileCompletion } from "@/hooks/useProfileCompletion";
import CompleteProfileBanner from "../(dashboard)/components/CompleteProfileBanner";

export default function DashboardPage() {
  const { userData, loading, error } = useUserData();
  const { isProfileComplete, profileData } = useProfileCompletion();

  if (loading) {
    return (
      <ProtectedRoute>
        <DashboardContainer>
          <Sidebar />
          <Content>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "50vh",
                fontSize: "18px",
                color: "#666",
              }}
            >
              Carregando dados do usuário...
            </div>
          </Content>
        </DashboardContainer>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <DashboardContainer>
          <Sidebar />
          <Content>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "50vh",
                fontSize: "18px",
                color: "#e74c3c",
              }}
            >
              Erro ao carregar dados: {error}
            </div>
          </Content>
        </DashboardContainer>
      </ProtectedRoute>
    );
  }

  const user = userData
    ? {
        name: userData.name,
        avatar: userData.avatar || "/Davi.png",
      }
    : null;

  return (
    <ProtectedRoute>
      <DashboardContainer>
        <Sidebar />

        <Content>
          <DashboardHeader user={user} setUser={() => {}} />
          {isProfileComplete === false && <CompleteProfileBanner />}
          <SummaryCards userData={userData} />
          <RemindersAndActivities userData={userData} />
          <Infographics userData={userData} />
        </Content>
      </DashboardContainer>
    </ProtectedRoute>
  );
}
