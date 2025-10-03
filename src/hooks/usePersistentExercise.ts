"use client";

import { useState, useEffect } from "react";

type ExerciseState = {
  exerciseId: string;
  isStarted: boolean;
  isTimerRunning: boolean;
  timeRemaining: number;
  formData: Record<string, string>;
  currentInterval: number;
  startTime: number;
  dataCollectionType: "A" | "B" | "C";
};

const STORAGE_KEY = "lungo-active-exercise";

export function usePersistentExercise() {
  const [exerciseState, setExerciseState] = useState<ExerciseState | null>(
    null
  );
  const [isRestored, setIsRestored] = useState(false);

  // Carregar estado do localStorage na inicialização
  useEffect(() => {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        // Verificar se o exercício ainda é válido (não muito antigo)
        const now = Date.now();
        const timeElapsed = now - parsed.startTime;
        const maxDuration = 25 * 60 * 1000; // 25 minutos em ms (maior duração possível)

        if (timeElapsed < maxDuration) {
          setExerciseState(parsed);
        } else {
          // Limpar estado expirado
          localStorage.removeItem(STORAGE_KEY);
        }
      } catch (error) {
        console.error("Erro ao restaurar estado do exercício:", error);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setIsRestored(true);
  }, []);

  // Salvar estado no localStorage sempre que mudar
  useEffect(() => {
    if (exerciseState && isRestored) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(exerciseState));
    }
  }, [exerciseState, isRestored]);

  const startExercise = (
    exerciseId: string,
    dataCollectionType: "A" | "B" | "C",
    totalTime: number
  ) => {
    const newState: ExerciseState = {
      exerciseId,
      isStarted: true,
      isTimerRunning: true, // Iniciar o timer imediatamente
      timeRemaining: totalTime,
      formData: {},
      currentInterval: 0,
      startTime: Date.now(),
      dataCollectionType,
    };
    console.log("🚀 Criando novo exercício:", newState);
    setExerciseState(newState);
  };

  const updateExerciseState = (updates: Partial<ExerciseState>) => {
    if (exerciseState) {
      setExerciseState({ ...exerciseState, ...updates });
    }
  };

  const clearExercise = () => {
    setExerciseState(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const resumeExercise = () => {
    if (exerciseState) {
      // Calcular tempo restante baseado no tempo decorrido
      const now = Date.now();
      const timeElapsed = Math.floor((now - exerciseState.startTime) / 1000);
      const totalTime = getTotalTimeForType(exerciseState.dataCollectionType);
      const newTimeRemaining = Math.max(0, totalTime - timeElapsed);

      console.log("🔄 Resumindo exercício:", {
        timeElapsed,
        totalTime,
        newTimeRemaining,
        wasRunning: exerciseState.isTimerRunning,
      });

      setExerciseState({
        ...exerciseState,
        timeRemaining: newTimeRemaining,
        startTime: now - (totalTime - newTimeRemaining) * 1000, // Ajustar startTime
        isTimerRunning: true, // IMPORTANTE: Reiniciar o timer automaticamente
      });
    }
  };

  const getTotalTimeForType = (type: "A" | "B" | "C"): number => {
    switch (type) {
      case "A":
        return 10 * 60; // 10 minutos
      case "B":
        return 6 * 60; // 6 minutos
      case "C":
        return 20 * 60; // 20 minutos
    }
  };

  return {
    exerciseState,
    isRestored,
    startExercise,
    updateExerciseState,
    clearExercise,
    resumeExercise,
  };
}
