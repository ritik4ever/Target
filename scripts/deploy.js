const hre = require("hardhat");

async function main() {
  // Deploy NFT contract
  const TargetBlasterNFT = await hre.ethers.getContractFactory("TargetBlasterNFT");
  const nftContract = await TargetBlasterNFT.deploy(
    "Monad Target Blaster NFTs",
    "MTBNFT",
    "https://monad-target-blaster.example/metadata/"
  );
  await nftContract.deployed();
  console.log("TargetBlasterNFT deployed to:", nftContract.address);
  
  // Deploy PlayerStats contract
  const PlayerStats = await hre.ethers.getContractFactory("PlayerStats");
  const statsContract = await PlayerStats.deploy();
  await statsContract.deployed();
  console.log("PlayerStats deployed to:", statsContract.address);
  
  // Deploy Game contract
  const TargetBlasterGame = await hre.ethers.getContractFactory("TargetBlasterGame");
  const gameContract = await TargetBlasterGame.deploy(nftContract.address, statsContract.address);
  await gameContract.deployed();
  console.log("TargetBlasterGame deployed to:", gameContract.address);
  
  // Set game admin in NFT contract
  await nftContract.setGameAdmin(gameContract.address);
  console.log("Game admin set in NFT contract");
  
  // Set game admin in stats contract
  await statsContract.setGameAdmin(gameContract.address);
  console.log("Game admin set in stats contract");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });