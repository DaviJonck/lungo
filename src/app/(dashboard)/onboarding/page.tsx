"use client";

import styled from "styled-components";
import Image from "next/image";
import OnboardingForm from "./components/OnboardingForm";

const OnboardingContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  position: relative;
  overflow: hidden;
`;

const OnboardingWrapper = styled.div`
  width: 100%;
  max-width: 1600px;
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 4rem;
  align-items: center;
  position: relative;
  z-index: 2;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 2rem;
    max-width: 32rem;
  }
`;

const ContentSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  position: relative;
`;

const LunguinhoContainer = styled.div`
  position: absolute;
  top: -1rem;
  right: -1rem;
  z-index: 1;
  opacity: 0.8;
  animation: float 3s ease-in-out infinite;

  @keyframes float {
    0%,
    100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  @media (max-width: 968px) {
    display: none;
  }
`;

const OnboardingTitle = styled.h1`
  font-size: 3rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.secondaryDarker};
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.2;

  @media (max-width: 968px) {
    font-size: 2.25rem;
    text-align: center;
  }
`;

const OnboardingSubtitle = styled.p`
  color: ${({ theme }) => theme.colors.secondary};
  font-size: ${({ theme }) => theme.fontSizes.xl};
  line-height: 1.6;
  margin-bottom: 1rem;

  @media (max-width: 968px) {
    text-align: center;
    font-size: ${({ theme }) => theme.fontSizes.lg};
  }
`;

const BenefitsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;

  @media (max-width: 968px) {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
  }
`;

const BenefitItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: rgba(59, 130, 246, 0.1);
  padding: 1rem 1.25rem;
  border-radius: 1rem;
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: #1e40af;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(59, 130, 246, 0.15);
    transform: translateX(4px);
  }
`;

const DecorativeElements = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 1;
`;

const FloatingCircle = styled.div`
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    rgba(59, 130, 246, 0.1) 0%,
    rgba(147, 197, 253, 0.1) 100%
  );
  animation: float 6s ease-in-out infinite;

  &:nth-child(1) {
    width: 120px;
    height: 120px;
    top: 10%;
    left: 10%;
    animation-delay: 0s;
  }

  &:nth-child(2) {
    width: 80px;
    height: 80px;
    top: 20%;
    right: 15%;
    animation-delay: 2s;
  }

  &:nth-child(3) {
    width: 60px;
    height: 60px;
    bottom: 20%;
    left: 20%;
    animation-delay: 4s;
  }
`;

export default function OnboardingPage() {
  return (
    <OnboardingContainer>
      <DecorativeElements>
        <FloatingCircle />
        <FloatingCircle />
        <FloatingCircle />
      </DecorativeElements>

      <OnboardingWrapper>
        <ContentSection>
          <LunguinhoContainer>
            <Image
              src="/lunguinho.png"
              alt="Lunguinho"
              width={120}
              height={120}
              style={{
                filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1))",
              }}
            />
          </LunguinhoContainer>

          <OnboardingTitle>Complete seu Perfil</OnboardingTitle>
          <OnboardingSubtitle>
            Ajude-nos a personalizar sua experiência na LunGo e receba
            recomendações específicas para sua saúde respiratória
          </OnboardingSubtitle>

          <BenefitsList>
            <BenefitItem>
              <span>🎯</span>
              <span>Exercícios personalizados</span>
            </BenefitItem>
            <BenefitItem>
              <span>📊</span>
              <span>Acompanhamento de progresso</span>
            </BenefitItem>
            <BenefitItem>
              <span>💡</span>
              <span>Dicas de saúde</span>
            </BenefitItem>
          </BenefitsList>
        </ContentSection>

        <OnboardingForm />
      </OnboardingWrapper>
    </OnboardingContainer>
  );
}
