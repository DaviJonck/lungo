"use client";

import { useMemo, useState } from "react";
import styled from "styled-components";
import { Card } from "../styles";
import DashboardHeader from "../components/DashboardHeader";
import { Search, Play, Clock, Target, TrendingUp, Star } from "lucide-react";

type Category = "respiratorios" | "aerobicos";

type Exercise = {
  id: string;
  name: string;
  description: string;
  category: Category;
  videoUrl?: string;
  thumbnailUrl?: string;
};

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 0 1rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    gap: 1rem;
    padding: 0 0.5rem;
  }
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  padding: 2rem;
  border-radius: 1.5rem;
  border: 1px solid rgba(59, 130, 246, 0.1);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 1.5rem;
    gap: 1rem;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 1rem;
    border-radius: 1rem;
  }
`;

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
`;

const StatCard = styled.div`
  background: white;
  border-radius: 1rem;
  border: 1px solid rgba(59, 130, 246, 0.1);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  gap: 1rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 0.5rem;
    gap: 0.75rem;
  }
`;

const StatIcon = styled.div`
  width: 3rem;
  height: 3rem;
  border-radius: 0.75rem;
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 2.5rem;
    height: 2.5rem;
  }
`;

const StatContent = styled.div`
  flex: 1;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 800;
  color: #1e293b;
  line-height: 1;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 1.25rem;
  }
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 500;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 0.75rem;
  }
`;

const FiltersRow = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
  }
`;

const Tab = styled.button<{ $active?: boolean }>`
  border: 2px solid ${({ $active }) => ($active ? "#3b82f6" : "#e2e8f0")};
  background: ${({ $active }) =>
    $active ? "linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)" : "#fff"};
  color: ${({ $active }) => ($active ? "#fff" : "#475569")};
  padding: 0.75rem 1.5rem;
  border-radius: 1rem;
  font-weight: 600;
  cursor: pointer;
  font-family: ${({ theme }) => theme.fonts.primary};
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: ${({ $active }) =>
    $active
      ? "0 4px 14px rgba(59, 130, 246, 0.3)"
      : "0 2px 4px rgba(0, 0, 0, 0.05)"};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 0.625rem 1.25rem;
    font-size: 0.875rem;
    justify-content: center;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ $active }) =>
      $active
        ? "0 6px 20px rgba(59, 130, 246, 0.4)"
        : "0 4px 12px rgba(0, 0, 0, 0.1)"};
  }
`;

const SearchContainer = styled.div`
  position: relative;
  flex: 1;
  min-width: 300px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    min-width: auto;
    width: 100%;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  border: 2px solid #e2e8f0;
  border-radius: 1rem;
  padding: 0.75rem 1rem 0.75rem 3rem;
  font-size: 1rem;
  outline: none;
  transition: all 0.3s ease;
  font-family: ${({ theme }) => theme.fonts.primary};
  background: white;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 0.625rem 1rem 0.625rem 2.5rem;
    font-size: 0.875rem;
  }

  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  pointer-events: none;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    left: 0.75rem;
  }
`;

const ExercisesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
  padding: 1rem 0;
  align-items: stretch;

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

const ExerciseCard = styled.div`
  background: white;
  border-radius: 1.5rem;
  overflow: hidden;
  border: 1px solid rgba(59, 130, 246, 0.1);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    border-radius: 1rem;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
      0 10px 10px -5px rgba(0, 0, 0, 0.04);
  }
`;

const CardImage = styled.div<{ $src?: string }>`
  width: 100%;
  height: 200px;
  background: ${({ $src }) =>
    $src
      ? `url(${$src}) center/cover no-repeat`
      : "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)"};
  position: relative;
  overflow: hidden;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    height: 150px;
  }

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
      135deg,
      rgba(0, 0, 0, 0.1) 0%,
      rgba(0, 0, 0, 0.3) 100%
    );
  }
`;

const PlayButton = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.2);

  &:hover {
    background: white;
    transform: translate(-50%, -50%) scale(1.1);
  }
`;

