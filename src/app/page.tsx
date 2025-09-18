"use client";

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
