"use client";

import { useMemo, useState } from "react";
import styled from "styled-components";
import { Card } from "../styles";
import DashboardHeader from "../components/DashboardHeader";
import {
  Search,
  Play,
  Clock,
  Target,
  TrendingUp,
  Star,
  Loader2,
  X,
} from "lucide-react";
import { useExercises } from "@/hooks/useExercises";

type Category = "todos" | "respiratorios" | "aerobicos" | "força";

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
  padding: 0.5rem;
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

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  gap: 1rem;
`;

const LoadingText = styled.div`
  color: #64748b;
  font-size: 1rem;
  font-weight: 500;
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  gap: 1rem;
  text-align: center;
`;

const ErrorText = styled.div`
  color: #ef4444;
  font-size: 1rem;
  font-weight: 500;
`;

const RetryButton = styled.button`
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  color: white;
  border: none;
  border-radius: 0.75rem;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
  }
`;

// Modal Styles
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 1.5rem;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.5);
  border: none;
  border-radius: 50%;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  z-index: 10;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.7);
    transform: scale(1.1);
  }
`;

const VideoContainer = styled.div`
  width: 100%;
  height: 300px;
  background: #000;
  border-radius: 1.5rem 1.5rem 0 0;
  overflow: hidden;
  position: relative;
`;

const Video = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const VideoPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  font-size: 1.1rem;
  font-weight: 500;
`;

const ModalBody = styled.div`
  padding: 2rem;
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 1rem 0;
`;

const ModalDescription = styled.p`
  color: #64748b;
  font-size: 1rem;
  line-height: 1.6;
  margin: 0 0 1.5rem 0;
`;

const ExerciseInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const InfoCard = styled.div`
  background: #f8fafc;
  border-radius: 0.75rem;
  padding: 1rem;
  border: 1px solid #e2e8f0;
`;

const InfoLabel = styled.div`
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 500;
  margin-bottom: 0.25rem;
`;

const InfoValue = styled.div`
  font-size: 1rem;
  color: #1e293b;
  font-weight: 600;
`;

const ModalActions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
`;

const ActionButton = styled.button<{ $variant?: "primary" | "secondary" }>`
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;

  ${({ $variant = "primary" }) =>
    $variant === "primary"
      ? `
        background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
        color: white;
        
        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
        }
      `
      : `
        background: #f1f5f9;
        color: #64748b;
        border: 1px solid #e2e8f0;
        
        &:hover {
          background: #e2e8f0;
          transform: translateY(-1px);
        }
      `}
`;

// Função para converter tipo do Supabase para categoria da UI
const mapExerciseTypeToCategory = (type: string): Category => {
  switch (type) {
    case "RESPIRATORY":
      return "respiratorios";
    case "AEROBIC":
      return "aerobicos";
    case "STRENGTH":
      return "força";
    default:
      return "respiratorios";
  }
};

// Função para obter URL de thumbnail baseada no tipo
const getThumbnailUrl = (type: string): string => {
  switch (type) {
    case "RESPIRATORY":
      return "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=70";
    case "AEROBIC":
      return "https://images.unsplash.com/photo-1536012441664-1428b1b08083?w=800&q=70";
    case "STRENGTH":
      return "https://images.unsplash.com/photo-1509395176047-4a66953fd231?w=800&q=70";
    default:
      return "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=70";
  }
};

interface ExerciseWithCategory {
  id: number;
  name: string;
  description?: string;
  type: string;
  videoUrl?: string;
  category: Category;
  thumbnailUrl: string;
}