const PlayIcon = styled.div`
  width: 0;
  height: 0;
  border-left: 1rem solid #3b82f6;
  border-top: 0.6rem solid transparent;
  border-bottom: 0.6rem solid transparent;
  margin-left: 0.2rem;
`;

const CardContent = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex: 1;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 1rem;
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin-bottom: 0.75rem;
  }
`;

const CardTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  line-height: 1.3;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 1.125rem;
  }
`;

const CategoryBadge = styled.div<{ $category: Category }>`
  padding: 0.25rem 0.75rem;
  border-radius: 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: ${({ $category }) =>
    $category === "respiratorios"
      ? "linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)"
      : "linear-gradient(135deg, #10b981 0%, #059669 100%)"};
  color: white;
  margin-left: auto;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 0.625rem;
    padding: 0.2rem 0.5rem;
  }
`;

const CardDescription = styled.p`
  color: #64748b;
  font-size: 0.875rem;
  line-height: 1.5;
  margin: 0 0 1.5rem 0;
  flex: 1;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 0.8rem;
    margin: 0 0 1rem 0;
  }
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1.5rem;
  border-top: 1px solid #f1f5f9;
  margin-top: auto;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding-top: 1rem;
  }
`;

const ExerciseStats = styled.div`
  display: flex;
  gap: 1rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    gap: 0.75rem;
  }
`;

const Stat = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #64748b;
  font-size: 0.875rem;
  font-weight: 500;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 0.75rem;
    gap: 0.25rem;
  }
`;

const StartButton = styled.button`
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  color: white;
  border: none;
  border-radius: 0.75rem;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 15px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 0.625rem 1.25rem;
    font-size: 0.875rem;
    margin-top: 10px;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
  }
`;

const ScrollArea = styled.div`
  max-height: calc(100vh - 300px);
  overflow-y: auto;
  padding: 1rem 0;
  -webkit-overflow-scrolling: touch;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    max-height: calc(100vh - 350px);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    max-height: calc(100vh - 400px);
    padding: 0.5rem 0;
  }
