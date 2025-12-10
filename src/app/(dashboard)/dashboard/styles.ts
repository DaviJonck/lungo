import styled from "styled-components";
import Link from "next/link";

export const DashboardContainer = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 24px;
  background-color: ${({ theme }) => theme.colors.background};
  height: 100vh; /* ocupar toda a viewport */
  overflow: hidden; /* impedir scroll da página; rolagem será interna */
  padding: 15px;
  @media (max-width: ${({ theme }) => theme.breakpoints.xl}) {
    gap: 20px;
    height: 100vh; /* ocupar toda a viewport */
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
    height: 94vh;
    padding: 0px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    gap: 16px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    gap: 12px;
  }
`;

export const SidebarRoot = styled.aside`
  background: #f3fafb;
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 12px;
  padding-inline: 16px;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0; /* necessário para permitir overflow interno em layouts grid */
  overflow-y: auto; /* rolagem interna da sidebar */
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: none;
  }
`;

export const NavSectionTitle = styled.p`
  margin-top: 8px;
  color: ${({ theme }) => theme.colors.secondaryDarker};
  font-size: 12px;
  opacity: 0.8;
`;

export const NavList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const NavItem = styled(Link).withConfig({
  shouldForwardProp: (prop) => prop !== "$active",
})<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 10px;
  color: ${({ $active }) => ($active ? "#1c2b2d" : "#1c2b2d")};
  background: ${({ $active }) => ($active ? "#e8f3ff" : "transparent")};
  transition: background 0.15s ease;
  font-weight: 600;
  font-size: 14px;

  &:hover {
    background: ${({ $active }) =>
      $active ? "#e8f3ff" : "rgba(0, 0, 0, 0.04)"};
  }
`;

export const NavItemIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  color: #4a628a;
`;

export const ProCard = styled.div`
  margin-top: auto;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 18px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 10px;
  position: relative;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: all 0.2s ease;
  margin-bottom: 1rem;
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
      0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }
`;

export const ProButton = styled.button`
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 16px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.2);

  &:hover {
    background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(59, 130, 246, 0.2);
  }
`;

export const Content = styled.main`
  background: #f7fbfc;
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 12px;
  padding: 16px;
  overflow: auto; /* rolagem interna do conteúdo do dashboard */
  height: 100%;
  min-height: 0; /* permite que o filho com overflow funcione dentro do grid */
  margin-bottom: 0;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding-bottom: 116px; /* evitar que o BottomNav cubra o fim do conteúdo */
    border-radius: 0px;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 14px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 12px;
  }
`;

export const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 12px;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    gap: 8px;
  }
`;

export const Title = styled.h1`
  margin: 0;
  font-size: 22px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 20px;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 18px;
  }
`;

export const UserMenuWrapper = styled.div`
  position: relative;
`;

export const UserButton = styled.button`
  background: transparent;
  border: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px;
  border-radius: 10px;
  &:hover {
    background: rgba(0, 0, 0, 0.06);
  }
`;

export const UserDropdown = styled.div`
  position: absolute;
  right: 0;
  top: 44px;
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 12px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.12);
  min-width: 200px;
  padding: 8px;
  z-index: 10;
`;

export const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

export const StatCard = styled.div`
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 12px;
  padding: 14px;
`;

export const TwoCol = styled.div`
  margin-top: 16px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 1rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
  }
`;

export const Card = styled.div`
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 12px;
  padding: 14px;
  min-height: 120px;
  overflow-y: hidden;
`;
export const CardDashboard = styled.div`
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 12px;
  padding: 14px;
  min-height: 120px;
  overflow-y: hidden;
  margin-bottom: 1rem;
`;
// New: Hero greeting card and progress
export const HeroCard = styled.div`
  background: linear-gradient(135deg, #27c1d9 0%, #2ad1a3 100%);
  color: #ffffff;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 1rem;
  box-shadow: 0 10px 18px rgba(0, 0, 0, 0.08);
`;

export const ProgressTrack = styled.div`
  width: 100%;
  height: 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.35);
  overflow: hidden;
`;

export const ProgressBar = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "value",
})<{ value: number }>`
  height: 100%;
  width: ${({ value }) => Math.min(Math.max(value, 0), 100)}%;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 999px;
`;

// New: Metric card with icon
export const MetricCard = styled(StatCard)`
  display: grid;
  grid-template-columns: 44px 1fr;
  gap: 10px;
  align-items: start;
`;

export const IconCircle = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #eef8fb;
  color: #2a7ea5;
`;

// New: Info and next exercise sections
export const GridTwoThirds = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 12px;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
  }
`;

export const InfoTable = styled.div`
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 12px;
  padding: 16px;
`;

export const InfoRow = styled.div`
  display: grid;
  grid-template-columns: 180px 1fr;
  padding: 10px 0;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  &:first-child {
    border-top: none;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
    gap: 6px;
  }
`;

export const NextExerciseCard = styled(StatCard)`
  background: linear-gradient(180deg, #eef8ff 0%, #e9f7ff 100%);
`;

export const Motivation = styled.div`
  margin-top: 12px;
  background: #44bce1;
  color: #fff;
  border-radius: 12px;
  padding: 14px;
  text-align: center;
  font-weight: 700;
`;

// Bottom navigation (mobile)
export const BottomNav = styled.nav`
  display: none;
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    position: fixed;
    left: 0;
    right: 0;
    bottom: env(safe-area-inset-bottom, 0);
    padding: 10px 14px calc(10px + env(safe-area-inset-bottom, 0));
    background: #ffffffcc;
    backdrop-filter: saturate(180%) blur(10px);
    border-top: 1px solid rgba(0, 0, 0, 0.06);
    z-index: 60;
  }
`;

export const BottomNavItem = styled(Link).withConfig({
  shouldForwardProp: (prop) => prop !== "active",
})<{ active?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  border-radius: 10px;
  color: ${({ active }) => (active ? "#2a7ea5" : "#4a628a")};
  background: ${({ active }) => (active ? "#e8f3ff" : "transparent")};
`;
