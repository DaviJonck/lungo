"use client";

import DashboardHeader from "./components/DashboardHeader";

import { useUserData } from "@/hooks/useUserData";
import { useProfileCompletion } from "@/hooks/useProfileCompletion";
import CompleteProfileBanner from "../components/CompleteProfileBanner";
import {
  SummaryCards,
  RemindersAndActivities,
  Infographics,
} from "./components/Sections";

export default function DashboardHomePage() {
  const { userData, loading, error } = useUserData();
  const { isProfileComplete } = useProfileCompletion();

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
          fontSize: 18,
          color: "#666",
        }}
      >
        Carregando dados do usuário...
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
          fontSize: 18,
          color: "#e74c3c",
        }}
      >
        Erro ao carregar dados: {error}
      </div>
    );
  }

  const user = userData
    ? {
        name: userData.name,
        avatar: userData.avatar || "/Davi.png",
      }
    : null;

  return (
    <>
      <DashboardHeader title="Home" />
      {isProfileComplete === false && <CompleteProfileBanner />}
      <SummaryCards userData={userData} />
      <RemindersAndActivities userData={userData} />
      <Infographics userData={userData} />
    </>
  );
}
