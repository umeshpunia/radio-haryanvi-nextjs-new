
import { configureStore } from '@reduxjs/toolkit';
import audioPlayerReducer from './slices/audio-player-slice';
import blogReducer from './slices/blog-slice';
import artistsReducer from './slices/artists-slice'; // Import the new reducer

export const store = configureStore({
  reducer: {
    audioPlayer: audioPlayerReducer,
    blog: blogReducer,
    artists: artistsReducer, // Add the new reducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
