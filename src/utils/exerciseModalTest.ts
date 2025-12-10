// Teste para verificar se o modal de exercícios está funcionando
import { ExerciseService } from "@/services/supabase";

export async function testExerciseModal() {
  try {
    console.log("🧪 Testando modal de exercícios...");

    // 1. Buscar exercícios
    const exercises = await ExerciseService.getAll();
    console.log(`✅ ${exercises.length} exercícios encontrados`);

    // 2. Verificar se há exercícios com vídeo
    const exercisesWithVideo = exercises.filter((ex) => ex.video_url);
    console.log(`📹 ${exercisesWithVideo.length} exercícios com vídeo`);

    // 3. Verificar se há exercícios sem vídeo
    const exercisesWithoutVideo = exercises.filter((ex) => !ex.video_url);
    console.log(`📷 ${exercisesWithoutVideo.length} exercícios sem vídeo`);

    // 4. Mostrar exemplos
    console.log("📋 Exemplos de exercícios:");
    exercises.slice(0, 3).forEach((exercise, index) => {
      console.log(`  ${index + 1}. ${exercise.name}`);
      console.log(`     - Tipo: ${exercise.type}`);
      console.log(`     - Vídeo: ${exercise.video_url ? "Sim" : "Não"}`);
      console.log(`     - Descrição: ${exercise.description ? "Sim" : "Não"}`);
    });

    // 5. Testar categorias
    const categories = {
      RESPIRATORY: exercises.filter((ex) => ex.type === "RESPIRATORY").length,
      AEROBIC: exercises.filter((ex) => ex.type === "AEROBIC").length,
      STRENGTH: exercises.filter((ex) => ex.type === "STRENGTH").length,
    };

    console.log("📊 Exercícios por categoria:", categories);

    return {
      total: exercises.length,
      withVideo: exercisesWithVideo.length,
      withoutVideo: exercisesWithoutVideo.length,
      categories,
      examples: exercises.slice(0, 3),
    };
  } catch (error) {
    console.error("❌ Erro ao testar modal de exercícios:", error);
    throw error;
  }
}

// Adicionar ao window para teste no console
if (typeof window !== "undefined") {
  interface WindowWithTestExerciseModal extends Window {
    testExerciseModal: typeof testExerciseModal;
  }
  (window as unknown as WindowWithTestExerciseModal).testExerciseModal =
    testExerciseModal;

  console.log(`
🧪 Teste do Modal de Exercícios disponível:

// Testar funcionalidade do modal
await testExerciseModal()
`);
}
