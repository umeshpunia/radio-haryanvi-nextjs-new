
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { fetchPostsFromApi, fetchCategoryBySlugFromApi } from '@/lib/wordpress';
import type { Post, Category } from '@/lib/wordpress';

const ARTISTS_CATEGORY_SLUG = 'artists'; // Define the slug for your artists category

interface ArtistsState {
  artists: Post[];
  artistCategory: Category | null;
  currentPage: number;
  totalPages: number;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ArtistsState = {
  artists: [],
  artistCategory: null,
  currentPage: 1,
  totalPages: 1,
  status: 'idle',
  error: null,
};

export const fetchArtists = createAsyncThunk(
  'artists/fetchArtists',
  async (page: number = 1, { getState, rejectWithValue }) => {
    try {
      const { artists: currentArtistsState } = getState() as { artists: ArtistsState };
      let category = currentArtistsState.artistCategory;

      if (!category) {
        category = await fetchCategoryBySlugFromApi(ARTISTS_CATEGORY_SLUG);
        if (!category) {
          return rejectWithValue(`Category '${ARTISTS_CATEGORY_SLUG}' not found.`);
        }
      }
      
      const response = await fetchPostsFromApi(page, category.id, 9); // Fetch 9 artists per page
      return { ...response, category };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const artistsSlice = createSlice({
  name: 'artists',
  initialState,
  reducers: {
    setCurrentArtistsPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchArtists.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchArtists.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.artists = action.payload.posts;
        state.totalPages = action.payload.totalPages;
        state.artistCategory = action.payload.category; 
        state.error = null;
      })
      .addCase(fetchArtists.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
        state.artists = []; // Clear artists on error
      });
  },
});

export const { setCurrentArtistsPage } = artistsSlice.actions;
export default artistsSlice.reducer;