`;

export default function ExercisesPage() {
  const [category, setCategory] = useState<Category>("respiratorios");
  const [query, setQuery] = useState("");
  const allExercises: Exercise[] = useMemo(
    () => [
      {
        id: "f1",
        name: "Respiração Diafragmática",
        description:
          "Fortalece o músculo diafragma e melhora a ventilação pulmonar.",
        category: "respiratorios",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=70",
      },
      {
        id: "f2",
        name: "Exercícios de Tosse Dirigida",
        description:
          "Técnicas para facilitar a expectoração e limpeza das vias aéreas.",
        category: "respiratorios",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=70",
      },
      {
        id: "f3",
        name: "Respiração Labial",
        description: "Controla o fluxo expiratório e melhora a troca gasosa.",
        category: "respiratorios",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=70",
      },
      {
        id: "f4",
        name: "Exercícios de Expansão Torácica",
        description:
          "Aumenta a mobilidade da caixa torácica e capacidade pulmonar.",
        category: "respiratorios",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=70",
      },
      {
        id: "f5",
        name: "Drenagem Postural",
        description:
          "Facilita a drenagem de secreções por meio de posicionamento.",
        category: "respiratorios",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=70",
      },
      {
        id: "f6",
        name: "Exercícios de Ventilação Dirigida",
        description: "Melhora a distribuição do ar nos pulmões.",
        category: "respiratorios",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=70",
      },
      {
        id: "f7",
        name: "Respiração com Resistência",
        description:
          "Fortalece os músculos respiratórios com carga progressiva.",
        category: "respiratorios",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=70",
      },
      {
        id: "f8",
        name: "Exercícios de Relaxamento",
        description:
          "Reduz tensão muscular e melhora a eficiência respiratória.",
        category: "respiratorios",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=70",
      },
      {
        id: "a1",
        name: "Caminhada Terapêutica",
        description:
          "Atividade aeróbica de baixo impacto para reabilitação pulmonar.",
        category: "aerobicos",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1536012441664-1428b1b08083?w=800&q=70",
      },
      {
        id: "a2",
        name: "Ciclismo Estacionário",
        description:
          "Melhora resistência cardiorrespiratória com baixo impacto.",
        category: "aerobicos",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1509395176047-4a66953fd231?w=800&q=70",
      },
      {
        id: "a3",
        name: "Subida de Escadas Controlada",
        description: "Aumenta condicionamento cardiovascular e força muscular.",
        category: "aerobicos",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1520975954732-35dd22a55801?w=800&q=70",
      },
      {
        id: "a4",
        name: "Exercícios de Coordenação",
        description: "Combina movimento com respiração para melhor eficiência.",
        category: "aerobicos",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1596357395104-5b5d89b2c541?w=800&q=70",
      },
      {
        id: "a5",
        name: "Hidroterapia",
        description: "Exercícios aquáticos para reabilitação pulmonar.",
        category: "aerobicos",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1536012441664-1428b1b08083?w=800&q=70",
      },
      {
        id: "a6",
        name: "Treinamento Intervalado",
        description:
          "Alterna períodos de esforço e recuperação para condicionamento.",
        category: "aerobicos",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1509395176047-4a66953fd231?w=800&q=70",
      },
    ],
    []
  );

  const filtered = useMemo(() => {
    const byCategory = allExercises.filter((e) => e.category === category);
    if (!query.trim()) return byCategory;
    const q = query.trim().toLowerCase();
    return byCategory.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q)
    );
  }, [allExercises, category, query]);

  return (
    <>
      <DashboardHeader title="Exercícios" />
      <PageContainer>
        <Header>
          <StatsRow>
            <StatCard>
              <StatIcon>
                <Target size={20} />
              </StatIcon>
              <StatContent>
                <StatValue>{filtered.length}</StatValue>
                <StatLabel>Exercícios Disponíveis</StatLabel>
              </StatContent>
            </StatCard>
            <StatCard>
              <StatIcon>
                <TrendingUp size={20} />
              </StatIcon>
              <StatContent>
                <StatValue>12</StatValue>
                <StatLabel>Completados Esta Semana</StatLabel>
              </StatContent>
            </StatCard>
            <StatCard>
              <StatIcon>
                <Star size={20} />
              </StatIcon>
              <StatContent>
                <StatValue>4.8</StatValue>
                <StatLabel>Avaliação Média</StatLabel>
              </StatContent>
            </StatCard>
          </StatsRow>

          <FiltersRow>
            <Tab
              $active={category === "respiratorios"}
              onClick={() => setCategory("respiratorios")}
            >
              <Target size={16} />
              Respiratórios
            </Tab>
            <Tab
              $active={category === "aerobicos"}
              onClick={() => setCategory("aerobicos")}
            >
              <TrendingUp size={16} />
              Aeróbicos
            </Tab>
            <SearchContainer>
              <SearchIcon>
                <Search size={20} />
              </SearchIcon>
              <SearchInput
                placeholder="Pesquisar exercícios..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </SearchContainer>
          </FiltersRow>
        </Header>

        <Card>
          <ScrollArea>
            <ExercisesGrid>
              {filtered.map((ex) => (
                <ExerciseCard key={ex.id}>
                  <CardImage $src={ex.thumbnailUrl}>
                    <PlayButton>
                      <PlayIcon />
                    </PlayButton>
                  </CardImage>
                  <CardContent>
                    <CardHeader>
                      <CardTitle>{ex.name}</CardTitle>
                      <CategoryBadge $category={ex.category}>
                        {ex.category === "respiratorios"
                          ? "Respiratório"
                          : "Aeróbico"}
                      </CategoryBadge>
                    </CardHeader>
                    <CardDescription>{ex.description}</CardDescription>
                    <CardFooter>
                      <ExerciseStats>
                        <Stat>
                          <Clock size={16} />
                          15 min
                        </Stat>
                        <Stat>
                          <Target size={16} />
                          Intermediário
                        </Stat>
                      </ExerciseStats>
                    </CardFooter>{" "}
                    <StartButton>
                      <Play size={16} />
                      Iniciar
                    </StartButton>
                  </CardContent>
                </ExerciseCard>
              ))}
            </ExercisesGrid>
          </ScrollArea>
        </Card>
      </PageContainer>
    </>
  );
}
