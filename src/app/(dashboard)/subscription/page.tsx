"use client";

import React, { useState } from "react";
import styled from "styled-components";
import {
  Check,
  X,
  Star,
  Zap,
  AlertCircle,
  Info,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

const ToastContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Toast = styled.div<{ $type: "success" | "error" | "info" }>`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-radius: 8px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
  font-weight: 600;
  font-size: 0.9rem;
  min-width: 300px;
  max-width: 400px;
  animation: slideIn 0.3s ease-out;
  cursor: pointer;
  transition: all 0.2s ease;

  background: ${({ $type }) => {
    switch ($type) {
      case "success":
        return "#10b981";
      case "error":
        return "#ef4444";
      case "info":
        return "#3b82f6";
      default:
        return "#10b981";
    }
  }};
  color: white;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 15px 25px rgba(0, 0, 0, 0.2);
  }

  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;

const ToastIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

interface ToastMessage {
  id: string;
  type: "success" | "error" | "info";
  message: string;
}

const Header = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding: 0.5rem;
  display: flex;
  align-items: center;
  z-index: 100;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: #64748b;
  font-weight: 600;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: #f1f5f9;
    color: #1e293b;
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const Container = styled.div`
  background: linear-gradient(135deg, #acd0f5 0%, #e1e1e1 100%);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 80px;
`;

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: 1.5rem;
  max-width: 500px;

  h1 {
    font-size: 1.8rem;
    font-weight: 800;
    background: linear-gradient(135deg, #1e293b 0%, #475569 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 0.5rem;
  }

  p {
    color: #64748b;
    font-size: 0.9rem;
    line-height: 1.4;
  }
`;

const ToggleContainer = styled.div`
  display: flex;
  gap: 1rem;
  background: white;
  border-radius: 12px;
  padding: 4px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
`;

const ToggleButton = styled.button<{ $active?: boolean }>`
  padding: 0.5rem 1rem;
  border: none;
  background: ${({ $active }) => ($active ? "#3b82f6" : "transparent")};
  color: ${({ $active }) => ($active ? "white" : "#64748b")};
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    background: ${({ $active }) => ($active ? "#3b82f6" : "#f1f5f9")};
  }
`;

const PlansGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  max-width: 900px;
  padding-top: 1rem;
  width: 100%;
  flex: 1;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
`;

const PlanCard = styled.div<{ $featured?: boolean }>`
  background: white;
  border-radius: 10px;
  padding: 1rem;
  box-shadow: ${({ $featured }) =>
    $featured
      ? "0 8px 12px -3px rgba(0, 0, 0, 0.1), 0 3px 4px -2px rgba(0, 0, 0, 0.05)"
      : "0 3px 4px -1px rgba(0, 0, 0, 0.1)"};
  border: ${({ $featured }) =>
    $featured ? "2px solid #3b82f6" : "1px solid #e2e8f0"};
  position: relative;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  height: fit-content;
  max-width: 400px;
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 12px 16px -4px rgba(0, 0, 0, 0.1);
  }
`;

const FeaturedBadge = styled.div`
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  padding: 0.25rem 0.6rem;
  border-radius: 12px;
  font-weight: 700;
  font-size: 0.65rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  white-space: nowrap;
  z-index: 10;
`;

const PlanHeader = styled.div`
  text-align: center;
  margin-bottom: 0.75rem;
`;

const PlanIcon = styled.div<{ $color: string }>`
  width: 28px;
  height: 28px;
  border-radius: 6px;
  background: ${({ $color }) => $color}15;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 0.4rem;

  svg {
    color: ${({ $color }) => $color};
  }
`;

const PlanName = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.25rem;
`;

const PlanDescription = styled.p`
  color: #64748b;
  font-size: 0.75rem;
  line-height: 1.3;
`;

const PricingSection = styled.div`
  text-align: center;
  margin-bottom: 0.75rem;
`;

const Price = styled.div`
  font-size: 1.5rem;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 0.25rem;
`;

const BillingPeriod = styled.div`
  color: #64748b;
  font-size: 0.75rem;
  margin-bottom: 0.4rem;
`;

const SavingsBadge = styled.div`
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 10px;
  font-size: 0.65rem;
  font-weight: 600;
  display: inline-block;
`;

const FeaturesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 0.75rem 0;
  flex: 1;
`;

const Feature = styled.li<{ $included?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.3rem 0;
  color: ${({ $included }) => ($included ? "#1e293b" : "#94a3b8")};
  font-size: 0.75rem;
`;

const FeatureIcon = styled.div<{ $included?: boolean }>`
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: ${({ $included }) => ($included ? "#10b981" : "#e2e8f0")};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg {
    width: 8px;
    height: 8px;
    color: ${({ $included }) => ($included ? "white" : "#94a3b8")};
  }
`;

const SubscribeButton = styled.button<{ $featured?: boolean }>`
  width: 100%;
  padding: 0.6rem;
  border: none;
  border-radius: 6px;
  background: ${({ $featured }) =>
    $featured
      ? "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)"
      : "linear-gradient(135deg, #64748b 0%, #475569 100%)"};
  color: white;
  font-weight: 700;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 3px 4px -1px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 8px -2px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: translateY(0);
  }
`;

const pricingData = {
  basic: {
    monthly: { price: 1.0, id: "plan_YAWZD79Ujsl0QE3l" },
    semiannual: { price: 169.9, id: "plan_Dpa3gVQIjIpndokW" },
    annual: { price: 299.0, id: "plan_zBywjlkuZunA5nQP" },
  },
  recommended: {
    monthly: { price: 59.9, id: "plan_xxxxxxxxxxxxxx04" },
    semiannual: { price: 339.9, id: "plan_xxxxxxxxxxxxxx05" },
    annual: { price: 599.9, id: "plan_xxxxxxxxxxxxxx06" },
  },
};

export default function SubscriptionPage() {
  const [billingCycle, setBillingCycle] = useState<
    "monthly" | "semiannual" | "annual"
  >("monthly");
  const [isLoading, setIsLoading] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (type: "success" | "error" | "info", message: string) => {
    const id = Date.now().toString();
    const newToast: ToastMessage = { id, type, message };

    setToasts((prev) => [...prev, newToast]);

    // Remove o toast após 4 segundos
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const handleGoBack = () => {
    window.history.back();
  };

  const getToastIcon = (type: "success" | "error" | "info") => {
    switch (type) {
      case "success":
        return <CheckCircle size={20} />;
      case "error":
        return <AlertCircle size={20} />;
      case "info":
        return <Info size={20} />;
      default:
        return <Info size={20} />;
    }
  };

  const getPrice = (plan: "basic" | "recommended") => {
    return pricingData[plan][billingCycle].price;
  };

  const getBillingText = () => {
    switch (billingCycle) {
      case "monthly":
        return "por mês";
      case "semiannual":
        return "por 6 meses";
      case "annual":
        return "por ano";
    }
  };
  const handleSubscribe = async (plan: "basic" | "recommended") => {
    setIsLoading(true);
    showToast("info", "Criando sua sessão de pagamento...");

    try {
      const planId = pricingData[plan][billingCycle].id;

      if (!planId) {
        throw new Error("ID do plano não encontrado para a seleção atual.");
      }

      const { data, error } = await supabase.functions.invoke(
        "create-pagarme-checkout",
        {
          body: { planId: planId },
        }
      );

      if (error) {
        throw new Error(error.message);
      }

      // O objeto 'data' da função contém a URL de checkout
      const { checkout_url, error: functionError } = data;

      if (functionError) {
        // Isso captura erros retornados na resposta JSON da função
        throw new Error(functionError);
      }

      // 4. Redirecione o usuário para o Pagar.me
      if (checkout_url) {
        window.location.href = checkout_url;
      } else {
        throw new Error("Não foi possível obter a URL de checkout.");
      }
    } catch (error: unknown) {
      console.error("Erro ao iniciar a assinatura:", error);
      showToast(
        "error",
        error instanceof Error
          ? error.message
          : "Ocorreu um erro ao redirecionar para o pagamento."
      );
      setIsLoading(false);
    }
  };

  const getSavings = (plan: "basic" | "recommended") => {
    const monthlyPrice = pricingData[plan].monthly.price;
    const currentPrice = pricingData[plan][billingCycle].price;

    if (billingCycle === "semiannual") {
      const monthlyEquivalent = currentPrice / 6;
      const savings = ((monthlyPrice - monthlyEquivalent) / monthlyPrice) * 100;
      return Math.round(savings);
    } else if (billingCycle === "annual") {
      const monthlyEquivalent = currentPrice / 12;
      const savings = ((monthlyPrice - monthlyEquivalent) / monthlyPrice) * 100;
      return Math.round(savings);
    }
    return 0;
  };

  return (
    <Container>
      <Header>
        <BackButton onClick={handleGoBack}>
          <ArrowLeft />
          Voltar
        </BackButton>
      </Header>

      <ToastContainer>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            $type={toast.type}
            onClick={() => removeToast(toast.id)}
          >
            <ToastIcon>{getToastIcon(toast.type)}</ToastIcon>
            {toast.message}
          </Toast>
        ))}
      </ToastContainer>

      <PageHeader>
        <h1>Escolha seu Plano</h1>
        <p>
          Selecione o plano que melhor se adapta às suas necessidades e comece
          sua jornada de saúde respiratória hoje mesmo.
        </p>
      </PageHeader>

      <ToggleContainer>
        <ToggleButton
          $active={billingCycle === "monthly"}
          onClick={() => setBillingCycle("monthly")}
        >
          Mensal
        </ToggleButton>
        <ToggleButton
          $active={billingCycle === "semiannual"}
          onClick={() => setBillingCycle("semiannual")}
        >
          Semestral
        </ToggleButton>
        <ToggleButton
          $active={billingCycle === "annual"}
          onClick={() => setBillingCycle("annual")}
        >
          Anual
        </ToggleButton>
      </ToggleContainer>

      <PlansGrid>
        <PlanCard>
          <PlanHeader>
            <PlanIcon $color="#64748b">
              <Zap size={24} />
            </PlanIcon>
            <PlanName>Básico</PlanName>
            <PlanDescription>
              Perfeito para começar sua jornada de saúde respiratória
            </PlanDescription>
          </PlanHeader>

          <PricingSection>
            <Price>R$ {getPrice("basic").toFixed(2).replace(".", ",")}</Price>
            <BillingPeriod>{getBillingText()}</BillingPeriod>
            {getSavings("basic") > 0 && (
              <SavingsBadge>Economize {getSavings("basic")}%</SavingsBadge>
            )}
          </PricingSection>

          <FeaturesList>
            <Feature $included={false}>
              <FeatureIcon $included={false}>
                <X size={12} />
              </FeatureIcon>
              Consulta Profissional
            </Feature>
            <Feature $included={true}>
              <FeatureIcon $included={true}>
                <Check size={12} />
              </FeatureIcon>
              Plano de Exercícios Padrão
            </Feature>
            <Feature $included={true}>
              <FeatureIcon $included={true}>
                <Check size={12} />
              </FeatureIcon>
              Relatórios Básicos Mensais
            </Feature>
            <Feature $included={false}>
              <FeatureIcon $included={false}>
                <X size={12} />
              </FeatureIcon>
              Acesso Total ao Conteúdo
            </Feature>
            <Feature $included={true}>
              <FeatureIcon $included={true}>
                <Check size={12} />
              </FeatureIcon>
              Suporte por E-mail
            </Feature>
            <Feature $included={true}>
              <FeatureIcon $included={true}>
                <Check size={12} />
              </FeatureIcon>
              Guias Básicos
            </Feature>
          </FeaturesList>

          <SubscribeButton
            onClick={() => handleSubscribe("basic")}
            disabled={isLoading}
          >
            {isLoading ? "Aguarde..." : "Assinar Plano Básico"}
          </SubscribeButton>
        </PlanCard>

        <PlanCard $featured>
          <FeaturedBadge>Mais Popular</FeaturedBadge>
          <PlanHeader>
            <PlanIcon $color="#3b82f6">
              <Star size={24} />
            </PlanIcon>
            <PlanName>Recomendado</PlanName>
            <PlanDescription>
              Plano completo com todos os recursos e acompanhamento profissional
            </PlanDescription>
          </PlanHeader>
          <PricingSection>
            <Price>
              R$ {getPrice("recommended").toFixed(2).replace(".", ",")}
            </Price>
            <BillingPeriod>{getBillingText()}</BillingPeriod>
            {getSavings("recommended") > 0 && (
              <SavingsBadge>
                Economize {getSavings("recommended")}%
              </SavingsBadge>
            )}
          </PricingSection>
          <FeaturesList>
            <Feature $included={true}>
              <FeatureIcon $included={true}>
                <Check size={12} />
              </FeatureIcon>
              Consulta Profissional (1x a cada 3 meses)
            </Feature>
            <Feature $included={true}>
              <FeatureIcon $included={true}>
                <Check size={12} />
              </FeatureIcon>
              Plano de Exercícios Personalizado
            </Feature>
            <Feature $included={true}>
              <FeatureIcon $included={true}>
                <Check size={12} />
              </FeatureIcon>
              Relatórios Detalhados Semanais (PDF)
            </Feature>
            <Feature $included={true}>
              <FeatureIcon $included={true}>
                <Check size={12} />
              </FeatureIcon>
              Acesso Total ao Conteúdo
            </Feature>
            <Feature $included={true}>
              <FeatureIcon $included={true}>
                <Check size={12} />
              </FeatureIcon>
              Suporte Prioritário via Chat
            </Feature>
            <Feature $included={true}>
              <FeatureIcon $included={true}>
                <Check size={12} />
              </FeatureIcon>
              E-books Exclusivos
            </Feature>
          </FeaturesList>
          <SubscribeButton
            $featured
            onClick={() => handleSubscribe("recommended")}
            disabled={isLoading}
          >
            {isLoading ? "Aguarde..." : "Assinar Plano Recomendado"}
          </SubscribeButton>{" "}
        </PlanCard>
      </PlansGrid>
    </Container>
  );
}
