"use client";

import LogInCard from "@/components/LoginCard";
import { Container } from "@chakra-ui/react";
// import { TurnkeyIframe } from "../components/TurnkeyIframe";

export default function Home() {
  return (
    <Container as="main">
      <LogInCard />
      {/* <TurnkeyIframe /> */}
    </Container>
  );
}
