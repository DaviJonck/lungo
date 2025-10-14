import { ScheduledExercise, Exercise, TodayExercise } from "@/types/supabase";

// Utilitários para formatação e processamento de dados de exercícios

/**
 * Converte exercícios agendados do Supabase para o formato usado no componente
 */
export function formatScheduledExercisesForToday(
  scheduledExercises: (ScheduledExercise & { exercise: Exercise })[]
): TodayExercise[] {
  return scheduledExercises.map((scheduled, index) => ({
    id: `daily-exercise-${index + 1}`,
    title: scheduled.exercise.name,
    duration: scheduled.duration_minutes
      ? `${scheduled.duration_minutes} min`
      : "Duração não definida",
    tasks: generateTasksForExercise(scheduled),
    videoUrl: scheduled.exercise.video_url,
    dataCollectionType: determineDataCollectionType(scheduled.exercise.type),
    exerciseId: scheduled.exercise.id,
    scheduledExerciseId: scheduled.id,
    sets: scheduled.sets,
    reps: scheduled.reps,
    restSeconds: scheduled.rest_seconds,
  }));
}

/**
 * Gera tarefas baseadas no tipo de exercício e parâmetros
 */
function generateTasksForExercise(
  scheduled: ScheduledExercise & { exercise: Exercise }
): string[] {
  const tasks: string[] = [];
  const { exercise, sets, reps, duration_minutes } = scheduled;

  // Tarefas baseadas no tipo de exercício
  switch (exercise.type) {
    case "RESPIRATORY":
      tasks.push("Medir frequência cardíaca inicial");
      if (duration_minutes && duration_minutes > 5) {
        tasks.push("Medir frequência cardíaca a cada 3 minutos");
      }
      tasks.push("Anotar sensações de bem-estar");
      break;

    case "AEROBIC":
      tasks.push("Medir frequência cardíaca inicial");
      if (duration_minutes && duration_minutes > 10) {
        tasks.push("Medir frequência cardíaca a cada 5 minutos");
      }
      tasks.push("Manter ritmo constante");
      break;

    case "STRENGTH":
      if (sets && reps) {
        tasks.push(`Realizar ${sets} séries de ${reps} repetições`);
      }
      if (scheduled.rest_seconds) {
        tasks.push(`Descansar ${scheduled.rest_seconds} segundos entre séries`);
      }
      tasks.push("Manter postura correta");
      break;
  }

  // Tarefas específicas baseadas na descrição do exercício
  if (exercise.description) {
    if (exercise.description.toLowerCase().includes("relaxamento")) {
      tasks.push("Relaxar entre os movimentos");
    }
    if (exercise.description.toLowerCase().includes("alongamento")) {
      tasks.push("Manter alongamento por 30 segundos");
    }
  }

  return tasks.length > 0 ? tasks : ["Seguir as instruções do exercício"];
}

/**
 * Determina o tipo de coleta de dados baseado no tipo de exercício
 */
function determineDataCollectionType(exerciseType: string): "A" | "B" | "C" {
  switch (exerciseType) {
    case "RESPIRATORY":
      return "A"; // Coleta de dados respiratórios
    case "AEROBIC":
      return "B"; // Coleta de dados cardiovasculares
    case "STRENGTH":
      return "C"; // Coleta de dados de força
    default:
      return "A";
  }
}

/**
 * Formata duração em minutos para string legível
 */
export function formatDuration(minutes?: number): string {
  if (!minutes) return "Duração não definida";

  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${remainingMinutes}min`;
}

/**
 * Formata repetições para string legível
 */
export function formatReps(reps?: string): string {
  if (!reps) return "Não definido";

  // Se contém números, assume que são repetições
  if (/^\d+$/.test(reps)) {
    return `${reps} repetições`;
  }

  // Se contém texto como "Até a falha", retorna como está
  return reps;
}

/**
 * Formata séries e repetições juntos
 */
export function formatSetsAndReps(sets?: number, reps?: string): string {
  if (!sets && !reps) return "Não definido";

  const setsText = sets ? `${sets} séries` : "";
  const repsText = formatReps(reps);

  if (setsText && repsText !== "Não definido") {
    return `${setsText} de ${repsText}`;
  }

  return setsText || repsText;
}

/**
 * Calcula duração total de um conjunto de exercícios
 */
export function calculateTotalDuration(exercises: TodayExercise[]): number {
  return exercises.reduce((total, exercise) => {
    const duration = parseInt(exercise.duration.replace(/\D/g, "")) || 0;
    return total + duration;
  }, 0);
}

/**
 * Agrupa exercícios por tipo
 */
export function groupExercisesByType(
  exercises: TodayExercise[]
): Record<string, TodayExercise[]> {
  return exercises.reduce((groups, exercise) => {
    const type = exercise.dataCollectionType;
    if (!groups[type]) {
      groups[type] = [];
    }
    groups[type].push(exercise);
    return groups;
  }, {} as Record<string, TodayExercise[]>);
}

/**
 * Valida se um exercício está completo (tem todos os dados necessários)
 */
export function isExerciseComplete(exercise: TodayExercise): boolean {
  return !!(exercise.title && exercise.duration && exercise.tasks.length > 0);
}

/**
 * Gera resumo de exercícios para o dia
 */
export function generateExerciseSummary(exercises: TodayExercise[]): {
  total: number;
  totalDuration: number;
  byType: Record<string, number>;
} {
  const total = exercises.length;
  const totalDuration = calculateTotalDuration(exercises);
  const byType = groupExercisesByType(exercises);

  return {
    total,
    totalDuration,
    byType: Object.keys(byType).reduce((acc, type) => {
      acc[type] = byType[type].length;
      return acc;
    }, {} as Record<string, number>),
  };
}

/**
 * Verifica se um exercício foi concluído hoje
 */
export function isExerciseCompletedToday(
  exerciseId: number,
  completedToday: Array<{ exercise_id: number; scheduled_exercise_id?: number }>
): boolean {
  return completedToday.some(
    (completed) => completed.exercise_id === exerciseId
  );
}

/**
 * Adiciona status de conclusão aos exercícios
 */
export function addCompletionStatusToExercises(
  exercises: TodayExercise[],
  completedToday: Array<{ exercise_id: number; scheduled_exercise_id?: number }>
): (TodayExercise & { isCompleted: boolean })[] {
  return exercises.map((exercise) => ({
    ...exercise,
    isCompleted: isExerciseCompletedToday(exercise.exerciseId, completedToday),
  }));
}
