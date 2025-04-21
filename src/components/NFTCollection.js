
import React from 'react';
import styled from 'styled-components';

const NFTCollectionContainer = styled.div`
  margin-top: 30px;
  padding: 20px;
  background-color: #1a1b2e;
  border-radius: 10px;
`;

const NFTTitle = styled.h2`
  color: #5e43ff;
  margin-bottom: 20px;
  font-size: 1.5rem;
`;

const NFTGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
`;

const NFTCard = styled.div`
  background-color: #2a2b3e;
  border-radius: 8px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const NFTImageContainer = styled.div`
  width: 100%;
  height: 150px;
  background-color: #3a3b4e;
  border-radius: 5px;
  margin-bottom: 10px;
  overflow: hidden;
  position: relative;
`;

const NFTImage = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 3rem;
  color: ${props => {
    switch(props.rewardType) {
      case 0: return '#ffffff'; // Common
      case 1: return '#30e9ff'; // Rare
      case 2: return '#ff9830'; // Epic
      case 3: return '#ff30e9'; // Legendary
      default: return '#ffffff';
    }
  }};
`;

const NFTInfo = styled.div`
  margin-top: 10px;
`;

const NFTName = styled.h3`
  color: white;
  margin: 0 0 5px 0;
  font-size: 1rem;
`;

const NFTDetail = styled.p`
  color: #bbb;
  margin: 2px 0;
  font-size: 0.8rem;
`;

const EmptyCollection = styled.p`
  text-align: center;
  color: #bbb;
  font-style: italic;
`;

export const NFTCollection = ({ nfts }) => {
  // NFT emoji icons based on reward type
  const rewardEmojis = ['🎯', '✨', '🔥', '💎'];
  
  // Reward type names
  const rewardTypeNames = ['Common', 'Rare', 'Epic', 'Legendary'];
  
  return (
    <NFTCollectionContainer>
      <NFTTitle>Your NFT Collection</NFTTitle>
      
      {nfts && nfts.length > 0 ? (
        <NFTGrid>
          {nfts.map((nft) => (
            <NFTCard key={nft.tokenId}>
              <NFTImageContainer>
                <NFTImage rewardType={nft.rewardType}>
                  {rewardEmojis[nft.rewardType]}
                </NFTImage>
              </NFTImageContainer>
              
              <NFTInfo>
                <NFTName>
                  {rewardTypeNames[nft.rewardType]} Target Trophy #{nft.tokenId}
                </NFTName>
                <NFTDetail>Type: {nft.targetType}</NFTDetail>
                <NFTDetail>Score: {nft.scoreValue}</NFTDetail>
                <NFTDetail>Minted: {nft.mintedAt}</NFTDetail>
              </NFTInfo>
            </NFTCard>
          ))}
        </NFTGrid>
      ) : (
        <EmptyCollection>
          Play the game and hit targets to earn NFT rewards!
        </EmptyCollection>
      )}
    </NFTCollectionContainer>
  );
};

