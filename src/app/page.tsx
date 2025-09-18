"use client";

import { useEffect, useState } from "react";
import styled from "styled-components";
import Header from "@/components/ui/Header/Header";
import CallToAction from "@/components/callToAction/CallToAction";
import WhatIsLungo from "@/components/whatIsLungo/WhatIsLungo";
import HowItWork from "@/components/howItWork/HowItWork";

const PageContainer = styled.div`
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.main`
  flex: 1;
  width: 100%;
`;

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <PageContainer>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
            backgroundColor: "#b9e5e8",
          }}
        >
          <div className="loading-spinner" />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Header />
      <MainContent>
        <CallToAction />
        <WhatIsLungo />
        <HowItWork />
      </MainContent>
    </PageContainer>
  );
}
