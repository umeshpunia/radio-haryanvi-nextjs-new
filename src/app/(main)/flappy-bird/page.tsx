
import { Metadata } from 'next';
import { Gamepad2Icon } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Flappy Bird Game - Radio Haryanvi',
  description: 'Play a fun game of Flappy Bird on Radio Haryanvi.',
};

export default function FlappyBirdPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-12 text-center">
        <Gamepad2Icon className="w-24 h-24 text-primary mx-auto mb-6" />
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary mb-4">
          Flappy Bird Game
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Get ready to flap! This game is under construction. Check back soon!
        </p>
      </header>

      <section className="max-w-md mx-auto text-center p-8 bg-card rounded-lg shadow-xl">
        <h2 className="font-headline text-2xl font-semibold text-primary mb-4">
          Game Area
        </h2>
        <p className="text-muted-foreground">
          The Flappy Bird game will be displayed here. We are working on bringing this fun feature to you.
        </p>
        {/* Placeholder for game canvas or component */}
        <div className="mt-6 w-full h-64 bg-muted rounded-md flex items-center justify-center">
          <p className="text-muted-foreground">Game Coming Soon!</p>
        </div>
      </section>
    </div>
  );
}
