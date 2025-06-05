
// Using a public demo WordPress site for example
const WP_API_BASE_URL = 'https://blog.weareharyanvi.com/wp-json/wp/v2';
// const WP_API_BASE_URL = 'https://your-wordpress-site.com/wp-json/wp/v2'; // Replace with your actual WordPress site URL

const COMMON_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  'Accept': 'application/json, text/plain, */*', // Explicitly state we accept JSON
};

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
    const response = await fetch(url, {
      headers: COMMON_HEADERS,
      next: { revalidate: 3600 }
    });
    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`WordPress API error ${response.status} for URL: ${url}. Body: ${errorBody.substring(0, 500)}`);
      if (errorBody.toLowerCase().includes('bot verification') || errorBody.toLowerCase().includes('recaptcha')) {
        console.error(`Bot verification detected for URL: ${url}. Returning empty posts. Suggest whitelisting server IP on WordPress site.`);
        return { posts: [], totalPages: 0 };
      }
      // For other non-ok responses, return empty to prevent crashes, but log it.
      return { posts: [], totalPages: 0 };
    }
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const errorBody = await response.text();
      console.error(`WordPress API did not return JSON for URL: ${url}. ContentType: ${contentType}. Body: ${errorBody.substring(0,500)}`);
      if (errorBody.toLowerCase().includes('bot verification') || errorBody.toLowerCase().includes('recaptcha')) {
        console.error(`Bot verification detected for URL: ${url}. Returning empty posts. Suggest whitelisting server IP on WordPress site.`);
        return { posts: [], totalPages: 0 };
      }
      // If not JSON and not bot verification, still return empty to prevent crashes.
      return { posts: [], totalPages: 0 };
    }
    const totalPages = Number(response.headers.get('X-WP-TotalPages')) || 1;
    const posts: Post[] = await response.json();
    return { posts, totalPages };
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    return { posts: [], totalPages: 0 };
  }
}

export async function fetchCategoriesFromApi(): Promise<Category[]> {
  const url = `${WP_API_BASE_URL}/categories?hide_empty=true&orderby=count&order=desc`; // Fetch categories with posts, order by count
  try {
    const response = await fetch(url, {
      headers: COMMON_HEADERS,
      next: { revalidate: 86400 }
    });
    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`WordPress API error ${response.status} for URL: ${url}. Body: ${errorBody.substring(0, 500)}`);
      if (errorBody.toLowerCase().includes('bot verification') || errorBody.toLowerCase().includes('recaptcha')) {
        console.error(`Bot verification detected for URL: ${url}. Returning empty categories. Suggest whitelisting server IP on WordPress site.`);
        return [];
      }
      return [];
    }
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const errorBody = await response.text();
      console.error(`WordPress API did not return JSON for URL: ${url}. ContentType: ${contentType}. Body: ${errorBody.substring(0,500)}`);
      if (errorBody.toLowerCase().includes('bot verification') || errorBody.toLowerCase().includes('recaptcha')) {
        console.error(`Bot verification detected for URL: ${url}. Returning empty categories. Suggest whitelisting server IP on WordPress site.`);
        return [];
      }
      return [];
    }
    const categories: Category[] = await response.json();
    return categories.filter(cat => cat.count > 0); // Ensure categories have posts
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return []; // Return empty array on error
  }
}

