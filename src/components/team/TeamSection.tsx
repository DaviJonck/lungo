"use client";

import { Linkedin, X } from "lucide-react";
import React from "react";
import styled from "styled-components";

const Section = styled.section`
  position: relative;
  background: #eef7f5;
  padding: 4rem 1rem 6rem;
  overflow: hidden;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
`;

const Container = styled.div`
  position: relative;
  z-index: 1;
  max-width: 1100px;
  margin: 0 auto;
  text-align: center;
`;

const Topnote = styled.div`
  display: inline-block;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.textBlue};
  font-weight: 700;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  margin-bottom: 0.75rem;
`;

const Title = styled.h2`
  color: ${({ theme }) => theme.colors.textBlue};
  font-weight: 800;
  font-size: clamp(1.5rem, 2.6vw, 2rem);
  margin: 0.25rem 0 0.5rem;
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.textBlue};
  opacity: 0.9;
  max-width: 560px;
  margin: 0 auto 1.25rem;
`;

const CTA = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  margin-bottom: 2rem;
`;

const Btn = styled.button<{ variant?: "primary" | "ghost" }>`
  border: 1px solid ${({ theme }) => theme.colors.secondary};
  border-radius: 999px;
  padding: 0.5rem 1rem;
  font-weight: 700;
  cursor: pointer;
  background: ${({ variant, theme }) =>
    variant === "primary" ? theme.colors.secondary : theme.colors.white};
  color: ${({ variant, theme }) =>
    variant === "primary" ? theme.colors.white : theme.colors.secondary};
`;

const Cards = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: stretch;
  width: 100%;
  gap: 2rem;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-wrap: nowrap;
    justify-content: center;
  }
`;

const Card = styled.article`
  background: ${({ theme }) => theme.colors.white};
  border-radius: 16px;
  box-shadow: ${({ theme }) => theme.shadows.lg};
  padding: 1.25rem;
  text-align: center;
  min-height: 300px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  transition: transform 160ms ease, box-shadow 160ms ease;
  flex: 1;
  max-width: 400px;
  display: flex;
  flex-direction: column;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    max-width: 450px;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows.xl};
  }
`;

const Avatar = styled.img`
  width: 76px;
  height: 76px;
  border-radius: 50%;
  object-fit: cover;
  display: block;
  margin: 0 auto 0.75rem;
`;

const Name = styled.h3`
  color: ${({ theme }) => theme.colors.textBlue};
  font-weight: 800;
`;

const Role = styled.span`
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 0.9rem;
`;

const Bio = styled.p`
  color: ${({ theme }) => theme.colors.textBlue};
  opacity: 0.9;
  margin: 0.5rem 0 0.75rem;
  max-width: 100%;
  line-height: 1.6;
  flex: 1;
`;

const Actions = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  color: ${({ theme }) => theme.colors.secondary};
`;

const IconLink = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.secondary};
  transition: background 140ms ease, color 140ms ease, box-shadow 140ms ease;

  &:hover {
    background: ${({ theme }) => theme.colors.secondary};
    color: ${({ theme }) => theme.colors.white};
    box-shadow: ${({ theme }) => theme.shadows.sm};
  }
`;

const Ellipse = styled.div<{ size: "lg" | "md" | "sm" }>`
  position: absolute;
  border-radius: 999px;
  pointer-events: none;
  z-index: 0;
  ${({ size }) =>
    size === "lg"
      ? `width:520px;height:520px;right:10%;top:60px;background:url('/Ellipse 6.png') no-repeat center/cover;`
      : size === "sm"
      ? `width:170px;height:170px;left:8%;top:90px;background:url('/Ellipse 7.png') no-repeat center/cover;`
      : `width:260px;height:260px;left:10%;bottom:40px;background:url('/Ellipse 8.png') no-repeat center/cover;`}
`;

export default function TeamSection() {
  return (
    <Section id="equipe" aria-labelledby="team-heading">
      <Ellipse size="lg" />
      <Ellipse size="sm" />
      <Ellipse size="md" />

      <Container>
        <Topnote>Estamos contratando</Topnote>
        <Title id="team-heading">Conheça nosso time.</Title>
        <Subtitle>
          Pessoas apaixonadas que econtraram na reabilitação motivação para
          ajudar o próximo.
        </Subtitle>

        <CTA>
          <Btn variant="ghost">Sobre nós</Btn>
          <Btn variant="primary">Vagas abertas</Btn>
        </CTA>

        <Cards>
          <Card>
            <Avatar src="/Gustavo.jpg" alt="Foto de Gustavo Demétrio" />
            <Name>Gustavo Demétrio</Name>
            <Role>CEO Founder</Role>
            <Bio>
              Mestre em Fisioterapia com paixão pela reabilitação respiratória.
              Combinando conhecimento científico e experiência clínica para
              criar soluções inovadoras que transformam vidas através da
              tecnologia e do cuidado humanizado.
            </Bio>
            <Actions>
              <IconLink href="#" aria-label="LinkedIn">
                <Linkedin size={18} />
              </IconLink>
              <IconLink href="#" aria-label="Twitter">
                <X size={18} />
              </IconLink>
            </Actions>
          </Card>
          <Card>
            <Avatar src="/Davi.png" alt="Foto de Davi Jonck" />
            <Name>Davi Jonck</Name>
            <Role>CEO Founder</Role>
            <Bio>
              Desenvolvedor apaixonado por tecnologia e inovação. Especialista
              em criar plataformas digitais que unem o melhor da tecnologia
              moderna com soluções práticas para melhorar a qualidade de vida e
              o acesso à saúde respiratória.
            </Bio>
            <Actions>
              <IconLink href="#" aria-label="LinkedIn">
                <Linkedin size={18} />
              </IconLink>
              <IconLink href="#" aria-label="Twitter">
                <X size={18} />
              </IconLink>
            </Actions>
          </Card>
        </Cards>
      </Container>
    </Section>
  );
}
