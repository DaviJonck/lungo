import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Verificar se as variáveis de ambiente estão definidas
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Variáveis de ambiente do Supabase não configuradas");
}

export async function GET(request: NextRequest) {
  try {
    console.log("Iniciando endpoint /api/user/profile");

    // Verificar se as variáveis de ambiente estão configuradas
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Variáveis de ambiente não configuradas");
      return NextResponse.json(
        { error: "Configuração do servidor incompleta" },
        { status: 500 }
      );
    }

    // Extrair token de autorização
    const authHeader = request.headers.get("authorization");
    console.log("Auth header:", authHeader ? "Presente" : "Ausente");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Token de autorização necessário" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    console.log("Token extraído:", token ? "Presente" : "Ausente");

    // Verificar se o usuário está autenticado
    console.log("Verificando autenticação do usuário...");

    // Criar cliente Supabase com o token de acesso
    const supabaseWithToken = createClient(supabaseUrl!, supabaseServiceKey!, {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });

    const {
      data: { user },
      error: authError,
    } = await supabaseWithToken.auth.getUser();

    if (authError) {
      console.error("Erro de autenticação:", authError);
      return NextResponse.json(
        { error: "Erro de autenticação: " + authError.message },
        { status: 401 }
      );
    }

    if (!user) {
      console.error("Usuário não encontrado");
      return NextResponse.json(
        { error: "Usuário não autenticado" },
        { status: 401 }
      );
    }

    console.log("Usuário autenticado:", user.id);

    // Buscar dados do usuário na tabela profiles
    console.log("Buscando perfil do usuário na tabela profiles...");
    const { data: profile, error: profileError } = await supabaseWithToken
      .from("profiles")
      .select("*, age, weight, height, respiratory_disease")
      .eq("id", user.id)
      .single();

    if (profileError) {
      console.error("Erro ao buscar perfil:", profileError);
      // Se não encontrar perfil, retornar dados básicos
      return NextResponse.json({
        id: user.id,
        name:
          user.user_metadata?.full_name ||
          user.email?.split("@")[0] ||
          "Usuário",
        email: user.email || "",
        avatar: user.user_metadata?.avatar_url || user.user_metadata?.picture,
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
      });
    }

    console.log("Perfil encontrado:", profile);

    // Retornar dados do perfil encontrado
    return NextResponse.json({
      id: user.id,
      name:
        profile.full_name ||
        user.user_metadata?.full_name ||
        user.email?.split("@")[0] ||
        "Usuário",
      email: user.email || "",
      avatar:
        profile.avatar_url ||
        user.user_metadata?.avatar_url ||
        user.user_metadata?.picture,
      // Dados adicionais do perfil
      age: profile.age,
      gender: profile.gender,
      weight: profile.weight,
      height: profile.height,
      respiratory_disease: profile.respiratory_disease,
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
    });
  } catch (error) {
    console.error("Erro no endpoint /api/user/profile:", error);
    return NextResponse.json(
      {
        error:
          "Erro interno do servidor: " +
          (error instanceof Error ? error.message : "Erro desconhecido"),
      },
      { status: 500 }
    );
  }
}
