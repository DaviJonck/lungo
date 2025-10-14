import React, { createContext, useContext, ReactNode } from "react";
import { usePatientDashboard } from "@/hooks/useSupabaseData";
import { UserData } from "@/hooks/useUserData";
import { PatientPlan, TodayExercise } from "@/types/supabase";

interface DashboardContextType {
  // Dados do dashboard
  activePlan: PatientPlan | null;
  todayExercises: (TodayExercise & { isCompleted: boolean })[];
  allExercises: unknown[];
  completedToday: Array<{
    exercise_id: number;
    scheduled_exercise_id?: number;
  }>;
  loading: boolean;
  error: string | null;
  summary: {
    total: number;
    totalDuration: number;
    byType: Record<string, number>;
  };
  refetch: () => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined
);

interface DashboardProviderProps {
  children: ReactNode;
  userData?: UserData | null;
}

export function DashboardProvider({
  children,
  userData,
}: DashboardProviderProps) {
  const dashboardData = usePatientDashboard(userData?.id || "");

  return (
    <DashboardContext.Provider value={dashboardData as DashboardContextType}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
}
