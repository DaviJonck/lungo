import { createClient } from "@supabase/supabase-js";
import {
  Exercise,
  WorkoutPlanTemplate,
  TemplateExercise,
  PatientPlan,
  ScheduledExercise,
  PatientPlanWithExercises,
  ExerciseFilters,
  PatientPlanFilters,
  PatientActivityLog,
  CreateActivityLogData,
} from "@/types/supabase";

// Configuração do Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Serviços para Exercises
export class ExerciseService {
  static async getAll(filters?: ExerciseFilters): Promise<Exercise[]> {
    let query = supabase.from("exercises").select("*");

    if (filters?.type) {
      query = query.eq("type", filters.type);
    }

    if (filters?.search) {
      query = query.ilike("name", `%${filters.search}%`);
    }

    const { data, error } = await query.order("name");

    if (error) {
      console.error("Erro ao buscar exercícios:", error);
      throw new Error("Falha ao carregar exercícios");
    }

    return data || [];
  }

  static async getById(id: number): Promise<Exercise | null> {
    const { data, error } = await supabase
      .from("exercises")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Erro ao buscar exercício:", error);
      return null;
    }

    return data;
  }

  static async getByType(
    type: "AEROBIC" | "STRENGTH" | "RESPIRATORY"
  ): Promise<Exercise[]> {
    const { data, error } = await supabase
      .from("exercises")
      .select("*")
      .eq("type", type)
      .order("name");

    if (error) {
      console.error("Erro ao buscar exercícios por tipo:", error);
      throw new Error("Falha ao carregar exercícios");
    }

    return data || [];
  }
}

// Serviços para WorkoutPlanTemplates
export class WorkoutPlanTemplateService {
  static async getAll(): Promise<WorkoutPlanTemplate[]> {
    const { data, error } = await supabase
      .from("workout_plan_templates")
      .select("*")
      .order("name");

    if (error) {
      console.error("Erro ao buscar templates de planos:", error);
      throw new Error("Falha ao carregar templates");
    }

    return data || [];
  }

  static async getById(id: number): Promise<WorkoutPlanTemplate | null> {
    const { data, error } = await supabase
      .from("workout_plan_templates")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Erro ao buscar template:", error);
      return null;
    }

    return data;
  }

  static async getByTargetDisease(
    disease: string
  ): Promise<WorkoutPlanTemplate[]> {
    const { data, error } = await supabase
      .from("workout_plan_templates")
      .select("*")
      .eq("target_disease", disease)
      .order("name");

    if (error) {
      console.error("Erro ao buscar templates por doença:", error);
      throw new Error("Falha ao carregar templates");
    }

    return data || [];
  }
}

// Serviços para TemplateExercises
export class TemplateExerciseService {
  static async getByTemplateId(
    templateId: number
  ): Promise<TemplateExercise[]> {
    const { data, error } = await supabase
      .from("template_exercises")
      .select("*")
      .eq("template_id", templateId)
      .order("day_of_week", { ascending: true })
      .order("order_in_day", { ascending: true });

    if (error) {
      console.error("Erro ao buscar exercícios do template:", error);
      throw new Error("Falha ao carregar exercícios do template");
    }

    return data || [];
  }
}

// Serviços para PatientPlans
export class PatientPlanService {
  static async getByPatientId(
    patientId: string,
    filters?: PatientPlanFilters
  ): Promise<PatientPlan[]> {
    let query = supabase
      .from("patient_plans")
      .select("*")
      .eq("patient_id", patientId);

    if (filters?.is_active !== undefined) {
      query = query.eq("is_active", filters.is_active);
    }

    const { data, error } = await query.order("created_at", {
      ascending: false,
    });

    if (error) {
      console.error("Erro ao buscar planos do paciente:", error);
      throw new Error("Falha ao carregar planos do paciente");
    }

    return data || [];
  }

