import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";

// Cache global para evitar chamadas desnecessárias
const userDataCache = new Map<string, { data: UserData; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

export interface UserData {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  age?: number;
  gender?: string;
  weight?: number;
  height?: number;
  respiratory_disease?: string;
  progress: {
    weekly: number;
    total: number;
  };
  stats: {
    sessionsCompleted: number;
    totalSessions: number;
    streak: number;
  };
  nextExercise?: {
    title: string;
    type: string;
    duration: string;
  };
}

export const useUserData = () => {
  const { user, session } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasInitialized = useRef(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user || !session) {
        setLoading(false);
        return;
      }

      // Verificar cache primeiro
      const cacheKey = user.id;
      const cachedData = userDataCache.get(cacheKey);
      const now = Date.now();

      if (cachedData && now - cachedData.timestamp < CACHE_DURATION) {
        // Log seguro apenas em desenvolvimento
        if (process.env.NODE_ENV === "development") {
          console.log(
            "Usando dados do cache para usuário:",
            user.id.substring(0, 8) + "..."
          );
        }
        setUserData(cachedData.data);
        setLoading(false);
        return;
      }

      // Evitar múltiplas chamadas simultâneas
      if (hasInitialized.current) {
        return;
      }
      hasInitialized.current = true;

      try {
        setLoading(true);
        setError(null);

        // Log seguro apenas em desenvolvimento
        if (process.env.NODE_ENV === "development") {
          console.log(
            "Fazendo chamada à API para usuário:",
            user.id.substring(0, 8) + "..."
          );
        }

        // Usar o access_token da sessão para autenticação
        const response = await fetch("/api/user/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Falha ao carregar dados do usuário");
        }

        const data = await response.json();

        // Salvar no cache
        userDataCache.set(cacheKey, {
          data,
          timestamp: now,
        });

        setUserData(data);
      } catch (err) {
        console.error("Erro ao buscar dados do usuário:", err);
        setError(err instanceof Error ? err.message : "Erro desconhecido");

        // Fallback com dados mockados enquanto não há API real
        const fallbackData = {
          id: user.id,
          name:
            user.user_metadata?.full_name ||
            user.email?.split("@")[0] ||
            "Usuário",
          email: user.email || "",
          avatar: user.user_metadata?.avatar_url || user.user_metadata?.picture,
          age: undefined,
          gender: undefined,
          weight: undefined,
          progress: {
            weekly: 3,
            total: 5,
          },
          stats: {
            sessionsCompleted: 12,
            totalSessions: 20,
            streak: 5,
          },
          nextExercise: {
            title: "Exercício de Respiração",
            type: "Aeróbico",
            duration: "15 min",
          },
        };

        setUserData(fallbackData);
      } finally {
        setLoading(false);
        hasInitialized.current = false;
      }
    };

    fetchUserData();
  }, [user, session]);

  const refetch = async () => {
    if (!user || !session) return;

    try {
      setLoading(true);
      setError(null);

      // Log seguro apenas em desenvolvimento
      if (process.env.NODE_ENV === "development") {
        console.log(
          "Forçando atualização dos dados para usuário:",
          user.id.substring(0, 8) + "..."
        );
      }

      const response = await fetch("/api/user/profile", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Falha ao carregar dados do usuário");
      }

      const data = await response.json();

      // Atualizar cache
      const cacheKey = user.id;
      userDataCache.set(cacheKey, {
        data,
        timestamp: Date.now(),
      });

      setUserData(data);
    } catch (err) {
      console.error("Erro ao buscar dados do usuário:", err);
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  // Função para limpar cache (útil para logout)
  const clearCache = () => {
    if (user) {
      userDataCache.delete(user.id);
    }
  };

  return { userData, loading, error, refetch, clearCache };
};
