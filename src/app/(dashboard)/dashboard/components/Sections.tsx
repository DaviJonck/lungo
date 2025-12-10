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
  HeroCard,
} from "../styles";
import {
  Heart,
  Wind,
  Activity,
  Cloud,
  Play,
  Eye,
  Clock,
  CheckCircle,
} from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
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

const ExerciseCard = styled.div<{ $completed: boolean; $isStarted?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
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
  position: relative;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    flex-wrap: wrap;
    gap: 10px;
    padding: 14px 16px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
    justify-content: flex-start;
  }
`;

const ExerciseContent = styled.div<{ $isStarted?: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: ${({ $isStarted }) => ($isStarted ? "0 1 auto" : "1")};
  min-width: 0;
  order: 1;
  max-width: 100%;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    flex: ${({ $isStarted }) => ($isStarted ? "0 1 40%" : "1 1 50%")};
    min-width: 200px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex: none;
    order: 0;
    max-width: 100%;
    min-width: 0;
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

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: ${({ $completed }) => ($completed ? "none" : "flex")};
  }
`;

const ExerciseInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
  overflow: hidden;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    gap: 8px;
  }
`;

const ExerciseInfoContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const ExerciseBorgContainer = styled.div`
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e2e8f0;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin-top: 12px;
    padding-top: 12px;
  }
`;

const ExerciseTitle = styled.div<{ $completed: boolean }>`
  font-weight: 600;
  font-size: 15px;
  color: ${({ $completed }) => ($completed ? "#059669" : "#1e293b")};
  margin-bottom: 4px;
  word-wrap: break-word;
  overflow-wrap: break-word;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    font-size: 14px;
  }
`;

const ExerciseDetails = styled.div`
  font-size: 13px;
  opacity: 0.7;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    font-size: 12px;
    gap: 6px;
  }
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
  white-space: nowrap;
  flex-shrink: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    padding: 6px 12px;
    font-size: 12px;
    min-width: 80px;
    gap: 4px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 100%;
    padding: 12px 16px;
    font-size: 14px;
    min-width: 0;
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

// Componentes para exercício simplificado
const TimerDisplay = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 18px;
  font-weight: 700;
  color: #0ea5e9;
  font-family: "Courier New", monospace;
  padding: 8px 14px;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border-radius: 8px;
  border: 2px solid #bae6fd;
  box-shadow: 0 2px 8px rgba(14, 165, 233, 0.15);
  min-width: 110px;
  flex: 0 0 auto;
  order: 2;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    font-size: 16px;
    padding: 6px 12px;
    min-width: 100px;
    flex: 0 0 auto;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 16px;
    padding: 6px 12px;
    min-width: 100px;
    width: 100%;
    order: 1;
  }
`;

const CongratulationsTitle = styled.div`
  font-size: 18px;
  font-weight: 800;
  color: #059669;
  margin-bottom: 12px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 16px;
  }
`;

const BorgScaleContainer = styled.div`
  margin-top: 8px;
`;

const BorgScaleTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #64748b;
  margin-bottom: 12px;
  text-align: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 12px;
    margin-bottom: 10px;
  }
`;

const BorgScaleGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 8px;
`;

const BorgScaleRow = styled.div<{ $isFirstRow?: boolean }>`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 8px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    gap: 4px;
  }
`;

const BorgScaleButton = styled.button<{ $selected: boolean; $value: number }>`
  padding: 10px 6px;
  border: 2px solid ${({ $selected }) => ($selected ? "#3b82f6" : "#e2e8f0")};
  border-radius: 8px;
  background: ${({ $selected, $value }) => {
    if ($selected) return "linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)";
    if ($value <= 2) return "#f0fdf4";
    if ($value <= 4) return "#fef3c7";
    if ($value <= 6) return "#fde68a";
    if ($value <= 8) return "#fcd34d";
    return "#fee2e2";
  }};
  color: ${({ $selected }) => ($selected ? "white" : "#1e293b")};
  font-weight: ${({ $selected }) => ($selected ? 700 : 600)};
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60px;
  min-width: 0;
  width: 100%;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 8px 4px;
    min-height: 50px;
    font-size: 11px;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
  }
`;

const BorgValue = styled.div`
  font-size: 16px;
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 4px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 14px;
    margin-bottom: 2px;
  }
`;

const BorgLabel = styled.div`
  font-size: 9px;
  text-align: center;
  line-height: 1.2;
  margin-top: 2px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 8px;
    display: none; /* Esconder labels no mobile para economizar espaço */
  }
