"use client";

import React from "react";
import styled from "styled-components";
import { HandHeart, Trophy } from "lucide-react";
import { useRouter } from "next/navigation";

const Section = styled.section`
  position: relative;
  background: ${({ theme }) => theme.colors.background};
  padding: 5rem 1rem 8rem;
  overflow: hidden;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 7rem 2rem 10rem;
  }
`;

const SectionInner = styled.div`
  max-width: 1100px;
  margin: 0 auto;
`;

const TopCurve = styled.div`
  position: absolute;
  top: -48px;
  left: 50%;
  transform: translateX(-50%);
  width: 130%;
  height: 96px;
  background: ${({ theme }) => theme.colors.disabledLight};
  border-bottom-left-radius: 50% 96px;
  border-bottom-right-radius: 50% 96px;
  pointer-events: none;
  z-index: 2;
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    top: -64px;
    height: 128px;
    border-bottom-left-radius: 50% 128px;
    border-bottom-right-radius: 50% 128px;
  }
`;

const Header = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
  margin-bottom: 2.5rem;
  margin-top: 2.5rem;
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    max-width: 680px;
  }

  h2 {
    color: ${({ theme }) => theme.colors.textBlue};
    font-weight: 800;
    font-size: clamp(1.5rem, 2.5vw, 2rem);
    line-height: 1.2;
  }

  p {
    color: ${({ theme }) => theme.colors.textBlue};
    opacity: 0.9;
  }
`;

const Cards = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;
  align-items: start;

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
`;

const Card = styled.div<{ $highlighted?: boolean }>`
  position: relative;
  background: ${({ $highlighted, theme }) =>
    $highlighted
      ? `linear-gradient(180deg, ${theme.colors.white} 0%, #f7fbff 60%, ${theme.colors.white} 100%)`
      : theme.colors.white};
  border-radius: 16px;
  box-shadow: ${({ theme }) => theme.shadows.lg};
  padding: 1.25rem;
  min-height: 440px;
  border: ${({ $highlighted, theme }) =>
    $highlighted
      ? `2px solid ${theme.colors.secondary}`
      : "2px solid transparent"};
  z-index: ${({ $highlighted }) => ($highlighted ? 2 : 1)};
  transform: ${({ $highlighted }) =>
    $highlighted ? "translateY(-20px)" : "none"};
  transition: box-shadow 200ms ease, transform 200ms ease,
    border-color 200ms ease;
  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.xl};
    transform: translateY(-6px)
      ${({ $highlighted }) =>
        $highlighted ? " translateY(-25px)" : "translateY(-5px)"};
    border-color: ${({ theme }) => theme.colors.secondary};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 1.5rem;
    min-height: 480px;
    transform: ${({ $highlighted }) =>
      $highlighted ? "translateY(-28px)" : "none"};
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin-top: ${({ $highlighted }) => ($highlighted ? "2.5rem" : "0")};
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;

  h3 {
    color: ${({ theme }) => theme.colors.textBlue};
    font-size: 1rem;
    font-weight: 700;
  }
`;

const IconCircle = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(122, 178, 211, 0.15);
`;

const PriceRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  margin: 0.25rem 0 0.5rem;

  .price {
    font-weight: 800;
    color: ${({ theme }) => theme.colors.textBlack};
    font-size: 1.75rem;
  }

  .per {
    color: ${({ theme }) => theme.colors.textBlue};
  }
`;

const Description = styled.p`
  color: ${({ theme }) => theme.colors.textBlue};
  font-size: 0.95rem;
  margin-bottom: 0.75rem;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  margin: 0.75rem 0 0.5rem;
`;

const Feature = styled.li<{ $included?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${({ theme, $included }) =>
    $included ? theme.colors.textBlue : theme.colors.textBlue};
  padding: 0.35rem 0;
  list-style: none;
  opacity: ${({ $included }) => ($included ? 1 : 0.6)};
`;

