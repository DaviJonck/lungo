import { NextRequest, NextResponse } from "next/server";

// WAQI API - Completamente gratuita, sem necessidade de cartão
const WAQI_API_BASE_URL = "https://api.waqi.info";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get("lat");
    const lon = searchParams.get("lon");

    if (!lat || !lon) {
      return NextResponse.json(
        { error: "Latitude e longitude são obrigatórios" },
        { status: 400 }
      );
    }

    // Buscar dados de qualidade do ar da WAQI (gratuita)
    const airQualityResponse = await fetch(
      `${WAQI_API_BASE_URL}/feed/geo:${lat};${lon}/?token=${process.env.WAQI_TOKEN}`
    );

    if (!airQualityResponse.ok) {
      throw new Error("Erro ao buscar dados de qualidade do ar da WAQI");
    }

    const airQualityData = await airQualityResponse.json();

    // Processar dados de qualidade do ar da WAQI
    const aqi = airQualityData.data.aqi;
    const city = airQualityData.data.city;
    const iaqi = airQualityData.data.iaqi; // Individual Air Quality Index
    const attributions = airQualityData.data.attributions;

    // Determinar status da qualidade do ar baseado no AQI da WAQI
    const getAirQualityStatus = (aqi: number) => {
      if (aqi <= 50) {
        return {
          status: "Boa",
          color: "#10b981",
          description: "Qualidade do ar satisfatória",
          category: "GOOD",
        };
      } else if (aqi <= 100) {
        return {
          status: "Moderada",
          color: "#f59e0b",
          description: "Qualidade do ar aceitável",
          category: "MODERATE",
        };
      } else if (aqi <= 150) {
        return {
          status: "Ruim para Sensíveis",
          color: "#f97316",
          description: "Pode afetar pessoas sensíveis",
          category: "UNHEALTHY_FOR_SENSITIVE_GROUPS",
        };
      } else if (aqi <= 200) {
        return {
          status: "Ruim",
          color: "#ef4444",
          description: "Pode afetar a saúde",
          category: "UNHEALTHY",
        };
      } else if (aqi <= 300) {
        return {
          status: "Muito Ruim",
          color: "#dc2626",
          description: "Risco significativo para a saúde",
          category: "VERY_UNHEALTHY",
        };
      } else {
        return {
          status: "Perigosa",
          color: "#991b1b",
          description: "Risco extremo para a saúde",
          category: "HAZARDOUS",
        };
      }
    };

    const airQualityStatus = getAirQualityStatus(aqi);

    // Gerar recomendações baseadas no AQI
    const getRecommendations = (aqi: number) => {
      if (aqi <= 50) {
        return [
          "Ideal para atividades ao ar livre",
          "Pode fazer exercícios normalmente",
          "Boa qualidade para respiração",
        ];
      } else if (aqi <= 100) {
        return [
          "Adequado para atividades ao ar livre",
          "Pessoas sensíveis devem ter cuidado",
          "Boa para exercícios leves",
        ];
      } else if (aqi <= 150) {
        return [
          "Evite exercícios intensos ao ar livre",
          "Pessoas sensíveis devem reduzir atividades",
          "Considere exercícios em ambientes fechados",
        ];
      } else {
        return [
          "Evite atividades ao ar livre",
          "Use máscara se necessário sair",
          "Prefira exercícios em ambientes fechados",
          "Mantenha janelas fechadas",
        ];
      }
    };

    const recommendations = getRecommendations(aqi);

    // Identificar poluente dominante
    const getDominantPollutant = (iaqi: Record<string, { v: number }>) => {
      if (!iaqi) return null;

      const pollutants = Object.keys(iaqi);
      if (pollutants.length === 0) return null;

      // Retorna o poluente com maior valor
      return pollutants.reduce((a, b) =>
        (iaqi[a]?.v || 0) > (iaqi[b]?.v || 0) ? a : b
      );
    };

    const dominantPollutant = getDominantPollutant(iaqi);

    const response = {
      aqi,
      status: airQualityStatus.status,
      color: airQualityStatus.color,
      description: airQualityStatus.description,
      category: airQualityStatus.category,
      dominantPollutant,
      components: iaqi || {},
      recommendations,
      location: {
        city: city?.name || "Localização não identificada",
        latitude: parseFloat(lat),
        longitude: parseFloat(lon),
      },
      attributions: attributions || [],
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Erro ao buscar dados de qualidade do ar:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
