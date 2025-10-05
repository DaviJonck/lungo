import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import styled from "styled-components";
import { useAuth } from "@/contexts/AuthContext";
import { useUserData } from "@/hooks/useUserData";
import LoginButton from "./LoginButton";
import {
  CircleUserRound,
  House,
  WalletMinimal,
  Users,
  Settings,
  ShieldCheck,
  LogOut,
  CircleX,
} from "lucide-react";
const StyledHeader = styled.header.withConfig({
  shouldForwardProp: (prop) => prop !== "isScrolled",
})<{ isScrolled: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 5;
  background-color: ${({ theme, isScrolled }) =>
    isScrolled ? "rgba(185,229,232,0.86)" : theme.colors.background};

  backdrop-filter: ${({ isScrolled }) =>
    isScrolled ? "saturate(180%) blur(8px)" : "none"};
  box-shadow: ${({ isScrolled }) =>
    isScrolled ? "0 8px 12px -6px rgb(0 0 0 / 0.15)" : "none"};
  border-bottom: ${({ isScrolled }) =>
    isScrolled ? "1px solid rgba(0,0,0,0.06)" : "1px solid transparent"};
  transform: ${({ isScrolled }) =>
    isScrolled ? "translateY(-6px)" : "translateY(0)"};
  transition: box-shadow 0.2s ease, backdrop-filter 0.2s ease,
    background-color 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
`;

const HeaderSpacer = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "isScrolled",
})<{ isScrolled: boolean }>`
  height: ${({ isScrolled }) => (isScrolled ? "64px" : "80px")};
  transition: height 0.2s ease;
`;

const Nav = styled.nav.withConfig({
  shouldForwardProp: (prop) => prop !== "isScrolled",
})<{ isScrolled: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme, isScrolled }) =>
    isScrolled ? `0.25rem ${theme.spacing.sm}` : theme.spacing.sm};
  width: 100%;
  height: ${({ isScrolled }) => (isScrolled ? "64px" : "69px")};
  transition: padding 0.2s ease, height 0.2s ease;
`;

const StyledLink = styled(Link)`
  color: ${({ theme }) => theme.colors.secondaryDarker};
  text-decoration: none;
  font-family: ${({ theme }) => theme.fonts.primary};
  font-size: ${({ theme }) => theme.fontSizes.base};
  font-weight: 500;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  line-height: 1;
  padding: 0.35rem 0.6rem;
  border-radius: 8px;

  &:hover {
    background: rgba(122, 178, 211, 0.15);
    color: ${({ theme }) => theme.colors.secondaryDarker};
  }
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.secondary};
    outline-offset: 2px;
  }
`;

const LogoLink = styled(Link)`
  display: flex;
  align-items: center;
  font-size: ${({ theme }) => theme.fontSizes.xl};
  transition: all 0.2s ease;
`;

const LeftNavList = styled.ul`
  display: flex;
  align-items: center;
  list-style: none;
  gap: ${({ theme }) => theme.spacing.md};
  margin: 0;
  padding: 0;
  z-index: 3;
`;

const RightNavList = styled.ul`
  display: flex;
  align-items: center;
  list-style: none;
  gap: ${({ theme }) => theme.spacing.md};
  margin: 0;
  padding: 0;
  z-index: 3;
`;

// Menu Hambúrguer
const HamburgerButton = styled.button`
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.sm};
  z-index: 10;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
`;

const HamburgerLine = styled.span.withConfig({
  shouldForwardProp: (prop) => prop !== "isOpen",
})<{ isOpen: boolean }>`
  width: 25px;
  height: 3px;
  background-color: ${({ theme }) => theme.colors.secondaryDarker};
  transition: all 0.3s ease;
  transform-origin: center;

  &:nth-child(1) {
    transform: ${({ isOpen }) =>
      isOpen ? "rotate(45deg) translate(4px, 4px)" : "none"};
  }

  &:nth-child(2) {
    opacity: ${({ isOpen }) => (isOpen ? "0" : "1")};
  }

  &:nth-child(3) {
    transform: ${({ isOpen }) =>
      isOpen ? "rotate(-45deg) translate(6px, -6px)" : "none"};
  }
`;

// Menu Mobile
const MobileMenu = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "isOpen",
})<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  max-width: 290px;
  height: 100vh;
  max-height: 100vh;
  background-color: ${({ theme }) => theme.colors.disabledLight};
  backdrop-filter: blur(10px) saturate(140%);
  -webkit-backdrop-filter: blur(10px) saturate(140%);
  transform: ${({ isOpen }) =>
    isOpen ? "translateX(0)" : "translateX(-100%)"};
  transition: transform 0.3s ease;
  z-index: 20;
  padding: ${({ theme }) => theme.spacing.lg};
  padding-top: 60px;
  box-shadow: ${({ theme }) => theme.shadows.xl};
  border-right: 1px solid rgba(0, 0, 0, 0.06);
  overflow-y: auto;
  overflow-x: hidden;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

