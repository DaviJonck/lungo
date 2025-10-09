"use client";

import Link from "next/link";
import Image from "next/image";
import styled from "styled-components";
import {
  Facebook,
  Twitter,
  Youtube,
  MapPin,
  Phone,
  Handshake,
  Instagram,
  MessageCircle,
} from "lucide-react";

const Wrapper = styled.footer`
  background: ${({ theme }) => theme.colors.disabledLight};
  color: ${({ theme }) => theme.colors.secondaryDarker};
  position: relative;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2.5rem 1rem 2rem;
`;

const Top = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 2fr 1.2fr;
  }
`;

const Contact = styled.div`
  display: grid;
  gap: 1.1rem;
  margin-bottom: 1rem;
`;

const ContactRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  color: ${({ theme }) => theme.colors.secondaryDarker};
  opacity: 0.95;
  line-height: 1.6;
  font-size: 0.95rem;
`;

const Newsletter = styled.div`
  display: grid;
  gap: 0.5rem;
  text-align: right;
  margin-bottom: 1rem;
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    text-align: left;
  }
`;

const NewsTitle = styled.h4`
  margin: 0;
  color: ${({ theme }) => theme.colors.secondaryDarker};
  font-size: 1rem;
  font-weight: 800;
`;

const NewsForm = styled.form`
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    justify-content: flex-start;
  }
`;

const NewsInput = styled.input`
  max-width: 300px;
  height: 40px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 999px;
  padding: 0.55rem 0.9rem;
  font-size: 0.95rem;
  outline: none;
`;

const NewsButton = styled.button`
  border: 1px solid ${({ theme }) => theme.colors.secondary};
  background: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.white};
  border-radius: 999px;
  padding: 0.55rem 0.9rem;
  height: 40px;
  font-weight: 700;
  cursor: pointer;
`;

const Mid = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.25rem;
  padding-top: 1rem;
  padding-bottom: 1rem;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  flex-wrap: wrap;
`;

const Links = styled.ul`
  display: flex;
  gap: 1.25rem;
  flex-wrap: wrap;
  list-style: none;
  margin: 0;
  padding: 0;
`;

const FooterLink = styled(Link)`
  color: ${({ theme }) => theme.colors.secondaryDarker};
  text-decoration: none;
  font-weight: 600;
  opacity: 0.9;
  border-radius: 8px;
  padding: 0.25rem 0.5rem;
  &:hover {
    opacity: 1;
    background: rgba(122, 178, 211, 0.12);
  }
`;

const Social = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SocialBtn = styled.a`
  width: 40px;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 1px solid rgba(0, 0, 0, 0.08);
  color: ${({ theme }) => theme.colors.secondaryDarker};
  background: ${({ theme }) => theme.colors.white};
  transition: background 140ms ease, box-shadow 140ms ease, transform 140ms ease;
  &:hover {
    background: ${({ theme }) => theme.colors.primary};
    box-shadow: ${({ theme }) => theme.shadows.sm};
    transform: translateY(-1px);
  }
`;

const Bottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding-top: 1rem;
  flex-wrap: wrap;
  color: ${({ theme }) => theme.colors.secondaryDarker};
  opacity: 0.85;
  font-size: 0.9rem;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
`;

export default function Footer() {
  return (
    <Wrapper>
      <Container>
        <Top>
          <Contact>
            <ContactRow>
              <MapPin size={18} /> Av. Pequeno Príncipe 930, Campeche -
              Florianópolis.
            </ContactRow>
            <ContactRow>
              <Phone size={18} /> (48) 9 4567-7890
            </ContactRow>
            <ContactRow>
              <Handshake size={18} /> Parcerias e dúvidas?
              lungo.contato@gmail.com
            </ContactRow>
          </Contact>
          <Newsletter>
            <NewsTitle>Assine nossa newsletter</NewsTitle>
            <NewsForm onSubmit={(e) => e.preventDefault()}>
              <NewsInput
                type="email"
                placeholder="Seu e-mail"
                aria-label="Seu e-mail"
              />
              <NewsButton type="submit">Inscrever</NewsButton>
            </NewsForm>
          </Newsletter>
        </Top>

        <Mid>
          <Links>
            <li>
              <FooterLink href="#sobre">Sobre</FooterLink>
            </li>
            <li>
              <FooterLink href="#topo">Contato</FooterLink>
            </li>
            <li>
              <FooterLink href="#equipe">Parceiros</FooterLink>
            </li>
            <li>
              <FooterLink href="#planos">Vagas</FooterLink>
            </li>
            <li>
              <FooterLink href="#topo">Exemplo</FooterLink>
            </li>
          </Links>
          <Social>
            <SocialBtn href="#" aria-label="Facebook">
              <Facebook size={18} />
            </SocialBtn>
            <SocialBtn href="#" aria-label="Twitter">
              <Twitter size={18} />
            </SocialBtn>
            <SocialBtn href="#" aria-label="YouTube">
              <Youtube size={18} />
            </SocialBtn>
            <SocialBtn href="#" aria-label="Instagram">
              <Instagram size={18} />
            </SocialBtn>
            <SocialBtn href="#" aria-label="WhatsApp">
              <MessageCircle size={18} />
            </SocialBtn>
          </Social>
        </Mid>

        <Bottom>
          <div>© 2025 LunGo. Todos direitos reservados.</div>
          <div style={{ display: "flex", gap: "1rem" }}>
            <FooterLink href="#topo">Termos de serviço</FooterLink>
            <FooterLink href="#topo">Política de privacidade</FooterLink>
          </div>
        </Bottom>
      </Container>
    </Wrapper>
  );
}
