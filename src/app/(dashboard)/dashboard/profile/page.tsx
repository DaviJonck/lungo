"use client";

import { useMemo } from "react";
import styled from "styled-components";
import {
  User,
  Trophy,
  Star,
  Flame,
  Target,
  Crown,
  Users,
  Timer,
  Heart,
  Activity,
  CheckCircle,
  Calendar,
  Award as AwardIcon,
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

const ProfileHeader = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  padding: 2rem;
  color: white;
  position: relative;
  overflow: hidden;
  margin-bottom: 2rem;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    width: 200px;
    height: 200px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    transform: translate(50px, -50px);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 1.5rem;
    margin-bottom: 1.5rem;
  }
`;

const ProfileInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 2rem;
  position: relative;
  z-index: 1;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
    text-align: center;
    gap: 1.5rem;
  }
`;

const Avatar = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.3) 0%,
    rgba(255, 255, 255, 0.1) 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(20px);
  border: 4px solid rgba(255, 255, 255, 0.4);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  position: relative;
  transition: all 0.3s ease;

  &::before {
    content: "";
    position: absolute;
    top: -4px;
    left: -4px;
    right: -4px;
    bottom: -4px;
    border-radius: 50%;
    background: linear-gradient(45deg, #ffd700, #ffed4e, #ffd700);
    z-index: -1;
    animation: rotate 3s linear infinite;
  }

  @keyframes rotate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 80px;
    height: 80px;
  }
`;

const UserDetails = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const UserName = styled.h1`
  font-size: 2.5rem;
  font-weight: 900;
  margin-bottom: 0.25rem;
  background: linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 2rem;
  }
`;

const UserTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.25rem;
  opacity: 0.95;
  font-weight: 600;
  margin-bottom: 0.5rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 1.125rem;
    justify-content: center;
  }
`;

const LevelBadge = styled.div`
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
  color: #1e293b;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  box-shadow: 0 2px 8px rgba(255, 215, 0, 0.3);
`;

const UserStats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-top: 0.5rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    gap: 1rem;
    max-width: 300px;
    margin: 0 auto;
  }
`;

const StatItem = styled.div`
  text-align: center;
  background: rgba(255, 255, 255, 0.1);
  padding: 1rem;
  border-radius: 12px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }
`;

const StatValue = styled.div`
  font-size: 1.75rem;
  font-weight: 800;
  margin-bottom: 0.25rem;
  color: #1e293b;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 1.5rem;
  }
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  opacity: 0.9;
  font-weight: 500;
  color: #1e293b;
`;

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

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const AchievementsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;

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

const StatsGrid = styled.div`
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
  color: #1e293b;
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

// Types
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

