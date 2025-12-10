// Teste para verificar se o modal de exercício está responsivo
export function testModalResponsive() {
  try {
    console.log("📱 Testando responsividade do modal...");

    // 1. Verificar se estamos em um dispositivo móvel
    const isMobile = window.innerWidth <= 768;
    console.log(`📱 Dispositivo móvel: ${isMobile ? "Sim" : "Não"}`);
    console.log(`📏 Largura da tela: ${window.innerWidth}px`);

    // 2. Verificar se o modal está aberto
    const modal =
      document.querySelector('[data-testid="exercise-modal"]') ||
      document.querySelector(".modal-overlay") ||
      document.querySelector('[role="dialog"]');

    if (!modal) {
      console.log("❌ Modal não encontrado. Abra um exercício primeiro.");
      return { isMobile, modalFound: false };
    }

    console.log("✅ Modal encontrado");

    // 3. Verificar estilos do modal
    const modalStyle = window.getComputedStyle(modal as HTMLElement);
    console.log("🎨 Estilos do modal:", {
      width: modalStyle.width,
      height: modalStyle.height,
      padding: modalStyle.padding,
      borderRadius: modalStyle.borderRadius,
    });

    // 4. Verificar título do exercício
    const title = modal.querySelector("h2") as HTMLElement;
    if (title) {
      const titleStyle = window.getComputedStyle(title);
      console.log("📝 Estilos do título:", {
        fontSize: titleStyle.fontSize,
        fontWeight: titleStyle.fontWeight,
      });
    }

    // 5. Verificar contador (se visível)
    const countdown =
      modal.querySelector('[data-testid="countdown"]') ||
      modal.querySelector(".countdown-number") ||
      modal.querySelector('div[style*="font-size: 120px"]') ||
      modal.querySelector('div[style*="font-size: 80px"]');

    if (countdown) {
      const countdownStyle = window.getComputedStyle(countdown as HTMLElement);
      console.log("🔢 Estilos do contador:", {
        fontSize: countdownStyle.fontSize,
        transform: countdownStyle.transform,
      });
    }

    // 6. Verificar timer (se visível)
    const timer =
      modal.querySelector('[data-testid="timer"]') ||
      modal.querySelector(".timer-display") ||
      modal.querySelector('div[style*="font-size: 64px"]') ||
      modal.querySelector('div[style*="font-size: 48px"]');

    if (timer) {
      const timerStyle = window.getComputedStyle(timer as HTMLElement);
      console.log("⏱️ Estilos do timer:", {
        fontSize: timerStyle.fontSize,
        fontFamily: timerStyle.fontFamily,
      });
    }

    // 7. Verificar grid de inputs
    const grid =
      modal.querySelector(".data-inputs-grid") ||
      modal.querySelector('[style*="grid-template-columns"]');

    if (grid) {
      const gridStyle = window.getComputedStyle(grid as HTMLElement);
      console.log("📊 Estilos do grid:", {
        gridTemplateColumns: gridStyle.gridTemplateColumns,
        gap: gridStyle.gap,
      });
    }

    return {
      isMobile,
      modalFound: true,
      screenWidth: window.innerWidth,
      breakpoint: isMobile ? "mobile" : "desktop",
    };
  } catch (error) {
    console.error("❌ Erro ao testar responsividade do modal:", error);
    throw error;
  }
}

// Função para simular diferentes tamanhos de tela e testar o modal
// ⚠️ FUNÇÃO REMOVIDA POR SEGURANÇA - Manipulação do window.innerWidth é insegura
// Use o hook useResponsive() em vez disso para responsividade segura
export function testModalAtScreenSize(width: number) {
  console.warn(
    "⚠️ Função testModalAtScreenSize foi desabilitada por motivos de segurança."
  );
  console.log("💡 Use o hook useResponsive() para responsividade segura.");

  return {
    simulatedWidth: width,
    actualWidth: window.innerWidth,
    warning: "Função desabilitada por segurança",
  };
}

// Adicionar ao window para teste no console - APENAS EM DESENVOLVIMENTO
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  interface WindowWithTestModalResponsive extends Window {
    testModalResponsive: typeof testModalResponsive;
    testModalAtScreenSize: typeof testModalAtScreenSize;
  }
  (window as WindowWithTestModalResponsive).testModalResponsive =
    testModalResponsive;
  (window as WindowWithTestModalResponsive).testModalAtScreenSize =
    testModalAtScreenSize;

  console.log(`
📱 Testes de Responsividade do Modal disponíveis (APENAS DESENVOLVIMENTO):

// Testar responsividade atual do modal
await testModalResponsive()

// ⚠️ Função desabilitada por segurança
await testModalAtScreenSize(375)  // Retorna warning de segurança
`);
} else if (typeof window !== "undefined") {
  console.log(
    "🔒 Funções de teste disponíveis apenas em ambiente de desenvolvimento"
  );
}
