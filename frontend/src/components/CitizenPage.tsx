"use client";
import { fromHexString } from "@nucypher/shared";
import { conditions, domains, fromBytes, toHexString } from "@nucypher/taco";
import { ethers } from "ethers";
import { hexlify } from "ethers/lib/utils";
import { useEffect, useState } from "react";

import useTaco from "../hooks/useTaco";
import {
  Button,
  Flex,
  Heading,
  Input,
  InputGroup,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";

declare const window: any;

const ritualId = 0; // Replace with your own ritual ID
const domain = domains.TESTNET;

function CitizenPage() {
  const [provider, setProvider] = useState<
    ethers.providers.Web3Provider | undefined
  >();
  const [medicalRecords, setMedicalRecords] = useState("");
  const [financialRecords, setFinancialRecords] = useState("");
  const [dnrRecords, setDnrRecords] = useState("");
  const [genomicRecords, setGenomicRecords] = useState("");
  const [myDID, setMyDID] = useState("");
  const [encrypting, setEncrypting] = useState(false);
  const [encryptedData, setEncryptedData] = useState<string | undefined>("");

  const loadWeb3Provider = async () => {
    if (!window.ethereum) {
      console.error("You need to connect to your wallet first");
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");

    const { chainId } = await provider.getNetwork();
    const amoyChainId = 80002;
    if (chainId !== amoyChainId) {
      // Switch to Polygon Amoy testnet
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: hexlify(amoyChainId) }],
      });
    }

    await provider.send("eth_requestAccounts", []);
    setProvider(provider);
  };

  useEffect(() => {
    loadWeb3Provider();
  }, []);

  const { isInit, encryptDataToBytes } = useTaco({
    domain,
    provider,
    ritualId,
  });

  if (!isInit || !provider) {
    return <div>Loading...</div>;
  }

  const handleMedicalRecordsChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setMedicalRecords(e.target.value);
  };

  const encryptMessage = async () => {
    const eMedicalData = await encryptRecord(medicalRecords);
    const eFinData = await encryptRecord(financialRecords);
    const eDnrData = await encryptRecord(dnrRecords);
    const eGenData = await encryptRecord(genomicRecords);
    const eDidData = await encryptRecord(myDID);
    const edata = {
      medicalRecords: eMedicalData,
      financialRecords: eFinData,
      dnrRecords: eDnrData,
      genomicRecords: eGenData,
      myDID: eDidData,
    };
    setEncryptedData(JSON.stringify(edata));
  };

  const encryptRecord = async (record: string) => {
    if (!provider) {
      return;
    }
    setEncrypting(true);
    try {
      const signer = provider.getSigner();
      const hasPositiveBalance = new conditions.base.rpc.RpcCondition({
        chain: 80002,
        method: "eth_getBalance",
        parameters: [":userAddress", "latest"],
        returnValueTest: {
          comparator: ">",
          value: 0,
        },
      });

      console.log("Encrypting message...");
      const encryptedBytes = await encryptDataToBytes(
        record,
        hasPositiveBalance,
        signer
      );
      if (encryptedBytes) {
        return toHexString(encryptedBytes);
      }
    } catch (e) {
      console.log(e);
    }
    setEncrypting(false);
  };

  return (
    <Stack as="section" spacing={5}>
      <Heading as="h2">Citizen Data</Heading>
      <Flex flexDirection="column">
        <Text>Medical Records: </Text>
        <Input
          placeholder="Medical Records"
          value={medicalRecords}
          onChange={handleMedicalRecordsChange}
        />
      </Flex>
      <Flex flexDirection="column">
        <Text>Financial Records: </Text>
        <Input
          placeholder="Financial Records"
          value={financialRecords}
          onChange={(e) => setFinancialRecords(e.target.value)}
        />
      </Flex>
      <Flex flexDirection="column">
        <Text>DNR Records: </Text>
        <Input
          placeholder="DNR Records"
          value={dnrRecords}
          onChange={(e) => setDnrRecords(e.target.value)}
        />
      </Flex>
      <Flex flexDirection="column">
        <Text>Genomic Records: </Text>
        <Input
          placeholder="Genomic Records"
          value={genomicRecords}
          onChange={(e) => setGenomicRecords(e.target.value)}
        />
      </Flex>
      <Flex flexDirection="column">
        <Text>De-Identified Records: </Text>
        <Input
          placeholder="My DID"
          value={myDID}
          onChange={(e) => setMyDID(e.target.value)}
        />
      </Flex>
      <Button onClick={encryptMessage}>Encrypt</Button>{" "}
      {encrypting && "Encrypting..."}
      <Heading as="h3">Encrypted message: </Heading>
      <Textarea
        placeholder="Encrypted Records"
        value={encryptedData}
        readOnly
      />
    </Stack>
  );
}

export default CitizenPage;
