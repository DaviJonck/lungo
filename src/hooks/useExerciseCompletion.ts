import { useState, useCallback } from "react";
import { PatientActivityLogService } from "@/services/supabase";
import {
  CreateActivityLogData,
  ExerciseCompletionData,
} from "@/types/supabase";

interface UseExerciseCompletionReturn {
  isCompleting: boolean;
  completionError: string | null;
  completeExercise: (
    patientId: string,
    exerciseId: number,
    scheduledExerciseId: number | undefined,
    completionData: ExerciseCompletionData
  ) => Promise<boolean>;
  clearError: () => void;
}

export function useExerciseCompletion(): UseExerciseCompletionReturn {
  const [isCompleting, setIsCompleting] = useState(false);
  const [completionError, setCompletionError] = useState<string | null>(null);

  const completeExercise = useCallback(
    async (
      patientId: string,
      exerciseId: number,
      scheduledExerciseId: number | undefined,
      completionData: ExerciseCompletionData
    ): Promise<boolean> => {
      setIsCompleting(true);
      setCompletionError(null);

      try {
        console.log("💾 Salvando conclusão do exercício:", {
          patientId,
          exerciseId,
          scheduledExerciseId,
          completionData,
        });

        // Preparar dados para salvar no banco
        const logData: CreateActivityLogData = {
          patient_id: patientId,
          exercise_id: exerciseId,
          scheduled_exercise_id: scheduledExerciseId,
          notes: completionData.notes,
          perceived_difficulty: completionData.perceived_difficulty,
        };

        // Salvar no banco de dados
        const savedLog = await PatientActivityLogService.create(logData);

        console.log("✅ Exercício salvo com sucesso:", savedLog);

        return true;
      } catch (error) {
        console.error("❌ Erro ao salvar exercício:", error);
        setCompletionError(
          error instanceof Error ? error.message : "Erro ao salvar exercício"
        );
        return false;
      } finally {
        setIsCompleting(false);
      }
    },
    []
  );

  const clearError = useCallback(() => {
    setCompletionError(null);
  }, []);

  return {
    isCompleting,
    completionError,
    completeExercise,
    clearError,
  };
}
