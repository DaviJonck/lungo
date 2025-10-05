"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { useProfileCompletion } from "@/hooks/useProfileCompletion";
import { validateUserProfile, sanitizeString } from "@/lib/validation";

interface OnboardingData {
  age: number;
  weight: number;
  height: number;
  respiratory_disease: string;
}

const respiratoryDiseases = [
  { value: "", label: "Selecione uma opção", disabled: true },
  { value: "DPOC", label: "DPOC" },
  { value: "Asma", label: "Asma" },
  { value: "Fibrose Cística", label: "Fibrose Cística" },
  { value: "Fibrose Pulmonar", label: "Fibrose Pulmonar" },
  { value: "Câncer de Pulmão", label: "Câncer de Pulmão" },
  { value: "Outra", label: "Outra" },
];

// Styled Components
const FormContainer = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  padding: 2rem;
  border: 1px solid rgba(59, 130, 246, 0.1);
  position: relative;
  backdrop-filter: blur(10px);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
`;

const ErrorMessage = styled.div`
  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 1rem 1.25rem;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &::before {
    content: "⚠️";
    font-size: 1.125rem;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
`;

const Label = styled.label`
  display: block;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.secondaryDarker};
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem 1.25rem;
  border: 2px solid #e5e7eb;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: ${({ theme }) => theme.fontSizes.base};
  transition: all 0.3s ease;
  background: #fafafa;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
    background: ${({ theme }) => theme.colors.white};
    transform: translateY(-1px);
  }

  &:hover {
    border-color: #9ca3af;
  }

  &::placeholder {
    color: #9ca3af;
    font-weight: 400;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 1rem 1.25rem;
  border: 2px solid #e5e7eb;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: ${({ theme }) => theme.fontSizes.base};
  background: #fafafa;
  transition: all 0.3s ease;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
    background: ${({ theme }) => theme.colors.white};
    transform: translateY(-1px);
  }

  &:hover {
    border-color: #9ca3af;
  }

  option:disabled {
    color: #9ca3af;
    font-style: italic;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  color: ${({ theme }) => theme.colors.white};
  padding: 1rem 1.5rem;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: ${({ theme }) => theme.fontSizes.base};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 14px 0 rgba(59, 130, 246, 0.3);

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: left 0.5s;
  }

  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px 0 rgba(59, 130, 246, 0.4);
  }

  &:hover:not(:disabled)::before {
    left: 100%;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: 0 4px 14px 0 rgba(59, 130, 246, 0.2);
  }
`;

const ProgressIndicator = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const ProgressDot = styled.div<{ $active: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ $active }) => ($active ? "#3b82f6" : "#e5e7eb")};
  transition: all 0.3s ease;
`;

const HelperText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: #6b7280;
  margin-top: 0.5rem;
  font-style: italic;
`;

export default function OnboardingForm() {
  const router = useRouter();
  const { user } = useAuth();
  const { clearCache } = useProfileCompletion();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<OnboardingData>({
    age: 0,
    weight: 0,
    height: 0,
    respiratory_disease: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "age" || name === "weight" || name === "height"
          ? parseFloat(value) || 0
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setError("Usuário não autenticado");
      return;
    }

    // Validação básica
    if (
      !formData.age ||
      !formData.weight ||
      !formData.height ||
      !formData.respiratory_disease
    ) {
      setError("Por favor, preencha todos os campos");
      return;
    }

    try {
      // Validar dados usando schema
      const validatedData = validateUserProfile({
        age: formData.age,
        weight: formData.weight,
        height: formData.height,
        respiratory_disease: sanitizeString(formData.respiratory_disease),
      });

      // Atualizar formData com dados validados
      formData.respiratory_disease = validatedData.respiratory_disease;
    } catch (validationError) {
      setError(
        validationError instanceof Error
          ? validationError.message
          : "Dados inválidos"
      );
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          age: formData.age,
          weight: formData.weight,
          height: formData.height,
          respiratory_disease: formData.respiratory_disease,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (updateError) {
        throw updateError;
      }

      // Limpar cache do perfil para forçar nova verificação
      clearCache();

      // Pequeno delay para garantir que o cache seja limpo antes do redirect
      setTimeout(() => {
        router.push("/dashboard");
      }, 100);
    } catch (err) {
      console.error("Erro ao atualizar perfil:", err);
      setError("Erro ao salvar dados. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  // Calcular progresso do formulário
  const getFormProgress = () => {
    let completed = 0;
    if (formData.age > 0) completed++;
    if (formData.weight > 0) completed++;
    if (formData.height > 0) completed++;
    if (formData.respiratory_disease) completed++;
    return completed;
  };

  const progress = getFormProgress();

  return (
    <FormContainer>
      <ProgressIndicator>
        {[1, 2, 3, 4].map((step) => (
          <ProgressDot key={step} $active={step <= progress} />
        ))}
      </ProgressIndicator>

      <Form onSubmit={handleSubmit}>
        {error && <ErrorMessage>{error}</ErrorMessage>}

        <FormGroup>
          <Label htmlFor="age">
            <span>👤</span>
            Idade
          </Label>
          <Input
            type="number"
            id="age"
            name="age"
            value={formData.age || ""}
            onChange={handleInputChange}
            min="1"
            max="120"
            required
            placeholder="Digite sua idade"
          />
          <HelperText>Idade entre 1 e 120 anos</HelperText>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="weight">
            <span>⚖️</span>
            Peso (kg)
          </Label>
          <Input
            type="number"
            id="weight"
            name="weight"
            value={formData.weight || ""}
            onChange={handleInputChange}
            min="1"
            max="500"
            step="0.1"
            required
            placeholder="Digite seu peso em kg"
          />
          <HelperText>Peso entre 1 e 500 kg</HelperText>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="height">
            <span>📏</span>
            Altura (m)
          </Label>
          <Input
            type="number"
            id="height"
            name="height"
            value={formData.height || ""}
            onChange={handleInputChange}
            min="0.5"
            max="3"
            step="0.01"
            required
            placeholder="Digite sua altura em metros (ex: 1.75)"
          />
          <HelperText>Altura entre 0.5 e 3 metros</HelperText>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="respiratory_disease">
            <span>🫁</span>
            Doença Respiratória
          </Label>
          <Select
            id="respiratory_disease"
            name="respiratory_disease"
            value={formData.respiratory_disease}
            onChange={handleInputChange}
            required
          >
            {respiratoryDiseases.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </Select>
          <HelperText>Selecione sua condição respiratória</HelperText>
        </FormGroup>

        <SubmitButton type="submit" disabled={loading}>
          {loading ? (
            <>
              <span>⏳</span> Salvando...
            </>
          ) : (
            <>
              <span>✨</span> Completar Perfil
            </>
          )}
        </SubmitButton>
      </Form>
    </FormContainer>
  );
}
