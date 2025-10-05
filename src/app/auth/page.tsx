"use client";

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";

const AuthContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #bae6fd 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  position: relative;
  overflow: hidden;
`;

const AuthWrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  position: relative;
  z-index: 2;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 2rem;
    max-width: 500px;
    justify-items: center;
  }
`;

const LeftSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  position: relative;

  @media (max-width: 968px) {
    display: none;
  }
`;

const LunguinhoContainer = styled.div`
  position: relative;
  margin-bottom: 2rem;
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
`;

const WelcomeTitle = styled.h1`
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
  }
`;

const WelcomeSubtitle = styled.p`
  color: ${({ theme }) => theme.colors.secondary};
  font-size: ${({ theme }) => theme.fontSizes.xl};
  line-height: 1.6;
  margin-bottom: 2rem;
  max-width: 400px;

  @media (max-width: 968px) {
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

const RightSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  width: 100%;

  @media (max-width: 968px) {
    max-width: 400px;
    width: 100%;
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

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;

  &::after {
    content: "";
    width: 40px;
    height: 40px;
    border: 4px solid rgba(255, 255, 255, 0.3);
    border-top: 4px solid white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <AuthContainer>
        <LoadingSpinner />
      </AuthContainer>
    );
  }

  if (user) {
    return null; // Will redirect to dashboard
  }

  return (
    <AuthContainer>
      <DecorativeElements>
        <FloatingCircle />
        <FloatingCircle />
        <FloatingCircle />
      </DecorativeElements>

      <AuthWrapper>
        <LeftSection>
          <LunguinhoContainer>
            <Image
              src="/Lunguinho.png"
              alt="Lunguinho - Mascote da LunGo"
              width={200}
              height={200}
              style={{
                filter: "drop-shadow(0 8px 16px rgba(0, 0, 0, 0.1))",
              }}
            />
          </LunguinhoContainer>

          <WelcomeTitle>Bem-vindo à LunGo</WelcomeTitle>
          <WelcomeSubtitle>
            Sua jornada para uma saúde respiratória melhor começa aqui. Junte-se
            a milhares de pessoas que já transformaram suas vidas.
          </WelcomeSubtitle>

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
              <span>Dicas de saúde especializadas</span>
            </BenefitItem>
            <BenefitItem>
              <span>🤝</span>
              <span>Comunidade de apoio</span>
            </BenefitItem>
          </BenefitsList>
        </LeftSection>

        <RightSection>
          {isLogin ? (
            <LoginForm onToggleMode={() => setIsLogin(false)} />
          ) : (
            <SignupForm onToggleMode={() => setIsLogin(true)} />
          )}
        </RightSection>
      </AuthWrapper>
    </AuthContainer>
  );
}