`;

const ViewExerciseButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: white;
  color: #64748b;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  flex-shrink: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    padding: 6px 12px;
    font-size: 12px;
    gap: 4px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex: 1;
    padding: 12px 16px;
    font-size: 14px;
  }

  &:hover {
    background: #f8fafc;
    border-color: #cbd5e1;
    transform: translateY(-1px);
  }
`;

const FinishButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 6px rgba(16, 185, 129, 0.2);
  white-space: nowrap;
  flex-shrink: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    padding: 6px 12px;
    font-size: 12px;
    gap: 4px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex: 1;
    padding: 12px 16px;
    font-size: 14px;
  }

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;

const ExerciseActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  flex: 0 0 auto;
  order: 3;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    flex: 0 1 auto;
    min-width: 0;
    gap: 6px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 100%;
    justify-content: stretch;
    order: 2;
    gap: 8px;
  }
`;

interface SectionsProps {
  userData?: UserData | null;
}

// Função para determinar tipo de exercício baseado no dataCollectionType
const getExerciseType = (
  dataCollectionType: "A" | "B" | "C"
): "RESPIRATORY" | "AEROBIC" | "STRENGTH" => {
  switch (dataCollectionType) {
    case "A":
      return "RESPIRATORY";
    case "B":
      return "AEROBIC";
    case "C":
      return "STRENGTH";
    default:
      return "RESPIRATORY";
  }
};

// Escala de Borg - dividida em duas linhas: 0-4 em cima, 5-10 em baixo
const borgScaleFirstRow = [
  { value: 0, label: "Nenhuma" },
  { value: 0.5, label: "Muito, muito leve" },
  { value: 1, label: "Muito leve" },
  { value: 2, label: "Leve" },
  { value: 3, label: "Moderada" },
  { value: 4, label: "Pouca intensa" },
];

const borgScaleSecondRow = [
  { value: 5, label: "Intensa" },
  { value: 6, label: "" },
  { value: 7, label: "Muito intensa" },
  { value: 8, label: "" },
  { value: 9, label: "Muito, muito intensa" },
  { value: 10, label: "Máxima" },
];

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
    <div style={{ marginBottom: 20 }}>
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
    </div>
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

  const router = useRouter();
  const [toast, setToast] = useState<string | null>(null);
  const [selectedExercise, setSelectedExercise] =
    useState<TodayExercise | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Estado para exercícios iniciados (sem modal)
  const [startedExercises, setStartedExercises] = useState<
    Record<string, { timeRemaining: number; startTime: number }>
  >({});
  const [completedExercises, setCompletedExercises] = useState<
    Record<string, boolean>
  >({});
  const [borgRatings, setBorgRatings] = useState<Record<string, number | null>>(
    {}
  );

  const timersRef = useRef<Record<string, NodeJS.Timeout>>({});

  // Converter duração para segundos
  const parseDurationToSeconds = (duration: string): number => {
    const match = duration.match(/(\d+)\s*min/);
    if (match) {
      return parseInt(match[1]) * 60;
    }
    return 10 * 60; // Default 10 minutos
  };

  // Iniciar exercício
  const handleStartExercise = (exercise: TodayExercise) => {
    const durationSeconds = parseDurationToSeconds(exercise.duration);
    setStartedExercises((prev) => ({
      ...prev,
      [exercise.id]: {
        timeRemaining: durationSeconds,
        startTime: Date.now(),
      },
    }));
  };

  // Ver exercício (navega para página de exercícios)
  const handleViewExercise = (exercise: TodayExercise) => {
    router.push(`/dashboard/exercises?exerciseId=${exercise.exerciseId}`);
  };

  // Finalizar exercício manualmente (antes do tempo acabar)
  const handleFinishExercise = (exercise: TodayExercise) => {
    // Parar o timer
    if (timersRef.current[exercise.id]) {
      clearInterval(timersRef.current[exercise.id]);
      delete timersRef.current[exercise.id];
    }

    // Marcar como finalizado (para mostrar escala de Borg), mas NÃO como completo ainda
    setCompletedExercises((prev) => ({ ...prev, [exercise.id]: true }));
    setStartedExercises((prev) => {
      const newState = { ...prev };
      // Manter o exercício no estado mas com tempo 0 para indicar que terminou
      if (newState[exercise.id]) {
        newState[exercise.id] = { ...newState[exercise.id], timeRemaining: 0 };
      }
      return newState;
    });

    const exerciseType = getExerciseType(exercise.dataCollectionType);

    // Se for exercício respiratório, salvar automaticamente
    if (exerciseType === "RESPIRATORY" && userData?.id) {
      handleBorgRating(exercise, 0);
    }
  };

  // Formatar tempo
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Salvar avaliação de Borg e completar exercício
  const handleBorgRating = useCallback(
    async (exercise: TodayExercise, rating: number) => {
      if (!userData?.id) {
        console.error("Dados insuficientes para completar exercício");
        return;
      }

      const exerciseType = getExerciseType(exercise.dataCollectionType);

      // Para exercícios respiratórios, não mostrar escala, apenas salvar
      if (exerciseType === "RESPIRATORY") {
        setBorgRatings((prev) => ({ ...prev, [exercise.id]: null }));
      } else {
        setBorgRatings((prev) => ({ ...prev, [exercise.id]: rating }));
      }

      try {
        // Converter dados para o formato esperado
        const completionData: ExerciseCompletionData = {
          notes: "",
          perceived_difficulty:
            exerciseType === "RESPIRATORY" ? undefined : rating,
          heartRate: undefined,
          oxygenSaturation: undefined,
          fatigue: undefined,
        };

        // Buscar o scheduled_exercise_id se disponível
        const scheduledExerciseId = exercise.scheduledExerciseId || undefined;

        // Salvar no banco de dados
        const success = await completeExercise(
          userData.id,
          exercise.exerciseId,
          scheduledExerciseId,
          completionData
        );

        if (success) {
          // Marcar como completo no estado local
          markExerciseComplete(
            exercise.id,
            exerciseType === "RESPIRATORY"
              ? {}
              : { perceived_difficulty: rating.toString() }
          );
          setToast(`Parabéns! Você concluiu: ${exercise.title}`);
          setTimeout(() => setToast(null), 3000);
          console.log("✅ Exercício concluído e salvo com sucesso!");

          // Limpar estados
          setStartedExercises((prev) => {
            const newState = { ...prev };
            delete newState[exercise.id];
            return newState;
          });

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
    },
    [userData?.id, completeExercise, markExerciseComplete, refetch]
  );

  // Timer para cada exercício iniciado
  useEffect(() => {
    const startedExerciseIds = Object.keys(startedExercises);

    startedExerciseIds.forEach((exerciseId) => {
      if (timersRef.current[exerciseId]) {
        clearInterval(timersRef.current[exerciseId]);
      }

      const exercise = todayExercises.find((e) => e.id === exerciseId);
      const exerciseType = exercise
        ? getExerciseType(exercise.dataCollectionType)
        : null;

      timersRef.current[exerciseId] = setInterval(() => {
        setStartedExercises((prev) => {
          const exerciseState = prev[exerciseId];
          if (!exerciseState) return prev;

          const newTimeRemaining = exerciseState.timeRemaining - 1;

          if (newTimeRemaining <= 0) {
            // Exercício terminou
            setCompletedExercises((prev) => ({ ...prev, [exerciseId]: true }));
            const timer = timersRef.current[exerciseId];
            if (timer) {
              clearInterval(timer);
              delete timersRef.current[exerciseId];
            }

            // Se for exercício respiratório, salvar automaticamente sem escala de Borg
            if (exerciseType === "RESPIRATORY" && exercise && userData?.id) {
              handleBorgRating(exercise, 0); // Usar 0 como valor padrão para respiratório
            }

            return {
              ...prev,
              [exerciseId]: { ...exerciseState, timeRemaining: 0 },
            };
          }

          return {
            ...prev,
            [exerciseId]: { ...exerciseState, timeRemaining: newTimeRemaining },
          };
        });
      }, 1000);
    });

    return () => {
      // Copiar referência para evitar problemas com cleanup
      // eslint-disable-next-line react-hooks/exhaustive-deps
      const currentTimers = { ...timersRef.current };
      Object.values(currentTimers).forEach((timer) => {
        if (timer) clearInterval(timer);
      });
    };
  }, [startedExercises, todayExercises, userData?.id, handleBorgRating]);

  // Handler para modal (apenas visualização)
  const handleCompleteExercise = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async (_exerciseId: string, _data: Record<string, string>) => {
      // Este handler é usado apenas quando o modal é usado para visualização
      // A lógica principal está em handleBorgRating
      // Parâmetros prefixados com _ para indicar que não são usados intencionalmente
    },
    []
  );

  return (
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
          todayExercises.map((exercise, index) => {
            const isStarted = !!startedExercises[exercise.id];
            const isCompleted = exercise.isCompleted; // Apenas quando salvo no banco
            const isFinished =
              completedExercises[exercise.id] && !exercise.isCompleted;
            const exerciseType = getExerciseType(exercise.dataCollectionType);
            const showBorgScale = isFinished && exerciseType !== "RESPIRATORY";
            const borgRating = borgRatings[exercise.id];
            const timeRemaining =
              startedExercises[exercise.id]?.timeRemaining || 0;

            return (
              <ExerciseCard
                key={exercise.id}
                $completed={isCompleted}
                $isStarted={isStarted && !isFinished}
                data-testid="exercise-card"
              >
                {/* Conteúdo do exercício - sempre visível */}
                <ExerciseContent $isStarted={isStarted && !isFinished}>
                  <ExerciseNumber $completed={isCompleted}>
                    {isCompleted ? "✓" : index + 1}
                  </ExerciseNumber>
                  <ExerciseInfo>
                    <ExerciseInfoContent>
                      <ExerciseTitle $completed={isCompleted}>
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
                    </ExerciseInfoContent>

                    {/* Mensagem de parabéns e escala de Borg quando terminar - Desktop: dentro do card, Mobile: abaixo */}
                    {isFinished &&
                      !isCompleted &&
                      showBorgScale &&
                      !borgRating && (
                        <ExerciseBorgContainer>
                          <CongratulationsTitle>
                            🎉 Parabéns!
                          </CongratulationsTitle>
                          <BorgScaleContainer>
                            <BorgScaleTitle>
                              Como foi a intensidade?
                            </BorgScaleTitle>
                            <BorgScaleGrid>
                              {/* Primeira linha: 0-4 (6 itens: 0, 0.5, 1, 2, 3, 4) */}
                              <BorgScaleRow $isFirstRow={true}>
                                {borgScaleFirstRow.map((item) => (
                                  <BorgScaleButton
                                    key={item.value}
                                    $selected={false}
                                    $value={item.value}
                                    onClick={() =>
                                      handleBorgRating(exercise, item.value)
                                    }
                                  >
                                    <BorgValue>{item.value}</BorgValue>
                                    {item.label && (
                                      <BorgLabel>{item.label}</BorgLabel>
                                    )}
                                  </BorgScaleButton>
                                ))}
                              </BorgScaleRow>
                              {/* Segunda linha: 5-10 (6 itens: 5, 6, 7, 8, 9, 10) */}
                              <BorgScaleRow $isFirstRow={false}>
                                {borgScaleSecondRow.map((item) => (
                                  <BorgScaleButton
                                    key={item.value}
                                    $selected={false}
                                    $value={item.value}
                                    onClick={() =>
                                      handleBorgRating(exercise, item.value)
                                    }
                                  >
                                    <BorgValue>{item.value}</BorgValue>
                                    {item.label && (
                                      <BorgLabel>{item.label}</BorgLabel>
                                    )}
                                  </BorgScaleButton>
                                ))}
                              </BorgScaleRow>
                            </BorgScaleGrid>
                          </BorgScaleContainer>
                        </ExerciseBorgContainer>
                      )}

                    {/* Mensagem de parabéns para exercícios respiratórios (sem escala) */}
                    {isFinished &&
                      !isCompleted &&
                      exerciseType === "RESPIRATORY" &&
                      borgRating === null && (
                        <ExerciseBorgContainer>
                          <CongratulationsTitle>
                            🎉 Parabéns!
                          </CongratulationsTitle>
                        </ExerciseBorgContainer>
                      )}
                  </ExerciseInfo>
                </ExerciseContent>

                {/* Cronômetro quando iniciado - no meio usando flex */}
                {isStarted && !isFinished && (
                  <TimerDisplay>
                    <Clock size={18} />
                    {formatTime(timeRemaining)}
                  </TimerDisplay>
                )}

                {/* Botões de ação */}
                {!isFinished && (
                  <ExerciseActions>
                    <ViewExerciseButton
                      onClick={() => handleViewExercise(exercise)}
                      data-testid="view-exercise-button"
                    >
                      <Eye size={14} />
                      Ver Exercício
                    </ViewExerciseButton>
                    {isStarted ? (
                      <FinishButton
                        onClick={() => handleFinishExercise(exercise)}
                        data-testid="finish-exercise-button"
                      >
                        <CheckCircle size={14} />
                        Finalizar
                      </FinishButton>
                    ) : (
                      <ExerciseButton
                        onClick={() => handleStartExercise(exercise)}
                        disabled={isCompleted || isCompleting}
                        $completed={isCompleted}
                        data-testid="exercise-button"
                      >
                        <Play size={14} />
                        {isCompleted
                          ? "Concluído"
                          : isCompleting
                          ? "Salvando..."
                          : "Iniciar"}
                      </ExerciseButton>
                    )}
                  </ExerciseActions>
                )}
              </ExerciseCard>
            );
          })
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
