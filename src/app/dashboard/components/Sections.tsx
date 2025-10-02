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
import { UserData } from "@/hooks/useUserData";

interface SectionsProps {
  userData?: UserData | null;
}

export function SummaryCards({ userData }: SectionsProps) {
  // Gerar saudação personalizada baseada na condição
  const getPersonalizedGreeting = () => {
    if (userData?.respiratory_disease) {
      return `Como você está se sentindo hoje?`;
    }
    return "Como você está se sentindo hoje?";
  };

  const getConditionalMessage = () => {
    if (userData?.respiratory_disease === "DPOC") {
      return "Continue com seus exercícios respiratórios! 💪";
    } else if (userData?.respiratory_disease === "Asma") {
      return "Mantenha sua rotina de exercícios! 🌟";
    } else if (userData?.respiratory_disease) {
      return "Sua saúde respiratória é nossa prioridade! ❤️";
    }
    return "Mantenha-se ativo e saudável! 🏃‍♂️";
  };

  return (
    <>
      <HeroCard>
        <div style={{ fontSize: 22, fontWeight: 800 }}>
          Olá, {userData?.name || "Usuário"}!
        </div>
        <div style={{ opacity: 0.95 }}>{getPersonalizedGreeting()}</div>
        {userData?.respiratory_disease && (
          <div
            style={{
              fontSize: 14,
              marginTop: 4,
              color: "#f6f6f6",
            }}
          >
            {getConditionalMessage()}
          </div>
        )}
        <div style={{ fontSize: 12, opacity: 0.95, marginTop: 8 }}>
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
  // userData pode ser usado para personalizar lembretes e atividades
  console.log("User data for reminders:", userData);
  return (
    <TwoCol>
      <Card>
        <div style={{ fontWeight: 700, marginBottom: 8 }}>Lembretes</div>
        <div style={{ opacity: 0.75, fontSize: 14 }}>Realizar Salbutamol</div>
        <div style={{ opacity: 0.75, fontSize: 14 }}>
          Realizar Predinisolona
        </div>
      </Card>
      <Card>
        <div style={{ fontWeight: 700, marginBottom: 8 }}>
          Atividades do Dia
        </div>
        <div style={{ opacity: 0.75, fontSize: 14 }}>Manhã · 2 tarefas</div>
        <div style={{ opacity: 0.75, fontSize: 14 }}>Tarde · 2 tarefas</div>
        <div style={{ opacity: 0.75, fontSize: 14 }}>Noite · 2 tarefas</div>
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
