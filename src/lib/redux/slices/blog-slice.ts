import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { fetchPostsFromApi, fetchCategoriesFromApi, fetchPostBySlugApi } from '@/lib/wordpress';
import type { Post, Category } from '@/lib/wordpress';


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

export const fetchPostBySlug = createAsyncThunk(
  'blog/fetchPostBySlug',
  async (slug: string, { rejectWithValue }) => {
    try {
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
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.posts = action.payload.posts;
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
        state.currentPost = null;
      })
      .addCase(fetchPostBySlug.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentPost = action.payload;
      })
      .addCase(fetchPostBySlug.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { setCurrentPage, setSelectedCategory, clearCurrentPost } = blogSlice.actions;
export default blogSlice.reducer;
