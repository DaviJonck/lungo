import styled from "styled-components";
import Image from "next/image";
import { useState, useRef } from "react";
import {
  ShoppingCart,
  User,
  Target,
  Play,
  TrendingUp,
  Calendar,
} from "lucide-react";

const Section = styled.section`
  background-color: ${({ theme }) => theme.colors.disabledLight};
  width: 100%;
  padding: ${({ theme }) => theme.spacing["3xl"]} 0;
  position: relative;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.xl};
  position: relative;
  z-index: 2;
`;

const Title = styled.h2`
  color: ${({ theme }) => theme.colors.secondaryDarker};
  font-size: ${({ theme }) => theme.fontSizes["4xl"]};
  font-weight: 800;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  line-height: 1.2;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.fontSizes["3xl"]};
    text-align: center;
  }
`;

const TitleLine = styled.div`
  width: 150px;
  height: 4px;
  background-color: #3cd7cd;
  border-radius: 2px;
  margin-bottom: 3em;
  margin-top: -1rem;
`;

const StepsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing["3xl"]};

  align-items: start;
  justify-items: center;

  /* Empurra levemente os cards da coluna da direita (2, 4, 6) para baixo */
  > div:nth-child(even) {
    margin-top: 36px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.xl};
    > div:nth-child(even) {
      margin-top: 0;
    }
  }
`;

const StepCard = styled.div<{ transform: string; $gradient: string }>`
  background: ${({ $gradient }) => $gradient};
  padding: ${({ theme }) => theme.spacing.xl};
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1), 0 4px 12px rgba(0, 0, 0, 0.08);
  position: relative;
  z-index: 3;
  max-width: 360px;
  width: 100%;
  text-align: left;
  margin: 0 auto;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  transform: ${({ transform }) => transform};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.5),
      transparent
    );
  }

  &:hover {
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15), 0 8px 16px rgba(0, 0, 0, 0.1);
    transform: ${({ transform }) => transform} translateY(-4px);
  }
`;

const StepHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const StepIconContainer = styled.div<{ $bgColor: string }>`
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: ${({ $bgColor }) => $bgColor};
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  flex-shrink: 0;
`;

const StepNumberBadge = styled.div`
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(10px);
  color: white;
  font-size: 12px;
  font-weight: 800;
  padding: 4px 12px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const StepContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const StepDescription = styled.p`
  color: rgba(255, 255, 255, 0.95);
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: 500;
  line-height: 1.6;
  margin: 0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
`;

// Background ellipse images
const EllipseImage = styled(Image).withConfig({
  shouldForwardProp: (prop) =>
    !["top", "left", "right", "bottom", "zIndex"].includes(prop),
})<{
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  zIndex: number;
}>`
  position: absolute;
  ${({ top }) => top && `top: ${top};`}
  ${({ left }) => left && `left: ${left};`}
  ${({ right }) => right && `right: ${right};`}
  ${({ bottom }) => bottom && `bottom: ${bottom};`}
  z-index: ${({ zIndex }) => zIndex};
  pointer-events: none;
`;

// Magnetic Card Component
const MagneticCard = ({
  stepNumber,
  description,
  icon,
  gradient,
  iconBg,
}: {
  stepNumber: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  iconBg: string;
}) => {
  const [transform, setTransform] = useState("translate(0px, 0px)");
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - centerX) * 0.1;
    const deltaY = (e.clientY - centerY) * 0.1;

    setTransform(`translate(${deltaX}px, ${deltaY}px)`);
  };

  const handleMouseLeave = () => {
    setTransform("translate(0px, 0px)");
  };

  return (
    <StepCard
      ref={cardRef}
      transform={transform}
      $gradient={gradient}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <StepHeader>
        <StepIconContainer $bgColor={iconBg}>{icon}</StepIconContainer>
        <StepContent>
          <StepNumberBadge>{stepNumber}</StepNumberBadge>
        </StepContent>
      </StepHeader>
      <StepDescription>{description}</StepDescription>
    </StepCard>
  );
};

const HowItWork = () => {
  return (
    <Section id="como-funciona">
      {/* Background ellipse images */}
      <EllipseImage
        src="/Ellipse 1.png"
        alt="Ellipse decoration"
        width={200}
        height={200}
        top="5%"
        left="5%"
        zIndex={1}
      />
      <EllipseImage
        src="/Ellipse 2.png"
        alt="Ellipse decoration"
        width={150}
        height={150}
        top="15%"
        right="10%"
        zIndex={1}
      />
      <EllipseImage
        src="/Ellipse 3.png"
        alt="Ellipse decoration"
        width={180}
        height={180}
        bottom="20%"
        left="10%"
        zIndex={1}
      />
      <EllipseImage
        src="/Ellipse 4.png"
        alt="Ellipse decoration"
        width={160}
        height={160}
        bottom="10%"
        right="5%"
        zIndex={1}
      />
      <EllipseImage
        src="/Ellipse 5.png"
        alt="Ellipse decoration"
        width={220}
        height={220}
        top="40%"
        left="50%"
        zIndex={1}
      />

      <Container>
        <Title>Como funciona o LunGo ?</Title>
        <TitleLine />
        <StepsGrid>
          <MagneticCard
            stepNumber="Passo 01"
            description="Escolha o plano que melhor se adapta às suas necessidades e faça sua assinatura para ter acesso completo à plataforma."
            icon={<ShoppingCart size={28} color="white" />}
            gradient="linear-gradient(135deg, #4a628a 0%, #7ab2d3 100%)"
            iconBg="rgba(255, 255, 255, 0.2)"
          />

          <MagneticCard
            stepNumber="Passo 02"
            description="Complete seu perfil com informações sobre idade, peso, altura e condição respiratória para personalizarmos sua experiência."
            icon={<User size={28} color="white" />}
            gradient="linear-gradient(135deg, #4a628a 0%, #7ab2d3 100%)"
            iconBg="rgba(255, 255, 255, 0.2)"
          />

          <MagneticCard
            stepNumber="Passo 03"
            description="Após completar o onboarding, você receberá automaticamente um plano de exercícios personalizado baseado no seu perfil."
            icon={<Target size={28} color="white" />}
            gradient="linear-gradient(135deg, #4a628a 0%, #7ab2d3 100%)"
            iconBg="rgba(255, 255, 255, 0.2)"
          />

          <MagneticCard
            stepNumber="Passo 04"
            description="Acesse seus exercícios diários, inicie os treinos seguindo as instruções e acompanhe seu progresso em tempo real."
            icon={<Play size={28} color="white" />}
            gradient="linear-gradient(135deg, #4a628a 0%, #7ab2d3 100%)"
            iconBg="rgba(255, 255, 255, 0.2)"
          />

          <MagneticCard
            stepNumber="Passo 05"
            description="Visualize seu progresso através de gráficos, estatísticas e relatórios detalhados sobre sua evolução na reabilitação."
            icon={<TrendingUp size={28} color="white" />}
            gradient="linear-gradient(135deg, #4a628a 0%, #7ab2d3 100%)"
            iconBg="rgba(255, 255, 255, 0.2)"
          />

          <MagneticCard
            stepNumber="Passo 06"
            description="Continue seguindo seu plano diário, complete os exercícios regularmente e mantenha-se comprometido com sua saúde respiratória."
            icon={<Calendar size={28} color="white" />}
            gradient="linear-gradient(135deg, #4a628a 0%, #7ab2d3 100%)"
            iconBg="rgba(255, 255, 255, 0.2)"
          />
        </StepsGrid>
      </Container>
    </Section>
  );
};

export default HowItWork;
