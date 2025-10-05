"use client";

import { useState, useMemo } from "react";
import styled from "styled-components";
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

// Styled Components
const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 0 1rem;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    gap: 1rem;
    padding: 0 0.5rem;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 800;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 1.5rem;
  }
`;

const AddButton = styled.button`
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 12px 24px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 6px rgba(59, 130, 246, 0.2);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 10px 20px;
    font-size: 14px;
  }
`;

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }
`;

const StatCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid rgba(59, 130, 246, 0.1);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 1rem;
  }
`;

const StatIcon = styled.div<{ $color: string }>`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 40px;
    height: 40px;
  }
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 0.25rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 1.5rem;
  }
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 500;
`;

const FiltersRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    gap: 0.5rem;
  }
`;

const FilterButton = styled.button<{ $active: boolean }>`
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid ${({ $active }) => ($active ? "#3b82f6" : "#e2e8f0")};
  background: ${({ $active }) => ($active ? "#3b82f6" : "white")};
  color: ${({ $active }) => ($active ? "white" : "#64748b")};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #3b82f6;
    color: #3b82f6;
    background: ${({ $active }) => ($active ? "#3b82f6" : "#f8fafc")};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 6px 12px;
    font-size: 14px;
  }
`;

const DiaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
  padding: 1rem 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1rem;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
    gap: 0.75rem;
    padding: 0.5rem 0;
  }
`;

const DiaryCard = styled.div`
  background: white;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(59, 130, 246, 0.1);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 25px rgba(0, 0, 0, 0.15);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    border-radius: 12px;
  }
`;

const CardHeader = styled.div`
  padding: 1.5rem 1.5rem 1rem;
  border-bottom: 1px solid #f1f5f9;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 1rem 1rem 0.75rem;
  }
`;

const CardDate = styled.div`
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 500;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CardTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.5rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 1.125rem;
  }
`;

const CardContent = styled.div`
  padding: 1rem 1.5rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 0.75rem 1rem;
  }
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 1rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    gap: 0.75rem;
  }
`;

const MetricItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 0.5rem;
  }
`;

const MetricIcon = styled.div<{ $color: string }>`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 28px;
    height: 28px;
  }
`;

const MetricInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const MetricLabel = styled.div`
  font-size: 0.75rem;
  color: #64748b;
  font-weight: 500;
  margin-bottom: 0.25rem;
`;

const MetricValue = styled.div`
  font-size: 1rem;
  font-weight: 700;
  color: #1e293b;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 0.875rem;
  }
`;

const CardDescription = styled.p`
  color: #64748b;
  line-height: 1.6;
  margin-bottom: 1rem;
  font-size: 0.875rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 0.8125rem;
  }
`;

const CardFooter = styled.div`
  padding: 1rem 1.5rem;
  border-top: 1px solid #f1f5f9;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 0.75rem 1rem;
  }
`;

const StatusBadge = styled.div<{ $status: "good" | "warning" | "excellent" }>`
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background: ${({ $status }) => {
    switch ($status) {
      case "excellent":
        return "#dcfce7";
      case "good":
        return "#dbeafe";
      case "warning":
        return "#fef3c7";
      default:
        return "#f1f5f9";
    }
  }};
  color: ${({ $status }) => {
    switch ($status) {
      case "excellent":
        return "#166534";
      case "good":
        return "#1e40af";
      case "warning":
        return "#92400e";
      default:
        return "#64748b";
    }
  }};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button<{ $variant: "edit" | "delete" }>`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  background: ${({ $variant }) =>
    $variant === "edit" ? "#f0f9ff" : "#fef2f2"};
  color: ${({ $variant }) => ($variant === "edit" ? "#0369a1" : "#dc2626")};

  &:hover {
    background: ${({ $variant }) =>
      $variant === "edit" ? "#e0f2fe" : "#fee2e2"};
    transform: scale(1.05);
  }
`;

// Gamification Components
const GamificationSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const LevelCard = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 1.5rem;
  color: white;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    width: 100px;
    height: 100px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    transform: translate(30px, -30px);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 1rem;
  }
`;

const LevelHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const LevelIcon = styled.div`
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
`;

const LevelInfo = styled.div`
  flex: 1;
`;

const LevelTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 800;
  margin-bottom: 0.25rem;
`;

const LevelSubtitle = styled.p`
  font-size: 0.875rem;
  opacity: 0.9;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.5rem;
