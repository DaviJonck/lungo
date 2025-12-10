// Teste para verificar se a página de exercícios está funcionando
import { ExerciseService } from "@/services/supabase";

export async function testExercisesPage() {
  try {
    console.log("🧪 Testando página de exercícios...");

    // 1. Buscar todos os exercícios
    const allExercises = await ExerciseService.getAll();
    console.log(`✅ ${allExercises.length} exercícios encontrados no banco`);

    // 2. Agrupar por tipo
    const byType = allExercises.reduce((acc, exercise) => {
      acc[exercise.type] = (acc[exercise.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    console.log("📊 Exercícios por tipo:", byType);

    // 3. Testar busca
    const searchResults = await ExerciseService.getAll({
      search: "respiração",
    });
    console.log(
      `🔍 Busca por "respiração": ${searchResults.length} resultados`
    );

    // 4. Testar filtro por tipo
    const respiratoryExercises = await ExerciseService.getAll({
      type: "RESPIRATORY",
    });
    console.log(`🫁 Exercícios respiratórios: ${respiratoryExercises.length}`);

    // 5. Mostrar alguns exemplos
    console.log("📋 Exemplos de exercícios:");
    allExercises.slice(0, 3).forEach((exercise, index) => {
      console.log(`  ${index + 1}. ${exercise.name} (${exercise.type})`);
    });

    return {
      total: allExercises.length,
      byType,
      searchResults: searchResults.length,
      respiratoryExercises: respiratoryExercises.length,
      examples: allExercises.slice(0, 3),
    };
  } catch (error) {
    console.error("❌ Erro ao testar página de exercícios:", error);
    throw error;
  }
}

// Adicionar ao window para teste no console
if (typeof window !== "undefined") {
  interface WindowWithTestExercisesPage extends Window {
    testExercisesPage: typeof testExercisesPage;
  }
  (window as unknown as WindowWithTestExercisesPage).testExercisesPage =
    testExercisesPage;

  console.log(`
🧪 Teste da Página de Exercícios disponível:

// Testar funcionalidade completa
await testExercisesPage()
`);
}
