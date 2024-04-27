import { useAccount, useAuthenticate } from "@alchemy/aa-alchemy/react";
import { Box, Button, Heading, Input, Stack } from "@chakra-ui/react";
import { useState } from "react";

export default function LoginCard() {
  const [email, setEmail] = useState("");
  const onEmailChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setEmail(e.target.value);

  const { authenticate, isPending: isAuthenticatingUser } = useAuthenticate();
  const { isLoadingAccount } = useAccount({
    type: "MultiOwnerModularAccount",
    skipCreate: true,
  });

  return (
    <Box as="section">
      {isAuthenticatingUser || isLoadingAccount ? (
        <Heading as={"h2"}>Check your email...</Heading>
      ) : (
        <Stack>
          <Heading as="h2">Log in with Alchemy</Heading>
          <Input
            placeholder="Enter your email"
            type="email"
            value={email}
            onChange={onEmailChange}
          />
          <Button
            colorScheme="purple"
            onClick={() => authenticate({ type: "email", email })}
          >
            Log in
          </Button>
        </Stack>
      )}
    </Box>
  );
}
