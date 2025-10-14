import { useState, useEffect, useCallback } from "react";
import { PatientPlanService } from "@/services/supabase";
import { PatientPlan } from "@/types/supabase";

interface UseUserPlanStatusReturn {
  hasActivePlan: boolean;
  activePlan: PatientPlan | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useUserPlanStatus(patientId: string): UseUserPlanStatusReturn {
  const [hasActivePlan, setHasActivePlan] = useState(false);
  const [activePlan, setActivePlan] = useState<PatientPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlanStatus = useCallback(async () => {
    if (!patientId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log("📋 Verificando status do plano do usuário...");

      const plan = await PatientPlanService.getActivePlan(patientId);

      setActivePlan(plan);
      setHasActivePlan(!!plan);

      console.log(`✅ Status do plano: ${plan ? "Ativo" : "Sem plano ativo"}`);
    } catch (error) {
      console.error("❌ Erro ao verificar status do plano:", error);
      setError(
        error instanceof Error ? error.message : "Erro ao verificar plano"
      );
      setHasActivePlan(false);
      setActivePlan(null);
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  useEffect(() => {
    fetchPlanStatus();
  }, [fetchPlanStatus]);

  return {
    hasActivePlan,
    activePlan,
    loading,
    error,
    refetch: fetchPlanStatus,
  };
}
