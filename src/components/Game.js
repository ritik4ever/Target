
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import { GameCanvas } from './GameCanvas';
import { Scoreboard } from './Scoreboard';
import { NFTCollection } from './NFTCollection';
import { WalletConnection } from './WalletConnection';
import gameABI from '../contracts/TargetBlasterGame.json';
import nftABI from '../contracts/TargetBlasterNFT.json';



const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: #0a0b1c;
  border-radius: 15px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  border-bottom: 2px solid #5e43ff;
`;

const Logo = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #5e43ff;
`;

const GameSection = styled.section`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
`;

const GameControlsRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const Button = styled.button`
  background-color: #5e43ff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #4834c5;
  }
  
  &:disabled {
    background-color: #666;
    cursor: not-allowed;
  }
`;

const StatusMessage = styled.div`
  margin-top: 10px;
  color: ${props => props.isError ? '#ff5252' : '#5aff5a'};
  text-align: center;
  font-size: 16px;
`;

// Game component
const Game = () => {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [gameContract, setGameContract] = useState(null);
  const [nftContract, setNftContract] = useState(null);
  const [gameState, setGameState] = useState('idle'); // idle, playing, gameOver
  const [score, setScore] = useState(0);
  const [targetsHit, setTargetsHit] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [nfts, setNfts] = useState([]);
  
  const web3ModalRef = useRef();
  
  // Initialize web3modal
  useEffect(() => {
    if (!web3ModalRef.current) {
      web3ModalRef.current = new Web3Modal({
        network: "monad-testnet",
        cacheProvider: true,
        providerOptions: {},
      });
    }
  }, []);
  
  // Connect wallet
  const connectWallet = async () => {
    try {
      const instance = await web3ModalRef.current.connect();
      const provider = new ethers.providers.Web3Provider(instance);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      
      setAccount(address);
      setProvider(provider);
      setSigner(signer);
      
      // Initialize contracts
      const gameContract = new ethers.Contract(
        process.env.REACT_APP_GAME_CONTRACT_ADDRESS,
        gameABI.abi,
        signer
      );
      
      const nftContract = new ethers.Contract(
        process.env.REACT_APP_NFT_CONTRACT_ADDRESS,
        nftABI.abi,
        signer
      );
      
      setGameContract(gameContract);
      setNftContract(nftContract);
      
      // Load user's NFTs
      loadUserNFTs(address, nftContract);
      
      // Show success message
      displayStatus('Wallet connected successfully!', false);
    } catch (error) {
      console.error("Error connecting to wallet:", error);
      displayStatus('Failed to connect wallet. Please try again.', true);
    }
  };
  
  // Load user NFTs
  const loadUserNFTs = async (address, nftContract) => {
    try {
      const balance = await nftContract.balanceOf(address);
      const nftData = [];
      
      for (let i = 0; i < balance; i++) {
        const tokenId = await nftContract.tokenOfOwnerByIndex(address, i);
        const metadata = await nftContract.nftMetadata(tokenId);
        
        nftData.push({
          tokenId: tokenId.toString(),
          rewardType: metadata.rewardType,
          targetType: metadata.targetType,
          scoreValue: metadata.scoreValue.toString(),
          mintedAt: new Date(metadata.mintedAt.toNumber() * 1000).toLocaleDateString()
        });
      }
      
      setNfts(nftData);
    } catch (error) {
      console.error("Error loading NFTs:", error);
    }
  };
  
  // Start game
  const startGame = () => {
    if (!account) {
      displayStatus('Please connect your wallet first!', true);
      return;
    }
    
    setGameState('playing');
    setScore(0);
    setTargetsHit(0);
    displayStatus('Game started! Shoot the targets!', false);
  };
  
  // End game
  const endGame = async () => {
    if (gameState !== 'playing') return;
    
    setGameState('gameOver');
    
    try {
      // Generate a random seed for NFT drop calculation
      const randomSeed = Math.floor(Math.random() * 1000000);
      
      // Send game results to blockchain
      const tx = await gameContract.endGameSession(
        account,
        score,
        targetsHit,
        randomSeed
      );
      
      await tx.wait();
      
      // Reload NFTs after game completion
      await loadUserNFTs(account, nftContract);
      
      displayStatus(`Game Over! Your score: ${score}. Check if you won an NFT!`, false);
    } catch (error) {
      console.error("Error ending game session:", error);
      displayStatus('Failed to register game results on blockchain.', true);
    }
  };
  
  // Handle target hit
  const handleTargetHit = (pointsEarned) => {
    setScore(prevScore => prevScore + pointsEarned);
    setTargetsHit(prev => prev + 1);
  };
  
  // Display status message
  const displayStatus = (message, isError) => {
    setStatusMessage(message);
    setIsError(isError);
    
    // Clear message after 5 seconds
    setTimeout(() => {
      setStatusMessage('');
    }, 5000);
  };
  
  return (
    <GameContainer>
      <Header>
        <Logo>Monad Target Blaster</Logo>
        <WalletConnection 
          account={account} 
          connectWallet={connectWallet} 
        />
      </Header>
      
      <GameSection>
        <GameControlsRow>
          <Button 
            onClick={startGame}
            disabled={!account || gameState === 'playing'}
          >
            Start Game
          </Button>
          
          <Button 
            onClick={endGame}
            disabled={gameState !== 'playing'}
          >
            End Game
          </Button>
        </GameControlsRow>
        
        {statusMessage && (
          <StatusMessage isError={isError}>
            {statusMessage}
          </StatusMessage>
        )}
        
        <GameCanvas 
          gameState={gameState} 
          onTargetHit={handleTargetHit} 
        />
        
        <Scoreboard 
          score={score}
          targetsHit={targetsHit}
        />
      </GameSection>
      
      <NFTCollection nfts={nfts} />
    </GameContainer>
  );
};

export default Game;