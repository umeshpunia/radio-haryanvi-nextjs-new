
"use client";

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import {
  play,
  pause,
  setVolume,
  setCurrentTime, // Kept for potential future use or internal logic, though not directly used by removed elements
  setDuration,  // Kept for potential future use or internal logic
  playNext,
  playPrevious,
  setCurrentTrack, // For initial load or testing
} from '@/lib/redux/slices/audio-player-slice';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { PlayIcon, PauseIcon, Volume2Icon, VolumeXIcon } from 'lucide-react'; // Removed SkipBackIcon, SkipForwardIcon
import { cn } from '@/lib/utils';

export function StickyAudioPlayer() {
  const dispatch = useAppDispatch();
  const { currentTrack, isPlaying, volume, currentTime, duration, playlist } = useAppSelector((state) => state.audioPlayer);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(volume);

  // Test track for development
  useEffect(() => {
    if (!currentTrack && playlist.length === 0) {
       dispatch(setCurrentTrack({ id: 'test1', title: 'Radio Hub Intro', artist: 'Haryanvi Beats', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', coverArt: 'https://placehold.co/100x100.png' }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);


  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(error => console.error("Error playing audio:", error));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrack]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const handlePlayPause = () => {
    if (isPlaying) {
      dispatch(pause());
    } else {
      dispatch(play());
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    dispatch(setVolume(newVolume));
    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
    } else if (newVolume === 0 && !isMuted) {
      setIsMuted(true);
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      dispatch(setVolume(previousVolume > 0 ? previousVolume : 0.1)); // Restore previous or small volume
    } else {
      setPreviousVolume(volume); // Save current volume
      setIsMuted(true);
      dispatch(setVolume(0));
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      dispatch(setCurrentTime(audioRef.current.currentTime));
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      dispatch(setDuration(audioRef.current.duration));
    }
  };

  // handleSeek is no longer needed as slider is removed
  // const handleSeek = (value: number[]) => {
  //   if (audioRef.current) {
  //     audioRef.current.currentTime = value[0];
  //     dispatch(setCurrentTime(value[0]));
  //   }
  // };

  // formatTime is no longer needed as time display is removed
  // const formatTime = (time: number) => {
  //   const minutes = Math.floor(time / 60);
  //   const seconds = Math.floor(time % 60).toString().padStart(2, '0');
  //   return `${minutes}:${seconds}`;
  // };

  if (!currentTrack) {
    return null; 
  }

  return (
    <div className={cn(
      "fixed left-0 right-0 z-40 border-t bg-background/95 p-3 backdrop-blur supports-[backdrop-filter]:bg-background/60",
      // Mobile: position 0.5rem (theme.spacing.2) above the mobile nav (4.5rem + safe area)
      // Desktop: position 0.5rem (theme.spacing.2) from the bottom of the viewport
      "bottom-[calc(4.5rem+env(safe-area-inset-bottom)+0.5rem)] md:bottom-2"
    )}>
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => dispatch(playNext())} // Still dispatch playNext on ended, even if button is removed
        onError={(e) => console.error("Audio error:", e)}
      />
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Image 
            src={currentTrack.coverArt || "https://placehold.co/40x40.png"} 
            alt={currentTrack.title} 
            width={40} height={40} 
            className="rounded"
            data-ai-hint="music album"
          />
          <div>
            <p className="text-sm font-semibold truncate max-w-[150px] md:max-w-xs">{currentTrack.title}</p>
            <p className="text-xs text-muted-foreground truncate max-w-[150px] md:max-w-xs">{currentTrack.artist}</p>
          </div>
        </div>

        <div className="flex flex-col items-center space-y-1 md:min-w-[auto]"> {/* Adjusted min-w */}
          <div className="flex items-center space-x-2">
            {/* Previous button removed */}
            <Button variant="ghost" size="icon" onClick={handlePlayPause} className="w-10 h-10">
              {isPlaying ? <PauseIcon className="h-6 w-6" /> : <PlayIcon className="h-6 w-6" />}
            </Button>
            {/* Next button removed */}
          </div>
          {/* Progress bar and time display removed */}
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={toggleMute}>
            {isMuted || volume === 0 ? <VolumeXIcon className="h-5 w-5" /> : <Volume2Icon className="h-5 w-5" />}
          </Button>
          <Slider
            value={[isMuted ? 0 : volume]}
            max={1}
            step={0.01}
            onValueChange={handleVolumeChange}
            className="hidden w-24 md:flex"
          />
        </div>
      </div>
    </div>
  );
}
