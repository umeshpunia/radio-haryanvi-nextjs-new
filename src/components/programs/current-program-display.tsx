
"use client";

import { useState, useEffect } from 'react';
import { programSchedule, getCurrentProgram, ProgramSlot } from '@/lib/program-schedule';

export function CurrentProgramDisplay() {
  const [currentProgram, setCurrentProgram] = useState<ProgramSlot | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const updateProgram = () => {
    const now = new Date();
    // IST is UTC+5:30
    const istTime = new Date(now.valueOf() + (5.5 * 60 * 60 * 1000));
    const istHour = istTime.getUTCHours();
    const istMinute = istTime.getUTCMinutes();
    
    const program = getCurrentProgram(programSchedule, istHour, istMinute);
    setCurrentProgram(program);
    setIsLoading(false);
  };

  useEffect(() => {
    updateProgram(); // Initial call
    const intervalId = setInterval(updateProgram, 60000); // Update every minute

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  if (isLoading) {
    return <span className="text-base md:text-lg text-gray-200 animate-pulse">Loading program...</span>;
  }

  return (
    <p className="text-base md:text-lg text-gray-200">
      Currently Live: <span className="font-semibold text-white">{currentProgram ? currentProgram.name : "Radio Haryanvi"}</span>
    </p>
  );
}
