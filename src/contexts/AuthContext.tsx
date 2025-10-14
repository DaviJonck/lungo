"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error("Erro ao obter sessão inicial:", error);
        setSession(null);
        setUser(null);
        setLoading(false);
        return;
      }

      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log(
        "Auth state change:",
        event,
        session?.user?.id ? "User logged in" : "User logged out"
      );

      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      // Se o usuário fez logout, limpar dados locais
      if (event === "SIGNED_OUT" || !session) {
        // Limpar localStorage se necessário
        if (typeof window !== "undefined") {
          localStorage.removeItem(
            "sb-" +
              process.env.NEXT_PUBLIC_SUPABASE_URL?.split("//")[1]?.split(
                "."
              )[0] +
              "-auth-token"
          );
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
      if (error) throw error;
    } catch (error) {
      console.error("Error signing in with Google:", error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });
      if (error) throw error;
    } catch (error) {
      console.error("Error signing up:", error);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
    } catch (error) {
      console.error("Error signing in:", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      // Limpar dados locais antes do logout
      if (typeof window !== "undefined") {
        // Limpar cache dos hooks
        localStorage.removeItem("userDataCache");
        localStorage.removeItem("profileCache");
        localStorage.removeItem("requestTimestamps");

        // Limpar localStorage do Supabase
        const supabaseKey =
          process.env.NEXT_PUBLIC_SUPABASE_URL?.split("//")[1]?.split(".")[0];
        if (supabaseKey) {
          localStorage.removeItem(`sb-${supabaseKey}-auth-token`);
        }
      }

      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // Forçar limpeza do estado local
      setSession(null);
      setUser(null);
    } catch (error) {
      console.error("Error signing out:", error);
      // Mesmo com erro, limpar estado local
      setSession(null);
      setUser(null);
      throw error;
    }
  };

  const value = {
    user,
    session,
    loading,
    signInWithGoogle,
    signUp,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