export async function fetchPostBySlugApi(slug: string): Promise<Post | null> {
  const url = `${WP_API_BASE_URL}/posts?slug=${slug}&_embed`;
  try {
    const response = await fetch(url, {
      headers: COMMON_HEADERS,
      next: { revalidate: 3600 }
    });
    if (!response.ok) {
      const errorBody = await response.text(); 
      console.error(`WordPress API error ${response.status} for URL: ${url}. Slug: ${slug}. Body: ${errorBody.substring(0, 500)}`);
      if (errorBody.toLowerCase().includes('bot verification') || errorBody.toLowerCase().includes('recaptcha')) {
        console.error(`Bot verification detected for slug '${slug}' (URL: ${url}). Cannot fetch post. Suggest whitelisting server IP on WordPress site.`);
        return null;
      }
      // For other non-ok responses for a single post, return null.
      return null;
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const errorBody = await response.text();
      console.error(`WordPress API did not return JSON for slug '${slug}' (URL: ${url}). ContentType: ${contentType}. Body: ${errorBody.substring(0,500)}`);

      if (errorBody.toLowerCase().includes('bot verification') || errorBody.toLowerCase().includes('recaptcha')) {
        console.error(`Bot verification detected for slug '${slug}' (URL: ${url}). Cannot fetch post. Suggest whitelisting server IP on WordPress site.`);
        return null; 
      }
      
      if (response.ok && contentType.includes("text/html")) {
        console.warn(`Slug '${slug}' likely not found or WordPress returned HTML instead of JSON (URL: ${url}). Check if the post with this slug exists and is published.`);
        return null;
      }
      // If not JSON, and not bot verification, and not a 200 OK HTML page (potential 404), return null.
      return null;
    }

    const posts: Post[] = await response.json();
    return posts.length > 0 ? posts[0] : null;
  } catch (error) {
    console.error(`Failed to fetch post by slug ${slug}:`, error);
    return null; 
  }
}

export async function fetchAuthorApi(id: number): Promise<Author | null> {
  const url = `${WP_API_BASE_URL}/users/${id}`;
  try {
    const response = await fetch(url, {
      headers: COMMON_HEADERS,
      next: { revalidate: 86400 }
    });
    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`WordPress API error ${response.status} for author ${id}. Body: ${errorBody.substring(0, 500)}`);
      if (errorBody.toLowerCase().includes('bot verification') || errorBody.toLowerCase().includes('recaptcha')) {
        console.error(`Bot verification detected when fetching author ${id}. Returning null. Suggest whitelisting server IP.`);
        return null;
      }
      return null;
    }
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const errorBody = await response.text();
      console.error(`WordPress API did not return JSON for author ${id}. ContentType: ${contentType}. Body: ${errorBody.substring(0,500)}`);
      if (errorBody.toLowerCase().includes('bot verification') || errorBody.toLowerCase().includes('recaptcha')) {
        console.error(`Bot verification detected when fetching author ${id}. Returning null. Suggest whitelisting server IP.`);
        return null;
      }
      return null;
    }
    const author: Author = await response.json();
    return author;
  } catch (error) {
    console.error(`Failed to fetch author ${id}:`, error);
    return null;
  }
}

export async function fetchCategoryBySlugFromApi(slug: string): Promise<Category | null> {
  const url = `${WP_API_BASE_URL}/categories?slug=${slug}`;
  try {
    const response = await fetch(url, {
      headers: COMMON_HEADERS,
      next: { revalidate: 86400 }
    });
    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`WordPress API error ${response.status} for URL: ${url}. Body: ${errorBody.substring(0, 500)}`);
      if (errorBody.toLowerCase().includes('bot verification') || errorBody.toLowerCase().includes('recaptcha')) {
        console.error(`Bot verification detected for URL: ${url}. Returning null. Suggest whitelisting server IP.`);
        return null;
      }
      return null;
    }
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const errorBody = await response.text();
      console.error(`WordPress API did not return JSON for URL: ${url}. ContentType: ${contentType}. Body: ${errorBody.substring(0,500)}`);
      if (errorBody.toLowerCase().includes('bot verification') || errorBody.toLowerCase().includes('recaptcha')) {
        console.error(`Bot verification detected for URL: ${url}. Returning null. Suggest whitelisting server IP.`);
        return null;
      }
      return null;
    }
    const categories: Category[] = await response.json();
    if (categories.length > 0) {
      return categories[0];
    }
    return null;
  } catch (error) {
    console.error(`Failed to fetch category by slug ${slug}:`, error);
    return null; // Return null on error
  }
}
