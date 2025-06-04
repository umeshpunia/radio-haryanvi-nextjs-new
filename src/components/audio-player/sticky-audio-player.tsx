
"use client";

import { useEffect, useState, useCallback, useRef } from 'react';
import Image from 'next/image';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import {
  play,
  pause,
  setVolume, // Keep setVolume for initial setting or if controlled elsewhere
  setDuration,
  setCurrentTrack,
  updateCurrentTrackMetadata,
} from '@/lib/redux/slices/audio-player-slice';
import { Button } from '@/components/ui/button';
import { PlayIcon, PauseIcon } from 'lucide-react'; // Removed Volume icons
import { cn } from '@/lib/utils';
import { Howl } from 'howler';

const METADATA_URL = 'https://listen.weareharyanvi.com/'; 
const METADATA_FETCH_INTERVAL = 15000; 

export function StickyAudioPlayer() {
  const dispatch = useAppDispatch();
  const { currentTrack, isPlaying, volume, playlist } = useAppSelector((state) => state.audioPlayer);
  const [howlInstance, setHowlInstance] = useState<Howl | null>(null);
  const [isClient, setIsClient] = useState(false);
  const metadataIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

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
      volume: volume, // Use Redux volume, not isMuted
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
  }, [currentTrack?.url, dispatch, isClient]); 

  useEffect(() => {
    if (!howlInstance || !isClient) return;

    if (isPlaying && !howlInstance.playing()) {
      howlInstance.play();
    } else if (!isPlaying && howlInstance.playing()) {
      howlInstance.pause();
    }
  }, [isPlaying, howlInstance, isClient]);

  useEffect(() => {
    if (!howlInstance || !isClient) return;
    howlInstance.volume(volume); // Update Howler's volume if Redux volume changes
  }, [volume, howlInstance, isClient]);

  useEffect(() => {
    const fetchMetadata = async () => {
      if (!currentTrack || currentTrack.id !== 'liveRadioHaryanvi' || !METADATA_URL) {
        return;
      }
      try {
        const response = await fetch(METADATA_URL);
        if (!response.ok) {
          console.warn(`Failed to fetch metadata: ${response.status} ${response.statusText} from ${METADATA_URL}`);
          return;
        }
        const data = await response.json();
        const songTitle = data.title || data.songtitle || data.song || null;
        const songArtist = data.artist || null;
        
        dispatch(updateCurrentTrackMetadata({ title: songTitle, artist: songArtist }));

      } catch (error) {
        console.warn(`Error fetching or parsing stream metadata from ${METADATA_URL}:`, error);
      }
    };

    if (isClient && isPlaying && currentTrack && currentTrack.id === 'liveRadioHaryanvi') {
      fetchMetadata(); 
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
        <div className="flex items-center space-x-3 flex-grow min-w-0"> {/* Added flex-grow and min-w-0 */}
          <Image 
            src={currentTrack.coverArt || "https://placehold.co/40x40.png"} 
            alt={displayTitle} 
            width={40} height={40} 
            className="rounded flex-shrink-0" // Added flex-shrink-0
            data-ai-hint="radio live stream"
          />
          <div className="min-w-0"> {/* Added min-w-0 for truncation */}
            <p className="text-sm font-semibold truncate max-w-[150px] sm:max-w-[200px] md:max-w-xs">{displayTitle}</p>
            <p className="text-xs text-muted-foreground truncate max-w-[150px] sm:max-w-[200px] md:max-w-xs">{displayArtist}</p>
          </div>
        </div>

        <div className="flex items-center space-x-1 md:space-x-2 flex-shrink-0"> {/* Added flex-shrink-0 */}
            <Button variant="ghost" size="icon" onClick={handlePlayPause} className="w-10 h-10">
              {isPlaying ? <PauseIcon className="h-6 w-6" /> : <PlayIcon className="h-6 w-6" />}
            </Button>
        </div>
      </div>
    </div>
  );
}
