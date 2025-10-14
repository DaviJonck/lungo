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
import { useState, useEffect } from "react";
import { UserData } from "@/hooks/useUserData";
import ExerciseModal from "./ExerciseModal";
import styled from "styled-components";
import { useExerciseCompletion as useExerciseCompletionState } from "@/hooks/useSupabaseData";
import { useExerciseCompletion } from "@/hooks/useExerciseCompletion";
import { TodayExercise, ExerciseCompletionData } from "@/types/supabase";
import { useDashboard } from "@/contexts/DashboardContext";

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

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
`;

const ExerciseContent = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex: none;
  }
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

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 100%;
    padding: 12px 16px;
    font-size: 14px;
  }

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

  // Buscar dados do Supabase via contexto
  const {
    todayExercises,
    loading: exercisesLoading,
    error: exercisesError,
    summary,
    refetch,
  } = useDashboard();

  // Gerenciar estado de exercícios completados
  const { markExerciseComplete } = useExerciseCompletionState();

  // Hook para salvar conclusão no banco
  const { isCompleting, completionError, completeExercise, clearError } =
    useExerciseCompletion();

  const [toast, setToast] = useState<string | null>(null);
  const [selectedExercise, setSelectedExercise] =
    useState<TodayExercise | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleStartExercise = (exercise: TodayExercise) => {
    setSelectedExercise(exercise);
    setIsModalOpen(true);
  };

  const handleCompleteExercise = async (
    exerciseId: string,
    data: Record<string, string>
  ) => {
    if (!selectedExercise || !userData?.id) {
      console.error("Dados insuficientes para completar exercício");
      return;
    }

    try {
      // Converter dados para o formato esperado
      const completionData: ExerciseCompletionData = {
        notes: data.notes,
        perceived_difficulty: data.perceived_difficulty
          ? parseInt(data.perceived_difficulty)
          : undefined,
        heartRate: data.heartRate,
        oxygenSaturation: data.oxygenSaturation,
        fatigue: data.fatigue,
      };

      // Buscar o scheduled_exercise_id se disponível
      const scheduledExerciseId =
        selectedExercise.scheduledExerciseId || undefined;

      // Salvar no banco de dados
      const success = await completeExercise(
        userData.id,
        selectedExercise.exerciseId,
        scheduledExerciseId,
        completionData
      );

      if (success) {
        // Marcar como completo no estado local
        markExerciseComplete(exerciseId, data);
        setToast(`Parabéns! Você concluiu: ${selectedExercise.title}`);
        setTimeout(() => setToast(null), 3000);
        console.log("✅ Exercício concluído e salvo com sucesso!");

        // Recarregar dados do dashboard para atualizar o status
        refetch();
      } else {
        setToast("Erro ao salvar exercício. Tente novamente.");
        setTimeout(() => setToast(null), 5000);
      }
    } catch (error) {
      console.error("Erro ao completar exercício:", error);
      setToast("Erro ao salvar exercício. Tente novamente.");
      setTimeout(() => setToast(null), 5000);
    }
  };

  return (
    <TwoCol>
      <CardDashboard>
        <SectionTitle>🏃‍♂️ Atividade do Dia</SectionTitle>

        <InfoBanner>
          {exercisesLoading
            ? "Carregando exercícios..."
            : exercisesError
            ? "Erro ao carregar exercícios"
            : `Pacote de exercícios personalizado (${summary.total} exercícios, ${summary.totalDuration} min total)`}
        </InfoBanner>

        <ExerciseContainer>
          {exercisesLoading ? (
            <div style={{ textAlign: "center", padding: "20px", opacity: 0.7 }}>
              Carregando exercícios...
            </div>
          ) : exercisesError ? (
            <div
              style={{ textAlign: "center", padding: "20px", color: "#ef4444" }}
            >
              Erro ao carregar exercícios: {exercisesError}
            </div>
          ) : todayExercises.length === 0 ? (
            <div style={{ textAlign: "center", padding: "20px", opacity: 0.7 }}>
              Nenhum exercício agendado para hoje
            </div>
          ) : (
            todayExercises.map((exercise, index) => (
              <ExerciseCard
                key={exercise.id}
                $completed={exercise.isCompleted}
                data-testid="exercise-card"
              >
                <ExerciseContent>
                  <ExerciseNumber $completed={exercise.isCompleted}>
                    {exercise.isCompleted ? "✓" : index + 1}
                  </ExerciseNumber>
                  <ExerciseInfo>
                    <ExerciseTitle $completed={exercise.isCompleted}>
                      {exercise.title}
                    </ExerciseTitle>
                    <ExerciseDetails>
                      <span>⏱️ {exercise.duration}</span>
                      <span>•</span>
                      <span>📋 {exercise.tasks.length} tarefas</span>
                      {exercise.sets && exercise.reps && (
                        <>
                          <span>•</span>
                          <span>
                            💪 {exercise.sets}x{exercise.reps}
                          </span>
                        </>
                      )}
                    </ExerciseDetails>
                  </ExerciseInfo>
                </ExerciseContent>
                <ExerciseButton
                  onClick={() => handleStartExercise(exercise)}
                  disabled={exercise.isCompleted || isCompleting}
                  $completed={exercise.isCompleted}
                  data-testid="exercise-button"
                >
                  <Play size={14} />
                  {exercise.isCompleted
                    ? "Concluído"
                    : isCompleting
                    ? "Salvando..."
                    : "Iniciar"}
                </ExerciseButton>
              </ExerciseCard>
            ))
          )}
        </ExerciseContainer>

        {toast && <Toast aria-live="polite">{toast}</Toast>}
        {completionError && (
          <Toast style={{ background: "#ef4444" }} aria-live="polite">
            {completionError}
          </Toast>
        )}

        <ExerciseModal
          exercise={selectedExercise}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedExercise(null);
            clearError();
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
  // Buscar dados do dashboard via contexto
  const { activePlan, loading: planLoading } = useDashboard();

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
              {activePlan ? "Plano Ativo" : "Próximo Exercício"}
            </div>
            {activePlan ? (
              <>
                <div style={{ fontSize: 14, opacity: 0.8, marginBottom: 4 }}>
                  {activePlan.plan_name}
                </div>
                <div style={{ fontWeight: 700, marginTop: 6 }}>
                  Iniciado em:{" "}
                  {new Date(activePlan.start_date).toLocaleDateString("pt-BR")}
                </div>
                <div style={{ opacity: 0.8 }}>
                  {activePlan.notes ||
                    "Plano personalizado pelo seu profissional"}
                </div>
              </>
            ) : planLoading ? (
              <div style={{ opacity: 0.7 }}>Carregando plano...</div>
            ) : (
              <>
                <div>Hoje às 15:00</div>
                <div style={{ fontWeight: 700, marginTop: 6 }}>
                  {userData?.nextExercise?.title || "Exercícios Respiratórios"}
                </div>
                <div style={{ opacity: 0.8 }}>
                  Duração: {userData?.nextExercise?.duration || "20 minutos"}
                </div>
              </>
            )}
          </NextExerciseCard>
        </div>
      </GridTwoThirds>
    </>
  );
}
