require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
const { mnemonic } = require("./secrets.json");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async () => {
  const accounts = await ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  defaultNetwork: "mainnet",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
    },
    hardhat: {},
    mainnet: {
      url: "https://rpc-mainnet.matic.network/",
      chainId: 137,
      accounts: { mnemonic: mnemonic },
    },
    testnet: {
      url: "https://polygon-mumbai.g.alchemy.com/v2/OPzbjhgk8SF_tN1f6W_hqi-eg_0jdzLl",
      accounts: { mnemonic: mnemonic },
    },
  },
  solidity: {
    version: "0.8.10",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  mocha: {
    timeout: 20000,
  },
};
