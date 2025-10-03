"use client";

import { useMemo, useState } from "react";
import styled from "styled-components";
import { Card } from "../styles";
import DashboardHeader from "../components/DashboardHeader";

type Category = "forca" | "aerobico";

type Exercise = {
  id: string;
  name: string;
  description: string;
  category: Category;
  videoUrl?: string;
  thumbnailUrl?: string;
};

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const FiltersRow = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 16px;
`;

const Tab = styled.button<{ $active?: boolean }>`
  border: 1px solid ${({ $active }) => ($active ? "#2a7ea5" : "#e5e7eb")};
  background: ${({ $active }) => ($active ? "#e0f2fe" : "#fff")};
  color: ${({ $active }) => ($active ? "#075985" : "#334155")};
  padding: 8px 14px;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
  font-family: ${({ theme }) => theme.fonts.primary};
`;

const SearchInput = styled.input`
  flex: 1;
  min-width: 220px;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s ease;
  font-family: ${({ theme }) => theme.fonts.primary};
  &:focus {
    border-color: #2a7ea5;
    box-shadow: 0 0 0 3px rgba(42, 126, 165, 0.1);
  }
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 10px;
  padding: 5px;
`;

const ScrollArea = styled.div`
  max-height: calc(100vh - 250px);
  overflow-y: auto;
  padding-bottom: 20px;
  -webkit-overflow-scrolling: touch;
  padding-right: 15px; /* espaço para não cortar sombra da barra */
  overflow-x: hidden;
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    max-height: calc(100vh - 290px);
  }
`;

const Item = styled.li`
  border: 1px solid #e5e7eb;
  background: #fff;
  border-radius: 12px;
  padding: 8px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Thumb = styled.div<{ $src?: string }>`
  width: 120px;
  height: 68px;
  border-radius: 10px;
  background: ${({ $src }) =>
    $src ? `url(${$src}) center/cover no-repeat` : "#f1f5f9"};
  border: 1px solid #e5e7eb;
  flex-shrink: 0;
  position: relative;

  &:before {
    content: "";
    position: absolute;
    inset: 0;
    background: radial-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.15));
    border-radius: 10px;
  }
`;

const PlayBadge = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
`;

const PlayTriangle = styled.div`
  width: 0;
  height: 0;
  border-left: 12px solid #ffffff;
  border-top: 8px solid transparent;
  border-bottom: 8px solid transparent;
  margin-left: 2px; /* centraliza visualmente dentro do círculo */
`;

const ItemBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
`;

const ItemName = styled.div`
  font-weight: 800;
  color: #1c2b2d;
`;

const ItemDesc = styled.div`
  font-size: 13px;
  color: #475569;
`;

export default function ExercisesPage() {
  const [category, setCategory] = useState<Category>("forca");
  const [query, setQuery] = useState("");
  const allExercises: Exercise[] = useMemo(
    () => [
      {
        id: "f1",
        name: "Agachamento",
        description: "Fortalece pernas e glúteos.",
        category: "forca",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=70",
      },
      {
        id: "f2",
        name: "Flexão de braço",
        description: "Trabalha peitoral, tríceps e core.",
        category: "forca",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1599050751707-9f0b7b3b046d?w=800&q=70",
      },
      {
        id: "f7",
        name: "Flexão de braço",
        description: "Trabalha peitoral, tríceps e core.",
        category: "forca",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1599050751707-9f0b7b3b046d?w=800&q=70",
      },
      {
        id: "f8",
        name: "Flexão de braço",
        description: "Trabalha peitoral, tríceps e core.",
        category: "forca",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1599050751707-9f0b7b3b046d?w=800&q=70",
      },
      {
        id: "f9",
        name: "Flexão de braço",
        description: "Trabalha peitoral, tríceps e core.",
        category: "forca",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1599050751707-9f0b7b3b046d?w=800&q=70",
      },
      {
        id: "f0",
        name: "Flexão de braço",
        description: "Trabalha peitoral, tríceps e core.",
        category: "forca",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1599050751707-9f0b7b3b046d?w=800&q=70",
      },
      {
        id: "f99",
        name: "Flexão de braço",
        description: "Trabalha peitoral, tríceps e core.",
        category: "forca",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1599050751707-9f0b7b3b046d?w=800&q=70",
      },
      {
        id: "f3",
        name: "Remada elástica",
        description: "Fortalece costas e ombros.",
        category: "forca",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1517963628607-235ccdd5476c?w=800&q=70",
      },
      {
        id: "f4",
        name: "Elevação de panturrilha",
        description: "Foco em panturrilhas.",
        category: "forca",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=800&q=70",
      },
      {
        id: "a1",
        name: "Caminhada",
        description: "Atividade aeróbica de baixo impacto.",
        category: "aerobico",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1536012441664-1428b1b08083?w=800&q=70",
      },
      {
        id: "a2",
        name: "Ciclismo leve",
        description: "Melhora resistência cardiorrespiratória.",
        category: "aerobico",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1509395176047-4a66953fd231?w=800&q=70",
      },
      {
        id: "a3",
        name: "Subir escadas",
        description: "Aumenta condicionamento e força de pernas.",
        category: "aerobico",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1520975954732-35dd22a55801?w=800&q=70",
      },
      {
        id: "a4",
        name: "Polichinelo controlado",
        description: "Ativação aeróbica moderada.",
        category: "aerobico",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1596357395104-5b5d89b2c541?w=800&q=70",
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
      <Card>
        <Header>
          <FiltersRow>
            <Tab
              $active={category === "forca"}
              onClick={() => setCategory("forca")}
            >
              Força
            </Tab>
            <Tab
              $active={category === "aerobico"}
              onClick={() => setCategory("aerobico")}
            >
              Aeróbico
            </Tab>
            <SearchInput
              placeholder="Pesquisar por nome ou descrição..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </FiltersRow>
        </Header>
        <ScrollArea>
          <List>
            {filtered.map((ex) => (
              <Item key={ex.id}>
                <Thumb $src={ex.thumbnailUrl}>
                  <PlayBadge>
                    <PlayTriangle />
                  </PlayBadge>
                </Thumb>
                <ItemBody>
                  <ItemName>{ex.name}</ItemName>
                  <ItemDesc>{ex.description}</ItemDesc>
                </ItemBody>
              </Item>
            ))}
          </List>
        </ScrollArea>
      </Card>
    </>
  );
}
