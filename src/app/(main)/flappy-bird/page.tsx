
"use client"; // Required for FlappyBirdGame component

import { Metadata } from 'next'; // Still can have metadata if needed at build time for the page itself
import { Gamepad2Icon } from 'lucide-react';
import FlappyBirdGame from '@/components/games/flappy-bird-game'; // Import the game component

// Metadata can still be defined for server rendering part of the page shell
// export const metadata: Metadata = {
//   title: 'Flappy Bird Game - Radio Haryanvi',
//   description: 'Play a fun game of Flappy Bird on Radio Haryanvi.',
// };

export default function FlappyBirdPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-12 text-center">
        <Gamepad2Icon className="w-24 h-24 text-primary mx-auto mb-6" />
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary mb-4">
          Flappy Bird Game
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Test your skills and see how far you can fly!
        </p>
      </header>

      <section className="max-w-md mx-auto text-center p-6 bg-card rounded-lg shadow-xl">
        <h2 className="font-headline text-2xl font-semibold text-primary mb-6">
          Game Area
        </h2>
        <FlappyBirdGame />
      </section>
    </div>
  );
}
