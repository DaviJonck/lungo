"use client";

import { useState, useEffect } from "react";
import styled from "styled-components";
import { Cloud, Wind, AlertTriangle, CheckCircle } from "lucide-react";

const Card = styled.div`
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
`;

const Icon = styled.div<{ $color: string }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${({ $color }) => $color}20;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ $color }) => $color};
`;

const Title = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #1c2b2d;
`;

const Status = styled.div<{ $color: string }>`
  background: ${({ $color }) => $color}20;
  color: ${({ $color }) => $color};
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  margin-left: auto;
`;

const Description = styled.p`
  margin: 0 0 16px 0;
  color: #64748b;
  font-size: 14px;
`;

const Metrics = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 16px;
`;

const Metric = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  background: #f8fafc;
  border-radius: 8px;
`;

const MetricIcon = styled.div`
  color: #64748b;
`;

const MetricText = styled.div`
  font-size: 12px;
  color: #64748b;
`;

const Recommendations = styled.div`
  margin-top: 16px;
`;

const RecommendationsTitle = styled.h4`
  margin: 0 0 8px 0;
  font-size: 14px;
  font-weight: 600;
  color: #1c2b2d;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const RecommendationList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
`;

const RecommendationItem = styled.li`
  font-size: 12px;
  color: #64748b;
  margin-bottom: 4px;
  padding-left: 16px;
  position: relative;

  &:before {
    content: "•";
    position: absolute;
    left: 0;
    color: #94a3b8;
  }
`;

const LoadingCard = styled.div`
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
`;

const ErrorCard = styled.div`
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 16px;
  padding: 20px;
  color: #dc2626;
  text-align: center;
`;

type AirQualityData = {
  aqi: number;
  status: string;
  color: string;
  description: string;
  category: string;
  dominantPollutant?: string;
  components: Record<string, { v: number }>;
  recommendations: string[];
  location: {
    city: string;
    latitude: number;
    longitude: number;
  };
  attributions: Record<string, string>[];
  timestamp: string;
};

export default function AirQualityCard() {
  const [airQuality, setAirQuality] = useState<AirQualityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAirQuality = async (latitude: number, longitude: number) => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `/api/air-quality?lat=${latitude}&lon=${longitude}`
        );

        if (!response.ok) {
          throw new Error("Erro ao buscar dados de qualidade do ar");
        }

        const data = await response.json();
        setAirQuality(data);
      } catch (err) {
        console.error("Erro ao buscar qualidade do ar:", err);
        setError("Não foi possível carregar os dados de qualidade do ar");
      } finally {
        setLoading(false);
      }
    };

    const getLocationAndFetchAirQuality = async () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            // Usar localização real do usuário
            fetchAirQuality(
              position.coords.latitude,
              position.coords.longitude
            );
          },
          (error) => {
            console.warn("Erro ao obter localização:", error);
            // Fallback para São Paulo se não conseguir a localização
            fetchAirQuality(-23.5505, -46.6333);
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000, // 5 minutos de cache
          }
        );
      } else {
        // Fallback para São Paulo se geolocalização não estiver disponível
        fetchAirQuality(-23.5505, -46.6333);
      }
    };

    getLocationAndFetchAirQuality();
  }, []);

  if (loading) {
    return (
      <LoadingCard>
        <div style={{ textAlign: "center", color: "#64748b" }}>
          <Cloud size={32} style={{ marginBottom: "8px" }} />
          <div>Carregando dados de qualidade do ar...</div>
        </div>
      </LoadingCard>
    );
  }

  if (error) {
    return (
      <ErrorCard>
        <AlertTriangle size={24} style={{ marginBottom: "8px" }} />
        <div>{error}</div>
      </ErrorCard>
    );
  }

  if (!airQuality) {
    return null;
  }

  const getStatusIcon = (status: string) => {
    if (status === "Boa") return <CheckCircle size={20} />;
    return <AlertTriangle size={20} />;
  };

  return (
    <Card>
      <Header>
        <Icon $color={airQuality.color}>
          {getStatusIcon(airQuality.status)}
        </Icon>
        <div>
          <Title>Qualidade do Ar</Title>
          <div style={{ fontSize: "12px", color: "#64748b" }}>
            {airQuality.location.city} • AQI: {airQuality.aqi}
          </div>
          {airQuality.dominantPollutant && (
            <div style={{ fontSize: "11px", color: "#94a3b8" }}>
              Poluente dominante: {airQuality.dominantPollutant}
            </div>
          )}
        </div>
        <Status $color={airQuality.color}>{airQuality.status}</Status>
      </Header>

      <Description>{airQuality.description}</Description>

      <Metrics>
        <Metric>
          <MetricIcon>
            <Cloud size={16} />
          </MetricIcon>
          <MetricText>
            <div>AQI {airQuality.aqi}</div>
            <div>Índice de Qualidade</div>
          </MetricText>
        </Metric>
        <Metric>
          <MetricIcon>
            <AlertTriangle size={16} />
          </MetricIcon>
          <MetricText>
            <div>{airQuality.category}</div>
            <div>Categoria</div>
          </MetricText>
        </Metric>
      </Metrics>

      <Recommendations>
        <RecommendationsTitle>
          <Wind size={16} />
          Recomendações
        </RecommendationsTitle>
        <RecommendationList>
          {airQuality.recommendations.map((recommendation, index) => (
            <RecommendationItem key={index}>
              {recommendation}
            </RecommendationItem>
          ))}
        </RecommendationList>
      </Recommendations>
    </Card>
  );
}
