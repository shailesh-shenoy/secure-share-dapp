"use client";
import { fromHexString } from "@nucypher/shared";
import { domains, fromBytes } from "@nucypher/taco";
import { ethers } from "ethers";
import { hexlify } from "ethers/lib/utils";
import { useEffect, useState } from "react";

import useTaco from "../hooks/useTaco";
import { Button, Heading, Input, InputGroup, Stack } from "@chakra-ui/react";

declare const window: any;

const ritualId = 0; // Replace with your own ritual ID
const domain = domains.TESTNET;

function ConsumerPage() {
  const [provider, setProvider] = useState<
    ethers.providers.Web3Provider | undefined
  >();
  const [encryptedData, setEncryptedData] = useState<string | undefined>("");
  const [eMedicalRecords, setEMedicalRecords] = useState("");
  const [eFinancialRecords, setEFinancialRecords] = useState("");
  const [eDnrRecords, setEDnrRecords] = useState("");
  const [eGenomicRecords, setEGenomicRecords] = useState("");
  const [eMyDID, setEMyDID] = useState("");
  const [decrypting, setDecrypting] = useState(false);
  const [decryptedMessage, setDecryptedMessage] = useState<string | undefined>(
    ""
  );

  const handleEncryptedDataChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setEncryptedData(e.target.value);
  };

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

  const { isInit, decryptDataFromBytes } = useTaco({
    domain,
    provider,
    ritualId,
  });

  if (!isInit || !provider) {
    return <div>Loading...</div>;
  }

  const parseMessage = async () => {
    if (!encryptedData) return;
    const data = JSON.parse(encryptedData);
    setEMedicalRecords(data.medicalRecords);
    setEFinancialRecords(data.financialRecords);
    setEDnrRecords(data.dnrRecords);
    setEGenomicRecords(data.genomicRecords);
    setEMyDID(data.myDID);
  };

  const decryptMessage = async () => {
    if (!encryptedData || !provider) return;
    try {
      setDecrypting(true);
      const signer = provider.getSigner();

      console.log("Decrypting message...");
      const decryptedMessage = await decryptDataFromBytes(
        fromHexString(encryptedData),
        signer
      );
      if (decryptedMessage) {
        setDecryptedMessage(fromBytes(decryptedMessage));
      }
    } catch (e) {
      console.log(e);
    }
    setDecrypting(false);
  };

  return (
    <Stack as="section">
      <Heading as="h2">Consume Data</Heading>
      <InputGroup>
        <Input
          placeholder="Medical Records"
          value={encryptedData}
          onChange={handleEncryptedDataChange}
        />
      </InputGroup>
      <Button onClick={parseMessage}>Decrypt</Button>{" "}
      {decrypting && "Encrypting..."}
      <InputGroup>
        <Heading as="h3">Decrypted message: </Heading>
        <Input
          placeholder="Decrypted medical records"
          value={decryptedMessage}
          readOnly
        />
      </InputGroup>
    </Stack>
  );
}

export default ConsumerPage;
