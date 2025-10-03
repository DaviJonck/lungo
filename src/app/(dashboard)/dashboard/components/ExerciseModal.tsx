"use client";

import { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import {
  X,
  Play,
  Pause,
  RotateCcw,
  Clock,
  Heart,
  Activity,
  AlertTriangle,
} from "lucide-react";
import { usePersistentExercise } from "@/hooks/usePersistentExercise";

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
  border-radius: 16px;
  width: 100%;
  max-width: 1000px;
  height: 90vh; /* usa altura total da viewport para permitir scroll interno */
  max-height: 90vh;
  overflow: hidden; /* esconde overflow geral; painéis internos rolam */
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
    height: 95vh;
    max-height: 95vh;
  }
`;

const LeftPanel = styled.div`
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  background: #f8fafc;
  min-height: 0; /* necessário para permitir overflow de filhos em layouts flex/grid */
  overflow-y: auto; /* rolagem interna do painel de inputs */
  -webkit-overflow-scrolling: touch; /* scroll suave no iOS */
`;

const RightPanel = styled.div`
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  background: white;
  min-height: 0;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: rgba(0, 0, 0, 0.1);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.2);
  }
`;

const ExerciseTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: #1c2b2d;
  margin: 0;
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

const VideoContainer = styled.div`
  width: 100%;
  aspect-ratio: 16/9;
  background: #f1f5f9;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  font-size: 14px;
  border: 2px dashed #cbd5e1;
`;

const SubmitButton = styled.button`
  background: #10b981;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: #059669;
  }

  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
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
`;

const CountdownNumber = styled.div<{ $isActive: boolean }>`
  font-size: 120px;
  font-weight: 900;
  color: ${({ $isActive }) => ($isActive ? "#2a7ea5" : "#e5e7eb")};
  transition: all 0.3s ease;
  transform: ${({ $isActive }) => ($isActive ? "scale(1.2)" : "scale(1)")};
`;

const TimerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 24px;
  background: #f8fafc;
  border-radius: 12px;
  border: 2px solid #e2e8f0;
`;

const TimerDisplay = styled.div`
  font-size: 48px;
  font-weight: 700;
  color: #2a7ea5;
  font-family: "Courier New", monospace;
`;

const TimerControls = styled.div`
  display: flex;
  gap: 12px;
`;

