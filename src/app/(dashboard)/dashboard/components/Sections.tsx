import {
  CardDashboard,
  CardsGrid,
  GridTwoThirds,
  IconCircle,
  InfoRow,
  InfoTable,
  MetricCard,
  NextExerciseCard,
  ProgressBar,
  ProgressTrack,
  TwoCol,
  HeroCard,
} from "../styles";
import { Heart, Wind, Activity, Cloud, Play } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { UserData } from "@/hooks/useUserData";
import ExerciseModal from "./ExerciseModal";
import styled from "styled-components";

// Styled Components
const SectionTitle = styled.div`
  font-weight: 800;
  font-size: 18px;
  margin-bottom: 16px;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const InfoBanner = styled.div`
  opacity: 0.8;
  font-size: 14px;
  margin-bottom: 20px;
  padding: 12px 16px;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border-radius: 12px;
  border: 1px solid #bae6fd;
`;

const ExerciseCard = styled.div<{ $completed: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 16px 20px;
  background: ${({ $completed }) =>
    $completed
      ? "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)"
      : "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)"};
  box-shadow: ${({ $completed }) =>
    $completed
      ? "0 2px 8px rgba(34, 197, 94, 0.1)"
      : "0 2px 4px rgba(0, 0, 0, 0.05)"};
  transition: all 0.2s ease;
  border-color: ${({ $completed }) => ($completed ? "#22c55e" : "#e2e8f0")};
`;

const ExerciseContent = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
`;

const ExerciseNumber = styled.div<{ $completed: boolean }>`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: ${({ $completed }) =>
    $completed
      ? "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)"
      : "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)"};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 12px;
  font-weight: 700;
  flex-shrink: 0;
`;

const ExerciseInfo = styled.div`
  flex: 1;
`;

const ExerciseTitle = styled.div<{ $completed: boolean }>`
  font-weight: 600;
  font-size: 15px;
  color: ${({ $completed }) => ($completed ? "#059669" : "#1e293b")};
  margin-bottom: 4px;