`;

const ProgressFill = styled.div<{ $progress: number }>`
  height: 100%;
  background: linear-gradient(90deg, #ffd700 0%, #ffed4e 100%);
  width: ${({ $progress }) => $progress}%;
  transition: width 0.3s ease;
`;

const ProgressText = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  opacity: 0.9;
`;

const StreakCard = styled.div`
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
  border-radius: 16px;
  padding: 1.5rem;
  color: white;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    width: 80px;
    height: 80px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    transform: translate(20px, -20px);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 1rem;
  }
`;

const StreakHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const StreakNumber = styled.div`
  font-size: 3rem;
  font-weight: 900;
  line-height: 1;
`;

const StreakInfo = styled.div`
  flex: 1;
`;

const StreakTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
`;

const StreakSubtitle = styled.p`
  font-size: 0.875rem;
  opacity: 0.9;
`;

const AchievementsSection = styled.div`
  margin-bottom: 2rem;
`;

const AchievementsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
  margin-top: 1rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const AchievementCard = styled.div<{ $unlocked: boolean }>`
  background: white;
  border-radius: 12px;
  padding: 1rem;
  border: 2px solid ${({ $unlocked }) => ($unlocked ? "#10b981" : "#e2e8f0")};
  box-shadow: ${({ $unlocked }) =>
    $unlocked
      ? "0 4px 12px rgba(16, 185, 129, 0.2)"
      : "0 2px 4px rgba(0, 0, 0, 0.1)"};
  transition: all 0.3s ease;
  opacity: ${({ $unlocked }) => ($unlocked ? 1 : 0.6)};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ $unlocked }) =>
      $unlocked
        ? "0 8px 20px rgba(16, 185, 129, 0.3)"
        : "0 4px 8px rgba(0, 0, 0, 0.15)"};
  }
`;

const AchievementHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
`;

const AchievementIcon = styled.div<{ $color: string; $unlocked: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: ${({ $color, $unlocked }) => ($unlocked ? $color : "#f1f5f9")};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ $unlocked }) => ($unlocked ? "white" : "#94a3b8")};
`;

const AchievementInfo = styled.div`
  flex: 1;
`;

const AchievementTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.25rem;
`;

const AchievementDescription = styled.p`
  font-size: 0.75rem;
  color: #64748b;
  line-height: 1.4;
`;

const AchievementPoints = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: #f59e0b;
  margin-top: 0.5rem;
`;

const RecentActivity = styled.div`
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid rgba(59, 130, 246, 0.1);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 1rem;
  }
`;

const ActivityHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  font-weight: 700;
  color: #1e293b;
`;

const ActivityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const ActivityItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
`;

const ActivityIcon = styled.div<{ $color: string }>`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.875rem;
`;

const ActivityContent = styled.div`
  flex: 1;
`;

const ActivityTitle = styled.div`
  font-weight: 600;
  color: #1e293b;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
`;

const ActivityTime = styled.div`
  font-size: 0.75rem;
  color: #64748b;
`;

const ActivityPoints = styled.div`
  font-weight: 600;
  color: #f59e0b;
  font-size: 0.875rem;
`;

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

  // User Level Data
  const userLevel: UserLevel = useMemo(
    () => ({
      level: 7,
      title: "Respiratório Avançado",
      icon: <Crown size={32} />,
      color: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      nextLevelPoints: 1000,
      currentPoints: 750,
      progress: 75,
    }),
    []
  );

  // Streak Data
  const streakData: StreakData = useMemo(
    () => ({
      current: 12,
      longest: 18,
      lastExercise: "2024-01-15",
      nextMilestone: 15,
    }),
    []
  );

  // Achievements Data
  const achievements: Achievement[] = useMemo(
    () => [
      {
        id: "streak_7",
        title: "Semana de Ouro",
        description: "Exercite-se 7 dias seguidos",
        icon: <Flame size={20} />,
        color: "linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)",
        unlocked: true,
        points: 100,
        category: "streak",
      },
      {
        id: "streak_30",
        title: "Mestre da Consistência",
        description: "Exercite-se 30 dias seguidos",
        icon: <Trophy size={20} />,
        color: "linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)",
        unlocked: false,
        points: 500,
        category: "streak",
      },
      {
        id: "exercise_100",
        title: "Centenário",
        description: "Complete 100 exercícios",
        icon: <Target size={20} />,
        color: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
        unlocked: true,
        points: 250,
        category: "exercise",
      },
      {
        id: "health_perfect",
        title: "Saúde Perfeita",
        description: "Mantenha saturação > 98% por 7 dias",
        icon: <Heart size={20} />,
        color: "linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)",
        unlocked: false,
        points: 300,
        category: "health",
      },
      {
        id: "social_mentor",
        title: "Mentor",
        description: "Ajude 5 outros usuários",
        icon: <Users size={20} />,
        color: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
        unlocked: false,
        points: 400,
        category: "social",
      },
    ],
    []
  );

  // Recent Activity Data
  const recentActivity = useMemo(
    () => [
      {
        id: "1",
        title: "Exercício Completo",
        description: "Respiração Diafragmática",
        time: "2 horas atrás",
        points: 50,
        icon: <Activity size={16} />,
        color: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
      },
      {
        id: "2",
        title: "Conquista Desbloqueada",
        description: "Semana de Ouro",
        time: "Ontem",
        points: 100,
        icon: <Trophy size={16} />,
        color: "linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)",
      },
      {
        id: "3",
        title: "Nível Aumentado",
        description: "Respiratório Avançado",
        time: "3 dias atrás",
        points: 200,
        icon: <Star size={16} />,
        color: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      },
    ],
    []
  );

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
