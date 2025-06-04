import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Track {
  id: string;
  title: string;
  artist: string;
  url: string;
  coverArt?: string;
}

interface AudioPlayerState {
  currentTrack: Track | null;
  playlist: Track[];
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  duration: number;
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
      state.isPlaying = false; // Ensure no autoplay when track changes
      state.currentTime = 0;
      state.duration = 0;
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
    playNext: (state) => {
      if (!state.currentTrack || state.playlist.length === 0) return;
      const currentIndex = state.playlist.findIndex(track => track.id === state.currentTrack!.id);
      if (currentIndex !== -1 && currentIndex < state.playlist.length - 1) {
        state.currentTrack = state.playlist[currentIndex + 1];
      } else { // Loop to first track or stop, here we loop
        state.currentTrack = state.playlist[0];
      }
      state.isPlaying = true; // Autoplay next track
      state.currentTime = 0;
    },
    playPrevious: (state) => {
      if (!state.currentTrack || state.playlist.length === 0) return;
      const currentIndex = state.playlist.findIndex(track => track.id === state.currentTrack!.id);
      if (currentIndex > 0) {
        state.currentTrack = state.playlist[currentIndex - 1];
      } else { // Loop to last track or stop, here we loop
        state.currentTrack = state.playlist[state.playlist.length - 1];
      }
      state.isPlaying = true; // Autoplay previous track
      state.currentTime = 0;
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
  playNext,
  playPrevious,
} = audioPlayerSlice.actions;

export default audioPlayerSlice.reducer;
