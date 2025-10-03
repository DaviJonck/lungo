"use client";

import {
  Brand,
  NavItem,
  NavList,
  NavSectionTitle,
  ProButton,
  ProCard,
  SidebarRoot,
  BottomNav,
  BottomNavItem,
  NavItemIcon,
} from "../styles";
import {
  Home,
  NotebookPen,
  Dumbbell,
  Activity,
  Book,
  User,
} from "lucide-react";
import { usePathname } from "next/navigation";

import Image from "next/image";

export default function Sidebar() {
  const pathname = usePathname();
  const isHomeActive = pathname === "/dashboard" || pathname === "/";

  return (
    <>
      <SidebarRoot>
        <Brand>
          <Image src={"./Logo.svg"} alt="Logo" width={45} height={45} /> LunGo
        </Brand>

        <NavSectionTitle>Menu</NavSectionTitle>
        <NavList>
          <li>
            <NavItem href="/dashboard" $active={isHomeActive}>
              <NavItemIcon>
                <Home size={18} />
              </NavItemIcon>
              Home
            </NavItem>
          </li>
          <li>
            <NavItem href="#">
              <NavItemIcon>
                <NotebookPen size={18} />
              </NavItemIcon>
              Diário
            </NavItem>
          </li>
          <li>
            <NavItem href="#">
              <NavItemIcon>
                <Dumbbell size={18} />
              </NavItemIcon>
              Exercícios
            </NavItem>
          </li>
          <li>
            <NavItem href="#">
              <NavItemIcon>
                <Book size={18} />
              </NavItemIcon>
              Aprendendo
            </NavItem>
          </li>
        </NavList>

        {/* <NavSectionTitle>Conta</NavSectionTitle>
        <NavList>
          <li>
            <NavItem href="#">
              <NavItemIcon>
                <User size={18} />
              </NavItemIcon>
              Perfil
            </NavItem>
          </li>
        </NavList> */}

        <ProCard>
          <div style={{ fontWeight: 700 }}>Assine a versão PRO</div>
          <div style={{ fontSize: 12, opacity: 0.8 }}>
            para todos os recursos.
          </div>
          <ProButton>Assine</ProButton>
        </ProCard>
      </SidebarRoot>
      <BottomNav>
        <BottomNavItem
          href="/dashboard"
          aria-label="Home"
          active={isHomeActive}
        >
          <Home size={20} />
        </BottomNavItem>
        <BottomNavItem href="#" aria-label="Diário">
          <NotebookPen size={20} />
        </BottomNavItem>
        <BottomNavItem href="#" aria-label="Aeróbico">
          <Activity size={20} />
        </BottomNavItem>
        <BottomNavItem href="#" aria-label="Força">
          <Dumbbell size={20} />
        </BottomNavItem>
        <BottomNavItem href="#" aria-label="Perfil">
          <User size={20} />
        </BottomNavItem>
      </BottomNav>
    </>
  );
}