  static async getActivePlan(patientId: string): Promise<PatientPlan | null> {
    const { data, error } = await supabase
      .from("patient_plans")
      .select("*")
      .eq("patient_id", patientId)
      .eq("is_active", true)
      .single();

    if (error) {
      console.error("Erro ao buscar plano ativo:", error);
      return null;
    }

    return data;
  }

  static async getPlanWithExercises(
    planId: number
  ): Promise<PatientPlanWithExercises | null> {
    const { data, error } = await supabase
      .from("patient_plans")
      .select(
        `
        *,
        scheduled_exercises (
          *,
          exercise:exercises (*)
        )
      `
      )
      .eq("id", planId)
      .single();

    if (error) {
      console.error("Erro ao buscar plano com exercícios:", error);
      return null;
    }

    return data;
  }
}

// Serviços para ScheduledExercises
export class ScheduledExerciseService {
  static async getByPatientPlanId(
    patientPlanId: number
  ): Promise<ScheduledExercise[]> {
    const { data, error } = await supabase
      .from("scheduled_exercises")
      .select("*")
      .eq("patient_plan_id", patientPlanId)
      .order("day_of_week", { ascending: true })
      .order("order_in_day", { ascending: true });

    if (error) {
      console.error("Erro ao buscar exercícios agendados:", error);
      throw new Error("Falha ao carregar exercícios agendados");
    }

    return data || [];
  }

  static async getByPatientIdAndDay(
    patientId: string,
    dayOfWeek: number
  ): Promise<(ScheduledExercise & { exercise: Exercise })[]> {
    // Primeiro, buscar o plano ativo do paciente
    const activePlan = await PatientPlanService.getActivePlan(patientId);

    if (!activePlan) {
      return [];
    }

    // Depois, buscar os exercícios agendados para esse plano e dia
    const { data, error } = await supabase
      .from("scheduled_exercises")
      .select(
        `
        *,
        exercise:exercises (*)
      `
      )
      .eq("patient_plan_id", activePlan.id)
      .eq("day_of_week", dayOfWeek)
      .order("order_in_day", { ascending: true });

    if (error) {
      console.error("Erro ao buscar exercícios do dia:", error);
      throw new Error("Falha ao carregar exercícios do dia");
    }

    return data || [];
  }

  static async getTodayExercises(
    patientId: string
  ): Promise<(ScheduledExercise & { exercise: Exercise })[]> {
    const today = new Date().getDay(); // 0 = Domingo, 6 = Sábado
    const dayOfWeek = today === 0 ? 7 : today; // Converter para formato 1-7 (Domingo = 7)

    return this.getByPatientIdAndDay(patientId, dayOfWeek);
  }
}

// Serviço principal para buscar dados do dashboard
export class DashboardService {
  static async getPatientDashboardData(patientId: string) {
    try {
      // Buscar plano ativo do paciente
      const activePlan = await PatientPlanService.getActivePlan(patientId);

      if (!activePlan) {
        return {
          activePlan: null,
          todayExercises: [],
          allExercises: [],
          completedToday: [],
        };
      }

      // Buscar exercícios de hoje usando o plano ativo diretamente
      const today = new Date().getDay(); // 0 = Domingo, 6 = Sábado
      const dayOfWeek = today === 0 ? 7 : today; // Converter para formato 1-7 (Domingo = 7)

      const { data: todayExercisesData, error: todayError } = await supabase
        .from("scheduled_exercises")
        .select(
          `
          *,
          exercise:exercises (*)
        `
        )
        .eq("patient_plan_id", activePlan.id)
        .eq("day_of_week", dayOfWeek)
        .order("order_in_day", { ascending: true });

      if (todayError) {
        console.error("Erro ao buscar exercícios de hoje:", todayError);
        throw new Error("Falha ao carregar exercícios de hoje");
      }

      // Buscar atividades concluídas hoje
      const todayDate = new Date().toISOString().split("T")[0];
      const { data: completedTodayData, error: completedError } = await supabase
        .from("patient_activity_logs")
        .select("exercise_id, scheduled_exercise_id")
        .eq("patient_id", patientId)
        .eq("completed_at", todayDate);

      if (completedError) {
        console.error("Erro ao buscar atividades concluídas:", completedError);
        // Não falha a operação, apenas loga o erro
      }

      // Buscar todos os exercícios disponíveis
      const allExercises = await ExerciseService.getAll();

      return {
        activePlan,
        todayExercises: todayExercisesData || [],
        allExercises,
        completedToday: completedTodayData || [],
      };
    } catch (error) {
      console.error("Erro ao buscar dados do dashboard:", error);
      throw new Error("Falha ao carregar dados do dashboard");
    }
  }
}

