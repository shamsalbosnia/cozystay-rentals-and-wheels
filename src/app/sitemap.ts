import { MetadataRoute } from 'next';
import { createSupabaseServerClient } from '@/lib/supabaseServer';

const BASE_URL = 'https://www.shamsalbosnia.com';

const STATIC_ROUTES = [
  { url: '/', priority: 1.0, changeFrequency: 'weekly' },
  { url: '/cars', priority: 0.9, changeFrequency: 'daily' },
  { url: '/accommodations', priority: 0.9, changeFrequency: 'daily' },
  { url: '/bundles', priority: 0.8, changeFrequency: 'weekly' },
  { url: '/blog', priority: 0.8, changeFrequency: 'daily' },
  { url: '/about', priority: 0.6, changeFrequency: 'monthly' },
  { url: '/contact', priority: 0.6, changeFrequency: 'monthly' },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createSupabaseServerClient();

  const { data: posts } = await supabase
    .from('blog_posts')
    .select('slug, created_at')
    .eq('published', true)
    .order('created_at', { ascending: false });

  const blogRoutes: MetadataRoute.Sitemap = (posts ?? []).map(post => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.created_at),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const staticRoutes: MetadataRoute.Sitemap = STATIC_ROUTES.map(route => ({
    url: `${BASE_URL}${route.url}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency as MetadataRoute.Sitemap[0]['changeFrequency'],
    priority: route.priority,
  }));

  return [...staticRoutes, ...blogRoutes];
}
