"use client";

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { CheckCircle, ArrowRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #acf0cf 0%, #e1f7e7 100%);
  padding: 1.5rem;
`;

const Card = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  max-width: 560px;
  width: 100%;
  text-align: center;
`;

const IconWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  margin: 0 auto 1rem;
  border-radius: 50%;
  background: #10b98115;

  svg {
    color: #10b981;
  }
`;

const Title = styled.h1`
  font-size: 1.6rem;
  font-weight: 800;
  color: #064e3b;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: #475569;
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 1.25rem;
`;

const Divider = styled.hr`
  border: none;
  height: 1px;
  background: #e2e8f0;
  margin: 1.25rem 0 1.5rem;
`;

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.85rem 1rem;
  border: none;
  border-radius: 10px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  box-shadow: 0 6px 14px -4px rgba(16, 185, 129, 0.4);

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 10px 18px -5px rgba(16, 185, 129, 0.45);
  }

  &:active {
    transform: translateY(0);
  }
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
          <CheckCircle size={36} />
        </IconWrap>
        <Title>Assinatura ativada com sucesso!</Title>
        <Subtitle>
          Obrigado por apoiar o LunGo. Sua assinatura foi confirmada pelo
          Pagar.me e seu acesso premium está liberado.
          {orderId && (
            <>
              <br />
              <br />
              <strong>ID do pedido: {orderId}</strong>
            </>
          )}
        </Subtitle>
        <Divider />
        <Button onClick={goToDashboard}>
          Ir para o painel
          <ArrowRight size={18} />
        </Button>
      </Card>
    </Container>
  );
}
