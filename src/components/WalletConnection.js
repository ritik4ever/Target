
import React from 'react';
import styled from 'styled-components';

const WalletContainer = styled.div`
  display: flex;
  align-items: center;
`;

const WalletButton = styled.button`
  background-color: ${props => props.connected ? '#2ecc71' : '#5e43ff'};
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${props => props.connected ? '#27ae60' : '#4834c5'};
  }
`;

const AccountInfo = styled.div`
  margin-left: 15px;
  color: #ddd;
  font-size: 14px;
`;

export const WalletConnection = ({ account, connectWallet }) => {
  // Format address for display
  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };
  
  return (
    <WalletContainer>
      <WalletButton 
        connected={!!account}
        onClick={connectWallet}
      >
        {account ? 'Connected' : 'Connect Wallet'}
      </WalletButton>
      
      {account && (
        <AccountInfo>
          {formatAddress(account)}
        </AccountInfo>
      )}
    </WalletContainer>
  );
};