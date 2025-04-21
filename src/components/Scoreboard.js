// src/components/Scoreboard.js
import React from 'react';
import styled from 'styled-components';

const ScoreboardContainer = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: #1a1b2e;
  padding: 15px 20px;
  border-radius: 10px;
  margin-top: 20px;
`;

const ScoreItem = styled.div`
  text-align: center;
`;

const ScoreLabel = styled.p`
  margin: 0;
  color: #aaa;
  font-size: 14px;
`;

const ScoreValue = styled.p`
  font-size: 24px;
  font-weight: bold;
  color: #5e43ff;
  margin: 5px 0 0;
`;

export const Scoreboard = ({ score, targetsHit }) => {
  return (
    <ScoreboardContainer>
      <ScoreItem>
        <ScoreLabel>Score</ScoreLabel>
        <ScoreValue>{score}</ScoreValue>
      </ScoreItem>
      
      <ScoreItem>
        <ScoreLabel>Targets Hit</ScoreLabel>
        <ScoreValue>{targetsHit}</ScoreValue>
      </ScoreItem>
    </ScoreboardContainer>
  );
};