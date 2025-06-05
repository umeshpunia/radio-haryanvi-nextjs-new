
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

const LIVE_RADIO_TRACK_ID = 'liveRadioHaryanvi';
// IMPORTANT: Verify this URL. It should point to your Icecast JSON status endpoint.
// Common endpoints are /status-json.xsl, /json.xsl, /live.json, or a custom one.
// Example: 'https://your-icecast-server.com/status-json.xsl'
const METADATA_URL = 'https://listen.weareharyanvi.com/';
const METADATA_FETCH_INTERVAL = 15000; // 15 seconds

export function StickyAudioPlayer() {
  const dispatch = useAppDispatch();
  const isPlayingRef = useRef<boolean>(false);
  const { currentTrack, isPlaying, volume, playlist } = useAppSelector((state) => {
    isPlayingRef.current = state.audioPlayer.isPlaying;
    return state.audioPlayer;
  });

  const [howlInstance, setHowlInstance] = useState<Howl | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const metadataIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && !currentTrack && playlist.length === 0) {
      dispatch(setCurrentTrack({
        id: LIVE_RADIO_TRACK_ID,
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
      setIsLoadingAudio(false);
      return;
    }

    if (howlInstance) {
      howlInstance.unload();
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

    if (isPlaying && !howlInstance.playing()) {
      setIsLoadingAudio(true);
      howlInstance.play();
    } else if (!isPlaying && howlInstance.playing()) {
      setIsLoadingAudio(true);
      howlInstance.stop();
    }
  }, [isPlaying, howlInstance, isClient]);

  useEffect(() => {
    if (!howlInstance || !isClient) return;
    howlInstance.volume(volume);
  }, [volume, howlInstance, isClient]);

  const fetchMetadata = useCallback(async () => {
    if (!currentTrack || currentTrack.id !== LIVE_RADIO_TRACK_ID || !METADATA_URL) {
      return;
    }
    try {
      const response = await fetch(METADATA_URL);
      if (!response.ok) {
        console.warn(`Failed to fetch metadata: ${response.status} ${response.statusText} from ${METADATA_URL}`);
        // Dispatch null to clear old metadata if fetch fails
        dispatch(updateCurrentTrackMetadata({ title: null, artist: null }));
        return;
      }
      const data = await response.json();
      console.log('Fetched Icecast Metadata:', data); // Log the raw data

      let songTitle: string | null = null;
      let songArtist: string | null = null;

      if (data.icestats && data.icestats.source) {
          const source = Array.isArray(data.icestats.source) ? data.icestats.source[0] : data.icestats.source;
          if (source) {
              if (source.song && typeof source.song === 'string') {
                  const parts = source.song.split(' - ');
                  if (parts.length >= 2) {
                      songArtist = parts[0].trim();
                      songTitle = parts.slice(1).join(' - ').trim();
                  } else {
                      songTitle = source.song.trim();
                  }
              }
              if (!songArtist && source.artist && typeof source.artist === 'string') {
                  songArtist = source.artist.trim();
              }
              if (!songTitle && source.title && typeof source.title === 'string') {
                  songTitle = source.title.trim();
              }
          }
      }

      if (!songTitle && (data.title || data.songtitle || data.song)) {
          songTitle = data.title || data.songtitle || data.song || null;
          if (typeof songTitle === 'string') songTitle = songTitle.trim();
      }
      if (!songArtist && data.artist) {
          songArtist = data.artist;
          if (typeof songArtist === 'string') songArtist = songArtist.trim();
      }

      if (songTitle && !songArtist && songTitle.includes(' - ')) {
          const parts = songTitle.split(' - ');
          if (parts.length >= 2) {
              songArtist = parts[0].trim();
              songTitle = parts.slice(1).join(' - ').trim();
          }
      }
      
      dispatch(updateCurrentTrackMetadata({ title: songTitle, artist: songArtist }));

    } catch (error) {
      console.warn(`Error fetching or parsing stream metadata from ${METADATA_URL}:`, error);
      dispatch(updateCurrentTrackMetadata({ title: null, artist: null }));
    }
  }, [currentTrack, dispatch]); // Added currentTrack and dispatch to dependencies


  useEffect(() => {
    if (isClient && isPlaying && currentTrack && currentTrack.id === LIVE_RADIO_TRACK_ID) {
      fetchMetadata();
      if (metadataIntervalRef.current) clearInterval(metadataIntervalRef.current);
      metadataIntervalRef.current = setInterval(fetchMetadata, METADATA_FETCH_INTERVAL);
    } else {
      if (metadataIntervalRef.current) {
        clearInterval(metadataIntervalRef.current);
        metadataIntervalRef.current = null;
      }
      if (currentTrack && currentTrack.id === LIVE_RADIO_TRACK_ID && (currentTrack.currentSongTitle || currentTrack.currentSongArtist)) {
        // dispatch(updateCurrentTrackMetadata({ title: null, artist: null }));
      }
    }

    return () => {
      if (metadataIntervalRef.current) {
        clearInterval(metadataIntervalRef.current);
        metadataIntervalRef.current = null;
      }
    };
  }, [isClient, isPlaying, currentTrack, dispatch, fetchMetadata]); // Added fetchMetadata to dependencies


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
            <p className="text-sm font-semibold truncate max-w-[150px] sm:max-w-[200px] md:max-w-xs">{displayTitle}</p>
            <p className="text-xs text-muted-foreground truncate max-w-[150px] sm:max-w-[200px] md:max-w-xs">{displayArtist}</p>
          </div>
        </div>

        <div className="flex items-center space-x-1 md:space-x-2 flex-shrink-0">
            <Button variant="ghost" size="icon" onClick={handlePlayPause} className="w-10 h-10" disabled={isLoadingAudio}>
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
