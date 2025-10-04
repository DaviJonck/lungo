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
import AirQualityCard from "./AirQualityCard";

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
  // Log userData para debug (remove warning)
  console.log("User data in RemindersAndActivities:", userData);

  // Planos mockados (Iniciante, Médio, Avançado)
  type Exercise = {
    id: string;
    title: string;
    duration: string;
    tasks: string[];
    videoUrl?: string;
    dataCollectionType: "A" | "B" | "C";
  };
  type DayPlan = Exercise[];
  type Plan = { name: "Iniciante" | "Médio" | "Avançado"; week: DayPlan[] };

  const plans: Plan[] = useMemo(
    () => [
      {
        name: "Iniciante",
        week: Array.from({ length: 7 }).map((_d, i) => [
          {
            id: `i${i}1`,
            title: "Respiração diafragmática",
            duration: "8 min",
            tasks: ["Medir frequência cardíaca a cada 2 minutos"],
            dataCollectionType: "A" as const,
          },
          {
            id: `i${i}2`,
            title: "Caminhada leve",
            duration: "12 min",
            tasks: ["Medir frequência cardíaca a cada 3 minutos"],
            dataCollectionType: "A" as const,
          },
          {
            id: `i${i}3`,
            title: "Alongamento peitoral",
            duration: "5 min",
            tasks: ["Respirar profundamente durante o alongamento"],
            dataCollectionType: "B" as const,
          },
          {
            id: `i${i}4`,
            title: "Hidratação",
            duration: "1 copo",
            tasks: [
              "Beber 1 copo de água",
              "Anotar a quantidade ingerida",
              "Verificar se há sede excessiva",
            ],
            dataCollectionType: "B" as const,
          },
        ]),
      },
      {
        name: "Médio",
        week: Array.from({ length: 7 }).map((_d, i) => [
          {
            id: `m${i}1`,
            title: "Respiração com lábios semicerrados",
            duration: "10 min",
            tasks: [
              "Inspirar pelo nariz por 2 segundos",
              "Expirar pelos lábios semicerrados por 4 segundos",
              "Manter ritmo constante",
              "Medir frequência cardíaca a cada 2 minutos",
              "Verificar saturação de oxigênio",
            ],
            dataCollectionType: "A" as const,
          },
          {
            id: `m${i}2`,
            title: "Caminhada moderada",
            duration: "18 min",
            tasks: [
              "Caminhar em ritmo moderado",
              "Manter frequência cardíaca entre 100-120 bpm",
              "Medir frequência cardíaca a cada 3 minutos",
              "Verificar saturação de oxigênio",
            ],
            dataCollectionType: "A" as const,
          },
          {
            id: `m${i}3`,
            title: "Fortalecimento tronco",
            duration: "8 min",
            tasks: [
              "Exercícios de fortalecimento do core",
              "Manter postura correta",
              "Respirar durante os exercícios",
              "Medir frequência cardíaca",
            ],
            dataCollectionType: "B" as const,
          },
          {
            id: `m${i}4`,
            title: "Alongamento",
            duration: "5 min",
            tasks: [
              "Alongar todos os grupos musculares",
              "Manter cada posição por 30 segundos",
              "Respirar profundamente",
              "Anotar sensações",
            ],
            dataCollectionType: "B" as const,
          },
        ]),
      },
      {
        name: "Avançado",
        week: Array.from({ length: 7 }).map((_d, i) => [
          {
            id: `a${i}1`,
            title: "Respiração controlada",
            duration: "12 min",
            tasks: [
              "Técnica de respiração avançada",
              "Controle total do ritmo respiratório",
              "Medir frequência cardíaca a cada 2 minutos",
              "Verificar saturação de oxigênio",
              "Anotar pressão arterial",
            ],
            dataCollectionType: "A" as const,
          },
          {
            id: `a${i}2`,
            title: "Caminhada rápida",
            duration: "25 min",
            tasks: [
              "Caminhar em ritmo acelerado",
              "Manter frequência cardíaca entre 120-140 bpm",
              "Medir frequência cardíaca a cada 3 minutos",
              "Verificar saturação de oxigênio",
              "Anotar pressão arterial",
            ],
            dataCollectionType: "C" as const,
          },
          {
            id: `a${i}3`,
            title: "Circuito funcional",
            duration: "10 min",
            tasks: [
              "Exercícios funcionais variados",
              "Manter intensidade moderada-alta",
              "Medir frequência cardíaca a cada 2 minutos",
              "Verificar saturação de oxigênio",
              "Anotar pressão arterial",
            ],
            dataCollectionType: "A" as const,
          },
          {
            id: `a${i}4`,
            title: "Alongamento avançado",
            duration: "6 min",
            tasks: [
              "Alongamentos profundos",
              "Técnicas de relaxamento",
              "Respiração controlada",
              "Anotar sensações e bem-estar",
            ],
            dataCollectionType: "B" as const,
          },
        ]),
      },
    ],
    []
  );

  const [selectedPlanIndex, setSelectedPlanIndex] = useState(0);
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [toast, setToast] = useState<string | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const todayIndex = useMemo(() => new Date().getDay() % 7, []);
  const todayExercises = plans[selectedPlanIndex].week[todayIndex];

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
        <div style={{ fontWeight: 700, marginBottom: 8 }}>
          Atividades do Dia
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          {plans.map((p, idx) => (
            <button
              key={p.name}
              onClick={() => setSelectedPlanIndex(idx)}
              style={{
                padding: "6px 10px",
                borderRadius: 8,
                border: "1px solid #e5e7eb",
                background: idx === selectedPlanIndex ? "#e0f2fe" : "#fff",
                color: "#075985",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {p.name}
            </button>
          ))}
        </div>

        <div style={{ opacity: 0.7, fontSize: 12, marginBottom: 8 }}>
          Plano: {plans[selectedPlanIndex].name} • Dia {todayIndex + 1}
        </div>

        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            display: "grid",
            gap: 10,
          }}
        >
          {todayExercises.map((ex) => (
            <li
              key={ex.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                border: "1px solid #e5e7eb",
                borderRadius: 10,
                padding: "10px 12px",
                background: completed[ex.id] ? "#f0f9ff" : "#fff",
              }}
            >
              <div>
                <div
                  style={{
                    fontWeight: 700,
                    color: completed[ex.id] ? "#059669" : "#1c2b2d",
                  }}
                >
                  {ex.title}
                </div>
                <div style={{ fontSize: 12, opacity: 0.75 }}>
                  Duração: {ex.duration}
                </div>
              </div>
              <button
                onClick={() => handleStartExercise(ex)}
                disabled={completed[ex.id]}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 16px",
                  borderRadius: 8,
                  border: "none",
                  background: completed[ex.id]
                    ? "#10b981"
                    : "linear-gradient(135deg, #2a7ea5 0%, #1ea1a1 100%)",
                  color: "white",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: completed[ex.id] ? "default" : "pointer",
                  opacity: completed[ex.id] ? 0.8 : 1,
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  if (!completed[ex.id]) {
                    e.currentTarget.style.transform = "translateY(-1px)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 12px rgba(42, 126, 165, 0.3)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!completed[ex.id]) {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }
                }}
              >
                <Play size={16} />
                {completed[ex.id] ? "Concluído" : "Iniciar"}
              </button>
            </li>
          ))}
        </ul>

        {toast && (
          <div
            aria-live="polite"
            style={{
              position: "fixed",
              right: 20,
              top: 20,
              background: "#16a34a",
              color: "#fff",
              padding: "10px 14px",
              borderRadius: 8,
              boxShadow: "0 10px 20px rgba(0,0,0,0.15)",
              zIndex: 100,
              fontWeight: 700,
            }}
          >
            {toast}
          </div>
        )}

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
        <div style={{ fontWeight: 700, marginBottom: 8 }}>Lembretes</div>
        <div style={{ opacity: 0.75, fontSize: 14 }}>Realizar Salbutamol</div>
        <div style={{ opacity: 0.75, fontSize: 14 }}>
          Realizar Predinisolona
        </div>
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

      {/* Card de Qualidade do Ar */}
      <AirQualityCard />
    </>
  );
}
