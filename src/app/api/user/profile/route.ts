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

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Token de autorização necessário" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];

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
      return NextResponse.json(
        { error: "Usuário não autenticado" },
        { status: 401 }
      );
    }
    const { data: profile, error: profileError } = await supabaseWithToken
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError) {
      // Se não encontrar perfil, retornar dados básicos
      return NextResponse.json({
        id: user.id,
        name:
          user.user_metadata?.full_name ||
          user.email?.split("@")[0] ||
          "Usuário",
        email: user.email || "",
        avatar: user.user_metadata?.avatar_url || user.user_metadata?.picture,
        // Campos da tabela profiles (vazios quando não há perfil)
        full_name: user.user_metadata?.full_name || null,
        age: null,
        gender: null,
        weight: null,
        height: null,
        respiratory_disease: null,
        rehab_start_date: null,
        subscription_plan: null,
        next_follow_up_date: null,
        last_follow_up_date: null,
        updated_at: null,
        // Dados adicionais para compatibilidade
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
      // Todos os dados da tabela profiles
      full_name: profile.full_name,
      age: profile.age,
      gender: profile.gender,
      weight: profile.weight,
      height: profile.height,
      respiratory_disease: profile.respiratory_disease,
      rehab_start_date: profile.rehab_start_date,
      subscription_plan: profile.subscription_plan,
      next_follow_up_date: profile.next_follow_up_date,
      last_follow_up_date: profile.last_follow_up_date,
      updated_at: profile.updated_at,
      // Dados adicionais para compatibilidade
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
