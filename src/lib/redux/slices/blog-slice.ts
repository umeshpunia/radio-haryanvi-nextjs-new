import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { fetchPostsFromApi, fetchCategoriesFromApi, fetchPostBySlugApi } from '@/lib/wordpress';
import type { Post, Category } from '@/lib/wordpress';
import type { RootState } from '../store';


interface BlogState {
  posts: Post[];
  currentPost: Post | null;
  categories: Category[];
  currentPage: number;
  totalPages: number;
  selectedCategory: number | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: BlogState = {
  posts: [],
  currentPost: null,
  categories: [],
  currentPage: 1,
  totalPages: 1,
  selectedCategory: null,
  status: 'idle',
  error: null,
};

export const fetchPosts = createAsyncThunk(
  'blog/fetchPosts',
  async (params: { page?: number; categoryId?: number }, { rejectWithValue }) => {
    try {
      const response = await fetchPostsFromApi(params.page, params.categoryId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchCategories = createAsyncThunk(
  'blog/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const categories = await fetchCategoriesFromApi();
      return categories;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchPostBySlug = createAsyncThunk<
  Post | null, // Return type
  string, // Argument type (slug)
  { state: RootState; rejectValue: string } // ThunkAPI config
>(
  'blog/fetchPostBySlug',
  async (slug: string, { getState, rejectWithValue }) => {
    try {
      // Check if the post already exists in the state.posts array
      const existingPost = getState().blog.posts.find(post => post.slug === slug);
      if (existingPost) {
        return existingPost;
      }
      // If not found, fetch from API
      const post = await fetchPostBySlugApi(slug);
      return post;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setSelectedCategory: (state, action: PayloadAction<number | null>) => {
      state.selectedCategory = action.payload;
      state.currentPage = 1; // Reset page when category changes
    },
    clearCurrentPost: (state) => {
      state.currentPost = null;
      state.status = 'idle';
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Merge new posts with existing ones, avoiding duplicates,
        // useful if we implement "load more" later. For now, simple replacement is also fine.
        const newPosts = action.payload.posts.filter(
          p => !state.posts.some(existing => existing.id === p.id)
        );
        state.posts = [...state.posts, ...newPosts]; // Or simply state.posts = action.payload.posts if replacing
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(fetchPostBySlug.pending, (state) => {
        state.status = 'loading';
        state.currentPost = null; // Clear previous post
        state.error = null;
      })
      .addCase(fetchPostBySlug.fulfilled, (state, action: PayloadAction<Post | null>) => {
        state.status = 'succeeded';
        state.currentPost = action.payload;
        // If the fetched post is new and not in the main list, add it
        if (action.payload && !state.posts.some(p => p.id === action.payload!.id)) {
          state.posts.push(action.payload);
        }
      })
      .addCase(fetchPostBySlug.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
        state.currentPost = null;
      });
  },
});

export const { setCurrentPage, setSelectedCategory, clearCurrentPost } = blogSlice.actions;
export default blogSlice.reducer;
