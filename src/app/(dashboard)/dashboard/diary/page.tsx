"use client";

import { useState, useMemo } from "react";
import {
  PageContainer,
  Header,
  Title,
  AddButton,
  StatsRow,
  StatCard,
  StatIcon,
  StatValue,
  StatLabel,
  FiltersRow,
  FilterButton,
  DiaryGrid,
  DiaryCard,
  CardHeader,
  CardDate,
  CardTitle,
  CardContent,
  MetricsGrid,
  MetricItem,
  MetricIcon,
  MetricInfo,
  MetricLabel,
  MetricValue,
  CardDescription,
  CardFooter,
  StatusBadge,
  ActionButtons,
  ActionButton,
} from "./style";
import {
  Calendar,
  Plus,
  Edit3,
  Trash2,
  Heart,
  Activity,
  Wind,
  Clock,
  CheckCircle,
  AlertCircle,
  Trophy,
  Star,
  Flame,
  Target,
  Crown,
  Users,
} from "lucide-react";
import DashboardHeader from "../components/DashboardHeader";

// Types
type DiaryEntry = {
  id: string;
  date: string;
  title: string;
  description: string;
  metrics: {
    heartRate: number;
    oxygenSaturation: number;
    breathingRate: number;
    exerciseDuration: number;
  };
  status: "good" | "warning" | "excellent";
  mood: string;
  symptoms: string[];
  points: number;
  achievements: string[];
};

type UserLevel = {
  level: number;
  title: string;
  icon: React.ReactNode;
  color: string;
  nextLevelPoints: number;
  currentPoints: number;
  progress: number;
};

type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  unlocked: boolean;
  points: number;
  category: "streak" | "exercise" | "health" | "social";
};

type StreakData = {
  current: number;
  longest: number;
  lastExercise: string;
  nextMilestone: number;
};

