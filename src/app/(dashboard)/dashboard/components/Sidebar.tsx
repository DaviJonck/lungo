"use client";

import {
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
  Book,
  User,
  Crown,
  CheckCircle,
} from "lucide-react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useUserData } from "@/hooks/useUserData";
import { useUserPlanStatus } from "@/hooks/useUserPlanStatus";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { userData } = useUserData();
  const { hasActivePlan } = useUserPlanStatus(userData?.id || "");

  const isHomeActive = pathname === "/dashboard" || pathname === "/";
  const isDiaryActive = pathname?.startsWith("/dashboard/diary");
  const isExercisesActive = pathname?.startsWith("/dashboard/exercises");
  const isLearningActive = pathname?.startsWith("/dashboard/learning");
  const isProfileActive = pathname?.startsWith("/dashboard/profile");

  return (
    <>
      <SidebarRoot>
        <Image src="/LogoEscrita.png" alt="Logo" width={85} height={85} />
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
            <NavItem href="/dashboard/exercises" $active={!!isExercisesActive}>
              <NavItemIcon>
                <Dumbbell size={18} />
              </NavItemIcon>
              Exercícios
            </NavItem>
          </li>
          <li>
            <NavItem href="/dashboard/learning" $active={!!isLearningActive}>
              <NavItemIcon>
                <Book size={18} />
              </NavItemIcon>
              Aprendendo
            </NavItem>
          </li>
        </NavList>
        <NavSectionTitle>Conta</NavSectionTitle>
        <NavList>
          <li>
            <NavItem href="/dashboard/profile" $active={!!isProfileActive}>
              <NavItemIcon>
                <User size={18} />
              </NavItemIcon>
              Perfil
            </NavItem>
          </li>
        </NavList>
        <ProCard>
          {hasActivePlan ? (
            <>
              <div
                style={{
                  fontWeight: 600,
                  fontSize: "15px",
                  color: "#1e293b",
                  marginBottom: "4px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                Parabéns! Você já é um usuário Plus
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "#64748b",
                  lineHeight: "1.4",
                  marginBottom: "12px",
                }}
              >
                Aproveite todos os recursos disponíveis
              </div>
              <ProButton
                onClick={() => router.push("/dashboard/profile")}
                style={{
                  background:
                    "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                }}
              >
                <CheckCircle size={14} style={{ marginRight: "6px" }} />
                Ver Perfil
              </ProButton>
            </>
          ) : (
            <>
              <div
                style={{
                  fontWeight: 600,
                  fontSize: "15px",
                  color: "#1e293b",
                  marginBottom: "4px",
                }}
              >
                🚀 Upgrade para PRO
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "#64748b",
                  lineHeight: "1.4",
                  marginBottom: "12px",
                }}
              >
                Acesso completo a todos os recursos
              </div>
              <ProButton onClick={() => router.push("/subscription")}>
                Assinar Agora
              </ProButton>
            </>
          )}
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
        <BottomNavItem
          href="/dashboard/exercises"
          aria-label="Exercícios"
          active={!!isExercisesActive}
        >
          <Dumbbell size={20} />
        </BottomNavItem>{" "}
        <BottomNavItem
          href="/dashboard/learning"
          aria-label="Aprendendo"
          active={!!isLearningActive}
        >
          <Book size={20} />
        </BottomNavItem>
        <BottomNavItem
          href="/dashboard/profile"
          aria-label="Perfil"
          active={!!isProfileActive}
        >
          <User size={20} />
        </BottomNavItem>
      </BottomNav>
    </>
  );
}
