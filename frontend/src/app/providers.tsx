"use client";

import { ChakraProvider } from "@chakra-ui/react";
import { PropsWithChildren } from "react";

export const Providers = (props: PropsWithChildren) => {
  return <ChakraProvider>{props.children}</ChakraProvider>;
};
