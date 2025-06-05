
"use client";

import { Gamepad2Icon } from 'lucide-react';
import FlappyBirdGame from '@/components/games/flappy-bird-game'; 
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MobileSubPageHeader } from '@/components/layout/mobile-subpage-header';

export default function FlappyBirdPage() {
  return (
    <>
      <MobileSubPageHeader title="Flappy Bird" />
      <div className="container mx-auto px-4 py-8 md:py-0"> {/* Adjusted py for mobile */}
        <header className="mb-12 text-center">
          <Gamepad2Icon className="w-24 h-24 text-primary mx-auto mb-6" />
          <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary mb-4">
            Flappy Haryanvi Bird
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Test your skills and see how far the Haryanvi bird can fly! Click or press Spacebar to flap.
          </p>
        </header>

        <section className="max-w-md mx-auto">
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="text-center font-headline text-2xl">Game Area</CardTitle>
              <CardDescription className="text-center text-sm">
                Click the game canvas or press Spacebar to make the bird flap.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center p-4 md:p-6">
              <FlappyBirdGame />
            </CardContent>
          </Card>
        </section>
      </div>
    </>
  );
}
