// src/App.js
import React from 'react';
import styled from 'styled-components';
import Game from './components/Game';

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0f1e 0%, #1a1a3a 100%);
  padding: 40px 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 40px;
`;

const Title = styled.h1`
  color: white;
  font-size: 3rem;
  margin-bottom: 10px;
`;

const Subtitle = styled.p`
  color: #bbb;
  font-size: 1.2rem;
`;

const Footer = styled.footer`
  text-align: center;
  margin-top: 50px;
  padding: 20px;
  color: #888;
  font-size: 0.9rem;
`;

function App() {
  return (
    <AppContainer>
      <Header>
        <Title>Monad Target Blaster</Title>
        <Subtitle>Shoot targets, earn NFTs, dominate the leaderboard!</Subtitle>
      </Header>
      
      <Game />
      
      <Footer>
        <p>Built on Monad Blockchain | HackHazards 2025</p>
      </Footer>
    </AppContainer>
  );
}

export default App;