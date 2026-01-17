'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Calendar, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import FloatingOrbs from '@/components/shared/FloatingOrbs';
import GlassCard from '@/components/shared/GlassCard';
import { staggerContainer, fadeInUp } from '@/lib/animations';

import NextImage from 'next/image';

const BlogPage = ({ setCurrentPage, setSelectedBlog }) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch('/api/blogs?status=Published');
        const data = await res.json();
        setBlogs(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="pt-24 min-h-screen bg-gradient-to-br from-white via-orange-50/20 to-white">
      <FloatingOrbs />
      <div className="container mx-auto px-6 py-16 relative z-10">
        <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <Badge className="mb-4 bg-orange-100 text-orange-600 border-orange-200">
            <BookOpen className="w-4 h-4 mr-2" />
            Our Blog
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Latest <span className="text-gradient-orange">Insights</span>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Stay updated with the latest trends, tips, and insights in B2B sales and marketing
          </p>
        </motion.div>

        {blogs.length === 0 ? (
          <GlassCard className="p-12 text-center">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Blog Posts Yet</h3>
            <p className="text-gray-500">Check back later for new content!</p>
          </GlassCard>
        ) : (
          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {blogs.map((blog) => (
              <motion.div key={blog.id} variants={fadeInUp}>
                <GlassCard className="overflow-hidden h-full cursor-pointer group" hover>
                  {blog.coverImageUrl && (
                    <div className="h-48 overflow-hidden relative w-full">
                      <NextImage
                        src={blog.coverImageUrl}
                        alt={blog.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {blog.tags?.slice(0, 3).map((tag, i) => (
                        <Badge key={i} variant="secondary" className="bg-orange-50 text-orange-600 text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-orange-500 transition-colors line-clamp-2">
                      {blog.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{blog.excerpt}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(blog.createdAt).toLocaleDateString()}
                      </span>
                      <span>{blog.author}</span>
                    </div>
                    <Button
                      variant="ghost"
                      className="mt-4 p-0 text-orange-500 hover:text-orange-600 group/btn"
                      onClick={() => {
                        setSelectedBlog(blog);
                        setCurrentPage('blog-detail');
                      }}
                    >
                      Read More
                      <ChevronRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default BlogPage;
