import styled from "styled-components";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Section = styled.section`
  background: linear-gradient(90deg, #dff2eb 0%, #b9e5e8 100%);
  width: 100%;
`;

const Content = styled.div`
  color: ${({ theme }) => theme.colors.secondaryDarker};
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  align-items: center;
  gap: ${({ theme }) => theme.spacing["2xl"]};
  padding: ${({ theme }) => theme.spacing["2xl"]};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing["2xl"]};
    ${({ theme }) => theme.spacing["2xl"]};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1.1fr 0.9fr;
    padding: ${({ theme }) => theme.spacing["2xl"]};
    ${({ theme }) => theme.spacing["2xl"]};
  }
`;
const Title = styled.h1`
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.secondaryDarker};
  font-size: ${({ theme }) => theme.fontSizes["2xl"]};

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: ${({ theme }) => theme.fontSizes["3xl"]};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.fontSizes["4xl"]};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    font-size: ${({ theme }) => theme.fontSizes["5xl"]};
  }
`;

const Description = styled.p`
  color: ${({ theme }) => theme.colors.secondaryDarker};
  font-size: ${({ theme }) => theme.fontSizes.base};
  max-width: 52ch;
  margin-bottom: ${({ theme }) => theme.spacing["2xl"]};
  line-height: 1.6;

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: ${({ theme }) => theme.fontSizes.lg};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.fontSizes.xl};
  }
`;

const CtaButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  font-family: ${({ theme }) => theme.fonts.primary};
  background-color: #3cd7cd;
  color: ${({ theme }) => theme.colors.white};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  cursor: pointer;
  font-weight: 600;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  width: 100%;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.md};
  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: auto;
    font-size: ${({ theme }) => theme.fontSizes.base};
    padding: ${({ theme }) => theme.spacing.md};
    ${({ theme }) => theme.spacing["3xl"]};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.xl}) {
    padding: ${({ theme }) => theme.spacing.md};
    ${({ theme }) => theme.spacing["3xl"]};
  }

  &:hover {
    transform: translateY(-1px);
    box-shadow: ${({ theme }) => theme.shadows.xl};
  }
`;

const Illustration = styled.div`
  display: flex;
  justify-content: center;
  order: -1;

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    order: 0;
  }
`;

const CallToAction = () => {
  const router = useRouter();
  return (
    <Section>
      <Container>
        <Content>
          <Title>
            Reabilitação Pulmonar <br />
            <span style={{ color: "#3CD7CD" }}>ao seu alcance!</span>
          </Title>
          <Description>
            Descubra como a reabilitação pulmonar com a LunGo pode transformar
            sua vida. Começe agora seu teste grátis!
          </Description>
          <CtaButton onClick={() => router.push("/subscription")}>
            Melhorar qualidade de vida
            <span aria-hidden>→</span>
          </CtaButton>
        </Content>

        <Illustration>
          <Image
            src="/Lunguinho.png"
            alt="Ilustração de pulmões em reabilitação"
            width={520}
            height={420}
            priority
            style={{
              position: "relative",
              bottom: "0",
              right: "0",
              left: "0",
              top: "0",
              height: "100%",
              width: "100%",
              maxWidth: "100%",
              minWidth: "280px",
            }}
          />
        </Illustration>
      </Container>
    </Section>
  );
};

export default CallToAction;
