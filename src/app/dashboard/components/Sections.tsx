import {
  Card,
  CardsGrid,
  GridTwoThirds,
  IconCircle,
  InfoRow,
  InfoTable,
  MetricCard,
  Motivation,
  NextExerciseCard,
  ProgressBar,
  ProgressTrack,
  StatCard,
  TwoCol,
  HeroCard,
} from "../styles";
import { Heart, Wind, Activity, Cloud } from "lucide-react";

export function SummaryCards() {
  return (
    <>
      <HeroCard>
        <div style={{ fontSize: 22, fontWeight: 800 }}>Olá, João!</div>
        <div style={{ opacity: 0.95 }}>Como você está se sentindo hoje?</div>
        <div style={{ fontSize: 12, opacity: 0.95, marginTop: 8 }}>
          Progresso Semanal
        </div>
        <ProgressTrack>
          <ProgressBar value={62} />
        </ProgressTrack>
        <div style={{ fontSize: 12 }}>
          3 de 5 sessões completas esta semana 🎉
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

export function RemindersAndActivities() {
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

export function Infographics() {
  return (
    <>
      <GridTwoThirds>
        <InfoTable>
          <div style={{ fontWeight: 800, marginBottom: 8 }}>
            Informações do Paciente
          </div>
          <InfoRow>
            <div>Nome Completo</div>
            <div>João Silva Santos</div>
          </InfoRow>
          <InfoRow>
            <div>Condição</div>
            <div>DPOC (Doença Pulmonar Obstrutiva Crônica)</div>
          </InfoRow>
          <InfoRow>
            <div>Data do Diagnóstico</div>
            <div>15/03/2023</div>
          </InfoRow>
          <InfoRow>
            <div>Tempo de Tratamento</div>
            <div>1 ano e 10 meses</div>
          </InfoRow>
        </InfoTable>
        <div>
          <NextExerciseCard>
            <div style={{ fontWeight: 800, marginBottom: 8 }}>
              Próximo Exercício
            </div>
            <div>Hoje às 15:00</div>
            <div style={{ fontWeight: 700, marginTop: 6 }}>
              Exercícios Respiratórios
            </div>
            <div style={{ opacity: 0.8 }}>Duração: 20 minutos</div>
            <Motivation>
              Frase Motivacional
              <br />
              &quot;Cada respiração é um passo em direção à sua
              recuperação&quot; 💪
            </Motivation>
          </NextExerciseCard>
        </div>
      </GridTwoThirds>
    </>
  );
}
