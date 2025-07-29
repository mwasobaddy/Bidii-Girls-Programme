import { NextRequest, NextResponse } from 'next/server';
import { getAllBlogPosts, getAllBlogPostsForAdmin, createBlogPost, updateBlogPost, deleteBlogPost } from '@/lib/services';
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

    // Check if this is an admin request (for admin panel, show all posts)
    const { searchParams } = new URL(request.url);
    const isAdmin = searchParams.get('admin') === 'true';
    
    // Fetch blog posts from database
    const blogPosts = isAdmin ? await getAllBlogPostsForAdmin() : await getAllBlogPosts();

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
      published: post.published,
      featured_image: post.featured_image,
      created_at: post.created_at,
      updated_at: post.updated_at,
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

export async function POST(request: NextRequest) {
  try {
    // Test database connection
    const isConnected = await testConnection();
    if (!isConnected) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      );
    }

    const body = await request.json();
    
    // Validate required fields
    if (!body.title || !body.content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    // Generate slug if not provided
    const slug = body.slug || body.title.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();

    // Transform the data to match database schema
    const blogPostData = {
      title: body.title,
      slug: slug,
      excerpt: body.excerpt || body.content.substring(0, 150) + '...',
      content: body.content,
      category: body.category || 'General',
      author: body.author || 'Bidii Team',
      featured_image: body.featured_image || null,
      published: body.published !== undefined ? body.published : true,
    };

    const newBlogPost = await createBlogPost(blogPostData);
    
    return NextResponse.json(newBlogPost, { status: 201 });
  } catch (error) {
    console.error('Error creating blog post:', error);
    return NextResponse.json(
      { error: 'Failed to create blog post' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Test database connection
    const isConnected = await testConnection();
    if (!isConnected) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { id, ...updateData } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Blog post ID is required' },
        { status: 400 }
      );
    }

    // Transform the data to match database schema
    const blogPostData: any = {};
    if (updateData.title !== undefined) blogPostData.title = updateData.title;
    if (updateData.slug !== undefined) blogPostData.slug = updateData.slug;
    if (updateData.excerpt !== undefined) blogPostData.excerpt = updateData.excerpt;
    if (updateData.content !== undefined) blogPostData.content = updateData.content;
    if (updateData.category !== undefined) blogPostData.category = updateData.category;
    if (updateData.author !== undefined) blogPostData.author = updateData.author;
    if (updateData.featured_image !== undefined) blogPostData.featured_image = updateData.featured_image;
    if (updateData.published !== undefined) blogPostData.published = updateData.published;

    const updatedBlogPost = await updateBlogPost(id, blogPostData);
    
    return NextResponse.json(updatedBlogPost);
  } catch (error) {
    console.error('Error updating blog post:', error);
    return NextResponse.json(
      { error: 'Failed to update blog post' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Test database connection
    const isConnected = await testConnection();
    if (!isConnected) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Blog post ID is required' },
        { status: 400 }
      );
    }

    await deleteBlogPost(Number(id));
    
    return NextResponse.json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json(
      { error: 'Failed to delete blog post' },
      { status: 500 }
    );
  }
}
