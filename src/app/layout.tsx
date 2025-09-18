"use client";

import { Nunito_Sans } from "next/font/google";
import { ThemeProvider } from "styled-components";
import { theme } from "../styles/theme";
import "./globals.css";

const nunitoSans = Nunito_Sans({
  variable: "--font-nunito-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={nunitoSans.variable}
        style={{ backgroundColor: theme.colors.background }}
        suppressHydrationWarning={true}
      >
        <ThemeProvider
          theme={{ ...theme, fontWeights: {}, lineHeights: {}, space: {} }}
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
