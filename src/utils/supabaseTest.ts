// Arquivo para testar a conexão com o Supabase
// Este arquivo pode ser removido após confirmar que tudo está funcionando

import { supabase } from "@/services/supabase";

export async function testSupabaseConnection() {
  try {
    console.log("🔍 Testando conexão com Supabase...");

    // Teste 1: Verificar se consegue acessar a tabela exercises
    const { data: exercises, error: exercisesError } = await supabase
      .from("exercises")
      .select("*")
      .limit(5);

    if (exercisesError) {
      console.error("❌ Erro ao acessar tabela exercises:", exercisesError);
      return false;
    }

    console.log(
      "✅ Tabela exercises acessível:",
      exercises?.length || 0,
      "exercícios encontrados"
    );

    // Teste 2: Verificar se consegue acessar a tabela patient_plans
    const { data: plans, error: plansError } = await supabase
      .from("patient_plans")
      .select("*")
      .limit(5);

    if (plansError) {
      console.error("❌ Erro ao acessar tabela patient_plans:", plansError);
      return false;
    }

    console.log(
      "✅ Tabela patient_plans acessível:",
      plans?.length || 0,
      "planos encontrados"
    );

    // Teste 3: Verificar se consegue acessar a tabela scheduled_exercises
    const { data: scheduled, error: scheduledError } = await supabase
      .from("scheduled_exercises")
      .select("*")
      .limit(5);

    if (scheduledError) {
      console.error(
        "❌ Erro ao acessar tabela scheduled_exercises:",
        scheduledError
      );
      return false;
    }

    console.log(
      "✅ Tabela scheduled_exercises acessível:",
      scheduled?.length || 0,
      "exercícios agendados encontrados"
    );

    console.log("🎉 Todos os testes de conexão passaram!");
    return true;
  } catch (error) {
    console.error("❌ Erro geral no teste de conexão:", error);
    return false;
  }
}

export async function testPatientData(patientId: string) {
  try {
    console.log(`🔍 Testando dados do paciente: ${patientId}`);

    // Teste: Buscar plano ativo do paciente
    const { data: activePlan, error: planError } = await supabase
      .from("patient_plans")
      .select("*")
      .eq("patient_id", patientId)
      .eq("is_active", true)
      .single();

    if (planError) {
      console.error("❌ Erro ao buscar plano ativo:", planError);
      return false;
    }

    console.log("✅ Plano ativo encontrado:", activePlan?.plan_name);

    if (activePlan) {
      // Teste: Buscar exercícios agendados para hoje
      const today = new Date().getDay();
      const dayOfWeek = today === 0 ? 7 : today;

      const { data: todayExercises, error: exercisesError } = await supabase
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

      if (exercisesError) {
        console.error("❌ Erro ao buscar exercícios de hoje:", exercisesError);
        return false;
      }

      console.log(
        "✅ Exercícios de hoje encontrados:",
        todayExercises?.length || 0
      );

      if (todayExercises && todayExercises.length > 0) {
        console.log("📋 Exercícios:");
        todayExercises.forEach((exercise, index) => {
          console.log(
            `  ${index + 1}. ${exercise.exercise?.name} (${
              exercise.duration_minutes
            } min)`
          );
        });
      }
    }

    console.log("🎉 Teste de dados do paciente concluído!");
    return true;
  } catch (error) {
    console.error("❌ Erro no teste de dados do paciente:", error);
    return false;
  }
}

// Função para testar a query específica que estava falhando
export async function testScheduledExercisesQuery(
  patientId: string,
  dayOfWeek: number = 2
) {
  try {
    console.log(
      `🔍 Testando query específica para paciente ${patientId}, dia ${dayOfWeek}`
    );

    // Primeiro, buscar o plano ativo
    const { data: activePlan, error: planError } = await supabase
      .from("patient_plans")
      .select("*")
      .eq("patient_id", patientId)
      .eq("is_active", true)
      .single();

    if (planError) {
      console.error("❌ Erro ao buscar plano ativo:", planError);
      return false;
    }

    if (!activePlan) {
      console.log("⚠️ Nenhum plano ativo encontrado para o paciente");
      return true;
    }

    console.log("✅ Plano ativo encontrado:", activePlan.id);

    // Agora buscar os exercícios agendados
    const { data: exercises, error: exercisesError } = await supabase
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

    if (exercisesError) {
      console.error(
        "❌ Erro na query de exercícios agendados:",
        exercisesError
      );
      return false;
    }

    console.log("✅ Query executada com sucesso!");
    console.log(
      `📋 ${
        exercises?.length || 0
      } exercícios encontrados para o dia ${dayOfWeek}`
    );

    if (exercises && exercises.length > 0) {
      exercises.forEach((exercise, index) => {
        console.log(
          `  ${index + 1}. ${exercise.exercise?.name} - ${
            exercise.duration_minutes
          } min`
        );
      });
    }

    return true;
  } catch (error) {
    console.error("❌ Erro no teste da query específica:", error);
    return false;
  }
}
