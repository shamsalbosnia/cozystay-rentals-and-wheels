'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import FooterSection from '@/components/home/FooterSection';
import { motion } from 'framer-motion';
import { Clock, Tag } from 'lucide-react';
import Image from 'next/image';

const CATEGORIES = [
  { value: '', label: 'All' },
  { value: 'gradovi', label: 'Cities' },
  { value: 'atrakcije', label: 'Attractions' },
  { value: 'rute', label: 'Routes' },
  { value: 'prakticno', label: 'Travel Tips' },
  { value: 'sezonski', label: 'Seasonal' },
];

const CATEGORY_LABELS: Record<string, string> = {
  gradovi: 'Cities',
  atrakcije: 'Attractions',
  rute: 'Routes',
  prakticno: 'Travel Tips',
  sezonski: 'Seasonal',
};

const Blog = () => {
  const router = useRouter();
  const [posts, setPosts] = useState<any[]>([]);
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const url = category ? `/api/blog?category=${category}` : '/api/blog';
    fetch(url)
      .then(r => r.json())
      .then(data => { setPosts(Array.isArray(data) ? data : []); setLoading(false); });
  }, [category]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 pt-32 pb-16 max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-5xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-yellow-500">
            Bosnia & Herzegovina Guide
          </h1>
          <p className="text-muted-foreground text-lg mb-10">Travel tips, city guides and hidden gems of Bosnia.</p>

          {/* Category filter */}
          <div className="flex gap-2 flex-wrap mb-10">
            {CATEGORIES.map(c => (
              <button
                key={c.value}
                onClick={() => setCategory(c.value)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                  category === c.value
                    ? 'bg-amber-600 text-white border-amber-600'
                    : 'border-border text-muted-foreground hover:border-amber-500 hover:text-amber-600'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3].map(i => <div key={i} className="h-72 rounded-2xl bg-muted animate-pulse" />)}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-24 text-muted-foreground">
              <p className="text-lg">No posts yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post, i) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => router.push(`/blog/${post.slug}`)}
                  className="cursor-pointer group rounded-2xl border border-border/50 bg-card overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1"
                >
                  {post.image_url ? (
                    <div className="relative h-48 overflow-hidden">
                      <Image src={post.image_url} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, 33vw" />
                    </div>
                  ) : (
                    <div className="h-48 bg-gradient-to-br from-amber-100 to-yellow-50 flex items-center justify-center">
                      <span className="text-5xl">🇧🇦</span>
                    </div>
                  )}
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="flex items-center gap-1 text-xs text-amber-600 font-medium">
                        <Tag className="h-3 w-3" /> {CATEGORY_LABELS[post.category] || post.category}
                      </span>
                      <span className="text-muted-foreground/40">·</span>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" /> {post.reading_time} min read
                      </span>
                    </div>
                    <h2 className="font-bold text-lg mb-2 group-hover:text-amber-600 transition-colors line-clamp-2">{post.title}</h2>
                    {post.excerpt && <p className="text-sm text-muted-foreground line-clamp-3">{post.excerpt}</p>}
                    <p className="text-xs text-muted-foreground mt-3">{new Date(post.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </motion.div>
      </div>
      <FooterSection />
    </div>
  );
};

export default Blog;
