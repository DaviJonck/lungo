"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useProfileCompletion } from "@/hooks/useProfileCompletion";

export default function OnboardingRedirect() {
  const router = useRouter();
  const pathname = usePathname();
  const { isProfileComplete, loading } = useProfileCompletion();

  useEffect(() => {
    // Não redirecionar se ainda está carregando
    if (loading) return;

    // Não redirecionar se já está na página de onboarding
    if (pathname === "/onboarding") return;

    // Redirecionar se o perfil está incompleto
    if (isProfileComplete === false) {
      router.push("/onboarding");
    }
  }, [isProfileComplete, loading, pathname, router]);

  // Não renderizar nada - este componente apenas gerencia redirecionamentos
  return null;
}
