import { useState, useEffect, useCallback } from "react";
import { DashboardService } from "@/services/supabase";
import {
  formatScheduledExercisesForToday,
  generateExerciseSummary,
  addCompletionStatusToExercises,
} from "@/utils/exerciseUtils";
import { TodayExercise, PatientPlan } from "@/types/supabase";
import { useSupabaseCache } from "./useSupabaseCache";

interface DashboardData {
  activePlan: PatientPlan | null;
  todayExercises: TodayExercise[];
  allExercises: any[];
  completedToday: any[];
  loading: boolean;
  error: string | null;
  summary: {
    total: number;
    totalDuration: number;
    byType: Record<string, number>;
  };
}

/**
 * Hook principal para buscar dados do dashboard do paciente
 */
export function usePatientDashboard(patientId: string) {
  const { getOrSetCache, clearCache } = useSupabaseCache();

  const [data, setData] = useState<DashboardData>({
    activePlan: null,
    todayExercises: [],
    allExercises: [],
    completedToday: [],
    loading: true,
    error: null,
    summary: {
      total: 0,
      totalDuration: 0,
      byType: {},
    },
  });

  const fetchDashboardData = useCallback(async () => {
    if (!patientId) return;

    const cacheKey = `dashboard-${patientId}`;

    try {
      setData((prev) => ({ ...prev, loading: true, error: null }));

      const dashboardData = await getOrSetCache(cacheKey, async () => {
        console.log(
          `🔍 Buscando dados do dashboard para paciente: ${patientId}`
        );
        return await DashboardService.getPatientDashboardData(patientId);
      });

      // Formatar exercícios de hoje
      const formattedExercises = formatScheduledExercisesForToday(
        dashboardData.todayExercises
      );

      // Adicionar status de conclusão aos exercícios
      const exercisesWithCompletion = addCompletionStatusToExercises(
        formattedExercises,
        dashboardData.completedToday
      );

      // Gerar resumo
      const summary = generateExerciseSummary(formattedExercises);

      console.log(
        `✅ Dados carregados: ${formattedExercises.length} exercícios, plano: ${
          dashboardData.activePlan?.plan_name || "Nenhum"
        }`
      );

      setData({
        activePlan: dashboardData.activePlan,
        todayExercises: exercisesWithCompletion,
        allExercises: dashboardData.allExercises,
        completedToday: dashboardData.completedToday,
        loading: false,
        error: null,
        summary,
      });
    } catch (error) {
      console.error("Erro ao buscar dados do dashboard:", error);
      setData((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : "Erro desconhecido",
      }));
    }
  }, [patientId, getOrSetCache]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const refetch = useCallback(() => {
    const cacheKey = `dashboard-${patientId}`;
    clearCache(cacheKey);
    fetchDashboardData();
  }, [fetchDashboardData, patientId, clearCache]);

  return {
    ...data,
    refetch,
  };
}

/**
 * Hook para buscar exercícios de hoje especificamente
 */
export function useTodayExercises(patientId: string) {
  const [exercises, setExercises] = useState<TodayExercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTodayExercises = useCallback(async () => {
    if (!patientId) return;

    setLoading(true);
    setError(null);

    try {
      const dashboardData = await DashboardService.getPatientDashboardData(
        patientId
      );
      const formattedExercises = formatScheduledExercisesForToday(
        dashboardData.todayExercises
      );

      setExercises(formattedExercises);
    } catch (error) {
      console.error("Erro ao buscar exercícios de hoje:", error);
      setError(error instanceof Error ? error.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  useEffect(() => {
    fetchTodayExercises();
  }, [fetchTodayExercises]);

  return {
    exercises,
    loading,
    error,
    refetch: fetchTodayExercises,
  };
}

/**
 * Hook para buscar plano ativo do paciente
 */
export function useActivePatientPlan(patientId: string) {
  const [plan, setPlan] = useState<PatientPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActivePlan = useCallback(async () => {
    if (!patientId) return;

    setLoading(true);
    setError(null);

    try {
      const dashboardData = await DashboardService.getPatientDashboardData(
        patientId
      );
      setPlan(dashboardData.activePlan);
    } catch (error) {
      console.error("Erro ao buscar plano ativo:", error);
      setError(error instanceof Error ? error.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  useEffect(() => {
    fetchActivePlan();
  }, [fetchActivePlan]);

  return {
    plan,
    loading,
    error,
    refetch: fetchActivePlan,
  };
}

/**
 * Hook para gerenciar estado de exercícios completados
 */
export function useExerciseCompletion() {
  const [completedExercises, setCompletedExercises] = useState<
    Record<string, boolean>
  >({});
  const [completionData, setCompletionData] = useState<Record<string, any>>({});

  const markExerciseComplete = useCallback((exerciseId: string, data?: any) => {
    setCompletedExercises((prev) => ({ ...prev, [exerciseId]: true }));
    if (data) {
      setCompletionData((prev) => ({ ...prev, [exerciseId]: data }));
    }
  }, []);

  const markExerciseIncomplete = useCallback((exerciseId: string) => {
    setCompletedExercises((prev) => {
      const newState = { ...prev };
      delete newState[exerciseId];
      return newState;
    });
    setCompletionData((prev) => {
      const newState = { ...prev };
      delete newState[exerciseId];
      return newState;
    });
  }, []);

  const isExerciseCompleted = useCallback(
    (exerciseId: string) => {
      return completedExercises[exerciseId] || false;
    },
    [completedExercises]
  );

  const getCompletionData = useCallback(
    (exerciseId: string) => {
      return completionData[exerciseId] || null;
    },
    [completionData]
  );

  const resetCompletion = useCallback(() => {
    setCompletedExercises({});
    setCompletionData({});
  }, []);

  const getCompletionSummary = useCallback(() => {
    const total = Object.keys(completedExercises).length;
    const completed = Object.values(completedExercises).filter(Boolean).length;
    return {
      total,
      completed,
      percentage: total > 0 ? (completed / total) * 100 : 0,
    };
  }, [completedExercises]);

  return {
    completedExercises,
    completionData,
    markExerciseComplete,
    markExerciseIncomplete,
    isExerciseCompleted,
    getCompletionData,
    resetCompletion,
    getCompletionSummary,
  };
}
