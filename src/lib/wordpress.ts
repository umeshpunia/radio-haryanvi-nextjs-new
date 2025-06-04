// Using a public demo WordPress site for example
const WP_API_BASE_URL = 'https://dev-headless-wp.pantheonsite.io/wp-json/wp/v2';
// const WP_API_BASE_URL = 'https://your-wordpress-site.com/wp-json/wp/v2'; // Replace with your actual WordPress site URL

export interface Post {
  id: number;
  date: string;
  slug: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  author: number;
  categories: number[];
  tags: number[];
  _embedded?: any; // For featured image, author name, etc.
  featured_media?: number;
  link: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  count: number;
}

export interface Author {
  id: number;
  name: string;
  slug: string;
}

interface FetchPostsResponse {
  posts: Post[];
  totalPages: number;
}

export async function fetchPostsFromApi(page = 1, categoryId?: number, perPage = 10): Promise<FetchPostsResponse> {
  let url = `${WP_API_BASE_URL}/posts?_embed&per_page=${perPage}&page=${page}`;
  if (categoryId) {
    url += `&categories=${categoryId}`;
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`WordPress API error: ${response.statusText}`);
    }
    const totalPages = Number(response.headers.get('X-WP-TotalPages')) || 1;
    const posts: Post[] = await response.json();
    return { posts, totalPages };
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    throw error;
  }
}

export async function fetchCategoriesFromApi(): Promise<Category[]> {
  const url = `${WP_API_BASE_URL}/categories?hide_empty=true&orderby=count&order=desc`; // Fetch categories with posts, order by count
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`WordPress API error: ${response.statusText}`);
    }
    const categories: Category[] = await response.json();
    return categories.filter(cat => cat.count > 0); // Ensure categories have posts
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    throw error;
  }
}

export async function fetchPostBySlugApi(slug: string): Promise<Post | null> {
  const url = `${WP_API_BASE_URL}/posts?slug=${slug}&_embed`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`WordPress API error: ${response.statusText}`);
    }
    const posts: Post[] = await response.json();
    return posts.length > 0 ? posts[0] : null;
  } catch (error) {
    console.error(`Failed to fetch post by slug ${slug}:`, error);
    throw error;
  }
}

export async function fetchAuthorApi(id: number): Promise<Author | null> {
  const url = `${WP_API_BASE_URL}/users/${id}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`WordPress API error for author ${id}: ${response.statusText}`);
    }
    const author: Author = await response.json();
    return author;
  } catch (error) {
    console.error(`Failed to fetch author ${id}:`, error);
    return null; // Return null on error to not break post display
  }
}
