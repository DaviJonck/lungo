// Tipos para as tabelas do Supabase

export interface Exercise {
  id: number;
  name: string;
  description?: string;
  video_url?: string;
  type: "AEROBIC" | "STRENGTH" | "RESPIRATORY";
  created_at: string;
}

export interface WorkoutPlanTemplate {
  id: number;
  name: string;
  target_disease: string;
  description?: string;
  created_at: string;
}

export interface TemplateExercise {
  id: number;
  template_id: number;
  exercise_id: number;
  day_of_week?: number; // 1-7 (Domingo a Sábado)
  order_in_day: number;
  sets?: number;
  reps?: string;
  duration_minutes?: number;
  rest_seconds?: number;
}

export interface PatientPlan {
  id: number;
  patient_id: string;
  professional_id: string;
  plan_name: string;
  is_active: boolean;
  start_date: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ScheduledExercise {
  id: number;
  patient_plan_id: number;
  exercise_id: number;
  day_of_week: number; // 1-7 (Domingo a Sábado)
  order_in_day: number;
  sets?: number;
  reps?: string;
  duration_minutes?: number;
  rest_seconds?: number;
}

// Tipos para joins e dados processados
export interface ExerciseWithDetails extends Exercise {
  scheduled_exercises?: ScheduledExercise[];
  template_exercises?: TemplateExercise[];
}

export interface PatientPlanWithExercises extends PatientPlan {
  scheduled_exercises: (ScheduledExercise & { exercise: Exercise })[];
}

export interface TodayExercise {
  id: string;
  title: string;
  duration: string;
  tasks: string[];
  videoUrl?: string;
  dataCollectionType: "A" | "B" | "C";
  exerciseId: number;
  scheduledExerciseId?: number;
  sets?: number;
  reps?: string;
  restSeconds?: number;
}

// Tipos para filtros e queries
export interface ExerciseFilters {
  type?: "AEROBIC" | "STRENGTH" | "RESPIRATORY";
  search?: string;
}

export interface PatientPlanFilters {
  is_active?: boolean;
  patient_id?: string;
}

// Tabela para logs de atividade do paciente
export interface PatientActivityLog {
  id: number;
  patient_id: string;
  exercise_id: number;
  scheduled_exercise_id?: number;
  completed_at: string;
  notes?: string;
  perceived_difficulty?: number; // 1-5
  created_at: string;
}

// Dados para criar um novo log de atividade
export interface CreateActivityLogData {
  patient_id: string;
  exercise_id: number;
  scheduled_exercise_id?: number;
  notes?: string;
  perceived_difficulty?: number;
}

// Dados coletados durante o exercício
export interface ExerciseCompletionData {
  notes?: string;
  perceived_difficulty?: number;
  heartRate?: string;
  oxygenSaturation?: string;
  fatigue?: string;
  [key: string]: string | number | undefined;
}
