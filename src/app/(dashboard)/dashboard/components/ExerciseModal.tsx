"use client";

import { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { X, Play, Clock, Heart, Activity } from "lucide-react";
import { usePersistentExercise } from "@/hooks/usePersistentExercise";
import { useResponsive } from "@/hooks/useResponsive";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  overflow: hidden; /* evita scroll do fundo */
  overscroll-behavior: contain; /* impede scroll da página por trás no mobile */
  touch-action: none; /* evita scroll do body em iOS/Android */
`;

const ModalContent = styled.div`
  position: relative;
  background: white;
  border-radius: 24px;
  width: 100%;
  max-width: 800px;
  height: 85vh;
  max-height: 85vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    height: 90vh;
    max-height: 90vh;
    margin: 20px;
    width: calc(100% - 40px);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    height: 95vh;
    max-height: 95vh;
    margin: 10px;
    width: calc(100% - 20px);
    border-radius: 16px;
  }
`;

const MainContent = styled.div`
  padding: 40px;
  display: flex;
  flex-direction: column;
  gap: 32px;
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 20px;
    gap: 20px;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

  &:hover {
    background: rgba(255, 255, 255, 1);
    transform: scale(1.05);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  }
`;

const ExerciseTitle = styled.h2`
  font-size: 32px;
  font-weight: 800;
  color: #1e293b;
  margin: 0;
  text-align: center;
  background: linear-gradient(135deg, #2a7ea5 0%, #1ea1a1 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 24px;
  }
`;

const TaskList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const TaskItem = styled.li`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  font-size: 14px;
  color: #4a5568;
`;

const TaskNumber = styled.span`
  background: #2a7ea5;
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  flex-shrink: 0;
`;

const StartButton = styled.button`
  background: linear-gradient(135deg, #2a7ea5 0%, #1ea1a1 100%);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 16px 24px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease;
  margin-top: auto;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(42, 126, 165, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;

// Removido: VideoContainer não utilizado

const SubmitButton = styled.button`
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  border-radius: 16px;
  padding: 16px 32px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(16, 185, 129, 0.3);
  text-transform: uppercase;
  letter-spacing: 0.5px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(16, 185, 129, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`;

const CountdownContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
  padding: 40px;
  text-align: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    gap: 16px;
    padding: 20px;
  }
`;

const CountdownNumber = styled.div<{ $isActive: boolean }>`
  font-size: 120px;
  font-weight: 900;
  color: ${({ $isActive }) => ($isActive ? "#2a7ea5" : "#e5e7eb")};
  transition: all 0.3s ease;
  transform: ${({ $isActive }) => ($isActive ? "scale(1.2)" : "scale(1)")};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 80px;
    transform: ${({ $isActive }) => ($isActive ? "scale(1.1)" : "scale(1)")};
  }
`;

const TimerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 32px;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border-radius: 20px;
  border: 2px solid #bae6fd;
  box-shadow: 0 8px 32px rgba(14, 165, 233, 0.1);

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    gap: 16px;
    padding: 20px;
    border-radius: 16px;
  }
`;

const TimerDisplay = styled.div`
  font-size: 64px;
  font-weight: 900;
  color: #0ea5e9;
  font-family: "Courier New", monospace;
  text-shadow: 0 2px 4px rgba(14, 165, 233, 0.2);

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 48px;
  }
`;

const DataCollectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const DataInputsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

const DataInputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const DataLabel = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const DataInput = styled.input`
  padding: 12px 16px;
  border: 2px solid #d1d5db;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  text-align: center;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #2a7ea5;
    box-shadow: 0 0 0 3px rgba(42, 126, 165, 0.1);
  }

  &:disabled {
    background: #f3f4f6;
    color: #9ca3af;
  }
`;

const AlertContainer = styled.div`
  background: #fef3c7;
  border: 2px solid #f59e0b;
  border-radius: 8px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #92400e;
  font-weight: 600;
  animation: pulse 1s infinite;
`;

const ObservationsTextarea = styled.textarea`
  padding: 12px 16px;
  border: 2px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  resize: vertical;
  min-height: 80px;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #2a7ea5;
    box-shadow: 0 0 0 3px rgba(42, 126, 165, 0.1);
  }
`;

// Removido para MVP - RecoveryBanner e RecoveryButton

