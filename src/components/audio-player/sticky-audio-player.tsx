
"use client";

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import {
  play,
  pause,
  setVolume,
  setDuration,
  playNext,
  setCurrentTrack,
  // setCurrentTime is not actively used for display, but Howler can provide it
} from '@/lib/redux/slices/audio-player-slice';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { PlayIcon, PauseIcon, Volume2Icon, VolumeXIcon, SkipForwardIcon } from 'lucide-react'; // Added SkipForwardIcon
import { cn } from '@/lib/utils';
import { Howl } from 'howler';

export function StickyAudioPlayer() {
  const dispatch = useAppDispatch();
  const { currentTrack, isPlaying, volume, playlist } = useAppSelector((state) => state.audioPlayer);
  const [howlInstance, setHowlInstance] = useState<Howl | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(volume);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Effect for initializing the live radio track (runs only client-side)
  useEffect(() => {
    if (isClient && !currentTrack && playlist.length === 0) {
      dispatch(setCurrentTrack({ 
        id: 'liveRadioHaryanvi', 
        title: 'Radio Haryanvi Live', 
        artist: 'Live Stream', 
        url: 'https://listen.weareharyanvi.com/listen', 
        coverArt: 'https://placehold.co/100x100.png' 
      }));
    }
  }, [dispatch, currentTrack, playlist, isClient]);

  // Effect for creating/unloading Howl instance when currentTrack changes
  useEffect(() => {
    if (!isClient || !currentTrack) {
      if (howlInstance) {
        howlInstance.unload();
        setHowlInstance(null);
      }
      return;
    }

    // Unload previous Howl instance if it exists
    if (howlInstance) {
      howlInstance.unload();
    }

    const newHowl = new Howl({
      src: [currentTrack.url],
      html5: true, // Recommended for streaming and larger files
      volume: isMuted ? 0 : volume,
      format: ['mp3', 'aac'], // Specify formats if known, good for live streams
      onload: () => {
        dispatch(setDuration(newHowl.duration()));
      },
      onplay: () => {
        if (!isPlaying) dispatch(play()); 
      },
      onpause: () => {
        if (isPlaying) dispatch(pause());
      },
      onend: () => {
        // For live streams, onend might not be relevant unless the stream itself ends.
        // If you have a playlist of streams, you could dispatch(playNext()); 
        dispatch(pause()); // Or simply pause
      },
      onloaderror: (id, error) => {
        console.error(
          `Howler load error (code: ${error}) for track URL: ${currentTrack.url}.`,
          `Error code descriptions:`,
          `1. ABORTED: The loading of the audio file was aborted.`,
          `2. NETWORK: A network error occurred while fetching the audio file.`,
          `   - Check CORS settings on the server (${new URL(currentTrack.url).origin}). It needs 'Access-Control-Allow-Origin'.`,
          `   - Verify the stream URL is correct and the stream is online.`,
          `   - Ensure no mixed content issues (HTTPS app trying to load HTTP stream).`,
          `3. DECODE: The audio file could not be decoded.`,
          `4. SRC_NOT_SUPPORTED: The audio source is not supported or the URL is invalid.`
        );
        dispatch(pause()); // Ensure UI reflects that nothing is playing
        // Potentially dispatch an error action to show in UI
      },
      onplayerror: (id, error) => {
        console.error(
          `Howler play error (code: ${error}) for track ID: ${currentTrack.id}, URL: ${currentTrack.url}.`,
          `Common reasons:`,
          `1. AUDIO_LOCKED: Playback was blocked until a user interaction (e.g., click).`,
          `2. NETWORK/DECODE issues after loading.`
        );
        dispatch(pause()); // Ensure isPlaying is false if playback fails
      },
    });

    setHowlInstance(newHowl);

    return () => {
      newHowl.unload();
      setHowlInstance(null); // Clean up on component unmount or track change
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrack, dispatch, isClient]); // isMuted and volume are handled in separate effects

  // Effect for handling play/pause based on Redux state
  useEffect(() => {
    if (!howlInstance || !isClient) return;

    if (isPlaying && !howlInstance.playing()) {
      howlInstance.play();
    } else if (!isPlaying && howlInstance.playing()) {
      howlInstance.pause();
    }
  }, [isPlaying, howlInstance, isClient]);

  // Effect for handling volume changes
  useEffect(() => {
    if (!howlInstance || !isClient) return;
    howlInstance.volume(isMuted ? 0 : volume);
  }, [volume, isMuted, howlInstance, isClient]);


  const handlePlayPause = useCallback(() => {
    if (!currentTrack && playlist.length > 0) {
        dispatch(setCurrentTrack(playlist[0]));
        // Play will be triggered by the useEffect hook for isPlaying
        dispatch(play()); 
        return;
    }

    if (isPlaying) {
      dispatch(pause());
    } else {
      if (currentTrack) { 
        dispatch(play());
      }
    }
  }, [dispatch, isPlaying, currentTrack, playlist]);

  const handleVolumeChange = useCallback((value: number[]) => {
    const newVolume = value[0];
    dispatch(setVolume(newVolume));
    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
    } else if (newVolume === 0 && !isMuted) {
      setIsMuted(true);
    }
  }, [dispatch, isMuted]);

  const toggleMute = useCallback(() => {
    if (isMuted) {
      setIsMuted(false);
      dispatch(setVolume(previousVolume > 0 ? previousVolume : 0.1));
    } else {
      setPreviousVolume(volume);
      setIsMuted(true);
      dispatch(setVolume(0));
    }
  }, [dispatch, isMuted, volume, previousVolume]);
  
  // Handler for playNext, assuming you might add a button for it
  const handlePlayNext = useCallback(() => {
    dispatch(playNext());
  }, [dispatch]);

  if (!isClient || !currentTrack) { 
    return null; 
  }

  return (
    <div className={cn(
      "fixed left-0 right-0 z-40 border-t bg-background/95 p-3 backdrop-blur supports-[backdrop-filter]:bg-background/60",
      "bottom-[calc(4.5rem+env(safe-area-inset-bottom)+0.5rem)] md:bottom-2" 
      // Adjusted bottom position for mobile and desktop based on layout.tsx
    )}>
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Image 
            src={currentTrack.coverArt || "https://placehold.co/40x40.png"} 
            alt={currentTrack.title} 
            width={40} height={40} 
            className="rounded"
            data-ai-hint="radio live stream"
          />
          <div>
            <p className="text-sm font-semibold truncate max-w-[100px] sm:max-w-[150px] md:max-w-xs">{currentTrack.title}</p>
            <p className="text-xs text-muted-foreground truncate max-w-[100px] sm:max-w-[150px] md:max-w-xs">{currentTrack.artist}</p>
          </div>
        </div>

        <div className="flex items-center space-x-1 md:space-x-2">
            {/* Add SkipPrevious button if needed */}
            <Button variant="ghost" size="icon" onClick={handlePlayPause} className="w-10 h-10">
              {isPlaying ? <PauseIcon className="h-6 w-6" /> : <PlayIcon className="h-6 w-6" />}
            </Button>
            {/* Example: Add SkipNext button - this requires playlist functionality to be fully implemented
            {playlist.length > 1 && (
              <Button variant="ghost" size="icon" onClick={handlePlayNext} className="w-8 h-8">
                <SkipForwardIcon className="h-5 w-5" />
              </Button>
            )}
            */}
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
            className="hidden w-20 md:flex md:w-24" // Adjusted width
          />
        </div>
      </div>
    </div>
  );
}

