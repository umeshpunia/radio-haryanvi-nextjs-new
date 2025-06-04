
"use client";

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';

// Game constants
const CANVAS_WIDTH = 320;
const CANVAS_HEIGHT = 480;
const BIRD_WIDTH = 34;
const BIRD_HEIGHT = 24;
const BIRD_X = 50;
const GRAVITY = 0.5;
const LIFT = -8; // Adjusted for a slightly more responsive flap
const PIPE_WIDTH = 52;
const PIPE_GAP = 120; 
const PIPE_SPACING = 200; 
const PIPE_SPEED = 2;

type GameState = "START" | "PLAYING" | "GAME_OVER";

const FlappyBirdGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);
  
  const [gameState, setGameState] = useState<GameState>("START");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const birdYRef = useRef(CANVAS_HEIGHT / 2 - BIRD_HEIGHT / 2);
  const birdVelocityRef = useRef(0);
  const pipesRef = useRef<{ x: number; topPipeHeight: number; scored?: boolean }[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedHighScore = localStorage.getItem('flappyBirdHighScore');
      if (storedHighScore) {
        setHighScore(parseInt(storedHighScore, 10));
      }
    }
  }, []);

  const resetGame = useCallback(() => {
    birdYRef.current = CANVAS_HEIGHT / 2 - BIRD_HEIGHT / 2;
    birdVelocityRef.current = 0;
    pipesRef.current = [];
    setScore(0);
    // Add initial pipes starting further off-screen
    for (let i = 0; i < 2; i++) {
      pipesRef.current.push({
        x: CANVAS_WIDTH + i * PIPE_SPACING + PIPE_SPACING, // Ensure they start well off screen
        topPipeHeight: Math.random() * (CANVAS_HEIGHT / 2.5 - PIPE_GAP / 2) + PIPE_GAP / 3, // More varied pipe heights
        scored: false,
      });
    }
  }, []);
  
  useEffect(() => {
    resetGame(); 
  }, [resetGame]);


  const gameLoop = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    // Clear canvas - Sky blue background
    ctx.fillStyle = '#70c5ce'; 
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    if (gameState === "PLAYING") {
      // Bird physics
      birdVelocityRef.current += GRAVITY;
      birdYRef.current += birdVelocityRef.current;

      // Pipe logic
      for (let i = pipesRef.current.length - 1; i >= 0; i--) {
        const pipe = pipesRef.current[i];
        pipe.x -= PIPE_SPEED;

        // Add new pipe if the last pipe is far enough and we need more pipes
        if (pipesRef.current.length < 3 && pipe.x < CANVAS_WIDTH - PIPE_SPACING + PIPE_SPEED) {
           if (pipesRef.current.every(p => p.x < CANVAS_WIDTH - PIPE_SPACING)) { // ensure new pipe is spaced out
            pipesRef.current.push({
              x: CANVAS_WIDTH + PIPE_SPACING / 2, // Start new pipe off-screen
              topPipeHeight: Math.random() * (CANVAS_HEIGHT / 2.5 - PIPE_GAP / 2) + PIPE_GAP / 3,
              scored: false,
            });
          }
        }
        
        // Remove pipe if off-screen
        if (pipe.x + PIPE_WIDTH < 0) {
          pipesRef.current.splice(i, 1);
          continue; 
        }

        // Collision detection
        const birdRight = BIRD_X + BIRD_WIDTH;
        const birdBottom = birdYRef.current + BIRD_HEIGHT;
        const pipeRight = pipe.x + PIPE_WIDTH;
        const bottomPipeY = pipe.topPipeHeight + PIPE_GAP;

        if (
          BIRD_X < pipeRight &&
          birdRight > pipe.x &&
          (birdYRef.current < pipe.topPipeHeight || birdBottom > bottomPipeY)
        ) {
          setGameState("GAME_OVER");
        }

        // Score
        if (pipe.x + PIPE_WIDTH < BIRD_X && !pipe.scored) {
           pipe.scored = true; 
           setScore(prevScore => prevScore + 1);
        }
      }

      // Ground and ceiling collision
      if (birdYRef.current + BIRD_HEIGHT > CANVAS_HEIGHT -10) { // Hit ground (added small buffer)
        birdYRef.current = CANVAS_HEIGHT - BIRD_HEIGHT -10; // Prevent sinking
        setGameState("GAME_OVER");
      }
      if (birdYRef.current < 0) { // Hit ceiling
        birdYRef.current = 0; // Prevent going above
        setGameState("GAME_OVER");
      }
    }

    // Draw pipes (green)
    ctx.fillStyle = '#74BF2E'; // Pipe color
    ctx.strokeStyle = '#54882A'; // Pipe border
    ctx.lineWidth = 2;
    pipesRef.current.forEach(pipe => {
      // Top pipe
      ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.topPipeHeight); 
      ctx.strokeRect(pipe.x, 0, PIPE_WIDTH, pipe.topPipeHeight);
      // Bottom pipe
      const bottomPipeY = pipe.topPipeHeight + PIPE_GAP;
      ctx.fillRect(pipe.x, bottomPipeY, PIPE_WIDTH, CANVAS_HEIGHT - bottomPipeY); 
      ctx.strokeRect(pipe.x, bottomPipeY, PIPE_WIDTH, CANVAS_HEIGHT - bottomPipeY);
    });

    // Draw bird (yellow with a small black eye)
    ctx.fillStyle = 'yellow';
    ctx.fillRect(BIRD_X, birdYRef.current, BIRD_WIDTH, BIRD_HEIGHT);
    ctx.fillStyle = 'black';
    ctx.fillRect(BIRD_X + BIRD_WIDTH * 0.7, birdYRef.current + BIRD_HEIGHT * 0.3, 4, 4); // Eye


    // Draw score
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'left';
    ctx.strokeText(`Score: ${score}`, 10, 30);
    ctx.fillText(`Score: ${score}`, 10, 30);
    ctx.strokeText(`High: ${highScore}`, 10, 60);
    ctx.fillText(`High: ${highScore}`, 10, 60);


    if (gameState === "GAME_OVER") {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.fillRect(CANVAS_WIDTH / 2 - 100, CANVAS_HEIGHT / 2 - 60, 200, 120);
      
      ctx.fillStyle = 'white';
      ctx.font = 'bold 30px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Game Over!', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 15);
      ctx.font = '16px Arial';
      ctx.fillText('Click or Space', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 15);
      ctx.fillText('to Restart', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 35);

      if (score > highScore) {
        localStorage.setItem('flappyBirdHighScore', score.toString());
        setHighScore(score);
      }
    } else if (gameState === "START") {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.fillRect(CANVAS_WIDTH / 2 - 120, CANVAS_HEIGHT / 2 - 60, 240, 120);
        
        ctx.fillStyle = 'white';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Flappy Haryanvi Bird', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 -15);
        ctx.font = '16px Arial';
        ctx.fillText('Click or Space to Start', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 15);
    }
    ctx.textAlign = 'left'; // Reset text align

    if (gameState === "PLAYING" || gameState === "START") { 
       animationFrameIdRef.current = requestAnimationFrame(gameLoop);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState, score, highScore, resetGame]); 

  useEffect(() => {
    if (gameState === "PLAYING" || gameState === "START") { 
      animationFrameIdRef.current = requestAnimationFrame(gameLoop);
    } else if (gameState === "GAME_OVER" && animationFrameIdRef.current) {
       // Ensure gameLoop is explicitly called once to draw "Game Over" screen
       // then stop further animation frames until restart.
       gameLoop(); // Draw the game over screen
       cancelAnimationFrame(animationFrameIdRef.current);
       animationFrameIdRef.current = null;
    }
    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [gameState, gameLoop]);

  const handleInput = useCallback(() => {
    if (gameState === "PLAYING") {
      birdVelocityRef.current = LIFT;
    } else if (gameState === "GAME_OVER" || gameState === "START") {
      resetGame(); // Reset game state variables
      setGameState("PLAYING"); // This will trigger the useEffect to start the gameLoop
    }
  }, [gameState, resetGame]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Mouse click listener on canvas
    canvas.addEventListener('click', handleInput);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault(); 
        handleInput();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
        if (canvas) {
            canvas.removeEventListener('click', handleInput);
        }
        window.removeEventListener('keydown', handleKeyDown);
    }
  }, [handleInput]); // handleInput is stable due to useCallback

  return (
    <div className="flex flex-col items-center">
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        // onClick={handleInput} // Moved to useEffect for better event management
        className="border-2 border-primary rounded-md shadow-lg bg-[#70c5ce]" // Added bg color as fallback
        data-ai-hint="flappy bird game canvas"
      />
      <div className="mt-6 flex space-x-4">
        {(gameState === "START" || gameState === "GAME_OVER") && (
             <Button onClick={handleInput} variant="default" size="lg" className="font-semibold">
                {gameState === "START" ? "Start Game" : "Restart Game"}
            </Button>
        )}
      </div>
      { (gameState === "START" || gameState === "GAME_OVER") &&
        <p className="mt-3 text-sm text-muted-foreground">
            Tip: Click the button, game area, or press Spacebar.
        </p>
      }
    </div>
  );
};

export default FlappyBirdGame;
