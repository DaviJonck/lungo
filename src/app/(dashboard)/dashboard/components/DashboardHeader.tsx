"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  HeaderRow,
  Title,
  UserButton,
  UserDropdown,
  UserMenuWrapper,
} from "../styles";
import { useUserData } from "@/hooks/useUserData";
import { Home, Settings, LogOut } from "lucide-react";

type Props = {
  title: string;
};

export default function DashboardHeader({ title }: Props) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { signOut } = useAuth();
  const { userData: user, clearCache } = useUserData();
  return (
    <HeaderRow>
      <Title>{title}</Title>
      <UserMenuWrapper>
        {user ? (
          <>
            <UserButton
              onMouseEnter={() => setIsUserMenuOpen(true)}
              onMouseLeave={() => setIsUserMenuOpen(false)}
            >
              <Image
                src={user.avatar || "/default-avatar.png"}
                alt={user.name || "Usuário"}
                width={36}
                height={36}
                style={{ borderRadius: 18 }}
              />
            </UserButton>
            {isUserMenuOpen && (
              <UserDropdown
                onMouseEnter={() => setIsUserMenuOpen(true)}
                onMouseLeave={() => setIsUserMenuOpen(false)}
              >
                <Link
                  href="/"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "10px 12px",
                    borderRadius: 10,
                    textDecoration: "none",
                    color: "#1e293b",
                    fontWeight: 500,
                    transition: "background-color 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#f1f5f9";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  <Home size={16} />
                  Home
                </Link>
                <Link
                  href="/settings"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "10px 12px",
                    borderRadius: 10,
                    textDecoration: "none",
                    color: "#1e293b",
                    fontWeight: 500,
                    transition: "background-color 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#f1f5f9";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  <Settings size={16} />
                  Configurações
                </Link>
                <button
                  onClick={async () => {
                    try {
                      setIsUserMenuOpen(false);
                      clearCache();
                      await signOut();
                      // Redirecionar após logout bem-sucedido
                      window.location.href = "/";
                    } catch (error) {
                      console.error("Erro no logout:", error);
                      // Mesmo com erro, redirecionar
                      window.location.href = "/";
                    }
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "10px 12px",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    fontWeight: 500,
                    fontSize: "16px",
                    fontFamily: "Nunito Sans",
                    color: "#dc2626",
                    transition: "background-color 0.2s ease",
                    width: "100%",
                    textAlign: "left",
                    borderRadius: 10,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#fef2f2";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  <LogOut size={16} />
                  Sair
                </button>
              </UserDropdown>
            )}
          </>
        ) : (
          <button
            onClick={() => clearCache()}
            style={{
              background: "#6cb8bf",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              padding: "10px 12px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Entrar
          </button>
        )}
      </UserMenuWrapper>
    </HeaderRow>
  );
}
