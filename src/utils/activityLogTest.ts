// Teste para funcionalidade de logs de atividade
import { PatientActivityLogService } from "@/services/supabase";

export async function testActivityLogCreation(patientId: string) {
  try {
    console.log("🧪 Testando criação de log de atividade...");

    const testData = {
      patient_id: patientId,
      exercise_id: 1, // ID de um exercício existente
      notes: "Teste de conclusão de exercício",
      perceived_difficulty: 3,
    };

    const result = await PatientActivityLogService.create(testData);

    console.log("✅ Log de atividade criado com sucesso:", result);
    return result;
  } catch (error) {
    console.error("❌ Erro ao criar log de atividade:", error);
    throw error;
  }
}

export async function testActivityLogRetrieval(patientId: string) {
  try {
    console.log("🧪 Testando busca de logs de atividade...");

    const activities = await PatientActivityLogService.getByPatientId(
      patientId
    );

    console.log(`✅ ${activities.length} atividades encontradas:`, activities);
    return activities;
  } catch (error) {
    console.error("❌ Erro ao buscar logs de atividade:", error);
    throw error;
  }
}

export async function testTodayActivities(patientId: string) {
  try {
    console.log("🧪 Testando busca de atividades de hoje...");

    const todayActivities = await PatientActivityLogService.getTodayActivities(
      patientId
    );

    console.log(
      `✅ ${todayActivities.length} atividades de hoje encontradas:`,
      todayActivities
    );
    return todayActivities;
  } catch (error) {
    console.error("❌ Erro ao buscar atividades de hoje:", error);
    throw error;
  }
}

// Função para testar o fluxo completo
export async function testCompleteActivityFlow(patientId: string) {
  try {
    console.log("🧪 Testando fluxo completo de atividade...");

    // 1. Criar log
    const created = await testActivityLogCreation(patientId);

    // 2. Buscar todos os logs
    const allActivities = await testActivityLogRetrieval(patientId);

    // 3. Buscar atividades de hoje
    const todayActivities = await testTodayActivities(patientId);

    console.log("🎉 Fluxo completo testado com sucesso!");
    return {
      created,
      allActivities,
      todayActivities,
    };
  } catch (error) {
    console.error("❌ Erro no fluxo completo:", error);
    throw error;
  }
}

// Adicionar ao window para teste no console
if (typeof window !== "undefined") {
  interface WindowWithTestActivityLogs extends Window {
    testActivityLogs: {
      create: typeof testActivityLogCreation;
      retrieve: typeof testActivityLogRetrieval;
      today: typeof testTodayActivities;
      fullFlow: typeof testCompleteActivityFlow;
    };
  }
  (window as unknown as WindowWithTestActivityLogs).testActivityLogs = {
    create: testActivityLogCreation,
    retrieve: testActivityLogRetrieval,
    today: testTodayActivities,
    fullFlow: testCompleteActivityFlow,
  };

  console.log(`
🧪 Activity Log Tests disponíveis:

// Testar criação de log
await testActivityLogs.create('patient-id')

// Testar busca de logs
await testActivityLogs.retrieve('patient-id')

// Testar atividades de hoje
await testActivityLogs.today('patient-id')

// Testar fluxo completo
await testActivityLogs.fullFlow('patient-id')
`);
}
