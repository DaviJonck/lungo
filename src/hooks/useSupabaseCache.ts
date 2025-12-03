import { useCallback } from "react";

// Cache simples em memória para evitar chamadas duplicadas
interface CacheEntry<T = unknown> {
  data: T | null;
  timestamp: number;
  promise?: Promise<T>;
}

const cache = new Map<string, CacheEntry>();
const CACHE_DURATION = 30000; // 30 segundos

export function useSupabaseCache() {
  const getCachedData = useCallback(<T = unknown>(key: string): T | null => {
    const cached = cache.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data as T | null;
    }
    return null;
  }, []);

  const setCachedData = useCallback(<T = unknown>(key: string, data: T) => {
    cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }, []);

  const getOrSetCache = useCallback(
    async <T = unknown>(key: string, fetchFn: () => Promise<T>): Promise<T> => {
      // Verificar se já existe uma promise em andamento
      const cached = cache.get(key);
      if (cached?.promise) {
        console.log(`🔄 Reutilizando promise em cache para: ${key}`);
        return (await cached.promise) as Promise<T>;
      }

      // Verificar se existe dados válidos no cache
      const cachedData = getCachedData<T>(key);
      if (cachedData !== null) {
        console.log(`💾 Dados encontrados no cache para: ${key}`);
        return cachedData;
      }

      // Criar nova promise e armazenar no cache
      console.log(`🚀 Executando nova busca para: ${key}`);
      const promise = fetchFn();

      cache.set(key, {
        data: null,
        timestamp: Date.now(),
        promise,
      } as CacheEntry<T>);

      try {
        const result = await promise;
        setCachedData(key, result);
        return result;
      } catch (error) {
        // Remover promise falhada do cache
        cache.delete(key);
        throw error;
      }
    },
    [getCachedData, setCachedData]
  );

  const clearCache = useCallback((key?: string) => {
    if (key) {
      cache.delete(key);
      console.log(`🗑️ Cache limpo para: ${key}`);
    } else {
      cache.clear();
      console.log(`🗑️ Todo o cache foi limpo`);
    }
  }, []);

  const getCacheInfo = useCallback(() => {
    const info: Record<
      string,
      {
        hasData: boolean;
        hasPromise: boolean;
        age: number;
        isValid: boolean;
      }
    > = {};
    cache.forEach((value, key) => {
      info[key] = {
        hasData: !!value.data,
        hasPromise: !!value.promise,
        age: Date.now() - value.timestamp,
        isValid: Date.now() - value.timestamp < CACHE_DURATION,
      };
    });
    return info;
  }, []);

  return {
    getCachedData,
    setCachedData,
    getOrSetCache,
    clearCache,
    getCacheInfo,
  };
}
