import styled from "styled-components";
import Image from "next/image";
import { useState, useRef } from "react";

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

const StepCard = styled.div<{ transform: string }>`
  background-color: rgba(242, 248, 245, 0.8);
  padding: ${({ theme }) => theme.spacing.xl};
  box-shadow: 0 0px 5px 0px rgba(31, 38, 135, 0.2);
  position: relative;
  z-index: 3;
  max-width: 320px;
  width: 100%;
  text-align: left;
  margin: 0 auto;
  backdrop-filter: blur(17px) saturate(200%);
  -webkit-backdrop-filter: blur(17px) saturate(200%);
  background-color: rgba(255, 255, 255, 0.63);
  border-radius: 12px;
  border: 1px solid rgba(209, 213, 219, 0.3);
  transform: ${({ transform }) => transform};
  transition: transform 0.1s ease-out;
  cursor: pointer;
`;

const StepNumber = styled.h3`
  color: ${({ theme }) => theme.colors.secondaryDarker};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: 700;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  line-height: 1.3;
`;

const StepDescription = styled.p`
  color: ${({ theme }) => theme.colors.secondaryDarker};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: 500;
  line-height: 1.5;
  opacity: 0.8;
  margin: 0;
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
}: {
  stepNumber: string;
  description: string;
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
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <StepNumber>{stepNumber}</StepNumber>
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
            description="Descrevemos aqui o passo a passo da aplicação"
          />

          <MagneticCard
            stepNumber="Passo 02"
            description="Descrevemos aqui o passo a passo da aplicação"
          />

          <MagneticCard
            stepNumber="Passo 03"
            description="Descrevemos aqui o passo a passo da aplicação"
          />

          <MagneticCard
            stepNumber="Passo 04"
            description="Descrevemos aqui o passo a passo da aplicação"
          />

          <MagneticCard
            stepNumber="Passo 05"
            description="Descrevemos aqui o passo a passo da aplicação"
          />

          <MagneticCard
            stepNumber="Passo 06"
            description="Descrevemos aqui o passo a passo da aplicação"
          />
        </StepsGrid>
      </Container>
    </Section>
  );
};

export default HowItWork;
