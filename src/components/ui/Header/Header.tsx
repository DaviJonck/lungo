import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import styled from "styled-components";
import LoginButton from "./LoginButton";

const StyledHeader = styled.header`
  background-color: ${({ theme }) => theme.colors.background};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.sm};
  width: 100%;
`;

const StyledLink = styled(Link)`
  color: ${({ theme }) => theme.colors.white};
  text-decoration: none;
  font-family: ${({ theme }) => theme.fonts.primary};
  font-size: ${({ theme }) => theme.fontSizes.base};
  font-weight: 500;
  transition: all 0.2s ease;
  display: inline-block;

  &:hover {
    transform: translateY(-2px);
    transition: transform 0.2s ease;
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
  width: 50%;
  height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
  transform: ${({ isOpen }) =>
    isOpen ? "translateX(0)" : "translateX(-100%)"};
  transition: transform 0.3s ease;
  z-index: 5;
  padding: ${({ theme }) => theme.spacing.xl};
  padding-top: 80px;
  box-shadow: ${({ theme }) => theme.shadows.xl};

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
  gap: ${({ theme }) => theme.spacing.lg};
`;

const MobileLink = styled(Link)`
  color: ${({ theme }) => theme.colors.textBlack};
  text-decoration: none;
  font-family: ${({ theme }) => theme.fonts.primary};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: 500;
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.secondaryDarker};
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
  z-index: 4;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

// Logo responsivo
const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  z-index: 10;

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
const BackgroundImage = styled(Image)`
  position: absolute;
  right: -400px;
  top: 0;
  z-index: 2;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <StyledHeader>
        <Nav>
          {/* Menu Hambúrguer - Mobile */}
          <HamburgerButton onClick={toggleMenu}>
            <HamburgerLine isOpen={isMenuOpen} />
            <HamburgerLine isOpen={isMenuOpen} />
            <HamburgerLine isOpen={isMenuOpen} />
          </HamburgerButton>

          {/* Logo */}
          <LogoContainer>
            <LogoLink href="/">
              <Image
                style={{ marginRight: "0.5rem" }}
                src="/Logo.svg"
                alt="Logo"
                width={45}
                height={45}
              />
              <span style={{ fontWeight: "300" }}>Lun</span>
              <span style={{ fontWeight: "600" }}>GO</span>
            </LogoLink>
          </LogoContainer>

          {/* Navegação Desktop */}
          <DesktopNav>
            <LeftNavList>
              <li>
                <StyledLink href="/">Início</StyledLink>
              </li>
              <li>
                <StyledLink href="/">Sobre</StyledLink>
              </li>
              <li>
                <StyledLink href="/">Assinatura</StyledLink>
              </li>
              <li>
                <StyledLink href="/">Equipe</StyledLink>
              </li>
            </LeftNavList>
            <RightNavList>
              <li>
                <LoginButton />
              </li>
            </RightNavList>
          </DesktopNav>

          {/* Imagem de fundo */}
          <BackgroundImage
            src="/Vector.svg"
            alt="Logo"
            width={1500}
            height={100}
          />
        </Nav>
      </StyledHeader>

      {/* Menu Mobile - só renderiza após mount para evitar flash */}
      {isMounted && (
        <>
          <MobileMenu isOpen={isMenuOpen}>
            <MobileMenuList>
              <li>
                <MobileLink href="/" onClick={closeMenu}>
                  Início
                </MobileLink>
              </li>
              <li>
                <MobileLink href="/" onClick={closeMenu}>
                  Sobre
                </MobileLink>
              </li>
              <li>
                <MobileLink href="/" onClick={closeMenu}>
                  Assinatura
                </MobileLink>
              </li>
              <li>
                <MobileLink href="/" onClick={closeMenu}>
                  Equipe
                </MobileLink>
              </li>
              <li>
                <LoginButton />
              </li>
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
