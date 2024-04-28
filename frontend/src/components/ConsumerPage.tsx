"use client";
import { fromHexString } from "@nucypher/shared";
import { domains, fromBytes } from "@nucypher/taco";
import { ethers } from "ethers";
import { hexlify } from "ethers/lib/utils";
import { useEffect, useState } from "react";

import useTaco from "../hooks/useTaco";
import { Button, Heading, Input, InputGroup, Stack, StackDivider, Text, Textarea } from "@chakra-ui/react";

declare const window: any;

const ritualId = 0; // Replace with your own ritual ID
const domain = domains.TESTNET;

function ConsumerPage() {
  const [provider, setProvider] = useState<
    ethers.providers.Web3Provider | undefined
  >();
  const [encryptedData, setEncryptedData] = useState<string | undefined>("");
  const [eMedicalRecords, setEMedicalRecords] = useState<string | undefined>("");
  const [eFinancialRecords, setEFinancialRecords] = useState<string | undefined>("");
  const [eDnrRecords, setEDnrRecords] = useState<string | undefined>("");
  const [eGenomicRecords, setEGenomicRecords] = useState<string | undefined>("");
  const [eMyDID, setEMyDID] = useState<string | undefined>("");
  const [decrypting, setDecrypting] = useState<boolean>(false);

  const [decryptedMedicalRecords, setDecryptedMedicalRecords] = useState<string | undefined>("");
  const [decryptedFinancialRecords, setDecryptedFinancialRecords] = useState<string | undefined>("");
  const [decryptedDnrRecords, setDecryptedDnrRecords] = useState<string | undefined>("");
  const [decryptedGenomicRecords, setDecryptedGenomicRecords] = useState<string | undefined>("");
  const [decryptedMyDID, setDecryptedMyDID] = useState<string | undefined>("");

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

  const decryptMessage = async (record: string | undefined) => {
    console.log(record)
    if (!encryptedData || !provider || !record) return;

    try {
      setDecrypting(true);
      const signer = provider.getSigner();

      console.log("Decrypting message...");
      const decryptedMessage = await decryptDataFromBytes(
        fromHexString(record),
        signer
      );
      console.log("Decrypted message:", fromBytes(decryptedMessage!));
      if (decryptedMessage) {
        return fromBytes(decryptedMessage);
      }
    } catch (e) {
      console.log(e);
    }
    setDecrypting(false);
  };

  const decryptMedicalRecords = async () => {
    const decryptedMedicalRecords = await decryptMessage(eMedicalRecords);
    setDecryptedMedicalRecords(decryptedMedicalRecords);
  };

  const decryptFinancialRecords = async () => {
    const decryptedFinancialRecords = await decryptMessage(eFinancialRecords);
    setDecryptedFinancialRecords(decryptedFinancialRecords);
  };

  const decryptDnrRecords = async () => {
    const decryptedDnrRecords = await decryptMessage(eDnrRecords);
    setDecryptedDnrRecords(decryptedDnrRecords);
  };

  const decryptGenomicRecords = async () => {
    const decryptedGenomicRecords = await decryptMessage(eGenomicRecords);
    setDecryptedGenomicRecords(decryptedGenomicRecords);
  };

  const decryptMyDID = async () => {
    const decryptedMyDID = await decryptMessage(eMyDID);
    setDecryptedMyDID(decryptedMyDID);
  };

  return (
    <Stack as="section" spacing={8} divider={<StackDivider borderColor="gray.400" />}>

      <Heading as="h2">Consume Data</Heading>
      <InputGroup as={Stack}>
        <Text>Enter Encrypted Data:</Text>
        <Input
          placeholder="Encrypted Data"
          value={encryptedData}
          onChange={handleEncryptedDataChange}
        />
        <Button onClick={parseMessage}>Process data</Button>
      </InputGroup>


      <Stack>
        <Text >Encrypted Medical Records: </Text>
        <Input
          placeholder="Medical Records"
          value={eMedicalRecords}
          readOnly
        />
        <Button onClick={decryptMedicalRecords}>Decrypt Medical Records</Button>
        <Textarea
          placeholder="Decrypted Medical Records"
          value={decryptedMedicalRecords}
          readOnly />
      </Stack>

      <Stack>
        <Text >Encrypted Financial Records: </Text>
        <Input
          placeholder="Medical Records"
          value={eMedicalRecords}
          readOnly
        />
        <Button
          onClick={decryptFinancialRecords}
        >Decrypt Financial Records</Button>
        <Textarea
          placeholder="Decrypted Financial Records"
          value={decryptedFinancialRecords}
          readOnly />
      </Stack>

      <Stack>
        <Text >Encrypted DNR Records: </Text>
        <Input
          placeholder="DNR Records"
          value={eDnrRecords}
          readOnly
        />
        <Button
          onClick={decryptDnrRecords}
        >Decrypt DNR Records</Button>
        <Textarea
          placeholder="Decrypted DNR Records"
          value={decryptedDnrRecords}
          readOnly />
      </Stack>

      <Stack>
        <Text >Encrypted Genomic Records: </Text>
        <Input
          placeholder="Genomic Records"
          value={eGenomicRecords}
          readOnly
        />
        <Button
          onClick={decryptGenomicRecords}
        >Decrypt Genomic Records</Button>
        <Textarea
          placeholder="Decrypted Genomic Records"
          value={decryptedGenomicRecords}
          readOnly />
      </Stack>

      <Stack>
        <Text >Encrypted De-Identified Records: </Text>
        <Input
          placeholder="MyDID"
          value={eMyDID}
          readOnly
        />
        <Button
          onClick={decryptMyDID}
        >Decrypt De-Identified Records</Button>
        <Textarea
          placeholder="Decrypted MyDID"
          value={decryptedMyDID}
          readOnly />
      </Stack>
    </Stack>
  );
}

export default ConsumerPage;
