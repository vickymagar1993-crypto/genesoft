'use client';

import { motion } from 'framer-motion';
import { ChevronRight, Calendar, Eye, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import FloatingOrbs from '@/components/shared/FloatingOrbs';
import GlassCard from '@/components/shared/GlassCard';

import NextImage from 'next/image';

const BlogDetailPage = ({ blog, setCurrentPage }) => {
  if (!blog) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center">
        <p>Blog not found</p>
      </div>
    );
  }

  return (
    <div className="pt-24 min-h-screen bg-gradient-to-br from-white via-orange-50/20 to-white">
      <FloatingOrbs />
      <div className="container mx-auto px-6 py-16 relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            className="mb-8 text-orange-500"
            onClick={() => setCurrentPage('blog')}
          >
            <ChevronRight className="w-4 h-4 mr-2 rotate-180" />
            Back to Blog
          </Button>
          
          {blog.coverImageUrl && (
            <div className="rounded-2xl overflow-hidden mb-8 shadow-xl relative h-[400px] w-full">
              <NextImage
                src={blog.coverImageUrl}
                alt={blog.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          <div className="flex flex-wrap gap-2 mb-4">
            {blog.tags?.map((tag, i) => (
              <Badge key={i} variant="secondary" className="bg-orange-50 text-orange-600">
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">{blog.title}</h1>

          <div className="flex items-center gap-6 text-gray-500 mb-8">
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {new Date(blog.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
            <span>By {blog.author}</span>
            <span className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {blog.views || 0} views
            </span>
          </div>

          <GlassCard className="p-8 md:p-12">
            <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-a:text-orange-500">
              {blog.content.split('\n').map((paragraph, i) => (
                <p key={i} className="mb-4 text-gray-700 leading-relaxed">{paragraph}</p>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
};

export default BlogDetailPage;