`;

const ExerciseDetails = styled.div`
  font-size: 13px;
  opacity: 0.7;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ExerciseButton = styled.button<{ $completed: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  background: ${({ $completed }) =>
    $completed
      ? "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)"
      : "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)"};
  color: white;
  font-size: 13px;
  font-weight: 600;
  cursor: ${({ $completed }) => ($completed ? "default" : "pointer")};
  opacity: ${({ $completed }) => ($completed ? 0.9 : 1)};
  transition: all 0.2s ease;
  box-shadow: ${({ $completed }) =>
    $completed
      ? "0 2px 6px rgba(34, 197, 94, 0.2)"
      : "0 2px 6px rgba(59, 130, 246, 0.2)"};
  min-width: 100px;
  justify-content: center;

  &:hover {
    transform: ${({ $completed }) =>
      $completed ? "none" : "translateY(-1px)"};
    box-shadow: ${({ $completed }) =>
      $completed
        ? "0 2px 6px rgba(34, 197, 94, 0.2)"
        : "0 4px 12px rgba(59, 130, 246, 0.3)"};
  }
`;

const ReminderCard = styled.div`
  padding: 12px 16px;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border-radius: 12px;
  border: 1px solid #f59e0b;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ReminderDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #f59e0b;
`;

const ReminderText = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #92400e;
`;

const Toast = styled.div`
  position: fixed;
  right: 20px;
  top: 20px;
  background: #16a34a;
  color: #fff;
  padding: 10px 14px;
  border-radius: 8px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
  z-index: 100;
  font-weight: 700;
`;

const ExerciseContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ReminderContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

interface SectionsProps {
  userData?: UserData | null;
}

export function SummaryCards({ userData }: SectionsProps) {
  // Gerar saudação personalizada baseada na condição
  const [airQuality, setAirQuality] = useState<{
    aqi: number;
    status: string;
    color: string;
    description: string;
  } | null>(null);

  useEffect(() => {
    const fetchAirQuality = async (latitude: number, longitude: number) => {
      try {
        const response = await fetch(
          `/api/air-quality?lat=${latitude}&lon=${longitude}`
        );
        if (response.ok) {
          const data = await response.json();
          setAirQuality({
            aqi: data.aqi,
            status: data.status,
            color: data.color,
            description: data.description,
          });
        }
      } catch (error) {
        console.error("Erro ao buscar qualidade do ar:", error);
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

  return (
    <>
      <HeroCard>
        <div style={{ fontSize: 22, fontWeight: 800 }}>
          Olá, {userData?.name || "Usuário"}!
        </div>
        <div style={{ fontSize: 12, opacity: 0.95, marginTop: 2 }}>
          Progresso Semanal
        </div>
        <ProgressTrack>
          <ProgressBar
            value={
              userData?.progress.weekly
                ? (userData.progress.weekly / userData.progress.total) * 100
                : 0
            }
          />
        </ProgressTrack>
        <div style={{ fontSize: 12 }}>
          {userData?.progress.weekly || 0} de {userData?.progress.total || 0}{" "}
          sessões completas esta semana 🎉
        </div>
      </HeroCard>

      <CardsGrid>
        <MetricCard>
          <IconCircle>
            <Heart size={20} />
          </IconCircle>
          <div>
            <div style={{ fontSize: 12, opacity: 0.7 }}>
              Frequência Cardíaca
            </div>
            <div style={{ fontSize: 24, fontWeight: 800 }}>72 bpm</div>
            <div style={{ fontSize: 12, color: "#2aa55f" }}>↓ Normal</div>
          </div>
        </MetricCard>
        <MetricCard>
          <IconCircle>
            <Wind size={20} />
          </IconCircle>
          <div>
            <div style={{ fontSize: 12, opacity: 0.7 }}>Saturação O₂</div>
            <div style={{ fontSize: 24, fontWeight: 800 }}>96 %</div>
            <div style={{ fontSize: 12, color: "#2aa55f" }}>↑ Excelente</div>
          </div>
        </MetricCard>
        <MetricCard>
          <IconCircle>
            <Activity size={20} />
          </IconCircle>
          <div>
            <div style={{ fontSize: 12, opacity: 0.7 }}>Cansaço Médio</div>
            <div style={{ fontSize: 24, fontWeight: 800 }}>3 /10</div>
            <div style={{ fontSize: 12, color: "#2aa55f" }}>↓ Melhorando</div>
          </div>
        </MetricCard>
        <MetricCard>
          <IconCircle>
            <Cloud size={20} />
          </IconCircle>
          <div>
            <div style={{ fontSize: 12, opacity: 0.7 }}>Qualidade do Ar</div>
            <div style={{ fontSize: 24, fontWeight: 800 }}>
              {airQuality ? airQuality.status : "Carregando..."}
            </div>
            <div
              style={{
                fontSize: 12,
                color: airQuality ? airQuality.color : "#2aa55f",
              }}
            >
              {airQuality ? `AQI: ${airQuality.aqi}` : "Ideal para exercícios"}
            </div>
          </div>
        </MetricCard>
      </CardsGrid>
    </>
  );
}

export function RemindersAndActivities({ userData }: SectionsProps) {
  // Log seguro apenas em desenvolvimento
  if (process.env.NODE_ENV === "development" && userData) {
    console.log("User data in RemindersAndActivities:", {
      id: userData.id?.substring(0, 8) + "...",
      name: userData.name,
      hasAvatar: !!userData.avatar,
    });
  }

  // Pacote de exercícios definido pelo profissional
  type Exercise = {
    id: string;
    title: string;
    duration: string;
    tasks: string[];
    videoUrl?: string;
    dataCollectionType: "A" | "B" | "C";
  };

  // Pacote de exercícios do dia (3-5 exercícios por paciente)
  const todayExercises: Exercise[] = useMemo(
    () => [
      {
        id: "daily-exercise-1",
        title: "Respiração Diafragmática",
        duration: "8 min",
        tasks: ["Medir frequência cardíaca inicial"],
        dataCollectionType: "A" as const,
      },
      {
        id: "daily-exercise-2",
        title: "Caminhada Leve",
        duration: "12 min",
        tasks: ["Medir frequência cardíaca a cada 3 minutos"],
        dataCollectionType: "A" as const,
      },
      {
        id: "daily-exercise-3",
        title: "Alongamento Peitoral",
        duration: "5 min",
        tasks: ["Relaxar entre os movimentos"],
        dataCollectionType: "A" as const,
      },
      {
        id: "daily-exercise-4",
        title: "Exercício de Relaxamento",
        duration: "7 min",
        tasks: ["Anotar sensações de bem-estar"],
        dataCollectionType: "A" as const,
      },
    ],
    []
  );

  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [toast, setToast] = useState<string | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleStartExercise = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setIsModalOpen(true);
  };

  const handleCompleteExercise = (
    exerciseId: string,
    data: Record<string, string>
  ) => {
    setCompleted((prev) => ({ ...prev, [exerciseId]: true }));
    setToast(`Parabéns! Você concluiu: ${selectedExercise?.title}`);
    setTimeout(() => setToast(null), 3000);
    console.log("Dados coletados:", data);
  };

  return (
    <TwoCol>
      <CardDashboard>
        <SectionTitle>🏃‍♂️ Atividade do Dia</SectionTitle>

        <InfoBanner>
          Pacote de exercícios personalizado definido pelo seu profissional
        </InfoBanner>

        <ExerciseContainer>
          {todayExercises.map((exercise, index) => (
            <ExerciseCard key={exercise.id} $completed={completed[exercise.id]}>
              <ExerciseContent>
                <ExerciseNumber $completed={completed[exercise.id]}>
                  {completed[exercise.id] ? "✓" : index + 1}
                </ExerciseNumber>
                <ExerciseInfo>
                  <ExerciseTitle $completed={completed[exercise.id]}>
                    {exercise.title}
                  </ExerciseTitle>
                  <ExerciseDetails>
                    <span>⏱️ {exercise.duration}</span>
                    <span>•</span>
                    <span>📋 {exercise.tasks.length} tarefas</span>
                  </ExerciseDetails>
                </ExerciseInfo>
              </ExerciseContent>
              <ExerciseButton
                onClick={() => handleStartExercise(exercise)}
                disabled={completed[exercise.id]}
                $completed={completed[exercise.id]}
              >
                <Play size={14} />
                {completed[exercise.id] ? "Concluído" : "Iniciar"}
              </ExerciseButton>
            </ExerciseCard>
          ))}
        </ExerciseContainer>

        {toast && <Toast aria-live="polite">{toast}</Toast>}

        <ExerciseModal
          exercise={selectedExercise}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedExercise(null);
          }}
          onComplete={handleCompleteExercise}
        />
      </CardDashboard>
      <CardDashboard>
        <SectionTitle>💊 Lembretes</SectionTitle>

        <ReminderContainer>
          <ReminderCard>
            <ReminderDot />
            <ReminderText>Realizar Salbutamol</ReminderText>
          </ReminderCard>

          <ReminderCard>
            <ReminderDot />
            <ReminderText>Realizar Predinisolona</ReminderText>
          </ReminderCard>
        </ReminderContainer>
      </CardDashboard>
    </TwoCol>
  );
}

export function Infographics({ userData }: SectionsProps) {
  // Calcular IMC se temos peso e altura
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
      <GridTwoThirds>
        <InfoTable>
          <div style={{ fontWeight: 800, marginBottom: 8 }}>
            Informações do Paciente
          </div>
          <InfoRow>
            <div>Idade</div>
            <div>
              {userData?.age ? `${userData.age} anos` : "Não informado"}
            </div>
          </InfoRow>
          <InfoRow>
            <div>Peso</div>
            <div>
              {userData?.weight ? `${userData.weight} kg` : "Não informado"}
            </div>
          </InfoRow>
          <InfoRow>
            <div>Altura</div>
            <div>
              {userData?.height ? `${userData.height} m` : "Não informado"}
            </div>
          </InfoRow>
          {bmi && (
            <InfoRow>
              <div>IMC</div>
              <div>{bmi} kg/m²</div>
            </InfoRow>
          )}
          <InfoRow>
            <div>Condição Respiratória</div>
            <div>{userData?.respiratory_disease || "Não informado"}</div>
          </InfoRow>
        </InfoTable>
        <div>
          <NextExerciseCard>
            <div style={{ fontWeight: 800, marginBottom: 8 }}>
              Próximo Exercício
            </div>
            <div>Hoje às 15:00</div>
            <div style={{ fontWeight: 700, marginTop: 6 }}>
              {userData?.nextExercise?.title || "Exercícios Respiratórios"}
            </div>
            <div style={{ opacity: 0.8 }}>
              Duração: {userData?.nextExercise?.duration || "20 minutos"}
            </div>
          </NextExerciseCard>
        </div>
      </GridTwoThirds>
    </>
  );
}