type Exercise = {
  id: string;
  title: string;
  duration: string;
  tasks: string[];
  videoUrl?: string;
  dataCollectionType: "A" | "B" | "C";
};

type ExerciseModalProps = {
  exercise: Exercise | null;
  isOpen: boolean;
  onClose: () => void;
  onComplete: (exerciseId: string, data: Record<string, string>) => void;
};

export default function ExerciseModal({
  exercise,
  isOpen,
  onClose,
  onComplete,
}: ExerciseModalProps) {
  const [countdown, setCountdown] = useState<number | null>(null);
  const [showAlert, setShowAlert] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { isMobile } = useResponsive();

  const { exerciseState, startExercise, updateExerciseState, clearExercise } =
    usePersistentExercise();

  // Configurações por tipo de coleta
  const getDataCollectionConfig = (type: "A" | "B" | "C") => {
    switch (type) {
      case "A":
        return {
          totalTime: 10 * 60, // 10 minutos
          intervalTime: 2 * 60, // 2 minutos
          inputs: 5,
          inputLabels: ["2min", "4min", "6min", "8min", "10min"],
          inputType: "heartRate",
        };
      case "B":
        return {
          totalTime: 6 * 60, // 6 minutos
          intervalTime: 3 * 60, // 3 minutos
          inputs: 2,
          inputLabels: ["3min", "6min"],
          inputType: "oxygenSaturation",
        };
      case "C":
        return {
          totalTime: 20 * 60, // 20 minutos
          intervalTime: 10 * 60, // 10 minutos
          inputs: 4,
          inputLabels: [
            "10min - FC",
            "10min - Sat",
            "20min - FC",
            "20min - Sat",
          ],
          inputType: "mixed",
        };
    }
  };

  const config = exercise
    ? getDataCollectionConfig(exercise.dataCollectionType)
    : null;

  // Verificar se o exercício atual é o mesmo que está em andamento
  const isCurrentExercise = exerciseState?.exerciseId === exercise?.id;

  // Verificar se deve limpar estado quando exercício diferente for aberto
  useEffect(() => {
    if (
      isOpen &&
      exercise &&
      exerciseState &&
      exerciseState.exerciseId !== exercise.id
    ) {
      // Se há um exercício diferente em andamento, limpar o estado
      clearExercise();
    }
  }, [isOpen, exercise, exerciseState, clearExercise]);

  // Contador 3-2-1
  useEffect(() => {
    if (countdown !== null && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && config) {
      startExercise(
        exercise!.id,
        exercise!.dataCollectionType,
        config.totalTime
      );
      setCountdown(null);
    }
  }, [countdown, config, exercise, startExercise]);

  // Timer principal - só funciona para o exercício atual
  useEffect(() => {
    if (
      isCurrentExercise &&
      exerciseState?.isTimerRunning &&
      exerciseState.timeRemaining > 0 &&
      config
    ) {
      timerRef.current = setTimeout(() => {
        const newTimeRemaining = exerciseState.timeRemaining - 1;

        // Verificar se é hora de um intervalo
        const intervalsPassed = Math.floor(
          (config.totalTime - newTimeRemaining) / config.intervalTime
        );

        const updates: Partial<typeof exerciseState> = {
          timeRemaining: newTimeRemaining,
        };

        if (
          intervalsPassed > exerciseState.currentInterval &&
          newTimeRemaining > 0
        ) {
          updates.currentInterval = intervalsPassed;
          setShowAlert(true);
          setTimeout(() => setShowAlert(false), 3000);
        }

        updateExerciseState(updates);
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [
    isCurrentExercise,
    exerciseState?.isTimerRunning,
    exerciseState?.timeRemaining,
    config,
    exerciseState?.currentInterval,
    updateExerciseState,
  ]);

  // Early return após todos os hooks
  if (!isOpen || !exercise) return null;

  const handleStart = () => {
    setCountdown(3);
  };

  // Removido para MVP - funcionalidades de resumo de exercício

  // Removido: controles de pausar/reiniciar timer

  const handleInputChange = (field: string, value: string) => {
    if (isCurrentExercise && exerciseState) {
      updateExerciseState({
        formData: { ...exerciseState.formData, [field]: value },
      });
    }
  };

  const handleSubmit = () => {
    if (isCurrentExercise && exerciseState) {
      onComplete(exercise.id, exerciseState.formData);
      clearExercise();
      onClose();
    }
  };

  const handleClose = () => {
    // Não limpar o estado ao fechar, apenas fechar o modal
    onClose();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const isStarted = isCurrentExercise && exerciseState?.isStarted;

  return (
    <ModalOverlay onClick={handleClose} data-testid="exercise-modal">
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={handleClose}>
          <X size={20} />
        </CloseButton>

        <MainContent>
          <ExerciseTitle>{exercise.title}</ExerciseTitle>

          {countdown !== null ? (
            <CountdownContainer>
              <div
                style={{
                  fontSize: isMobile ? 18 : 24,
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: isMobile ? 16 : 20,
                }}
              >
                Preparando para iniciar...
              </div>
              <CountdownNumber
                $isActive={countdown > 0}
                data-testid="countdown"
              >
                {countdown}
              </CountdownNumber>
            </CountdownContainer>
          ) : !isStarted ? (
            <>
              <div>
                <h3
                  style={{
                    fontSize: isMobile ? 16 : 18,
                    fontWeight: 600,
                    marginBottom: isMobile ? 12 : 16,
                    color: "#374151",
                    textAlign: "center",
                  }}
                >
                  Tarefas do Exercício:
                </h3>
                <TaskList>
                  {exercise.tasks.map((task, index) => (
                    <TaskItem key={index}>
                      <TaskNumber>{index + 1}</TaskNumber>
                      {task}
                    </TaskItem>
                  ))}
                </TaskList>
              </div>

              <StartButton onClick={handleStart}>
                <Play size={20} />
                Iniciar Exercício
              </StartButton>
            </>
          ) : (
            <DataCollectionContainer>
              {isCurrentExercise && (
                <TimerContainer>
                  <TimerDisplay data-testid="timer">
                    {formatTime(exerciseState?.timeRemaining || 0)}
                  </TimerDisplay>
                </TimerContainer>
              )}

              {showAlert && (
                <AlertContainer>
                  <Clock size={20} />
                  Hora de medir! Preencha os dados abaixo.
                </AlertContainer>
              )}

              <div>
                <h3
                  style={{
                    fontSize: isMobile ? 16 : 18,
                    fontWeight: 600,
                    marginBottom: isMobile ? 16 : 20,
                    color: "#374151",
                    textAlign: "center",
                  }}
                >
                  Coleta de Dados - Tipo {exercise.dataCollectionType}
                </h3>

                <DataInputsGrid>
                  {config &&
                    Array.from({ length: config.inputs }).map((_, index) => (
                      <DataInputGroup key={index}>
                        <DataLabel>
                          {config.inputType === "heartRate" && (
                            <Heart size={16} />
                          )}
                          {config.inputType === "oxygenSaturation" && (
                            <Activity size={16} />
                          )}
                          {config.inputType === "mixed" &&
                            (index % 2 === 0 ? (
                              <Heart size={16} />
                            ) : (
                              <Activity size={16} />
                            ))}
                          {config.inputLabels[index]}
                        </DataLabel>
                        <DataInput
                          type="number"
                          placeholder={
                            config.inputType === "oxygenSaturation"
                              ? "Ex: 98%"
                              : "Ex: 75"
                          }
                          value={
                            isCurrentExercise
                              ? exerciseState?.formData[`input_${index}`] || ""
                              : ""
                          }
                          onChange={(e) =>
                            handleInputChange(`input_${index}`, e.target.value)
                          }
                        />
                      </DataInputGroup>
                    ))}
                </DataInputsGrid>

                <DataInputGroup style={{ marginTop: 24 }}>
                  <DataLabel>Observações</DataLabel>
                  <ObservationsTextarea
                    placeholder="Como se sentiu durante o exercício..."
                    value={
                      isCurrentExercise
                        ? exerciseState?.formData?.observations || ""
                        : ""
                    }
                    onChange={(e) =>
                      handleInputChange("observations", e.target.value)
                    }
                  />
                </DataInputGroup>

                <SubmitButton
                  onClick={handleSubmit}
                  style={{ marginTop: 32, width: "100%" }}
                >
                  Finalizar Exercício
                </SubmitButton>
              </div>
            </DataCollectionContainer>
          )}
        </MainContent>
      </ModalContent>
    </ModalOverlay>
  );
}