export default function DiaryPage() {
  const [activeFilter, setActiveFilter] = useState<
    "all" | "today" | "week" | "month"
  >("all");

  // Mock data
  const diaryEntries: DiaryEntry[] = useMemo(
    () => [
      {
        id: "1",
        date: "2024-01-15",
        title: "Sessão de Exercícios Matinal",
        description:
          "Realizei uma sessão completa de exercícios respiratórios. Me senti muito bem durante e após a prática.",
        metrics: {
          heartRate: 85,
          oxygenSaturation: 98,
          breathingRate: 16,
          exerciseDuration: 30,
        },
        status: "excellent",
        mood: "Energizado",
        symptoms: [],
        points: 50,
        achievements: ["streak_7"],
      },
      {
        id: "2",
        date: "2024-01-14",
        title: "Caminhada no Parque",
        description:
          "Caminhada leve de 20 minutos. Tive um pouco de falta de ar no final, mas consegui completar.",
        metrics: {
          heartRate: 95,
          oxygenSaturation: 96,
          breathingRate: 18,
          exerciseDuration: 20,
        },
        status: "good",
        mood: "Satisfeito",
        symptoms: ["Falta de ar leve"],
        points: 30,
        achievements: [],
      },
      {
        id: "3",
        date: "2024-01-13",
        title: "Exercícios de Respiração",
        description:
          "Sessão de respiração diafragmática. Alguma dificuldade para manter o ritmo.",
        metrics: {
          heartRate: 78,
          oxygenSaturation: 97,
          breathingRate: 14,
          exerciseDuration: 15,
        },
        status: "warning",
        mood: "Cansado",
        symptoms: ["Cansaço", "Dificuldade respiratória"],
        points: 20,
        achievements: [],
      },
    ],
    []
  );

  const filteredEntries = useMemo(() => {
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];

    switch (activeFilter) {
      case "today":
        return diaryEntries.filter((entry) => entry.date === todayStr);
      case "week":
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        return diaryEntries.filter((entry) => new Date(entry.date) >= weekAgo);
      case "month":
        const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
        return diaryEntries.filter((entry) => new Date(entry.date) >= monthAgo);
      default:
        return diaryEntries;
    }
  }, [diaryEntries, activeFilter]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "excellent":
        return <CheckCircle size={12} />;
      case "good":
        return <Activity size={12} />;
      case "warning":
        return <AlertCircle size={12} />;
      default:
        return <Activity size={12} />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "excellent":
        return "Excelente";
      case "good":
        return "Bom";
      case "warning":
        return "Atenção";
      default:
        return "Normal";
    }
  };

  return (
    <>
      <DashboardHeader title="Diário" />
      <PageContainer>
        <Header>
          <Title>
            <Calendar size={28} />
            Meu Diário
          </Title>
          <AddButton>
            <Plus size={20} />
            Nova Entrada
          </AddButton>
        </Header>

        <StatsRow>
          <StatCard>
            <StatIcon $color="linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)">
              <Calendar size={24} />
            </StatIcon>
            <StatValue>{diaryEntries.length}</StatValue>
            <StatLabel>Entradas no Diário</StatLabel>
          </StatCard>

          <StatCard>
            <StatIcon $color="linear-gradient(135deg, #10b981 0%, #059669 100%)">
              <CheckCircle size={24} />
            </StatIcon>
            <StatValue>
              {
                diaryEntries.filter((entry) => entry.status === "excellent")
                  .length
              }
            </StatValue>
            <StatLabel>Dias Excelentes</StatLabel>
          </StatCard>

          <StatCard>
            <StatIcon $color="linear-gradient(135deg, #f59e0b 0%, #d97706 100%)">
              <Activity size={24} />
            </StatIcon>
            <StatValue>
              {Math.round(
                diaryEntries.reduce(
                  (acc, entry) => acc + entry.metrics.exerciseDuration,
                  0
                ) / diaryEntries.length
              )}
            </StatValue>
            <StatLabel>Min Médio/Dia</StatLabel>
          </StatCard>

          <StatCard>
            <StatIcon $color="linear-gradient(135deg, #ef4444 0%, #dc2626 100%)">
              <Heart size={24} />
            </StatIcon>
            <StatValue>
              {Math.round(
                diaryEntries.reduce(
                  (acc, entry) => acc + entry.metrics.heartRate,
                  0
                ) / diaryEntries.length
              )}
            </StatValue>
            <StatLabel>FC Média</StatLabel>
          </StatCard>
        </StatsRow>

        <FiltersRow>
          <FilterButton
            $active={activeFilter === "all"}
            onClick={() => setActiveFilter("all")}
          >
            Todas
          </FilterButton>
          <FilterButton
            $active={activeFilter === "today"}
            onClick={() => setActiveFilter("today")}
          >
            Hoje
          </FilterButton>
          <FilterButton
            $active={activeFilter === "week"}
            onClick={() => setActiveFilter("week")}
          >
            Esta Semana
          </FilterButton>
          <FilterButton
            $active={activeFilter === "month"}
            onClick={() => setActiveFilter("month")}
          >
            Este Mês
          </FilterButton>
        </FiltersRow>

        <DiaryGrid>
          {filteredEntries.map((entry) => (
            <DiaryCard key={entry.id}>
              <CardHeader>
                <CardDate>
                  <Calendar size={16} />
                  {new Date(entry.date).toLocaleDateString("pt-BR")}
                </CardDate>
                <CardTitle>{entry.title}</CardTitle>
              </CardHeader>

              <CardContent>
                <MetricsGrid>
                  <MetricItem>
                    <MetricIcon $color="linear-gradient(135deg, #ef4444 0%, #dc2626 100%)">
                      <Heart size={16} />
                    </MetricIcon>
                    <MetricInfo>
                      <MetricLabel>Frequência Cardíaca</MetricLabel>
                      <MetricValue>{entry.metrics.heartRate} bpm</MetricValue>
                    </MetricInfo>
                  </MetricItem>

                  <MetricItem>
                    <MetricIcon $color="linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)">
                      <Wind size={16} />
                    </MetricIcon>
                    <MetricInfo>
                      <MetricLabel>Saturação O₂</MetricLabel>
                      <MetricValue>
                        {entry.metrics.oxygenSaturation}%
                      </MetricValue>
                    </MetricInfo>
                  </MetricItem>

                  <MetricItem>
                    <MetricIcon $color="linear-gradient(135deg, #10b981 0%, #059669 100%)">
                      <Activity size={16} />
                    </MetricIcon>
                    <MetricInfo>
                      <MetricLabel>Freq. Respiratória</MetricLabel>
                      <MetricValue>
                        {entry.metrics.breathingRate} rpm
                      </MetricValue>
                    </MetricInfo>
                  </MetricItem>

                  <MetricItem>
                    <MetricIcon $color="linear-gradient(135deg, #f59e0b 0%, #d97706 100%)">
                      <Clock size={16} />
                    </MetricIcon>
                    <MetricInfo>
                      <MetricLabel>Duração</MetricLabel>
                      <MetricValue>
                        {entry.metrics.exerciseDuration} min
                      </MetricValue>
                    </MetricInfo>
                  </MetricItem>
                </MetricsGrid>

                <CardDescription>{entry.description}</CardDescription>
              </CardContent>

              <CardFooter>
                <StatusBadge $status={entry.status}>
                  {getStatusIcon(entry.status)}
                  {getStatusText(entry.status)}
                </StatusBadge>

                <ActionButtons>
                  <ActionButton $variant="edit">
                    <Edit3 size={16} />
                  </ActionButton>
                  <ActionButton $variant="delete">
                    <Trash2 size={16} />
                  </ActionButton>
                </ActionButtons>
              </CardFooter>
            </DiaryCard>
          ))}
        </DiaryGrid>
      </PageContainer>
    </>
  );
}
