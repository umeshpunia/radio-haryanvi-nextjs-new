
// Using a public demo WordPress site for example
const WP_API_BASE_URL = 'https://blog.weareharyanvi.com/wp-json/wp/v2';
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
    const response = await fetch(url, { next: { revalidate: 3600 } }); // Revalidate every hour
    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`WordPress API error ${response.status} for URL: ${url}. Body: ${errorBody.substring(0, 500)}`);
      throw new Error(`WordPress API error: ${response.statusText} for URL: ${url}`);
    }
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const errorBody = await response.text();
      console.error(`WordPress API did not return JSON for URL: ${url}. ContentType: ${contentType}. Body: ${errorBody.substring(0,500)}`);
      throw new Error(`Expected JSON response from WordPress API but received ${contentType} for URL: ${url}`);
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
    const response = await fetch(url, { next: { revalidate: 86400 } }); // Revalidate once a day
    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`WordPress API error ${response.status} for URL: ${url}. Body: ${errorBody.substring(0, 500)}`);
      throw new Error(`WordPress API error: ${response.statusText} for URL: ${url}`);
    }
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const errorBody = await response.text();
      console.error(`WordPress API did not return JSON for URL: ${url}. ContentType: ${contentType}. Body: ${errorBody.substring(0,500)}`);
      throw new Error(`Expected JSON response from WordPress API but received ${contentType} for URL: ${url}`);
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
    const response = await fetch(url, { next: { revalidate: 3600 } }); // Revalidate every hour
    if (!response.ok) {
      // Try to get more info if response is not ok
      const errorBody = await response.text();
      console.error(`WordPress API error ${response.status} for URL: ${url}. Slug: ${slug}. Body: ${errorBody.substring(0, 500)}`);
      throw new Error(`WordPress API error: ${response.statusText} fetching slug '${slug}' from URL: ${url}`);
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const errorBody = await response.text();
      console.error(`WordPress API did not return JSON for slug '${slug}' (URL: ${url}). ContentType: ${contentType}. Body: ${errorBody.substring(0,500)}`);
      // It's possible a "not found" slug returns HTML with a 200 OK in some WordPress setups.
      // In this case, it's better to return null than throw an error that breaks the page.
      if (response.ok && contentType.includes("text/html")) {
        console.warn(`Slug '${slug}' likely not found, WordPress returned HTML instead of JSON.`);
        return null;
      }
      throw new Error(`Expected JSON response from WordPress API for slug '${slug}' but received ${contentType} from URL: ${url}`);
    }

    const posts: Post[] = await response.json();
    return posts.length > 0 ? posts[0] : null;
  } catch (error) {
    console.error(`Failed to fetch post by slug ${slug}:`, error);
    // If the error is about parsing, it's already caught by the Content-Type check or the JSON.parse failure.
    // If it's a network error or other, rethrow.
    // Consider not rethrowing if you want to gracefully handle it as "not found"
    throw error;
  }
}

export async function fetchAuthorApi(id: number): Promise<Author | null> {
  const url = `${WP_API_BASE_URL}/users/${id}`;
  try {
    const response = await fetch(url, { next: { revalidate: 86400 } }); // Revalidate once a day
    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`WordPress API error ${response.status} for author ${id}. Body: ${errorBody.substring(0, 500)}`);
      throw new Error(`WordPress API error for author ${id}: ${response.statusText}`);
    }
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const errorBody = await response.text();
      console.error(`WordPress API did not return JSON for author ${id}. ContentType: ${contentType}. Body: ${errorBody.substring(0,500)}`);
      throw new Error(`Expected JSON response from WordPress API for author ${id} but received ${contentType}`);
    }
    const author: Author = await response.json();
    return author;
  } catch (error) {
    console.error(`Failed to fetch author ${id}:`, error);
    return null; // Return null on error to not break post display
  }
}

export async function fetchCategoryBySlugFromApi(slug: string): Promise<Category | null> {
  const url = `${WP_API_BASE_URL}/categories?slug=${slug}`;
  try {
    const response = await fetch(url, { next: { revalidate: 86400 } }); // Revalidate once a day
    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`WordPress API error ${response.status} for URL: ${url}. Body: ${errorBody.substring(0, 500)}`);
      throw new Error(`WordPress API error: ${response.statusText} for URL: ${url}`);
    }
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const errorBody = await response.text();
      console.error(`WordPress API did not return JSON for URL: ${url}. ContentType: ${contentType}. Body: ${errorBody.substring(0,500)}`);
      throw new Error(`Expected JSON response from WordPress API but received ${contentType} for URL: ${url}`);
    }
    const categories: Category[] = await response.json();
    if (categories.length > 0) {
      return categories[0];
    }
    return null;
  } catch (error) {
    console.error(`Failed to fetch category by slug ${slug}:`, error);
    throw error;
  }
}