export default function ProfilePage() {
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
      {
        id: "streak_100",
        title: "Lenda Viva",
        description: "Exercite-se 100 dias seguidos",
        icon: <AwardIcon size={20} />,
        color: "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)",
        unlocked: false,
        points: 1000,
        category: "streak",
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
      {
        id: "4",
        title: "Streak Mantido",
        description: "12 dias consecutivos",
        time: "Hoje",
        points: 25,
        icon: <Flame size={16} />,
        color: "linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)",
      },
    ],
    []
  );

  return (
    <>
      <DashboardHeader title="Perfil" />
      <PageContainer>
        {/* Profile Header */}
        <ProfileHeader>
          <ProfileInfo>
            <Avatar>
              <User size={50} />
            </Avatar>
            <UserDetails>
              <UserName>João Silva</UserName>
              <UserTitle>
                <LevelBadge>
                  <Crown size={16} />
                  Nível {userLevel.level}
                </LevelBadge>
                {userLevel.title}
              </UserTitle>
              <UserStats>
                <StatItem>
                  <StatValue>{userLevel.currentPoints}</StatValue>
                  <StatLabel>Pontos</StatLabel>
                </StatItem>
                <StatItem>
                  <StatValue>{streakData.current}</StatValue>
                  <StatLabel>Dias Streak</StatLabel>
                </StatItem>
                <StatItem>
                  <StatValue>
                    {achievements.filter((a) => a.unlocked).length}
                  </StatValue>
                  <StatLabel>Conquistas</StatLabel>
                </StatItem>
              </UserStats>
            </UserDetails>
          </ProfileInfo>
        </ProfileHeader>

        {/* Gamification Section */}
        <GamificationSection>
          <LevelCard>
            <LevelHeader>
              <LevelIcon>{userLevel.icon}</LevelIcon>
              <LevelInfo>
                <LevelTitle>Nível {userLevel.level}</LevelTitle>
                <LevelSubtitle>{userLevel.title}</LevelSubtitle>
              </LevelInfo>
            </LevelHeader>
            <ProgressBar>
              <ProgressFill $progress={userLevel.progress} />
            </ProgressBar>
            <ProgressText>
              <span>{userLevel.currentPoints} pts</span>
              <span>{userLevel.nextLevelPoints} pts</span>
            </ProgressText>
          </LevelCard>

          <StreakCard>
            <StreakHeader>
              <StreakNumber>{streakData.current}</StreakNumber>
              <StreakInfo>
                <StreakTitle>Dias Consecutivos</StreakTitle>
                <StreakSubtitle>
                  Recorde: {streakData.longest} dias
                </StreakSubtitle>
              </StreakInfo>
            </StreakHeader>
          </StreakCard>
        </GamificationSection>

        {/* Stats Grid */}
        <StatsGrid>
          <StatCard>
            <StatIcon $color="linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)">
              <Calendar size={24} />
            </StatIcon>
            <StatValue>45</StatValue>
            <StatLabel>Exercícios Completos</StatLabel>
          </StatCard>

          <StatCard>
            <StatIcon $color="linear-gradient(135deg, #10b981 0%, #059669 100%)">
              <CheckCircle size={24} />
            </StatIcon>
            <StatValue>38</StatValue>
            <StatLabel>Dias Excelentes</StatLabel>
          </StatCard>

          <StatCard>
            <StatIcon $color="linear-gradient(135deg, #f59e0b 0%, #d97706 100%)">
              <Timer size={24} />
            </StatIcon>
            <StatValue>1,250</StatValue>
            <StatLabel>Minutos Totais</StatLabel>
          </StatCard>

          <StatCard>
            <StatIcon $color="linear-gradient(135deg, #ef4444 0%, #dc2626 100%)">
              <Heart size={24} />
            </StatIcon>
            <StatValue>85</StatValue>
            <StatLabel>FC Média</StatLabel>
          </StatCard>
        </StatsGrid>

        {/* Achievements Section */}
        <AchievementsSection>
          <SectionTitle>
            <Trophy size={24} />
            Conquistas
          </SectionTitle>
          <AchievementsGrid>
            {achievements.map((achievement) => (
              <AchievementCard
                key={achievement.id}
                $unlocked={achievement.unlocked}
              >
                <AchievementHeader>
                  <AchievementIcon
                    $color={achievement.color}
                    $unlocked={achievement.unlocked}
                  >
                    {achievement.icon}
                  </AchievementIcon>
                  <AchievementInfo>
                    <AchievementTitle>{achievement.title}</AchievementTitle>
                    <AchievementDescription>
                      {achievement.description}
                    </AchievementDescription>
                  </AchievementInfo>
                </AchievementHeader>
                <AchievementPoints>
                  <Star size={12} />
                  {achievement.points} pts
                </AchievementPoints>
              </AchievementCard>
            ))}
          </AchievementsGrid>
        </AchievementsSection>

        {/* Recent Activity */}
        <RecentActivity>
          <ActivityHeader>
            <Activity size={20} />
            Atividade Recente
          </ActivityHeader>
          <ActivityList>
            {recentActivity.map((activity) => (
              <ActivityItem key={activity.id}>
                <ActivityIcon $color={activity.color}>
                  {activity.icon}
                </ActivityIcon>
                <ActivityContent>
                  <ActivityTitle>{activity.title}</ActivityTitle>
                  <ActivityTime>
                    {activity.description} • {activity.time}
                  </ActivityTime>
                </ActivityContent>
                <ActivityPoints>+{activity.points}</ActivityPoints>
              </ActivityItem>
            ))}
          </ActivityList>
        </RecentActivity>
      </PageContainer>
    </>
  );
}
