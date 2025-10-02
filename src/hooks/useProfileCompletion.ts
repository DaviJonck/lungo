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
        console.log("Usando dados do cache para perfil:", user.id);
        setProfileData(cachedData.data.profile);
        setIsProfileComplete(cachedData.data.isComplete);
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

        console.log("Fazendo chamada à API para verificar perfil:", user.id);

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

      console.log("Forçando atualização do perfil para usuário:", user.id);

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
