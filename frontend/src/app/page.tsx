"use client";

import LogInCard from "@/components/LoginCard";
import { ProfileCard } from "@/components/ProfileCard";
import { useAccount, useUser } from "@alchemy/aa-alchemy/react";
import { Container, Spinner } from "@chakra-ui/react";
// import { TurnkeyIframe } from "../components/TurnkeyIframe";

export default function Home() {
  const { account, isLoadingAccount } = useAccount({
    type: "MultiOwnerModularAccount",
  });
  const user = useUser();
  return (
    <Container as="main">
      {isLoadingAccount ? (
        <Spinner>Loading...</Spinner>
      ) : user != null && account != null ? (
        <ProfileCard />
      ) : (
        <LogInCard />
      )}
      {/* <TurnkeyIframe /> */}
    </Container>
  );
}
