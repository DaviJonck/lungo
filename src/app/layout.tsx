import { Nunito_Sans } from "next/font/google";
import ThemeProvider from "../components/ThemeProvider";
import { AuthProvider } from "../contexts/AuthContext";
import { SpeedInsights } from "@vercel/speed-insights/next";

import "./globals.css";

const nunitoSans = Nunito_Sans({
  variable: "--font-nunito-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="icon" href="/Logo.svg" sizes="32x32" />
        <link rel="icon" type="image/png" sizes="32x32" href="/Logo.svg" />
        <link rel="icon" type="image/png" sizes="32x32" href="/Logo.svg" />
        <link rel="apple-touch-icon" sizes="180x180" href="/Logo.svg" />
      </head>
      <body className={nunitoSans.variable} suppressHydrationWarning={true}>
        <ThemeProvider>
          <AuthProvider>
            <SpeedInsights />
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
