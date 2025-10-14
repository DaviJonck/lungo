// Teste para verificar se o status de conclusão está funcionando
import { DashboardService } from "@/services/supabase";
import {
  addCompletionStatusToExercises,
  formatScheduledExercisesForToday,
} from "@/utils/exerciseUtils";

export async function testCompletionStatus(patientId: string) {
  try {
    console.log("🧪 Testando status de conclusão de exercícios...");

    // 1. Buscar dados do dashboard
    const dashboardData = await DashboardService.getPatientDashboardData(
      patientId
    );

    console.log("📊 Dados do dashboard:", {
      activePlan: dashboardData.activePlan?.plan_name,
      todayExercises: dashboardData.todayExercises.length,
      completedToday: dashboardData.completedToday.length,
    });

    // 2. Formatar exercícios
    const formattedExercises = formatScheduledExercisesForToday(
      dashboardData.todayExercises
    );

    // 3. Adicionar status de conclusão
    const exercisesWithStatus = addCompletionStatusToExercises(
      formattedExercises,
      dashboardData.completedToday
    );

    console.log("✅ Exercícios com status de conclusão:");
    exercisesWithStatus.forEach((exercise, index) => {
      console.log(
        `  ${index + 1}. ${exercise.title} - ${
          exercise.isCompleted ? "✅ Concluído" : "⏳ Pendente"
        }`
      );
    });

    // 4. Verificar se há exercícios concluídos
    const completedCount = exercisesWithStatus.filter(
      (ex) => ex.isCompleted
    ).length;
    const totalCount = exercisesWithStatus.length;

    console.log(
      `📈 Resumo: ${completedCount}/${totalCount} exercícios concluídos hoje`
    );

    return {
      total: totalCount,
      completed: completedCount,
      exercises: exercisesWithStatus,
    };
  } catch (error) {
    console.error("❌ Erro ao testar status de conclusão:", error);
    throw error;
  }
}

// Adicionar ao window para teste no console
if (typeof window !== "undefined") {
  (window as any).testCompletionStatus = testCompletionStatus;

  console.log(`
🧪 Teste de Status de Conclusão disponível:

// Testar status de conclusão
await testCompletionStatus('patient-id')
`);
}
