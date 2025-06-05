
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Track {
  id: string;
  title: string; // Station name or default title
  artist: string; // "Live Stream" or default artist
  url: string;
  coverArt?: string;
  // For dynamically fetched stream metadata
  currentSongTitle?: string | null;
  currentSongArtist?: string | null;
}

interface AudioPlayerState {
  currentTrack: Track | null;
  playlist: Track[];
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  duration: number; // Duration might be Infinity for live streams
}

const initialState: AudioPlayerState = {
  currentTrack: null,
  playlist: [],
  isPlaying: false,
  volume: 0.8,
  currentTime: 0,
  duration: 0,
};

const audioPlayerSlice = createSlice({
  name: 'audioPlayer',
  initialState,
  reducers: {
    setPlaylist: (state, action: PayloadAction<Track[]>) => {
      state.playlist = action.payload;
    },
    setCurrentTrack: (state, action: PayloadAction<Track | null>) => {
      state.currentTrack = action.payload;
      state.isPlaying = false;
      state.currentTime = 0;
      state.duration = 0; 
      if (state.currentTrack) {
        state.currentTrack.currentSongTitle = null;
        state.currentTrack.currentSongArtist = null;
      }
    },
    play: (state) => {
      if (state.currentTrack) {
        state.isPlaying = true;
      }
    },
    pause: (state) => {
      state.isPlaying = false;
    },
    setVolume: (state, action: PayloadAction<number>) => {
      state.volume = action.payload;
    },
    setCurrentTime: (state, action: PayloadAction<number>) => {
      state.currentTime = action.payload;
    },
    setDuration: (state, action: PayloadAction<number>) => {
      state.duration = action.payload;
    },
    updateCurrentTrackMetadata: (state, action: PayloadAction<{ title?: string | null; artist?: string | null }>) => {
      if (state.currentTrack) {
        // If action.payload.title is undefined, set to null (fallback to station name). Otherwise, use provided value.
        state.currentTrack.currentSongTitle = action.payload.title !== undefined ? action.payload.title : null;
        // If action.payload.artist is undefined, set to null (fallback to station artist). Otherwise, use provided value.
        state.currentTrack.currentSongArtist = action.payload.artist !== undefined ? action.payload.artist : null;
      }
    },
    playNext: (state) => {
      if (!state.currentTrack || state.playlist.length === 0) return;
      const currentIndex = state.playlist.findIndex(track => track.id === state.currentTrack!.id);
      if (currentIndex !== -1 && currentIndex < state.playlist.length - 1) {
        state.currentTrack = state.playlist[currentIndex + 1];
      } else {
        state.currentTrack = state.playlist[0];
      }
      state.isPlaying = true;
      state.currentTime = 0;
      if (state.currentTrack) {
        state.currentTrack.currentSongTitle = null;
        state.currentTrack.currentSongArtist = null;
      }
    },
    playPrevious: (state) => {
      if (!state.currentTrack || state.playlist.length === 0) return;
      const currentIndex = state.playlist.findIndex(track => track.id === state.currentTrack!.id);
      if (currentIndex > 0) {
        state.currentTrack = state.playlist[currentIndex - 1];
      } else {
        state.currentTrack = state.playlist[state.playlist.length - 1];
      }
      state.isPlaying = true;
      state.currentTime = 0;
      if (state.currentTrack) {
        state.currentTrack.currentSongTitle = null;
        state.currentTrack.currentSongArtist = null;
      }
    },
  },
});

export const {
  setPlaylist,
  setCurrentTrack,
  play,
  pause,
  setVolume,
  setCurrentTime,
  setDuration,
  updateCurrentTrackMetadata,
  playNext,
  playPrevious,
} = audioPlayerSlice.actions;

export default audioPlayerSlice.reducer;
