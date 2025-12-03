"use client";

import {
  PageContainer,
  ProfileHeader,
  ProfileInfo,
  Avatar,
  UserDetails,
  UserName,
  UserAge,
  StatsGrid,
  StatCard,
  StatIcon,
  StatValue,
  StatLabel,
  ProgressSection,
  ProgressCardsContainer,
  ProgressCard,
  ProgressCardIcon,
  ProgressCardContent,
  ProgressCardValue,
  ProgressCardLabel,
  AchievementsSection,
  SectionTitle,
  ComingSoonCard,
  ComingSoonIcon,
  ComingSoonText,
} from "./style";
import {
  User,
  Scale,
  Ruler,
  Activity,
  Heart,
  Calendar,
  CheckCircle,
  Trophy,
  Construction,
} from "lucide-react";
import DashboardHeader from "../components/DashboardHeader";
import { useUserData } from "@/hooks/useUserData";

export default function ProfilePage() {
  const { userData } = useUserData();

  // Calcular IMC
  const calculateBMI = () => {
    if (userData?.weight && userData?.height) {
      const bmi = userData.weight / (userData.height * userData.height);
      return bmi.toFixed(1);
    }
    return null;
  };

  const bmi = calculateBMI();

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
              <UserName>{userData?.name || "Usuário"}</UserName>
              {userData?.age && <UserAge>{userData.age} anos</UserAge>}
            </UserDetails>
          </ProfileInfo>
        </ProfileHeader>

        {/* Stats Grid */}
        <StatsGrid>
          <StatCard>
            <StatIcon $color="linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)">
              <Scale size={24} />
            </StatIcon>
            <StatValue>
              {userData?.weight ? `${userData.weight} kg` : "—"}
            </StatValue>
            <StatLabel>Peso</StatLabel>
          </StatCard>

          <StatCard>
            <StatIcon $color="linear-gradient(135deg, #10b981 0%, #059669 100%)">
              <Ruler size={24} />
            </StatIcon>
            <StatValue>
              {userData?.height ? `${userData.height} m` : "—"}
            </StatValue>
            <StatLabel>Altura</StatLabel>
          </StatCard>

          <StatCard>
            <StatIcon $color="linear-gradient(135deg, #f59e0b 0%, #d97706 100%)">
              <Activity size={24} />
            </StatIcon>
            <StatValue>{bmi ? `${bmi} kg/m²` : "—"}</StatValue>
            <StatLabel>IMC</StatLabel>
          </StatCard>

          <StatCard>
            <StatIcon $color="linear-gradient(135deg, #ef4444 0%, #dc2626 100%)">
              <Heart size={24} />
            </StatIcon>
            <StatValue>{userData?.respiratory_disease || "—"}</StatValue>
            <StatLabel>Condição Respiratória</StatLabel>
          </StatCard>
        </StatsGrid>

        {/* Progress Section - Dias Consecutivos e Exercícios Completos */}
        <ProgressSection>
          <ProgressCardsContainer>
            <ProgressCard $color="linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)">
              <ProgressCardIcon>
                <Calendar size={32} />
              </ProgressCardIcon>
              <ProgressCardContent>
                <ProgressCardValue>
                  {userData?.stats?.streak || 0}
                </ProgressCardValue>
                <ProgressCardLabel>Dias Consecutivos</ProgressCardLabel>
              </ProgressCardContent>
            </ProgressCard>

            <ProgressCard $color="linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)">
              <ProgressCardIcon>
                <CheckCircle size={32} />
              </ProgressCardIcon>
              <ProgressCardContent>
                <ProgressCardValue>
                  {userData?.stats?.sessionsCompleted || 0}
                </ProgressCardValue>
                <ProgressCardLabel>Exercícios Completos</ProgressCardLabel>
              </ProgressCardContent>
            </ProgressCard>
          </ProgressCardsContainer>
        </ProgressSection>

        {/* Achievements Section - Em Breve */}
        <AchievementsSection>
          <SectionTitle>
            <Trophy size={24} />
            Conquistas
          </SectionTitle>
          <ComingSoonCard>
            <ComingSoonIcon>
              <Construction size={48} />
            </ComingSoonIcon>
            <ComingSoonText>Em breve</ComingSoonText>
          </ComingSoonCard>
        </AchievementsSection>
      </PageContainer>
    </>
  );
}
