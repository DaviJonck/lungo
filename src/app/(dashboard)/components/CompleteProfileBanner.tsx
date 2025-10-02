"use client";

import Link from "next/link";
import styled from "styled-components";
import { AlertTriangle, ArrowRight } from "lucide-react";

const BannerContainer = styled.div`
  background: #fef3c7;
  border-left: 4px solid #f59e0b;
  padding: 1rem;
  margin-bottom: 1.5rem;
`;

const BannerContent = styled.div`
  display: flex;
  align-items: flex-start;
`;

const IconContainer = styled.div`
  flex-shrink: 0;
`;

const BannerIcon = styled(AlertTriangle)`
  height: 1.25rem;
  width: 1.25rem;
  color: #f59e0b;
`;

const BannerText = styled.div`
  margin-left: 0.75rem;
  flex: 1;
`;

const BannerTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: 500;
  color: #92400e;
  margin: 0;
`;

const BannerMessage = styled.div`
  margin-top: 0.5rem;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: #b45309;
`;

const BannerButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 0.75rem;
  border: 1px solid transparent;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: 500;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: #92400e;
  background: #fef3c7;
  text-decoration: none;
  transition: all 0.2s ease;
  margin-top: 1rem;
  background: #fde68a;

  &:hover {
    box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.5);
  }

  &:focus {
    outline: none;
  }
`;

const ButtonIcon = styled(ArrowRight)`
  margin-left: 0.5rem;
  height: 1rem;
  width: 1rem;
`;

export default function CompleteProfileBanner() {
  return (
    <BannerContainer>
      <BannerContent>
        <IconContainer>
          <BannerIcon />
        </IconContainer>
        <BannerText>
          <BannerTitle>Perfil Incompleto</BannerTitle>
          <BannerMessage>
            <p>
              Seu perfil está incompleto. Por favor, preencha suas informações
              para uma melhor experiência personalizada na LunGo.
            </p>
          </BannerMessage>
          <BannerButton href="/onboarding">
            Completar Perfil
            <ButtonIcon />
          </BannerButton>
        </BannerText>
      </BannerContent>
    </BannerContainer>
  );
}
