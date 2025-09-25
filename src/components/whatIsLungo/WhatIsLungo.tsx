import styled from "styled-components";
import Image from "next/image";
import { ClipboardPen } from "lucide-react";
import { BicepsFlexed } from "lucide-react";
import { Globe } from "lucide-react";
import { Info } from "lucide-react";
import { theme } from "@/styles/theme";

const Section = styled.section`
  width: 100%;
  position: relative; /* Essencial para posicionar o ::before */
  padding: ${({}) => "5rem"} 0; /* Aumentei o padding para a curva ter espaço */
  background-color: ${({ theme }) =>
    theme.colors.background}; /* Cor superior */
  overflow: hidden; /* Garante que a curva não "vaze" para fora da seção */

  /* A MÁGICA DA CURVA ACONTECE AQUI */
  &::before {
    content: ""; /* Pseudo-elementos precisam de um content */
    position: absolute;
    bottom: 0; /* Posiciona a forma na base da seção */
    left: -60%; /* Começa na metade para a esquerda */
    width: 190%; /* O dobro da largura para criar uma curva suave */
    height: 450px; /* A "altura" da sua curva */

    background-color: ${({ theme }) =>
      theme.colors.disabledLight}; /* Cor inferior */

    /* A linha que cria a curva */
    border-radius: 4% 244% 0 0;
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.sm};
  position: relative;
`;

const MainCard = styled.div`
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing["xl"]};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  position: relative;
  z-index: 2;
`;

const InfoBox = styled.div<{ position: "left" | "right" }>`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  top: ${({ position }) => (position === "left" ? "15rem" : "3rem")};
  ${({ position }) => (position === "left" ? `left: -8rem;` : `right: -6rem;`)}
  background-color: rgba(242, 248, 245, 0.8);
  backdrop-filter: blur(1px);
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  gap: ${({ theme }) => theme.spacing.sm};
  box-shadow: ${({ theme }) => theme.shadows.md};
  z-index: 3;
  max-width: 200px;
  text-align: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: none;
  }
`;

const InfoText = styled.p`
  color: ${({ theme }) => theme.colors.secondary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: 500;
  margin: 0;
`;

const Title = styled.h2`
  color: ${({ theme }) => theme.colors.secondaryDarker};
  font-size: ${({ theme }) => theme.fontSizes["4xl"]};
  font-weight: 800;
  margin-bottom: ${({ theme }) => theme.spacing["2xl"]};
  line-height: 1.2;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.fontSizes["3xl"]};
  }
`;

const Subtitle = styled.h3`
  color: ${({ theme }) => theme.colors.secondary};
  font-size: ${({ theme }) => theme.fontSizes["2xl"]};
  font-weight: 700;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  line-height: 1.3;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.fontSizes.xl};
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing["2xl"]};
  align-items: center;
  padding-inline: ${({ theme }) => theme.spacing["3xl"]};

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr 1fr;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding-inline: 0.25rem;
  }
`;

const TextContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const Description = styled.p`
  color: ${({ theme }) => theme.colors.secondaryDarker};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  line-height: 1.6;
  margin: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.fontSizes.base};
  }
`;

const IllustrationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const Illustration = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const FeaturesSection = styled.div`
  margin-top: ${({ theme }) => theme.spacing["3xl"]};
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing["2xl"]};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const FeatureCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  gap: ${({ theme }) => theme.spacing.md};
`;

const FeatureTitle = styled.h4`
  color: ${({ theme }) => theme.colors.secondaryDarker};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: 700;
  margin: 0;
  line-height: 1.3;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.fontSizes.base};
  }
`;

const FeatureDescription = styled.p`
  color: ${({ theme }) => theme.colors.secondaryDarker};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  line-height: 1.5;
  margin: 0;
  opacity: 0.8;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.fontSizes.xs};
  }
`;

const WhatIsLungo = () => {
  return (
    <Section id="sobre">
      <Container>
        <InfoBox position="left">
          <Info color={theme.colors.secondaryDarker} />
          <InfoText>Descubra uma nova maneira de viver.</InfoText>
        </InfoBox>

        <InfoBox position="right">
          <Info color={theme.colors.secondaryDarker} />
          <InfoText>Seu melhor amigo para sua reabilitação</InfoText>
        </InfoBox>

        <MainCard>
          <Title>O que é LunGo ?</Title>

          <ContentGrid>
            <TextContent>
              <Subtitle>CUIDE DE VOCÊ</Subtitle>
              <Description>
                LunGo é uma plataforma nacional para reabilitação pulmonar e
                automanejo de doenças respiratórias. Aqui, pacientes recebem
                planos personalizados e profissionais têm acesso ao exclusivo
                Método AirTrack para avaliação e acompanhamento seguro.
              </Description>
            </TextContent>

            <IllustrationContainer>
              <Illustration>
                <Image
                  src="/pulmao2.png"
                  alt="Ilustração de pulmões com ícones de saúde"
                  width={400}
                  height={300}
                  style={{ height: "auto", width: "100%", maxWidth: "400px" }}
                />
              </Illustration>
            </IllustrationContainer>
          </ContentGrid>

          <FeaturesSection>
            <FeatureCard>
              <ClipboardPen color={theme.colors.secondary} />
              <FeatureTitle>Avaliação padronizada</FeatureTitle>
              <FeatureDescription>
                Texto aqui falando sobre a avaliação padronizada e como ele
                funciona.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard>
              <BicepsFlexed color={theme.colors.secondary} />
              <FeatureTitle>
                Prescrição personalizada por paciente.
              </FeatureTitle>
              <FeatureDescription>
                Texto aqui falando sobre a Prescrição personalizada por paciente
                e como ela funciona.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard>
              <Globe color={theme.colors.secondary} />
              <FeatureTitle>Acesso em qualquer lugar do Brasil</FeatureTitle>
              <FeatureDescription>
                Texto aqui falando sobre o acesso em qualquer lugar do Brasil e
                como ele funciona.
              </FeatureDescription>
            </FeatureCard>
          </FeaturesSection>
        </MainCard>
      </Container>
    </Section>
  );
};

export default WhatIsLungo;
