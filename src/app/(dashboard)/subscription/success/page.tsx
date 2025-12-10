"use client";

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { CheckCircle, ArrowRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { theme } from "@/styles/theme";

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
    135deg,
    ${theme.colors.primary} 0%,
    ${theme.colors.background} 100%
  );
  padding: ${theme.spacing.lg};
  position: relative;
  overflow: hidden;
`;

const Card = styled.div`
  background: ${theme.colors.white};
  border-radius: ${theme.borderRadius.xl};
  box-shadow: ${theme.shadows.xl};
  padding: ${theme.spacing["2xl"]};
  max-width: 500px;
  width: 100%;
  text-align: center;
  position: relative;
  z-index: 10;
  border: 2px solid ${theme.colors.secondary}20;
`;

const IconWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  margin: 0 auto ${theme.spacing.md};
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    ${theme.colors.secondary}15,
    ${theme.colors.secondaryLighter}15
  );
  border: 3px solid ${theme.colors.secondary}30;
  position: relative;
  animation: pulse 2s infinite;

  svg {
    color: ${theme.colors.secondary};
    filter: drop-shadow(0 2px 4px rgba(122, 178, 211, 0.3));
  }

  @keyframes pulse {
    0% {
      transform: scale(1);
      box-shadow: 0 0 0 0 ${theme.colors.secondary}40;
    }
    70% {
      transform: scale(1.05);
      box-shadow: 0 0 0 10px ${theme.colors.secondary}00;
    }
    100% {
      transform: scale(1);
      box-shadow: 0 0 0 0 ${theme.colors.secondary}00;
    }
  }
`;

const Title = styled.h1`
  font-size: ${theme.fontSizes["3xl"]};
  font-weight: 800;
  color: ${theme.colors.textBlack};
  margin-bottom: ${theme.spacing.sm};
  background: linear-gradient(
    135deg,
    ${theme.colors.secondary} 0%,
    ${theme.colors.secondaryLighter} 100%
  );
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Subtitle = styled.p`
  color: ${theme.colors.textBlue};
  font-size: ${theme.fontSizes.base};
  line-height: 1.6;
  margin-bottom: ${theme.spacing.lg};
  font-weight: 500;
`;

const Divider = styled.hr`
  border: none;
  height: 2px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    ${theme.colors.secondary}50 50%,
    transparent 100%
  );
  margin: ${theme.spacing.lg} 0;
`;

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.sm};
  width: 100%;
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  border: none;
  border-radius: ${theme.borderRadius.lg};
  background: linear-gradient(
    135deg,
    ${theme.colors.secondary} 0%,
    ${theme.colors.secondaryLighter} 100%
  );
  color: ${theme.colors.white};
  font-weight: 700;
  font-size: ${theme.fontSizes.base};
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: ${theme.shadows.lg};
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: left 0.5s;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.xl};

    &::before {
      left: 100%;
    }
  }

  &:active {
    transform: translateY(0);
  }
`;

const OrderIdBadge = styled.div`
  background: linear-gradient(
    135deg,
    ${theme.colors.secondary}15,
    ${theme.colors.secondaryLighter}15
  );
  border: 1px solid ${theme.colors.secondary}30;
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  margin: ${theme.spacing.md} 0;
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.textBlue};
  font-weight: 600;
  display: inline-block;
`;

export default function SubscriptionSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    // Extract order_id from URL parameters
    const payment = searchParams.get("payment");
    const orderIdParam = searchParams.get("order_id");

    if (payment === "success" && orderIdParam) {
      setOrderId(orderIdParam);
    }
  }, [searchParams]);

  const goToDashboard = () => {
    router.push("/dashboard");
  };

  return (
    <Container>
      <Card>
        <IconWrap>
          <CheckCircle size={48} />
        </IconWrap>
        <Title>🎉 Assinatura ativada com sucesso!</Title>
        <Subtitle>
          Obrigado por apoiar o LunGo! Sua assinatura foi confirmada pelo
          Pagar.me e seu acesso premium está liberado. Agora você tem acesso a
          todos os recursos exclusivos da plataforma.
        </Subtitle>

        {orderId && <OrderIdBadge>ID do pedido: {orderId}</OrderIdBadge>}

        <Divider />
        <Button onClick={goToDashboard}>
          Ir para o painel
          <ArrowRight size={20} />
        </Button>
      </Card>
    </Container>
  );
}
