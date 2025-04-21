require('dotenv').config();
const { ethers } = require("hardhat");

async function main() {
  const provider = new ethers.providers.JsonRpcProvider(process.env.MONAD_RPC_URL);
  const balance = await provider.getBalance(process.env.WALLET_ADDRESS);
  console.log("Balance:", ethers.utils.formatEther(balance), "tETH");
}

main();
