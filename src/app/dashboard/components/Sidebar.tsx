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
  Settings,
  User,
} from "lucide-react";

export default function Sidebar() {
  return (
    <>
      <SidebarRoot>
        <Brand>✨ LunGo</Brand>

        <NavSectionTitle>Menu</NavSectionTitle>
        <NavList>
          <li>
            <NavItem href="#">
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
                <Activity size={18} />
              </NavItemIcon>
              Aeróbico
            </NavItem>
          </li>
          <li>
            <NavItem href="#">
              <NavItemIcon>
                <Dumbbell size={18} />
              </NavItemIcon>
              Força
            </NavItem>
          </li>
          <li>
            <NavItem href="#">
              <NavItemIcon>
                <Settings size={18} />
              </NavItemIcon>
              Aprendendo
            </NavItem>
          </li>
          <li>
            <NavItem href="#">
              <NavItemIcon>
                <Settings size={18} />
              </NavItemIcon>
              Estatística
            </NavItem>
          </li>
        </NavList>

        <NavSectionTitle>Conta</NavSectionTitle>
        <NavList>
          <li>
            <NavItem href="#">
              <NavItemIcon>
                <User size={18} />
              </NavItemIcon>
              Perfil
            </NavItem>
          </li>
        </NavList>

        <ProCard>
          <div style={{ fontWeight: 700 }}>Assine a versão PRO</div>
          <div style={{ fontSize: 12, opacity: 0.8 }}>
            para todos os recursos.
          </div>
          <ProButton>Assine</ProButton>
        </ProCard>
      </SidebarRoot>
      <BottomNav>
        <BottomNavItem href="#" aria-label="Home" active>
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