const MobileMenuList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  height: 100%;
  overflow-y: auto;
`;

const MobileLink = styled(Link)`
  color: ${({ theme }) => theme.colors.secondaryDarker};
  text-decoration: none;
  font-family: ${({ theme }) => theme.fonts.primary};
  font-size: ${({ theme }) => theme.fontSizes.base};
  font-weight: 500;
  transition: color 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.75rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-bottom: 0.5rem;
  &:hover {
    color: ${({ theme }) => theme.colors.secondaryDarker};
    background-color: rgba(26, 229, 243, 0.15);
  }
`;

const MobileLoginButton = styled.button`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.secondaryDarker};
  padding: 0.4rem;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  cursor: pointer;
  font-weight: 700;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.1rem;
  &:hover {
    transform: translateY(-1px);
    box-shadow: ${({ theme }) => theme.shadows.xl};
  }
`;
const ProfileRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  padding: 0.5rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: rgba(255, 255, 255, 0.1);
`;
const Avatar = styled(Image)`
  border-radius: 23px;
`;
const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  line-height: 1.2;
  margin-left: 1rem;
`;
const ProfileName = styled.strong`
  color: ${({ theme }) => theme.colors.secondaryDarker};
`;
const ProfileAge = styled.span`
  color: ${({ theme }) => theme.colors.textBlack};
  opacity: 0.8;
  font-size: 0.9rem;
`;
const LogoutButton = styled.button`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.secondaryDarker};
  padding: 0.5rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: ${({ theme }) => theme.borderRadius.full};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  cursor: pointer;
  font-weight: 700;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  display: flex;
  margin-top: 1rem;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.secondaryDarker};
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

// Overlay com blur
const Overlay = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "isOpen",
})<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  opacity: ${({ isOpen }) => (isOpen ? "1" : "0")};
  visibility: ${({ isOpen }) => (isOpen ? "visible" : "hidden")};
  transition: all 0.3s ease;
  z-index: 6;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

// Logo responsivo
const LogoContainer = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "isScrolled",
})<{ isScrolled: boolean }>`
  display: flex;
  align-items: center;
  z-index: 10;
  transform: ${({ isScrolled }) => (isScrolled ? "scale(0.92)" : "scale(1)")};
  transform-origin: left center;
  transition: transform 0.2s ease;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    order: 2;
  }
`;

// Container responsivo para desktop
const DesktopNav = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing["3xl"]};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

// Imagem de fundo responsiva

const DivisorLine = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${({ theme }) => theme.colors.secondaryDarker};
  margin: ${({ theme }) => theme.spacing.md} 0;
  opacity: 0.3;
