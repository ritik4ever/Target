
require("@nomiclabs/hardhat-waffle");
require('dotenv').config();

module.exports = {
  solidity: "0.8.17",
  networks: {
    monad: {
      url: process.env.MONAD_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
      chainId: 10143, // Replace with actual Monad chainId
      timeout: 60000
    }
  },
  paths: {
    artifacts: './src/artifacts',
  },
};


