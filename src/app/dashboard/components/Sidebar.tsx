import {
  Brand,
  NavItem,
  NavList,
  NavSectionTitle,
  ProButton,
  ProCard,
  SidebarRoot,
} from "../styles";

export default function Sidebar() {
  return (
    <SidebarRoot>
      <Brand>✨ LunGo</Brand>

      <NavSectionTitle>Menu</NavSectionTitle>
      <NavList>
        <li>
          <NavItem href="#">Home</NavItem>
        </li>
        <li>
          <NavItem href="#">Diário</NavItem>
        </li>
        <li>
          <NavItem href="#">Aeróbico</NavItem>
        </li>
        <li>
          <NavItem href="#">Força</NavItem>
        </li>
        <li>
          <NavItem href="#">Aprendendo</NavItem>
        </li>
        <li>
          <NavItem href="#">Estatística</NavItem>
        </li>
      </NavList>

      <NavSectionTitle>Conta</NavSectionTitle>
      <NavList>
        <li>
          <NavItem href="#">Perfil</NavItem>
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
  );
}