export default function ExercisesPage() {
  const [category, setCategory] = useState<Category>("todos");
  const [query, setQuery] = useState("");
  const [selectedExercise, setSelectedExercise] =
    useState<ExerciseWithCategory | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Buscar exercícios do banco de dados
  const { exercises, loading, error, refetch } = useExercises();

  // Converter exercícios do Supabase para formato da UI
  const allExercises = useMemo(() => {
    return exercises.map((exercise) => ({
      ...exercise,
      category: mapExerciseTypeToCategory(exercise.type),
      thumbnailUrl: getThumbnailUrl(exercise.type),
    }));
  }, [exercises]);

  const filtered = useMemo(() => {
    const byCategory =
      category === "todos"
        ? allExercises
        : allExercises.filter((e) => e.category === category);

    if (!query.trim()) return byCategory;
    const q = query.trim().toLowerCase();
    return byCategory.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        (e.description && e.description.toLowerCase().includes(q))
    );
  }, [allExercises, category, query]);

  const handleOpenModal = (exercise: ExerciseWithCategory) => {
    setSelectedExercise(exercise);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedExercise(null);
    setIsModalOpen(false);
  };

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
              $active={category === "todos"}
              onClick={() => setCategory("todos")}
            >
              <Star size={16} />
              Todos
            </Tab>
            <Tab
              $active={category === "respiratorios"}
              onClick={() => setCategory("respiratorios")}
            >
              <Target size={16} />
              Respiratórios
            </Tab>
            <Tab
              $active={category === "força"}
              onClick={() => setCategory("força")}
            >
              <Target size={16} />
              Força
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
            {loading ? (
              <LoadingContainer>
                <Loader2 size={48} className="animate-spin" color="#3b82f6" />
                <LoadingText>Carregando exercícios...</LoadingText>
              </LoadingContainer>
            ) : error ? (
              <ErrorContainer>
                <ErrorText>Erro ao carregar exercícios: {error}</ErrorText>
                <RetryButton onClick={refetch}>Tentar Novamente</RetryButton>
              </ErrorContainer>
            ) : filtered.length === 0 ? (
              <ErrorContainer>
                <ErrorText>
                  {query.trim()
                    ? `Nenhum exercício encontrado para "${query}"`
                    : `Nenhum exercício disponível na categoria ${category}`}
                </ErrorText>
                {query.trim() && (
                  <RetryButton onClick={() => setQuery("")}>
                    Limpar Busca
                  </RetryButton>
                )}
              </ErrorContainer>
            ) : (
              <ExercisesGrid>
                {filtered.map((ex) => (
                  <ExerciseCard key={ex.id} onClick={() => handleOpenModal(ex)}>
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
                            : ex.category === "força"
                            ? "Força"
                            : "Aeróbico"}
                        </CategoryBadge>
                      </CardHeader>
                      <CardDescription>
                        {ex.description || "Descrição não disponível"}
                      </CardDescription>
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
                      </CardFooter>
                      <StartButton>
                        <Play size={16} />
                        Ver Detalhes
                      </StartButton>
                    </CardContent>
                  </ExerciseCard>
                ))}
              </ExercisesGrid>
            )}
          </ScrollArea>
        </Card>
      </PageContainer>

      {/* Modal de Detalhes do Exercício */}
      {isModalOpen && selectedExercise && (
        <ModalOverlay onClick={handleCloseModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <CloseButton onClick={handleCloseModal}>
              <X size={20} />
            </CloseButton>

            <VideoContainer>
              {selectedExercise.videoUrl ? (
                <Video controls poster={selectedExercise.thumbnailUrl}>
                  <source src={selectedExercise.videoUrl} type="video/mp4" />
                  Seu navegador não suporta vídeos HTML5.
                </Video>
              ) : (
                <VideoPlaceholder>
                  <div style={{ textAlign: "center" }}>
                    <Play
                      size={48}
                      color="#94a3b8"
                      style={{ marginBottom: "1rem" }}
                    />
                    <div>Vídeo não disponível</div>
                  </div>
                </VideoPlaceholder>
              )}
            </VideoContainer>

            <ModalBody>
              <ModalTitle>{selectedExercise.name}</ModalTitle>

              <ModalDescription>
                {selectedExercise.description ||
                  "Descrição não disponível para este exercício."}
              </ModalDescription>

              <ExerciseInfo>
                <InfoCard>
                  <InfoLabel>Tipo</InfoLabel>
                  <InfoValue>
                    {selectedExercise.category === "respiratorios"
                      ? "Respiratório"
                      : selectedExercise.category === "força"
                      ? "Força"
                      : "Aeróbico"}
                  </InfoValue>
                </InfoCard>

                <InfoCard>
                  <InfoLabel>Duração</InfoLabel>
                  <InfoValue>15 minutos</InfoValue>
                </InfoCard>

                <InfoCard>
                  <InfoLabel>Nível</InfoLabel>
                  <InfoValue>Intermediário</InfoValue>
                </InfoCard>

                <InfoCard>
                  <InfoLabel>ID do Exercício</InfoLabel>
                  <InfoValue>#{selectedExercise.id}</InfoValue>
                </InfoCard>
              </ExerciseInfo>

              <ModalActions>
                <ActionButton $variant="secondary" onClick={handleCloseModal}>
                  Fechar
                </ActionButton>
                <ActionButton
                  $variant="primary"
                  onClick={() => {
                    // Aqui você pode implementar a lógica para iniciar o exercício
                    console.log("Iniciar exercício:", selectedExercise.name);
                    handleCloseModal();
                  }}
                >
                  <Play size={16} style={{ marginRight: "0.5rem" }} />
                  Iniciar Exercício
                </ActionButton>
              </ModalActions>
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
}
