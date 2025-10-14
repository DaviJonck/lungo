import { useState, useEffect, useCallback } from "react";
import { ExerciseService } from "@/services/supabase";
import { Exercise, ExerciseFilters } from "@/types/supabase";

interface UseExercisesReturn {
  exercises: Exercise[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  getExercisesByType: (
    type: "AEROBIC" | "STRENGTH" | "RESPIRATORY"
  ) => Exercise[];
  searchExercises: (query: string) => Exercise[];
}

export function useExercises(filters?: ExerciseFilters): UseExercisesReturn {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExercises = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      console.log("🏃‍♂️ Buscando exercícios do banco de dados...");

      const data = await ExerciseService.getAll(filters);
      setExercises(data);

      console.log(`✅ ${data.length} exercícios carregados`);
    } catch (error) {
      console.error("❌ Erro ao buscar exercícios:", error);
      setError(
        error instanceof Error ? error.message : "Erro ao carregar exercícios"
      );
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchExercises();
  }, [fetchExercises]);

  const getExercisesByType = useCallback(
    (type: "AEROBIC" | "STRENGTH" | "RESPIRATORY") => {
      return exercises.filter((exercise) => exercise.type === type);
    },
    [exercises]
  );

  const searchExercises = useCallback(
    (query: string) => {
      if (!query.trim()) return exercises;

      const searchTerm = query.toLowerCase();
      return exercises.filter(
        (exercise) =>
          exercise.name.toLowerCase().includes(searchTerm) ||
          exercise.description?.toLowerCase().includes(searchTerm)
      );
    },
    [exercises]
  );

  return {
    exercises,
    loading,
    error,
    refetch: fetchExercises,
    getExercisesByType,
    searchExercises,
  };
}
