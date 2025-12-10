// Teste para verificar se o layout mobile está funcionando
export function testMobileLayout() {
  try {
    console.log("📱 Testando layout mobile...");

    // 1. Verificar se estamos em um dispositivo móvel
    const isMobile = window.innerWidth <= 768;
    console.log(`📱 Dispositivo móvel: ${isMobile ? "Sim" : "Não"}`);
    console.log(`📏 Largura da tela: ${window.innerWidth}px`);

    // 2. Verificar breakpoints
    const breakpoints = {
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
    };

    console.log("📊 Breakpoints disponíveis:", breakpoints);

    // 3. Verificar se os elementos estão responsivos
    const exerciseCards = document.querySelectorAll(
      '[data-testid="exercise-card"]'
    );
    console.log(`🎯 Cards de exercício encontrados: ${exerciseCards.length}`);

    // 4. Verificar estilos aplicados
    if (exerciseCards.length > 0) {
      const firstCard = exerciseCards[0] as HTMLElement;
      const computedStyle = window.getComputedStyle(firstCard);

      console.log("🎨 Estilos do card:", {
        display: computedStyle.display,
        flexDirection: computedStyle.flexDirection,
        alignItems: computedStyle.alignItems,
        justifyContent: computedStyle.justifyContent,
      });
    }

    // 5. Verificar botões
    const exerciseButtons = document.querySelectorAll(
      '[data-testid="exercise-button"]'
    );
    console.log(
      `🔘 Botões de exercício encontrados: ${exerciseButtons.length}`
    );

    if (exerciseButtons.length > 0) {
      const firstButton = exerciseButtons[0] as HTMLElement;
      const buttonStyle = window.getComputedStyle(firstButton);

      console.log("🎨 Estilos do botão:", {
        width: buttonStyle.width,
        padding: buttonStyle.padding,
        fontSize: buttonStyle.fontSize,
      });
    }

    return {
      isMobile,
      screenWidth: window.innerWidth,
      exerciseCards: exerciseCards.length,
      exerciseButtons: exerciseButtons.length,
      breakpoints,
    };
  } catch (error) {
    console.error("❌ Erro ao testar layout mobile:", error);
    throw error;
  }
}

// Função para simular diferentes tamanhos de tela
// ⚠️ FUNÇÃO MODIFICADA POR SEGURANÇA - Apenas altera viewport, não window.innerWidth
export function simulateScreenSize(width: number) {
  try {
    console.log(`🖥️ Simulando largura de tela: ${width}px`);
    console.warn(
      "⚠️ Esta função apenas altera o viewport meta tag, não o window.innerWidth"
    );

    // Alterar apenas a largura da viewport (mais seguro)
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      viewport.setAttribute("content", `width=${width}, initial-scale=1`);
    }

    // Disparar evento de resize (sem manipular window.innerWidth)
    window.dispatchEvent(new Event("resize"));

    console.log("✅ Viewport alterado com sucesso");
    console.log("💡 Use o hook useResponsive() para responsividade segura");

    return {
      simulatedWidth: width,
      actualWidth: window.innerWidth,
      warning: "Apenas viewport alterado, window.innerWidth não foi modificado",
    };
  } catch (error) {
    console.error("❌ Erro ao simular tamanho de tela:", error);
    throw error;
  }
}

// Adicionar ao window para teste no console - APENAS EM DESENVOLVIMENTO
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  interface WindowWithTestMobileLayout extends Window {
    testMobileLayout: typeof testMobileLayout;
    simulateScreenSize: typeof simulateScreenSize;
  }
  (window as unknown as WindowWithTestMobileLayout).testMobileLayout =
    testMobileLayout;
  (window as unknown as WindowWithTestMobileLayout).simulateScreenSize =
    simulateScreenSize;

  console.log(`
📱 Testes de Layout Mobile disponíveis (APENAS DESENVOLVIMENTO):

// Testar layout mobile atual
await testMobileLayout()

// Simular diferentes tamanhos de tela (apenas viewport)
await simulateScreenSize(375)  // iPhone
await simulateScreenSize(768)  // Tablet
await simulateScreenSize(1024) // Desktop
`);
} else if (typeof window !== "undefined") {
  console.log(
    "🔒 Funções de teste disponíveis apenas em ambiente de desenvolvimento"
  );
}
