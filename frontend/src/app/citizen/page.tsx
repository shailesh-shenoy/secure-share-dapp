"use client";

import CitizenPage from "@/components/CitizenPage";
import { Container, Spinner } from "@chakra-ui/react";
// import { TurnkeyIframe } from "../components/TurnkeyIframe";

export default function Citizen() {
  return (
    <Container as="main" p={2}>
      <CitizenPage />
    </Container>
  );
}
