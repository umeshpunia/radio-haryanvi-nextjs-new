
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
const LIFT = -8;
const PIPE_WIDTH = 52;
const PIPE_GAP = 120; // Space between top and bottom pipe
const PIPE_SPACING = 200; // Horizontal distance between pipes
const PIPE_SPEED = 2;

type GameState = "START" | "PLAYING" | "GAME_OVER";

const FlappyBirdGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);
  
  const [gameState, setGameState] = useState<GameState>("START");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  // Bird properties
  const birdYRef = useRef(CANVAS_HEIGHT / 2 - BIRD_HEIGHT / 2);
  const birdVelocityRef = useRef(0);

  // Pipe properties
  const pipesRef = useRef<{ x: number; topPipeHeight: number }[]>([]);

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
    // Add initial pipes
    for (let i = 0; i < 2; i++) {
      pipesRef.current.push({
        x: CANVAS_WIDTH + i * PIPE_SPACING + 150, // Start pipes off-screen
        topPipeHeight: Math.random() * (CANVAS_HEIGHT / 2 - PIPE_GAP / 2) + PIPE_GAP / 4,
      });
    }
  }, []);
  
  useEffect(() => {
    resetGame(); // Initialize pipes on first load
  }, [resetGame]);


  const gameLoop = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    // Clear canvas
    ctx.fillStyle = 'skyblue'; // Game background
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    if (gameState === "PLAYING") {
      // Bird physics
      birdVelocityRef.current += GRAVITY;
      birdYRef.current += birdVelocityRef.current;

      // Pipe logic
      for (let i = pipesRef.current.length - 1; i >= 0; i--) {
        const pipe = pipesRef.current[i];
        pipe.x -= PIPE_SPEED;

        // Add new pipe if needed
        if (pipe.x + PIPE_WIDTH < -PIPE_SPACING/2 && pipesRef.current.length < 4) { // Ensure not too many pipes and it's well off screen
          pipesRef.current.push({
            x: Math.max(CANVAS_WIDTH, pipesRef.current[pipesRef.current.length -1].x + PIPE_SPACING), // Add new pipe based on last pipe's position
            topPipeHeight: Math.random() * (CANVAS_HEIGHT / 2 - PIPE_GAP / 2) + PIPE_GAP / 4,
          });
        }
        
        // Remove pipe if off-screen
        if (pipe.x + PIPE_WIDTH < 0) {
          pipesRef.current.splice(i, 1);
          continue; // Important: skip drawing and collision for removed pipe
        }

        // Collision detection
        const birdRight = BIRD_X + BIRD_WIDTH;
        const birdBottom = birdYRef.current + BIRD_HEIGHT;
        const pipeRight = pipe.x + PIPE_WIDTH;
        const bottomPipeY = pipe.topPipeHeight + PIPE_GAP;

        // Check collision with this pipe
        if (
          BIRD_X < pipeRight &&
          birdRight > pipe.x &&
          (birdYRef.current < pipe.topPipeHeight || birdBottom > bottomPipeY)
        ) {
          setGameState("GAME_OVER");
        }

        // Score
        if (pipe.x + PIPE_WIDTH < BIRD_X && !pipesRef.current[i].scored) {
           pipesRef.current[i].scored = true; // Mark as scored
           setScore(prevScore => prevScore + 1);
        }
      }

      // Ground and ceiling collision
      if (birdYRef.current + BIRD_HEIGHT > CANVAS_HEIGHT || birdYRef.current < 0) {
        setGameState("GAME_OVER");
      }
    }

    // Draw bird (simple yellow rectangle)
    ctx.fillStyle = 'yellow';
    ctx.fillRect(BIRD_X, birdYRef.current, BIRD_WIDTH, BIRD_HEIGHT);

    // Draw pipes (simple green rectangles)
    ctx.fillStyle = 'green';
    pipesRef.current.forEach(pipe => {
      ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.topPipeHeight); // Top pipe
      ctx.fillRect(pipe.x, pipe.topPipeHeight + PIPE_GAP, PIPE_WIDTH, CANVAS_HEIGHT - (pipe.topPipeHeight + PIPE_GAP)); // Bottom pipe
    });

    // Draw score
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);
    ctx.fillText(`High Score: ${highScore}`, 10, 60);

    if (gameState === "GAME_OVER") {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, CANVAS_HEIGHT / 2 - 50, CANVAS_WIDTH, 100);
      ctx.fillStyle = 'white';
      ctx.font = '30px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Game Over!', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 10);
      ctx.font = '16px Arial';
      ctx.fillText('Click or Space to Restart', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 20);
      ctx.textAlign = 'left'; // Reset
      if (score > highScore) {
        localStorage.setItem('flappyBirdHighScore', score.toString());
        setHighScore(score);
      }
    } else if (gameState === "START") {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, CANVAS_HEIGHT / 2 - 50, CANVAS_WIDTH, 100);
        ctx.fillStyle = 'white';
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Flappy Haryanvi Bird', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 -15);
        ctx.font = '16px Arial';
        ctx.fillText('Click or Space to Start', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 15);
        ctx.textAlign = 'left'; // Reset
    }


    if (gameState !== "GAME_OVER" || gameState === "PLAYING") { // Ensure loop continues for start screen too
       animationFrameIdRef.current = requestAnimationFrame(gameLoop);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState, score, highScore, resetGame]); // resetGame added here, but it's stable due to useCallback

  useEffect(() => {
    if (gameState === "PLAYING" || gameState === "START") { // also run loop on START to show start screen
      animationFrameIdRef.current = requestAnimationFrame(gameLoop);
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
      resetGame();
      setGameState("PLAYING");
    }
  }, [gameState, resetGame]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault(); // Prevent page scroll
        handleInput();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleInput]);

  return (
    <div className="flex flex-col items-center">
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        onClick={handleInput}
        className="border-2 border-primary rounded-md shadow-lg"
        data-ai-hint="flappy bird game canvas"
      />
      <div className="mt-4 flex space-x-4">
        {gameState !== "PLAYING" && (
             <Button onClick={handleInput} variant="default" size="lg">
                {gameState === "START" ? "Start Game" : "Restart Game"}
            </Button>
        )}
      </div>
       <p className="mt-4 text-sm text-muted-foreground">
        Click the game area or press Spacebar to flap.
      </p>
    </div>
  );
};

export default FlappyBirdGame;
