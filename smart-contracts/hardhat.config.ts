import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

// Configure env variables
import * as dotenv from "dotenv";
dotenv.config({ path: "./.env" });

const config: HardhatUserConfig = {
  solidity: "0.8.21",
  networks: {
    hardhat: {
      loggingEnabled: false,
    },
    ethereum: {
      chainId: 1,
      url: "https://eth.public-rpc.com",
      forking: {
        url: "https://eth.public-rpc.com",
      },
      accounts: [process.env.PRIVATE_KEY_DEPLOYER as string],
    },
    goerli: {
      chainId: 5,
      url: "https://ethereum-goerli.publicnode.com",
      forking: {
        url: "https://ethereum-goerli.publicnode.com",
      },
      accounts: [process.env.PRIVATE_KEY_DEPLOYER as string],
    },
    polygonAmoy: {
      chainId: 80002,
      url: process.env.ALCHEMY_API_URL as string,
      forking: {
        url: process.env.ALCHEMY_API_URL as string,
      },
      accounts: [process.env.PRIVATE_KEY_DEPLOYER as string],
    },
  },
};

export default config;
