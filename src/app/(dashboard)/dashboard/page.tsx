"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
  const router = useRouter();
  const searchParams = useSearchParams();
  const { userData, loading, error } = useUserData();
  const { isProfileComplete } = useProfileCompletion();

  // Verifica se veio do Pagar.me com sucesso e redireciona
  useEffect(() => {
    const payment = searchParams.get("payment");
    const orderId = searchParams.get("order_id");

    if (payment === "success" && orderId) {
      // Redireciona para a página de sucesso com os parâmetros
      router.replace(
        `/subscription/success?payment=success&order_id=${orderId}`
      );
    }
  }, [searchParams, router]);

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
