import { Metadata } from 'next';
import { createSupabaseServerClient } from '@/lib/supabaseServer';
import BlogPost from '@/views/BlogPost';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = createSupabaseServerClient();
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('title, excerpt, image_url, created_at')
    .eq('slug', slug)
    .eq('published', true)
    .single();

  if (!posts) return { title: 'Blog | Shams Al Bosnia' };

  return {
    title: `${posts.title} | Shams Al Bosnia`,
    description: posts.excerpt || 'Travel guide for Bosnia & Herzegovina by Shams Al Bosnia.',
    openGraph: {
      title: posts.title,
      description: posts.excerpt || '',
      url: `https://www.shamsalbosnia.com/blog/${slug}`,
      type: 'article',
      publishedTime: posts.created_at,
      images: posts.image_url
        ? [{ url: posts.image_url, width: 1200, height: 630 }]
        : [{ url: 'https://www.shamsalbosnia.com/og-image.jpg', width: 1200, height: 630 }],
    },
  };
}

export default function BlogPostPage() {
  return <BlogPost />;
}