// Serviços para PatientActivityLogs
export class PatientActivityLogService {
  static async create(
    data: CreateActivityLogData
  ): Promise<PatientActivityLog> {
    const { data: result, error } = await supabase
      .from("patient_activity_logs")
      .insert({
        patient_id: data.patient_id,
        exercise_id: data.exercise_id,
        scheduled_exercise_id: data.scheduled_exercise_id,
        notes: data.notes,
        perceived_difficulty: data.perceived_difficulty,
        completed_at: new Date().toISOString().split("T")[0], // Data atual no formato YYYY-MM-DD
      })
      .select()
      .single();

    if (error) {
      console.error("Erro ao criar log de atividade:", error);
      throw new Error("Falha ao salvar atividade");
    }

    return result;
  }

  static async getByPatientId(
    patientId: string
  ): Promise<PatientActivityLog[]> {
    const { data, error } = await supabase
      .from("patient_activity_logs")
      .select(
        `
        *,
        exercise:exercises (*)
      `
      )
      .eq("patient_id", patientId)
      .order("completed_at", { ascending: false });

    if (error) {
      console.error("Erro ao buscar logs de atividade:", error);
      throw new Error("Falha ao carregar histórico de atividades");
    }

    return data || [];
  }

  static async getByPatientIdAndDate(
    patientId: string,
    date: string
  ): Promise<PatientActivityLog[]> {
    const { data, error } = await supabase
      .from("patient_activity_logs")
      .select(
        `
        *,
        exercise:exercises (*)
      `
      )
      .eq("patient_id", patientId)
      .eq("completed_at", date)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erro ao buscar logs por data:", error);
      throw new Error("Falha ao carregar atividades do dia");
    }

    return data || [];
  }

  static async getTodayActivities(
    patientId: string
  ): Promise<PatientActivityLog[]> {
    const today = new Date().toISOString().split("T")[0];
    return this.getByPatientIdAndDate(patientId, today);
  }

  static async getByExerciseId(
    patientId: string,
    exerciseId: number
  ): Promise<PatientActivityLog[]> {
    const { data, error } = await supabase
      .from("patient_activity_logs")
      .select(
        `
        *,
        exercise:exercises (*)
      `
      )
      .eq("patient_id", patientId)
      .eq("exercise_id", exerciseId)
      .order("completed_at", { ascending: false });

    if (error) {
      console.error("Erro ao buscar logs por exercício:", error);
      throw new Error("Falha ao carregar histórico do exercício");
    }

    return data || [];
  }

  static async updateLog(
    logId: number,
    updates: Partial<CreateActivityLogData>
  ): Promise<PatientActivityLog> {
    const { data, error } = await supabase
      .from("patient_activity_logs")
      .update(updates)
      .eq("id", logId)
      .select()
      .single();

    if (error) {
      console.error("Erro ao atualizar log de atividade:", error);
      throw new Error("Falha ao atualizar atividade");
    }

    return data;
  }

  static async deleteLog(logId: number): Promise<void> {
    const { error } = await supabase
      .from("patient_activity_logs")
      .delete()
      .eq("id", logId);

    if (error) {
      console.error("Erro ao deletar log de atividade:", error);
      throw new Error("Falha ao deletar atividade");
    }
  }
}
