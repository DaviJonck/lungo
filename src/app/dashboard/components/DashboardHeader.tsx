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

type User = { name: string; avatar: string } | null;

type Props = {
  user: User;
  setUser: (u: User) => void;
};

export default function DashboardHeader({ user, setUser }: Props) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user: authUser, signOut } = useAuth();

  return (
    <HeaderRow>
      <Title>Home</Title>
      <UserMenuWrapper>
        {user ? (
          <>
            <UserButton onClick={() => setIsUserMenuOpen((v) => !v)}>
              <Image
                src={user.avatar}
                alt={user.name}
                width={36}
                height={36}
                style={{ borderRadius: 18 }}
              />
            </UserButton>
            {isUserMenuOpen && (
              <UserDropdown>
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
                    await signOut();
                    setUser(null);
                    setIsUserMenuOpen(false);
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
            onClick={() => setUser({ name: "Davi Jonck", avatar: "/Davi.png" })}
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
