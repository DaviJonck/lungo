import { z } from "zod";

// Schema para coordenadas geográficas
export const coordinateSchema = z.object({
  lat: z.number().min(-90).max(90),
  lon: z.number().min(-180).max(180),
});

// Schema para perfil do usuário
export const userProfileSchema = z.object({
  age: z.number().min(1).max(120),
  weight: z.number().min(1).max(500),
  height: z.number().min(0.5).max(3),
  respiratory_disease: z.string().min(1).max(100),
});

// Schema para dados de exercício
export const exerciseDataSchema = z.object({
  heartRate: z.number().min(30).max(220).optional(),
  oxygenSaturation: z.number().min(70).max(100).optional(),
  breathingRate: z.number().min(5).max(60).optional(),
  exerciseDuration: z.number().min(1).max(480), // 1 min a 8 horas
});

// Schema para autenticação
export const authSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(6).max(100),
});

// Função para sanitizar strings
export const sanitizeString = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, "") // Remove caracteres potencialmente perigosos
    .substring(0, 1000); // Limita tamanho
};

// Função para validar coordenadas
export const validateCoordinates = (lat: string, lon: string) => {
  const latNum = parseFloat(lat);
  const lonNum = parseFloat(lon);

  if (isNaN(latNum) || isNaN(lonNum)) {
    throw new Error("Coordenadas devem ser números válidos");
  }

  if (latNum < -90 || latNum > 90) {
    throw new Error("Latitude deve estar entre -90 e 90");
  }

  if (lonNum < -180 || lonNum > 180) {
    throw new Error("Longitude deve estar entre -180 e 180");
  }

  return { lat: latNum, lon: lonNum };
};

// Função para validar dados de perfil
export const validateUserProfile = (data: unknown) => {
  try {
    return userProfileSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(
        `Dados inválidos: ${error.issues
          .map((e: z.ZodIssue) => e.message)
          .join(", ")}`
      );
    }
    throw error;
  }
};
