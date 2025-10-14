import { useState, useEffect, useCallback } from "react";
import { PatientActivityLogService } from "@/services/supabase";
import { PatientActivityLog } from "@/types/supabase";

interface UseActivityHistoryReturn {
  activities: PatientActivityLog[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  getTodayActivities: () => PatientActivityLog[];
  getActivitiesByDate: (date: string) => PatientActivityLog[];
}

export function useActivityHistory(
  patientId: string
): UseActivityHistoryReturn {
  const [activities, setActivities] = useState<PatientActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActivities = useCallback(async () => {
    if (!patientId) return;

    setLoading(true);
    setError(null);

    try {
      console.log(
        "📊 Buscando histórico de atividades para paciente:",
        patientId
      );

      const data = await PatientActivityLogService.getByPatientId(patientId);
      setActivities(data);

      console.log(`✅ ${data.length} atividades encontradas`);
    } catch (error) {
      console.error("❌ Erro ao buscar histórico de atividades:", error);
      setError(
        error instanceof Error ? error.message : "Erro ao carregar histórico"
      );
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  const getTodayActivities = useCallback(() => {
    const today = new Date().toISOString().split("T")[0];
    return activities.filter((activity) => activity.completed_at === today);
  }, [activities]);

  const getActivitiesByDate = useCallback(
    (date: string) => {
      return activities.filter((activity) => activity.completed_at === date);
    },
    [activities]
  );

  return {
    activities,
    loading,
    error,
    refetch: fetchActivities,
    getTodayActivities,
    getActivitiesByDate,
  };
}
