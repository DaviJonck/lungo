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
                    display: "block",
                    padding: "10px 12px",
                    borderRadius: 10,
                  }}
                >
                  Home
                </Link>
                <Link
                  href="/settings"
                  style={{
                    display: "block",
                    padding: "10px 12px",
                    borderRadius: 10,
                  }}
                >
                  Configurações
                </Link>
                <button
                  onClick={async () => {
                    window.location.href = "/";
                    clearCache();
                    setIsUserMenuOpen(false);
                    await signOut();
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "10px 12px",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    fontWeight: 700,
                    fontSize: "16px",
                    fontFamily: "Nunito Sans",
                  }}
                >
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
