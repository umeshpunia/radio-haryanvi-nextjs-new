
"use client";

import { useEffect, useState, useCallback, useRef } from 'react';
import Image from 'next/image';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import {
  play,
  pause,
  setVolume,
  setDuration,
  setCurrentTrack,
  updateCurrentTrackMetadata,
  // setCurrentTime is not actively used for display, but Howler can provide it
} from '@/lib/redux/slices/audio-player-slice';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { PlayIcon, PauseIcon, Volume2Icon, VolumeXIcon, SkipForwardIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Howl } from 'howler';

// IMPORTANT: Replace this with the actual metadata URL from your stream provider
const METADATA_URL_PLACEHOLDER = 'YOUR_METADATA_URL_HERE'; 
const METADATA_FETCH_INTERVAL = 15000; // Fetch metadata every 15 seconds

export function StickyAudioPlayer() {
  const dispatch = useAppDispatch();
  const { currentTrack, isPlaying, volume, playlist } = useAppSelector((state) => state.audioPlayer);
  const [howlInstance, setHowlInstance] = useState<Howl | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(volume);
  const [isClient, setIsClient] = useState(false);
  const metadataIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Effect for initializing the live radio track
  useEffect(() => {
    if (isClient && !currentTrack && playlist.length === 0) {
      dispatch(setCurrentTrack({ 
        id: 'liveRadioHaryanvi', 
        title: 'Radio Haryanvi Live', 
        artist: 'Live Stream', 
        url: 'https://listen.weareharyanvi.com/listen', 
        coverArt: 'https://placehold.co/100x100.png',
        currentSongTitle: null,
        currentSongArtist: null,
      }));
    }
  }, [dispatch, currentTrack, playlist, isClient]);

  // Effect for creating/unloading Howl instance
  useEffect(() => {
    if (!isClient || !currentTrack) {
      if (howlInstance) {
        howlInstance.unload();
        setHowlInstance(null);
      }
      return;
    }

    if (howlInstance) {
      howlInstance.unload();
    }

    const newHowl = new Howl({
      src: [currentTrack.url],
      html5: true,
      volume: isMuted ? 0 : volume,
      format: ['mp3', 'aac'],
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
        dispatch(pause());
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
        dispatch(pause());
      },
      onplayerror: (id, error) => {
        console.error(
          `Howler play error (code: ${error}) for track ID: ${currentTrack.id}, URL: ${currentTrack.url}.`,
          `Common reasons:`,
          `1. AUDIO_LOCKED: Playback was blocked until a user interaction (e.g., click).`,
          `2. NETWORK/DECODE issues after loading.`
        );
        dispatch(pause());
      },
    });

    setHowlInstance(newHowl);

    return () => {
      newHowl.unload();
      setHowlInstance(null);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrack?.url, dispatch, isClient]); // Only re-init Howl if URL changes

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

  // Effect for fetching stream metadata
  useEffect(() => {
    const fetchMetadata = async () => {
      if (!currentTrack || currentTrack.id !== 'liveRadioHaryanvi' || METADATA_URL_PLACEHOLDER === 'YOUR_METADATA_URL_HERE') {
        return;
      }
      try {
        const response = await fetch(METADATA_URL_PLACEHOLDER);
        if (!response.ok) {
          console.warn(`Failed to fetch metadata: ${response.status} ${response.statusText}`);
          return;
        }
        const data = await response.json();
        // Adjust these keys based on your metadata provider's JSON structure
        const songTitle = data.title || data.songtitle || data.song || null;
        const songArtist = data.artist || null;
        
        dispatch(updateCurrentTrackMetadata({ title: songTitle, artist: songArtist }));

      } catch (error) {
        console.warn('Error fetching or parsing stream metadata:', error);
      }
    };

    if (isClient && isPlaying && currentTrack && currentTrack.id === 'liveRadioHaryanvi') {
      fetchMetadata(); // Fetch immediately on play
      if (metadataIntervalRef.current) clearInterval(metadataIntervalRef.current);
      metadataIntervalRef.current = setInterval(fetchMetadata, METADATA_FETCH_INTERVAL);
    } else {
      if (metadataIntervalRef.current) {
        clearInterval(metadataIntervalRef.current);
        metadataIntervalRef.current = null;
      }
    }

    return () => {
      if (metadataIntervalRef.current) {
        clearInterval(metadataIntervalRef.current);
        metadataIntervalRef.current = null;
      }
    };
  }, [isClient, isPlaying, currentTrack, dispatch]);


  const handlePlayPause = useCallback(() => {
    if (!currentTrack && playlist.length > 0) {
        dispatch(setCurrentTrack(playlist[0]));
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
  
  if (!isClient || !currentTrack) { 
    return null; 
  }

  const displayTitle = currentTrack.currentSongTitle || currentTrack.title;
  const displayArtist = currentTrack.currentSongArtist || currentTrack.artist;

  return (
    <div className={cn(
      "fixed left-0 right-0 z-40 border-t bg-background/95 p-3 backdrop-blur supports-[backdrop-filter]:bg-background/60",
      "bottom-[calc(4.5rem+env(safe-area-inset-bottom)+0.5rem)] md:bottom-2" 
    )}>
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Image 
            src={currentTrack.coverArt || "https://placehold.co/40x40.png"} 
            alt={displayTitle} 
            width={40} height={40} 
            className="rounded"
            data-ai-hint="radio live stream"
          />
          <div>
            <p className="text-sm font-semibold truncate max-w-[100px] sm:max-w-[150px] md:max-w-xs">{displayTitle}</p>
            <p className="text-xs text-muted-foreground truncate max-w-[100px] sm:max-w-[150px] md:max-w-xs">{displayArtist}</p>
          </div>
        </div>

        <div className="flex items-center space-x-1 md:space-x-2">
            <Button variant="ghost" size="icon" onClick={handlePlayPause} className="w-10 h-10">
              {isPlaying ? <PauseIcon className="h-6 w-6" /> : <PlayIcon className="h-6 w-6" />}
            </Button>
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
            className="hidden w-20 md:flex md:w-24"
          />
        </div>
      </div>
    </div>
  );
}
