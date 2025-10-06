import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";

// Cache global para evitar chamadas desnecessárias
interface CachedProfileData {
  profile: ProfileData;
  isComplete: boolean;
}

const profileCache = new Map<
  string,
  { data: CachedProfileData; timestamp: number }
>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

// Rate limiting básico
const requestTimestamps = new Map<string, number[]>();
const MAX_REQUESTS_PER_MINUTE = 10;

interface ProfileData {
  age: number | null;
  weight: number | null;
  height: number | null;
  respiratory_disease: string | null;
}

export const useProfileCompletion = () => {
  const { user, session } = useAuth();
  const [isProfileComplete, setIsProfileComplete] = useState<boolean | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const hasInitialized = useRef(false);

  useEffect(() => {
    const checkProfileCompletion = async () => {
      if (!user || !session) {
        setIsProfileComplete(null);
        setLoading(false);
        return;
      }

      // Verificar cache primeiro
      const cacheKey = `profile_${user.id}`;
      const cachedData = profileCache.get(cacheKey);
      const now = Date.now();

      if (cachedData && now - cachedData.timestamp < CACHE_DURATION) {
        // Log seguro apenas em desenvolvimento
        if (process.env.NODE_ENV === "development") {
          console.log(
            "Usando dados do cache para perfil:",
            user.id.substring(0, 8) + "..."
          );
        }
        setProfileData(cachedData.data.profile);
        setIsProfileComplete(cachedData.data.isComplete);
        setLoading(false);
        return;
      }

      // Rate limiting básico
      const userRequests = requestTimestamps.get(user.id) || [];
      const recentRequests = userRequests.filter(
        (timestamp) => now - timestamp < 60000
      ); // Último minuto

      if (recentRequests.length >= MAX_REQUESTS_PER_MINUTE) {
        console.warn(
          "Rate limit excedido para usuário:",
          user.id.substring(0, 8) + "..."
        );
        setLoading(false);
        return;
      }

      // Registrar nova requisição
      recentRequests.push(now);
      requestTimestamps.set(user.id, recentRequests);

      // Evitar múltiplas chamadas simultâneas
      if (hasInitialized.current) {
        return;
      }
      hasInitialized.current = true;

      try {
        setLoading(true);

        // Usar a API /api/user/profile em vez de chamar Supabase diretamente
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

        const response = await fetch("/api/user/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            "Content-Type": "application/json",
          },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          console.error("Erro ao buscar perfil via API:", response.status);
          setIsProfileComplete(false);
          setLoading(false);
          return;
        }

        const userData = await response.json();

        // Validar dados recebidos
        if (!userData || typeof userData !== "object") {
          throw new Error("Dados inválidos recebidos da API");
        }

        // Extrair dados do perfil da resposta da API com validação
        const profile = {
          age: typeof userData.age === "number" ? userData.age : null,
          weight: typeof userData.weight === "number" ? userData.weight : null,
          height: typeof userData.height === "number" ? userData.height : null,
          respiratory_disease:
            typeof userData.respiratory_disease === "string"
              ? userData.respiratory_disease
              : null,
        };

        setProfileData(profile);

        // Verificar se todos os campos essenciais estão preenchidos
        const isComplete = !!(
          profile.age &&
          profile.weight &&
          profile.height &&
          profile.respiratory_disease
        );

        setIsProfileComplete(isComplete);

        // Salvar no cache
        profileCache.set(cacheKey, {
          data: { profile, isComplete },
          timestamp: now,
        });
      } catch (err) {
        console.error("Erro ao verificar perfil:", err);
        setIsProfileComplete(false);
      } finally {
        setLoading(false);
        hasInitialized.current = false;
      }
    };

    checkProfileCompletion();
  }, [user, session]);

  const refetch = async () => {
    if (!user || !session) return;

    try {
      setLoading(true);

      // Log seguro apenas em desenvolvimento
      if (process.env.NODE_ENV === "development") {
        console.log(
          "Forçando atualização do perfil para usuário:",
          user.id.substring(0, 8) + "..."
        );
      }

      // Usar a API /api/user/profile em vez de chamar Supabase diretamente
      const response = await fetch("/api/user/profile", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        console.error("Erro ao buscar perfil via API:", response.status);
        setIsProfileComplete(false);
        setLoading(false);
        return;
      }

      const userData = await response.json();

      // Extrair dados do perfil da resposta da API
      const profile = {
        age: userData.age,
        weight: userData.weight,
        height: userData.height,
        respiratory_disease: userData.respiratory_disease,
      };

      setProfileData(profile);

      // Verificar se todos os campos essenciais estão preenchidos
      const isComplete = !!(
        profile.age &&
        profile.weight &&
        profile.height &&
        profile.respiratory_disease
      );

      setIsProfileComplete(isComplete);

      // Atualizar cache
      const cacheKey = `profile_${user.id}`;
      profileCache.set(cacheKey, {
        data: { profile, isComplete },
        timestamp: Date.now(),
      });
    } catch (err) {
      console.error("Erro ao verificar perfil:", err);
      setIsProfileComplete(false);
    } finally {
      setLoading(false);
    }
  };

  // Função para limpar cache (útil para logout)
  const clearCache = () => {
    if (user) {
      profileCache.delete(`profile_${user.id}`);
    }
  };

  return {
    isProfileComplete,
    loading,
    profileData,
    refetch,
    clearCache,
  };
};

// Função auxiliar para verificar se o perfil está incompleto
export const isProfileIncomplete = (profile: ProfileData | null): boolean => {
  if (!profile) return true;

  return !(
    profile.age &&
    profile.weight &&
    profile.height &&
    profile.respiratory_disease
  );
};
