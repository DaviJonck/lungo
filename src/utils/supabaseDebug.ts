// Utilitário para debug do Supabase no console do navegador
// Use este arquivo para testar a conexão diretamente no console

import {
  testSupabaseConnection,
  testPatientData,
  testScheduledExercisesQuery,
} from "./supabaseTest";

// Função global para testar no console - APENAS EM DESENVOLVIMENTO
if (process.env.NODE_ENV === "development") {
  (window as any).testSupabase = {
    // Testar conexão geral
    connection: testSupabaseConnection,

    // Testar dados de um paciente específico
    patient: (patientId: string) => testPatientData(patientId),

    // Testar query específica que estava falhando
    query: (patientId: string, dayOfWeek: number = 2) =>
      testScheduledExercisesQuery(patientId, dayOfWeek),

    // Testar com o ID do paciente que estava causando erro
    testProblematicPatient: () =>
      testPatientData("17797c71-0671-4590-9299-f4c13bb610de"),

    // Testar a query específica que estava falhando
    testProblematicQuery: () =>
      testScheduledExercisesQuery("17797c71-0671-4590-9299-f4c13bb610de", 2),
  };
}

// Instruções para usar no console - APENAS EM DESENVOLVIMENTO
if (process.env.NODE_ENV === "development") {
  console.log(`
🔧 Supabase Debug Tools disponíveis (APENAS DESENVOLVIMENTO):

// Testar conexão geral
await testSupabase.connection()

// Testar paciente específico
await testSupabase.patient('17797c71-0671-4590-9299-f4c13bb610de')

// Testar query específica
await testSupabase.query('17797c71-0671-4590-9299-f4c13bb610de', 2)

// Testar o paciente que estava causando erro
await testSupabase.testProblematicPatient()

// Testar a query que estava falhando
await testSupabase.testProblematicQuery()
`);
} else {
  console.log(
    "🔒 Supabase Debug Tools disponíveis apenas em ambiente de desenvolvimento"
  );
}

export {};
