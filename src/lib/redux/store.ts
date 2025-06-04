import { configureStore } from '@reduxjs/toolkit';
import audioPlayerReducer from './slices/audio-player-slice';
import blogReducer from './slices/blog-slice';

export const store = configureStore({
  reducer: {
    audioPlayer: audioPlayerReducer,
    blog: blogReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
