import { fetchPostsFromApi } from '@/lib/wordpress'; // Assuming this fetches all posts for sitemap
import { type NextRequest } from 'next/server'

const generateSitemap = (posts: any[], siteUrl: string) => {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

  // Static pages
  const staticPages = [
    { url: '/', changefreq: 'daily', priority: '1.0' },
    { url: '/radio', changefreq: 'monthly', priority: '0.8' },
    { url: '/blog', changefreq: 'weekly', priority: '0.9' },
  ];

  staticPages.forEach(page => {
    xml += `
      <url>
        <loc>${siteUrl}${page.url}</loc>
        <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
        <changefreq>${page.changefreq}</changefreq>
        <priority>${page.priority}</priority>
      </url>
    `;
  });

  // Dynamic blog posts
  posts.forEach(post => {
    xml += `
      <url>
        <loc>${siteUrl}/blog/${post.slug}</loc>
        <lastmod>${new Date(post.date_gmt || post.date).toISOString().split('T')[0]}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.7</priority>
      </url>
    `;
  });

  xml += '</urlset>';
  return xml;
};

export async function GET(request: NextRequest) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
  
  try {
    // Fetch all posts for sitemap - adjust perPage as needed, or implement pagination if too many
    const { posts } = await fetchPostsFromApi(1, undefined, 100); 
    const sitemap = generateSitemap(posts, siteUrl);

    return new Response(sitemap, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
      },
    });
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return new Response("Error generating sitemap", { status: 500 });
  }
}
