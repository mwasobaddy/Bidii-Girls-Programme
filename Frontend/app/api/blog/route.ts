import { NextRequest, NextResponse } from 'next/server';
import { getAllBlogPosts } from '@/lib/services';
import { testConnection } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    // Test database connection
    const isConnected = await testConnection();
    if (!isConnected) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      );
    }

    // Fetch blog posts from database
    const blogPosts = await getAllBlogPosts();

    // Transform data to match frontend expectations
    const transformedPosts = blogPosts.map(post => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || post.content.substring(0, 150) + '...',
      image: post.featured_image || "/placeholder.svg?height=200&width=300",
      author: post.author || 'Bidii Team',
      date: post.created_at ? new Date(post.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }) : 'Unknown date',
      category: post.category || 'General',
      readTime: estimateReadTime(post.content),
      content: post.content,
    }));

    return NextResponse.json(transformedPosts);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}

// Helper function to estimate read time
function estimateReadTime(content: string): string {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  const readTime = Math.ceil(wordCount / wordsPerMinute);
  return `${readTime} min read`;
}
