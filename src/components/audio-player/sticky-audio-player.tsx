
"use client";

import { useEffect, useState, useCallback, useRef } from 'react';
import Image from 'next/image';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import {
  play,
  pause,
  setDuration,
  setCurrentTrack,
  updateCurrentTrackMetadata,
} from '@/lib/redux/slices/audio-player-slice';
import { Button } from '@/components/ui/button';
import { PlayIcon, PauseIcon, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Howl } from 'howler';
import { useAppSettings } from '@/contexts/app-settings-context';

const LIVE_RADIO_TRACK_ID = 'liveRadioHaryanvi';
const METADATA_FETCH_INTERVAL = 15000; // 15 seconds

export function StickyAudioPlayer() {
  const dispatch = useAppDispatch();
  const isPlayingRef = useRef<boolean>(false);
  const { currentTrack, isPlaying, volume, playlist } = useAppSelector((state) => {
    isPlayingRef.current = state.audioPlayer.isPlaying;
    return state.audioPlayer;
  });

  const { streamingUrl: firestoreStreamingUrl, metaDataUrl: firestoreMetaDataUrl } = useAppSettings();

  // Define default fallbacks directly
  const LIVE_RADIO_URL = firestoreStreamingUrl || 'https://listen.weareharyanvi.com/listen';
  const METADATA_URL_CONTEXT = firestoreMetaDataUrl || 'https://listen.weareharyanvi.com/status-json.xsl';


  const [howlInstance, setHowlInstance] = useState<Howl | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const metadataIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && !currentTrack && playlist.length === 0 && LIVE_RADIO_URL) {
      dispatch(setCurrentTrack({
        id: LIVE_RADIO_TRACK_ID,
        title: 'Radio Haryanvi Live',
        artist: 'Live Stream',
        url: LIVE_RADIO_URL,
        coverArt: 'https://placehold.co/100x100.png',
        currentSongTitle: null,
        currentSongArtist: null,
      }));
    }
  }, [dispatch, currentTrack, playlist, isClient, LIVE_RADIO_URL]);

  useEffect(() => {
    if (!isClient || !currentTrack) {
      if (howlInstance) {
        howlInstance.unload();
        setHowlInstance(null);
      }
      setIsLoadingAudio(false);
      return;
    }

    if (howlInstance) {
      howlInstance.unload();
    }
    
    // Only create Howl instance if URL is valid
    if (!currentTrack.url) {
        console.warn("No stream URL available for Howl instance.");
        setIsLoadingAudio(false);
        if (isPlayingRef.current) dispatch(pause()); // Ensure player state is paused
        return;
    }

    const newHowl = new Howl({
      src: [currentTrack.url],
      html5: true,
      volume: volume,
      format: ['mp3', 'aac'],
      onload: () => {
        dispatch(setDuration(newHowl.duration()));
      },
      onplay: () => {
        if (!isPlayingRef.current) dispatch(play());
        setIsLoadingAudio(false);
      },
      onpause: () => {
        if (isPlayingRef.current) dispatch(pause());
        setIsLoadingAudio(false);
      },
      onstop: () => {
        if (isPlayingRef.current) dispatch(pause());
        setIsLoadingAudio(false);
      },
      onend: () => {
        if (isPlayingRef.current) dispatch(pause());
        setIsLoadingAudio(false);
      },
      onloaderror: (id, error) => {
        console.error(
          `Howler load error (code: ${error}) for track URL: ${currentTrack.url}.`,
          `Error code descriptions: 1. ABORTED, 2. NETWORK, 3. DECODE, 4. SRC_NOT_SUPPORTED.`
        );
        if (isPlayingRef.current) dispatch(pause());
        setIsLoadingAudio(false);
      },
      onplayerror: (id, error) => {
        console.error(
          `Howler play error (code: ${error}) for track ID: ${currentTrack.id}, URL: ${currentTrack.url}.`
        );
        if (isPlayingRef.current) dispatch(pause());
        setIsLoadingAudio(false);
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

    if (isPlaying && !howlInstance.playing() && currentTrack?.url) {
      setIsLoadingAudio(true);
      howlInstance.play();
    } else if (!isPlaying && howlInstance.playing()) {
      setIsLoadingAudio(true);
      howlInstance.stop(); 
    }
  }, [isPlaying, howlInstance, isClient, currentTrack?.url]);

  useEffect(() => {
    if (!howlInstance || !isClient) return;
    howlInstance.volume(volume);
  }, [volume, howlInstance, isClient]);

  const fetchMetadata = useCallback(async () => {
    if (!currentTrack || currentTrack.id !== LIVE_RADIO_TRACK_ID || !METADATA_URL_CONTEXT) {
      return;
    }
    try {
      const urlWithCacheBuster = METADATA_URL_CONTEXT.includes('?') 
        ? `${METADATA_URL_CONTEXT}&cb=${new Date().getTime()}`
        : `${METADATA_URL_CONTEXT}?cb=${new Date().getTime()}`;

      const response = await fetch(urlWithCacheBuster);
      if (!response.ok) {
        console.warn(`Failed to fetch metadata: ${response.status} ${response.statusText} from ${urlWithCacheBuster}`);
        dispatch(updateCurrentTrackMetadata({ title: null, artist: null }));
        return;
      }
      const data = await response.json();
      console.log('Fetched Icecast Metadata:', data); 

      let songTitle: string | null = null;
      let songArtist: string | null = null;

      if (data && data.icestats && data.icestats.source) {
          const source = Array.isArray(data.icestats.source) ? data.icestats.source[0] : data.icestats.source;
          
          if (source) {
              const currentPlayingString = source.title || source.yp_currently_playing || null;

              if (currentPlayingString && typeof currentPlayingString === 'string') {
                  const parts = currentPlayingString.split(' - ');
                  if (parts.length >= 2) {
                      songArtist = parts[0].trim();
                      songTitle = parts.slice(1).join(' - ').trim();
                  } else {
                      songTitle = currentPlayingString.trim();
                  }
              }
              
              if (!songArtist && source.artist && typeof source.artist === 'string') {
                  songArtist = source.artist.trim();
              }
          }
      }
      
      dispatch(updateCurrentTrackMetadata({ title: songTitle, artist: songArtist }));

    } catch (error) {
      console.warn(`Error fetching or parsing stream metadata from ${METADATA_URL_CONTEXT}:`, error);
      dispatch(updateCurrentTrackMetadata({ title: null, artist: null }));
    }
  }, [currentTrack, dispatch, METADATA_URL_CONTEXT]);


  useEffect(() => {
    if (isClient && isPlaying && currentTrack && currentTrack.id === LIVE_RADIO_TRACK_ID && METADATA_URL_CONTEXT) {
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
  }, [isClient, isPlaying, currentTrack, fetchMetadata, METADATA_URL_CONTEXT]);


  const handlePlayPause = useCallback(() => {
    if (!currentTrack && playlist.length > 0) {
        dispatch(setCurrentTrack(playlist[0]));
        dispatch(play()); 
        return;
    }
     if (!currentTrack && !LIVE_RADIO_URL) {
        console.warn("No live radio URL configured to play.");
        return;
    }
     if (!currentTrack && LIVE_RADIO_URL) { // If no current track but live URL exists, set it up
        dispatch(setCurrentTrack({
            id: LIVE_RADIO_TRACK_ID,
            title: 'Radio Haryanvi Live',
            artist: 'Live Stream',
            url: LIVE_RADIO_URL,
            coverArt: 'https://placehold.co/100x100.png',
        }));
        // dispatch(play()); // Play will be handled by useEffect that watches isPlaying
        // Let the useEffect for Howl instance creation run, then the useEffect for play/pause will trigger play
    }


    if (isPlaying) {
      dispatch(pause());
    } else {
      if (currentTrack) { // currentTrack must exist to play
        dispatch(play());
      }
    }
  }, [dispatch, isPlaying, currentTrack, playlist, LIVE_RADIO_URL]);

  if (!isClient || !currentTrack) {
    // Render a disabled player or a message if no stream URL is configured
    if (!LIVE_RADIO_URL && !playlist.length) {
        return (
             <div className={cn(
                "fixed left-0 right-0 z-40 border-t bg-background/95 p-3 backdrop-blur supports-[backdrop-filter]:bg-background/60",
                "bottom-[calc(4.5rem+env(safe-area-inset-bottom))] md:bottom-2"
            )}>
                <div className="container mx-auto flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-grow min-w-0">
                        <Image
                            src={"https://placehold.co/40x40.png"}
                            alt={"No stream available"}
                            width={40} height={40}
                            className="rounded flex-shrink-0"
                            data-ai-hint="radio placeholder"
                        />
                        <div className="min-w-0">
                            <p className="text-sm font-semibold truncate">Stream Unavailable</p>
                            <p className="text-xs text-muted-foreground truncate">Configure in settings</p>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" className="w-10 h-10" disabled>
                        <PlayIcon className="h-6 w-6 opacity-50" />
                    </Button>
                </div>
            </div>
        );
    }
    // If URLs are configured but currentTrack is not yet set (initial load), show loading or return null
    return null; 
  }

  const displayTitle = currentTrack.currentSongTitle || currentTrack.title;
  const displayArtist = currentTrack.currentSongArtist || currentTrack.artist;

  return (
    <div className={cn(
      "fixed left-0 right-0 z-40 border-t bg-background/95 p-3 backdrop-blur supports-[backdrop-filter]:bg-background/60",
      "bottom-[calc(4.5rem+env(safe-area-inset-bottom))] md:bottom-2"
    )}>
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-grow min-w-0">
          <Image
            src={currentTrack.coverArt || "https://placehold.co/40x40.png"}
            alt={displayTitle || "Cover art"}
            width={40} height={40}
            className="rounded flex-shrink-0"
            data-ai-hint="radio live stream"
          />
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate max-w-[150px] sm:max-w-[200px] md:max-w-xs">Radio Haryanvi</p>
            <p className="text-xs text-muted-foreground truncate max-w-[150px] sm:max-w-[200px] md:max-w-xs"> {displayArtist} {displayTitle}</p>
          </div>
        </div>

        <div className="flex items-center space-x-1 md:space-x-2 flex-shrink-0">
            <Button variant="ghost" size="icon" onClick={handlePlayPause} className="w-10 h-10" disabled={isLoadingAudio || !currentTrack.url}>
              {isLoadingAudio ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : isPlaying ? (
                <PauseIcon className="h-6 w-6" />
              ) : (
                <PlayIcon className="h-6 w-6" />
              )}
            </Button>
        </div>
      </div>
    </div>
  );
}
