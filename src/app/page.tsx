"use client";

import Header from "@/components/ui/Header/Header";
import CallToAction from "@/components/callToAction/CallToAction";
import { theme } from "@/styles/theme";

export default function Home() {
  return (
    <div style={{ backgroundColor: theme.colors.background }}>
      <Header />
      <CallToAction />
    </div>
  );
}
