'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import FooterSection from '@/components/home/FooterSection';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

const CATEGORY_LABELS: Record<string, string> = {
  gradovi: 'Cities',
  atrakcije: 'Attractions',
  rute: 'Routes',
  prakticno: 'Travel Tips',
  sezonski: 'Seasonal',
};

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/blog`)
      .then(r => r.json())
      .then(data => {
        const found = Array.isArray(data) ? data.find((p: any) => p.slug === slug) : null;
        setPost(found || null);
        setLoading(false);
      });
  }, [slug]);

  if (loading) return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 pt-32 max-w-3xl">
        <div className="h-8 w-48 bg-muted rounded animate-pulse mb-6" />
        <div className="h-64 bg-muted rounded-2xl animate-pulse mb-6" />
        <div className="space-y-3">{[1,2,3,4].map(i => <div key={i} className="h-4 bg-muted rounded animate-pulse" />)}</div>
      </div>
    </div>
  );

  if (!post) return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 pt-32 text-center">
        <p className="text-2xl font-bold mb-4">Post not found</p>
        <Button onClick={() => router.push('/blog')}>Back to Blog</Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* JSON-LD BlogPosting */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.title,
            description: post.excerpt,
            image: post.image_url || 'https://www.shamsalbosnia.com/og-image.jpg',
            datePublished: post.created_at,
            author: { '@type': 'Organization', name: 'Shams Al Bosnia' },
            publisher: {
              '@type': 'Organization',
              name: 'Shams Al Bosnia',
              logo: { '@type': 'ImageObject', url: 'https://www.shamsalbosnia.com/lovable-uploads/shams-albosnia-logo.png' },
            },
            url: `https://www.shamsalbosnia.com/blog/${post.slug}`,
          }),
        }}
      />

      <div className="container mx-auto px-4 pt-32 pb-16 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Button variant="ghost" className="mb-6 -ml-2 text-muted-foreground" onClick={() => router.push('/blog')}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Blog
          </Button>

          {post.image_url && (
            <div className="relative h-72 rounded-2xl overflow-hidden mb-8">
              <Image src={post.image_url} alt={post.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 768px" />
            </div>
          )}

          <div className="flex items-center gap-3 mb-4">
            <span className="flex items-center gap-1 text-sm text-amber-600 font-medium">
              <Tag className="h-3.5 w-3.5" /> {CATEGORY_LABELS[post.category] || post.category}
            </span>
            <span className="text-muted-foreground/40">·</span>
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-3.5 w-3.5" /> {post.reading_time} min read
            </span>
            <span className="text-muted-foreground/40">·</span>
            <span className="text-sm text-muted-foreground">
              {new Date(post.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          </div>

          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          {post.excerpt && <p className="text-xl text-muted-foreground mb-8 leading-relaxed">{post.excerpt}</p>}

          <hr className="border-border/50 mb-8" />

          <div
            className="prose prose-lg max-w-none prose-headings:font-bold prose-a:text-amber-600 prose-img:rounded-xl"
            dangerouslySetInnerHTML={{ __html: post.content?.replace(/\n/g, '<br/>') || '' }}
          />
        </motion.div>
      </div>
      <FooterSection />
    </div>
  );
}