const Icon = styled.span<{ $included?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: ${({ $included }) => ($included ? "#10b981" : "#ef4444")};
  color: white;
  font-size: 10px;
  font-weight: 700;
  flex-shrink: 0;
`;

const Actions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.75rem;
`;

const Btn = styled.button<{ variant?: "primary" | "ghost" }>`
  appearance: none;
  border: none;
  background: ${({ variant }) =>
    variant === "primary" ? "#3CD7CD" : "#87B8F8"};
  color: white;
  font-weight: 700;
  border-radius: 999px;
  padding: 0.6rem 1rem;
  width: 100%;
  cursor: pointer;
  transition: background-color 150ms ease, color 150ms ease,
    box-shadow 150ms ease;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.sm};
    opacity: 0.8;
  }
`;

const Badge = styled.div`
  position: absolute;
  top: -14px;
  left: 50%;
  transform: translateX(-50%);
  background: #3cd7cd;
  color: white;
  font-weight: 700;
  font-size: 0.85rem;
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
  box-shadow: ${({ theme }) => theme.shadows.md};
  z-index: 3;
`;

const DecoTopRight = styled.img`
  position: absolute;
  right: 1rem;
  top: -2px;
  width: 140px;
  pointer-events: none;
  z-index: 1;
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    right: 3rem;
    width: 170px;
  }
`;

const DecoBottomLeft = styled.img`
  position: absolute;
  bottom: 0px;
  width: 160px;
  pointer-events: none;
  left: 1rem;

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    /* abaixo do card "Grátis" quando há 3 colunas */
    left: calc(50% - 550px + 36px);
    width: 190px;
  }
`;

export default function Pricing() {
  const router = useRouter();
  return (
    <Section id="planos" aria-labelledby="pricing-heading">
      <TopCurve />
      <DecoTopRight src="/pulmao3.png" alt="pulmão forte" />
      <DecoBottomLeft src="/pulmao4.png" alt="pulmão com máscara" />

      <SectionInner>
        <Header>
          <h2>Nosso planos de assinatura baseado nas suas necessidade.</h2>
          <p>Descubra qual plano faz mais sentido para você.</p>
        </Header>

        <Cards>
          <Card>
            <CardHeader>
              <h3>Básico</h3>
              <IconCircle>
                <HandHeart size={18} color="#7ab2d3" />
              </IconCircle>
            </CardHeader>
            <PriceRow>
              <span className="price">R$ 29,90</span>
              <span className="per">por mês</span>
            </PriceRow>
            <Description>
              Plano essencial para começar sua jornada de saúde respiratória.
            </Description>
            <Actions>
              <Btn variant="ghost" onClick={() => router.push("/subscription")}>
                Assinar
              </Btn>
            </Actions>
            <Divider />
            <ul>
              <Feature $included={false}>
                <Icon $included={false}>✗</Icon>
                Consulta Profissional
              </Feature>
              <Feature $included={true}>
                <Icon $included={true}>✓</Icon>
                Plano de Exercícios: Padrão
              </Feature>
              <Feature $included={true}>
                <Icon $included={true}>✓</Icon>
                Relatórios: Básico Mensal
              </Feature>
              <Feature $included={false}>
                <Icon $included={false}>✗</Icon>
                Conteúdo: Acesso Total
              </Feature>
              <Feature $included={true}>
                <Icon $included={true}>✓</Icon>
                Suporte: E-mail
              </Feature>
              <Feature $included={true}>
                <Icon $included={true}>✓</Icon>
                Materiais Complementares: Guias Básicos
              </Feature>
            </ul>
          </Card>

          <Card $highlighted>
            <Badge>Mais Popular</Badge>
            <CardHeader>
              <h3>Recomendado</h3>
              <IconCircle>
                <Trophy size={18} color="#7ab2d3" />
              </IconCircle>
            </CardHeader>
            <PriceRow>
              <span className="price">R$ 59,90</span>
              <span className="per">por mês</span>
            </PriceRow>
            <Description>
              Plano completo com todos os recursos e acompanhamento
              profissional.
            </Description>
            <Actions>
              <Btn
                variant="primary"
                onClick={() => router.push("/subscription")}
              >
                Assinar
              </Btn>
            </Actions>
            <Divider />
            <ul>
              <Feature $included={true}>
                <Icon $included={true}>✓</Icon>
                Consulta Profissional: 1x a cada 3 meses
              </Feature>
              <Feature $included={true}>
                <Icon $included={true}>✓</Icon>
                Plano de Exercícios: Personalizado
              </Feature>
              <Feature $included={true}>
                <Icon $included={true}>✓</Icon>
                Relatórios: Detalhado Semanal (PDF)
              </Feature>
              <Feature $included={true}>
                <Icon $included={true}>✓</Icon>
                Conteúdo: Acesso Total
              </Feature>
              <Feature $included={true}>
                <Icon $included={true}>✓</Icon>
                Suporte: Prioritário via Chat
              </Feature>
              <Feature $included={true}>
                <Icon $included={true}>✓</Icon>
                Materiais Complementares: E-books Exclusivos
              </Feature>
            </ul>
          </Card>
        </Cards>
      </SectionInner>
    </Section>
  );
}
