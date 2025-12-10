// Teste para verificar se o status do plano está funcionando
import { PatientPlanService } from "@/services/supabase";

export async function testPlanStatus(patientId: string) {
  try {
    console.log("🧪 Testando status do plano do usuário...");

    // 1. Verificar se tem plano ativo
    const activePlan = await PatientPlanService.getActivePlan(patientId);

    if (activePlan) {
      console.log("✅ Usuário tem plano ativo:", {
        id: activePlan.id,
        planName: activePlan.plan_name,
        isActive: activePlan.is_active,
        startDate: activePlan.start_date,
        notes: activePlan.notes,
      });

      return {
        hasActivePlan: true,
        plan: activePlan,
        message: "Parabéns! Você já é um usuário Plus",
      };
    } else {
      console.log("❌ Usuário não tem plano ativo");

      return {
        hasActivePlan: false,
        plan: null,
        message: "Upgrade para PRO",
      };
    }
  } catch (error) {
    console.error("❌ Erro ao testar status do plano:", error);
    throw error;
  }
}

// Adicionar ao window para teste no console
if (typeof window !== "undefined") {
  interface WindowWithTestPlanStatus extends Window {
    testPlanStatus: typeof testPlanStatus;
  }
  (window as WindowWithTestPlanStatus).testPlanStatus = testPlanStatus;

  console.log(`
🧪 Teste de Status do Plano disponível:

// Testar status do plano
await testPlanStatus('patient-id')
`);
}