`;

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { userData } = useUserData();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 8) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Bloqueia o scroll quando o menu mobile estiver aberto
  useEffect(() => {
    if (!isMounted) return;

    if (isMenuOpen) {
      // Aplica apenas o bloqueio de scroll sem salvar posição
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    } else {
      // Restaura o scroll
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    }
  }, [isMenuOpen, isMounted]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <StyledHeader isScrolled={isScrolled}>
        <Nav isScrolled={isScrolled}>
          {/* Menu Hambúrguer - Mobile */}
          <HamburgerButton onClick={toggleMenu}>
            <HamburgerLine isOpen={isMenuOpen} />
            <HamburgerLine isOpen={isMenuOpen} />
            <HamburgerLine isOpen={isMenuOpen} />
          </HamburgerButton>

          {/* Logo */}
          <LogoContainer isScrolled={isScrolled}>
            <LogoLink href="/">
              <Image
                style={{ marginRight: "0.5rem" }}
                src="/LogoEscrita.png"
                alt="Logo"
                width={115}
                height={115}
              />
            </LogoLink>
          </LogoContainer>

          {/* Navegação Desktop */}
          <DesktopNav>
            <LeftNavList>
              <li>
                <StyledLink href="#topo">Início</StyledLink>
              </li>
              <li>
                <StyledLink href="#sobre">Sobre</StyledLink>
              </li>
              <li>
                <StyledLink href="#planos">Assinatura</StyledLink>
              </li>
              <li>
                <StyledLink href="#equipe">Equipe</StyledLink>
              </li>
            </LeftNavList>
            <RightNavList>
              {!user ? (
                <li>
                  <Link href="/auth">
                    <LoginButton />
                  </Link>
                </li>
              ) : (
                <li style={{ position: "relative" }}>
                  <button
                    onClick={() => setIsUserMenuOpen((v) => !v)}
                    style={{
                      background: "transparent",
                      border: 0,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: 6,
                      borderRadius: 8,
                    }}
                  >
                    <Image
                      src={
                        userData?.avatar ||
                        user.user_metadata?.avatar_url ||
                        "/default-avatar.png"
                      }
                      alt={
                        userData?.name ||
                        user.user_metadata?.full_name ||
                        user.email ||
                        "User"
                      }
                      width={36}
                      height={36}
                      style={{ borderRadius: 18 }}
                    />
                  </button>
                  {isUserMenuOpen && (
                    <div
                      style={{
                        position: "absolute",
                        right: 0,
                        top: 44,
                        background: "#fff",
                        border: "1px solid rgba(0,0,0,0.08)",
                        borderRadius: 12,
                        boxShadow: "0 10px 20px rgba(0,0,0,0.12)",
                        minWidth: 200,
                        padding: 8,
                        zIndex: 50,
                      }}
                    >
                      <Link
                        href="/dashboard"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          padding: "10px 12px",
                          borderRadius: 10,
                        }}
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <House size={18} /> Dashboard
                      </Link>
                      <Link
                        href="/dashboard/profile"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          padding: "10px 12px",
                          borderRadius: 10,
                        }}
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <CircleUserRound size={18} /> Perfil
                      </Link>
                      <button
                        onClick={async () => {
                          await signOut();
                          setIsUserMenuOpen(false);
                        }}
                        style={{
                          width: "100%",
                          textAlign: "left",
                          background: "transparent",
                          border: 0,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          padding: "10px 12px",
                          borderRadius: 10,
                        }}
                      >
                        <LogOut size={18} /> Sair
                      </button>
                    </div>
                  )}
                </li>
              )}
            </RightNavList>
          </DesktopNav>

          {/* Imagem de fundo */}
        </Nav>
      </StyledHeader>

      {/* Espaço para compensar o header fixo */}
      <HeaderSpacer isScrolled={isScrolled} />

      {/* Menu Mobile - só renderiza após mount para evitar flash */}
      {isMounted && (
        <>
          <MobileMenu isOpen={isMenuOpen}>
            <CloseButton onClick={closeMenu}>
              <CircleX size={24} />
            </CloseButton>
            <MobileMenuList>
              {user ? (
                <ProfileRow>
                  <Avatar
                    src={
                      userData?.avatar ||
                      user.user_metadata?.avatar_url ||
                      "/default-avatar.png"
                    }
                    alt={
                      userData?.name ||
                      user.user_metadata?.full_name ||
                      user.email ||
                      "User"
                    }
                    width={66}
                    height={66}
                  />
                  <ProfileInfo>
                    <ProfileName>
                      {userData?.name ||
                        user.user_metadata?.full_name ||
                        user.email ||
                        "User"}
                    </ProfileName>
                    <ProfileAge>
                      {userData?.age ? `${userData.age} anos` : "Usuário"}
                    </ProfileAge>
                  </ProfileInfo>
                </ProfileRow>
              ) : (
                <ul style={{ listStyle: "none" }}>
                  <li>
                    <Link href="/auth">
                      <MobileLoginButton>
                        <CircleUserRound />
                        Entrar / Cadastrar
                      </MobileLoginButton>
                    </Link>
                  </li>
                </ul>
              )}
              <DivisorLine />
              <ul style={{ listStyle: "none" }}>
                <li>
                  <MobileLink href="/dashboard" onClick={closeMenu}>
                    <House />
                    Dashboard
                  </MobileLink>
                </li>
                <li>
                  <MobileLink href="/dashboard/profile" onClick={closeMenu}>
                    <CircleUserRound />
                    Perfil
                  </MobileLink>
                </li>
                <li>
                  <MobileLink href="#topo" onClick={closeMenu}>
                    <House />
                    Início
                  </MobileLink>
                </li>
                <li>
                  <MobileLink href="#sobre" onClick={closeMenu}>
                    <Users />
                    Sobre
                  </MobileLink>
                </li>
                <li>
                  <MobileLink href="#planos" onClick={closeMenu}>
                    <WalletMinimal />
                    Assinatura
                  </MobileLink>
                </li>
                <li>
                  <MobileLink href="#equipe" onClick={closeMenu}>
                    <Users />
                    Equipe
                  </MobileLink>
                </li>
              </ul>
              <DivisorLine />
              <ul style={{ listStyle: "none" }}>
                <MobileLink href="/" onClick={closeMenu}>
                  <Settings />
                  Configurações
                </MobileLink>
                <MobileLink href="/" onClick={closeMenu}>
                  <ShieldCheck />
                  Política de Privacidade
                </MobileLink>
                {user && (
                  <li style={{ marginTop: "0.5rem" }}>
                    <LogoutButton
                      onClick={async () => {
                        await signOut();
                        closeMenu();
                      }}
                    >
                      <LogOut size={18} /> SAIR
                    </LogoutButton>
                  </li>
                )}
              </ul>
            </MobileMenuList>
          </MobileMenu>

          {/* Overlay com blur */}
          <Overlay isOpen={isMenuOpen} onClick={closeMenu} />
        </>
      )}
    </>
  );
};

export default Header;
