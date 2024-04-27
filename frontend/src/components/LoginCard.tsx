import { Button, Heading, Input, Stack } from "@chakra-ui/react";
import { useState } from "react";

export default function LoginCard() {
  const [email, setEmail] = useState("");
  const onEmailChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setEmail(e.target.value);

  return (
    <Stack as="section">
      <Heading>Log in with Alchemy</Heading>
      <Input
        placeholder="Enter your email"
        type="email"
        value={email}
        onChange={onEmailChange}
      />
      <Button colorScheme="purple">Log in</Button>
    </Stack>
  );
}
