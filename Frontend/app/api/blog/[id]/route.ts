import { NextRequest, NextResponse } from 'next/server';
import { getBlogPostById } from '@/lib/services';
import { testConnection } from '@/lib/database';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Test database connection
    const isConnected = await testConnection();
    if (!isConnected) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      );
    }

    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid blog post ID' },
        { status: 400 }
      );
    }

    // Fetch blog post from database
    const post = await getBlogPostById(id);

    if (!post) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }

    // Transform data to match frontend expectations
    const transformedPost = {
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || post.content.substring(0, 150) + '...',
      content: post.content,
      image: post.featured_image || "/placeholder.svg?height=500&width=800",
      author: post.author || 'Bidii Team',
      date: post.created_at ? new Date(post.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }) : 'Unknown date',
      category: post.category || 'General',
      readTime: estimateReadTime(post.content),
      // For now, using placeholder images for gallery
      images: [
        post.featured_image || "/placeholder.svg?height=400&width=600",
        "/placeholder.svg?height=400&width=600",
        "/placeholder.svg?height=400&width=600",
      ],
    };

    return NextResponse.json(transformedPost);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog post' },
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
