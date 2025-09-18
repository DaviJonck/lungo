"use client";

import { ThemeProvider as StyledThemeProvider } from "styled-components";
import { theme } from "@/styles/theme";

interface ThemeProviderProps {
  children: React.ReactNode;
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <StyledThemeProvider
      theme={{ ...theme, fontWeights: {}, lineHeights: {}, space: {} }}
    >
      {children}
    </StyledThemeProvider>
  );
}
