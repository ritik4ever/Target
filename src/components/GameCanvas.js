
import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text, useTexture } from '@react-three/drei';

const CanvasContainer = styled.div`
  width: 100%;
  height: 500px;
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
`;

const CanvasOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 2rem;
  text-shadow: 0 0 10px rgba(0, 0, 0, 0.7);
  z-index: 10;
  background-color: ${props => props.gameState === 'idle' ? 'rgba(0, 0, 0, 0.7)' : 'transparent'};
  transition: background-color 0.5s ease;
`;

const Crosshair = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 20px;
  height: 20px;
  border: 2px solid white;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 20;
  
  &::before, &::after {
    content: '';
    position: absolute;
    background-color: white;
  }
  
  &::before {
    width: 2px;
    height: 10px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  
  &::after {
    width: 10px;
    height: 2px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;

// Target component
const Target = ({ position, size, speed, hitCallback, removeCallback }) => {
  const mesh = useRef();
  const [hit, setHit] = useState(false);
  const [hoverColor, setHoverColor] = useState(0xff0000); // Red
  
  // Random target type with different point values
  const targetTypes = [
    { color: 0xff0000, points: 10 },  // Red - Common
    { color: 0x00ff00, points: 20 },  // Green - Uncommon
    { color: 0x0000ff, points: 30 },  // Blue - Rare
    { color: 0xffff00, points: 50 },  // Yellow - Epic
    { color: 0xff00ff, points: 100 }, // Magenta - Legendary
  ];
  
  const targetType = targetTypes[Math.floor(Math.random() * targetTypes.length)];
  
  useFrame(() => {
    if (mesh.current && !hit) {
      // Move target
      mesh.current.position.x += speed.x;
      mesh.current.position.y += speed.y;
      
      // Rotate target for visual effect
      mesh.current.rotation.x += 0.01;
      mesh.current.rotation.y += 0.01;
      
      // Check if target is out of bounds
      if (
        mesh.current.position.x > 10 || 
        mesh.current.position.x < -10 ||
        mesh.current.position.y > 10 || 
        mesh.current.position.y < -10
      ) {
        removeCallback();
      }
    }
  });
  
  const handleClick = (e) => {
    e.stopPropagation();
    if (!hit) {
      setHit(true);
      setHoverColor(0x00ff00); // Green when hit
      
      // Call hit callback with points
      hitCallback(targetType.points);
      
      // Remove after animation
      setTimeout(() => {
        removeCallback();
      }, 500);
    }
  };
  
  return (
    <mesh
      ref={mesh}
      position={position}
      onClick={handleClick}
      onPointerOver={() => setHoverColor(0xffff00)}
      onPointerOut={() => setHoverColor(targetType.color)}
    >
      <boxGeometry args={[size, size, size]} />
      <meshStandardMaterial color={hit ? 0x00ff00 : hoverColor} />
    </mesh>
  );
};

// Scene setup
const GameScene = ({ gameState, onTargetHit }) => {
  const [targets, setTargets] = useState([]);
  const targetIdCounter = useRef(0);
  const { camera } = useThree();
  
  // Set up camera
  useEffect(() => {
    camera.position.z = 15;
  }, [camera]);
  
  // Spawn targets at interval when game is playing
  useEffect(() => {
    let spawnInterval;
    
    const spawnTarget = () => {
      if (gameState === 'playing') {
        const newTarget = {
          id: targetIdCounter.current++,
          position: [
            (Math.random() - 0.5) * 18, // x between -9 and 9
            (Math.random() - 0.5) * 18, // y between -9 and 9
            -5
          ],
          size: Math.random() * 0.5 + 0.5, // size between 0.5 and 1
          speed: {
            x: (Math.random() - 0.5) * 0.05,
            y: (Math.random() - 0.5) * 0.05
          }
        };
        
        setTargets(prevTargets => [...prevTargets, newTarget]);
        
        // Limit number of targets
        if (targets.length > 20) {
          setTargets(prevTargets => prevTargets.slice(1));
        }
      }
    };
    
    if (gameState === 'playing') {
      spawnInterval = setInterval(spawnTarget, 800);
      
      // Initial targets
      for (let i = 0; i < 5; i++) {
        spawnTarget();
      }
    }
    
    return () => {
      clearInterval(spawnInterval);
    };
  }, [gameState]);
  
  // Handle target removal
  const removeTarget = (targetId) => {
    setTargets(prevTargets => prevTargets.filter(target => target.id !== targetId));
  };
  
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      
      {/* Background */}
      <mesh position={[0, 0, -10]}>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color={0x0a0b1c} />
      </mesh>
      
      {/* Game targets */}
      {targets.map(target => (
        <Target
          key={target.id}
          position={target.position}
          size={target.size}
          speed={target.speed}
          hitCallback={onTargetHit}
          removeCallback={() => removeTarget(target.id)}
        />
      ))}
      
      {/* Game state messages */}
      {gameState === 'idle' && (
        <Text
          position={[0, 0, 0]}
          color="white"
          fontSize={1}
          maxWidth={10}
          textAlign="center"
        >
          Click Start Game to begin
        </Text>
      )}
      
      {gameState === 'gameOver' && (
        <Text
          position={[0, 0, 0]}
          color="white"
          fontSize={1}
          maxWidth={10}
          textAlign="center"
        >
          Game Over
        </Text>
      )}
    </>
  );
};

// Main game canvas component
export const GameCanvas = ({ gameState, onTargetHit }) => {
  return (
    <CanvasContainer>
      <Canvas>
        <GameScene gameState={gameState} onTargetHit={onTargetHit} />
      </Canvas>
      
      <CanvasOverlay gameState={gameState}>
        {gameState === 'idle' && <p>Ready to play?</p>}
        {gameState === 'gameOver' && <p>Game Over!</p>}
      </CanvasOverlay>
      
      {gameState === 'playing' && <Crosshair />}
    </CanvasContainer>
  );
};