const TimerButton = styled.button<{ $variant: "play" | "pause" | "reset" }>`
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;

  ${({ $variant }) => {
    switch ($variant) {
      case "play":
        return `
          background: #10b981;
          color: white;
          &:hover { background: #059669; }
        `;
      case "pause":
        return `
          background: #f59e0b;
          color: white;
          &:hover { background: #d97706; }
        `;
      case "reset":
        return `
          background: #6b7280;
          color: white;
          &:hover { background: #4b5563; }
        `;
    }
  }}
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

const RecoveryBanner = styled.div`
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border: 2px solid #f59e0b;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  color: #92400e;
  font-weight: 600;
`;

const RecoveryButton = styled.button`
  background: #f59e0b;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: #d97706;
  }
`;

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
  const [showRecoveryBanner, setShowRecoveryBanner] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const {
    exerciseState,
    isRestored,
    startExercise,
    updateExerciseState,
    clearExercise,
    resumeExercise,
  } = usePersistentExercise();

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

  // Verificar se há exercício em andamento quando o modal abre
  useEffect(() => {
    if (isOpen && exercise && isRestored) {
      if (exerciseState && exerciseState.exerciseId === exercise.id) {
        // Só mostrar banner se o exercício foi realmente interrompido
        // (tem tempo restante mas não está rodando)
        const shouldShowBanner =
          exerciseState.timeRemaining > 0 && !exerciseState.isTimerRunning;

        console.log("🔍 Verificando se deve mostrar banner:", {
          timeRemaining: exerciseState.timeRemaining,
          isTimerRunning: exerciseState.isTimerRunning,
          isStarted: exerciseState.isStarted,
          shouldShow: shouldShowBanner,
        });

        if (shouldShowBanner) {
          setShowRecoveryBanner(true);
        }
      } else if (exerciseState && exerciseState.exerciseId !== exercise.id) {
        // Se há um exercício diferente em andamento, limpar o estado
        clearExercise();
      }
    }
  }, [isOpen, exercise, isRestored, exerciseState, clearExercise]);

  // Contador 3-2-1
  useEffect(() => {
    if (countdown !== null && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && config) {
      console.log("🚀 Iniciando exercício após contador");
      startExercise(
        exercise!.id,
        exercise!.dataCollectionType,
        config.totalTime
      );
      setCountdown(null);
    }
  }, [countdown, config, exercise, startExercise]);

  // Timer principal
  useEffect(() => {
    console.log("⏰ Timer useEffect:", {
      isTimerRunning: exerciseState?.isTimerRunning,
      timeRemaining: exerciseState?.timeRemaining,
      hasConfig: !!config,
    });

    if (
      exerciseState?.isTimerRunning &&
      exerciseState.timeRemaining > 0 &&
      config
    ) {
      console.log("⏰ Iniciando timer");
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
          console.log("🔔 ALERTA: Hora de medir!");
          setTimeout(() => setShowAlert(false), 3000);
        }

        updateExerciseState(updates);
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [
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

  const handleResumeExercise = () => {
    console.log("🔄 Iniciando resumo do exercício");
    resumeExercise();
    setShowRecoveryBanner(false);
  };

  const handleStartNewExercise = () => {
    clearExercise();
    setShowRecoveryBanner(false);
    setCountdown(3);
  };

  const handleTimerToggle = () => {
    if (exerciseState) {
      updateExerciseState({
        isTimerRunning: !exerciseState.isTimerRunning,
      });
    }
  };

  const handleTimerReset = () => {
    if (exerciseState && config) {
      updateExerciseState({
        isTimerRunning: false,
        timeRemaining: config.totalTime,
        currentInterval: 0,
        formData: {},
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    if (exerciseState) {
      updateExerciseState({
        formData: { ...exerciseState.formData, [field]: value },
      });
    }
  };

  const handleSubmit = () => {
    if (exerciseState) {
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

  const isExerciseComplete = exerciseState?.timeRemaining === 0;
  const canFinish =
    isExerciseComplete &&
    exerciseState &&
    Object.keys(exerciseState.formData).length > 0;
  const isStarted = exerciseState?.isStarted || false;

  return (
    <ModalOverlay onClick={handleClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={handleClose}>
          <X size={20} />
        </CloseButton>

        <LeftPanel>
          <ExerciseTitle>{exercise.title}</ExerciseTitle>

          {showRecoveryBanner && (
            <RecoveryBanner>
              <AlertTriangle size={24} />
              <div>
                <div>Exercício em andamento detectado!</div>
                <div style={{ fontSize: 14, fontWeight: 400, marginTop: 4 }}>
                  Você pode continuar de onde parou ou iniciar um novo
                  exercício.
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, marginLeft: "auto" }}>
                <RecoveryButton onClick={handleResumeExercise}>
                  Continuar
                </RecoveryButton>
                <RecoveryButton
                  onClick={handleStartNewExercise}
                  style={{ background: "#6b7280" }}
                >
                  Novo
                </RecoveryButton>
              </div>
            </RecoveryBanner>
          )}

          {countdown !== null ? (
            <CountdownContainer>
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: 20,
                }}
              >
                Preparando para iniciar...
              </div>
              <CountdownNumber $isActive={countdown > 0}>
                {countdown}
              </CountdownNumber>
            </CountdownContainer>
          ) : !isStarted ? (
            <>
              <div>
                <h3
                  style={{
                    fontSize: 16,
                    fontWeight: 600,
                    marginBottom: 12,
                    color: "#374151",
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
              <TimerContainer>
                <TimerDisplay>
                  {formatTime(exerciseState?.timeRemaining || 0)}
                </TimerDisplay>
                <TimerControls>
                  <TimerButton $variant="play" onClick={handleTimerToggle}>
                    {exerciseState?.isTimerRunning ? (
                      <Pause size={16} />
                    ) : (
                      <Play size={16} />
                    )}
                    {exerciseState?.isTimerRunning ? "Pausar" : "Iniciar"}
                  </TimerButton>
                  <TimerButton $variant="reset" onClick={handleTimerReset}>
                    <RotateCcw size={16} />
                    Reset
                  </TimerButton>
                </TimerControls>
              </TimerContainer>

              {showAlert && (
                <AlertContainer>
                  <Clock size={20} />
                  Hora de medir! Preencha os dados abaixo.
                </AlertContainer>
              )}

              <div>
                <h3
                  style={{
                    fontSize: 16,
                    fontWeight: 600,
                    marginBottom: 16,
                    color: "#374151",
                  }}
                >
                  Coleta de Dados - Tipo {exercise.dataCollectionType}:
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
                            exerciseState?.formData[`input_${index}`] || ""
                          }
                          onChange={(e) =>
                            handleInputChange(`input_${index}`, e.target.value)
                          }
                          disabled={!exerciseState?.isTimerRunning}
                        />
                      </DataInputGroup>
                    ))}
                </DataInputsGrid>

                <DataInputGroup style={{ marginTop: 20 }}>
                  <DataLabel>Observações</DataLabel>
                  <ObservationsTextarea
                    placeholder="Como se sentiu durante o exercício..."
                    value={exerciseState?.formData?.observations || ""}
                    onChange={(e) =>
                      handleInputChange("observations", e.target.value)
                    }
                  />
                </DataInputGroup>

                <SubmitButton
                  onClick={handleSubmit}
                  disabled={!canFinish}
                  style={{ marginTop: 20 }}
                >
                  {isExerciseComplete
                    ? "Finalizar Exercício"
                    : "Aguarde o término do exercício"}
                </SubmitButton>
              </div>
            </DataCollectionContainer>
          )}
        </LeftPanel>

        <RightPanel>
          <h3
            style={{
              fontSize: 18,
              fontWeight: 600,
              marginBottom: 16,
              color: "#374151",
            }}
          >
            Vídeo do Exercício
          </h3>

          <VideoContainer>
            {exercise.videoUrl ? (
              <video
                controls
                style={{ width: "100%", height: "100%", borderRadius: "8px" }}
              >
                <source src={exercise.videoUrl} type="video/mp4" />
                Seu navegador não suporta vídeos.
              </video>
            ) : (
              <div style={{ textAlign: "center" }}>
                <Play size={48} style={{ marginBottom: 12, opacity: 0.5 }} />
                <div>Vídeo do exercício</div>
                <div style={{ fontSize: 12, marginTop: 4 }}>
                  (Vídeo será adicionado em breve)
                </div>
              </div>
            )}
          </VideoContainer>
        </RightPanel>
      </ModalContent>
    </ModalOverlay>
  );
}
