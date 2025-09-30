"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
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
                  onClick={() => {
                    setUser(null);
                    setIsUserMenuOpen(false);
                  }}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    background: "transparent",
                    border: 0,
                    cursor: "pointer",
                    padding: "10px 12px",
                    borderRadius: 10,
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
