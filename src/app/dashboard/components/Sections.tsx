import {
  Card,
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
import { Heart, Wind, Activity, Cloud } from "lucide-react";
import { useMemo, useState } from "react";
import { UserData } from "@/hooks/useUserData";

interface SectionsProps {
  userData?: UserData | null;
}

export function SummaryCards({ userData }: SectionsProps) {
  // Gerar saudação personalizada baseada na condição

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
            <div style={{ fontSize: 24, fontWeight: 800 }}>Boa</div>
            <div style={{ fontSize: 12, color: "#2aa55f" }}>
              Ideal para exercícios
            </div>
          </div>
        </MetricCard>
      </CardsGrid>
    </>
  );
}

export function RemindersAndActivities({ userData }: SectionsProps) {
  // Planos mockados (Iniciante, Médio, Avançado)
  type Exercise = { id: string; title: string; duration: string };
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
          },
          { id: `i${i}2`, title: "Caminhada leve", duration: "12 min" },
          { id: `i${i}3`, title: "Alongamento peitoral", duration: "5 min" },
          { id: `i${i}4`, title: "Hidratação", duration: "1 copo" },
        ]),
      },
      {
        name: "Médio",
        week: Array.from({ length: 7 }).map((_d, i) => [
          {
            id: `m${i}1`,
            title: "Respiração com lábios semicerrados",
            duration: "10 min",
          },
          { id: `m${i}2`, title: "Caminhada moderada", duration: "18 min" },
          { id: `m${i}3`, title: "Fortalecimento tronco", duration: "8 min" },
          { id: `m${i}4`, title: "Alongamento", duration: "5 min" },
        ]),
      },
      {
        name: "Avançado",
        week: Array.from({ length: 7 }).map((_d, i) => [
          { id: `a${i}1`, title: "Respiração controlada", duration: "12 min" },
          { id: `a${i}2`, title: "Caminhada rápida", duration: "25 min" },
          { id: `a${i}3`, title: "Circuito funcional", duration: "10 min" },
          { id: `a${i}4`, title: "Alongamento avançado", duration: "6 min" },
        ]),
      },
    ],
    []
  );

  const [selectedPlanIndex, setSelectedPlanIndex] = useState(0);
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [toast, setToast] = useState<string | null>(null);

  const todayIndex = useMemo(() => new Date().getDay() % 7, []);
  const todayExercises = plans[selectedPlanIndex].week[todayIndex];

  const toggleExercise = (ex: Exercise) => {
    setCompleted((prev) => {
      const next = { ...prev, [ex.id]: !prev[ex.id] };
      if (!prev[ex.id]) {
        setToast(`Parabéns! Você concluiu: ${ex.title}`);
        setTimeout(() => setToast(null), 1800);
      }
      return next;
    });
  };

  return (
    <TwoCol>
      <Card>
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
                background: "#fff",
              }}
            >
              <div>
                <div style={{ fontWeight: 700 }}>{ex.title}</div>
                <div style={{ fontSize: 12, opacity: 0.75 }}>
                  Duração: {ex.duration}
                </div>
              </div>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={!!completed[ex.id]}
                  onChange={() => toggleExercise(ex)}
                  style={{
                    width: 22,
                    height: 22,
                    accentColor: "#B9E5E8",
                    cursor: "pointer",
                  }}
                />
                <span style={{ fontSize: 14, fontWeight: 600 }}>
                  {completed[ex.id] ? "Feito" : "Marcar"}
                </span>
              </label>
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
      </Card>
      <Card>
        <div style={{ fontWeight: 700, marginBottom: 8 }}>Lembretes</div>
        <div style={{ opacity: 0.75, fontSize: 14 }}>Realizar Salbutamol</div>
        <div style={{ opacity: 0.75, fontSize: 14 }}>
          Realizar Predinisolona
        </div>
      </Card>
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
