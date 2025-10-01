"use client";

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";

const AuthContainer = styled.div`
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.md};
`;

const AuthWrapper = styled.div`
  width: 100%;
  max-width: 500px;
  position: relative;
`;

const BackgroundPattern = styled.div`
  position: absolute;
  top: -50px;
  left: -50px;
  right: -50px;
  bottom: -50px;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="rgba(122,178,211,0.1)"/><circle cx="75" cy="75" r="1" fill="rgba(122,178,211,0.1)"/><circle cx="50" cy="10" r="0.5" fill="rgba(122,178,211,0.05)"/><circle cx="10" cy="60" r="0.5" fill="rgba(122,178,211,0.05)"/><circle cx="90" cy="40" r="0.5" fill="rgba(122,178,211,0.05)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
  opacity: 0.3;
  pointer-events: none;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;

  &::after {
    content: "";
    width: 40px;
    height: 40px;
    border: 4px solid rgba(255, 255, 255, 0.3);
    border-top: 4px solid white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <AuthContainer>
        <LoadingSpinner />
      </AuthContainer>
    );
  }

  if (user) {
    return null; // Will redirect to dashboard
  }

  return (
    <AuthContainer>
      <AuthWrapper>
        <BackgroundPattern />
        {isLogin ? (
          <LoginForm onToggleMode={() => setIsLogin(false)} />
        ) : (
          <SignupForm onToggleMode={() => setIsLogin(true)} />
        )}
      </AuthWrapper>
    </AuthContainer>
  );
}
