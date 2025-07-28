import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"
import { Calendar, User, ArrowRight, AlertCircle } from "lucide-react"
import { getAllBlogPosts } from "@/lib/services"
import { BlogPost } from "@/lib/types"

// Transform database blog post to component format
function transformBlogPost(post: BlogPost) {
  return {
    id: post.id,
    title: post.title,
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
    slug: post.slug,
  };
}

// Helper function to estimate read time
function estimateReadTime(content: string): string {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  const readTime = Math.ceil(wordCount / wordsPerMinute);
  return `${readTime} min read`;
}

// Error fallback component
function DatabaseError({ message }: { message: string }) {
  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-8">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-800 dark:text-red-200 mb-2">
            Database Connection Error
          </h2>
          <p className="text-red-600 dark:text-red-300 mb-6">
            {message}
          </p>
          <div className="space-y-4">
            <p className="text-sm text-red-500 dark:text-red-400">
              Please ensure your database connection is working properly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function BlogPage() {
  let blogPosts: ReturnType<typeof transformBlogPost>[] = [];
  let errorMessage = '';

  try {
    const dbPosts = await getAllBlogPosts();
    blogPosts = dbPosts.map(transformBlogPost);
    
    // If no posts found in database
    if (blogPosts.length === 0) {
      errorMessage = 'No blog posts found in the database. Please add some blog posts or check if the seed data was imported correctly.';
    }
  } catch (error) {
    console.error('Failed to fetch blog posts:', error);
    errorMessage = 'Failed to connect to the database. Please check your database configuration.';
    
    // Return error component instead of dummy data
    return (
      <div className="pt-16">
        <section className="py-20 bg-gradient-to-r from-[#e51083] to-pink-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Our Blog</h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto">
              Stories of impact, education, and empowerment from the field
            </p>
          </div>
        </section>
        <DatabaseError message={errorMessage} />
      </div>
    );
  }

const categories = ["All", "Education", "Success Stories", "Research", "Community", "Sustainability", "Empowerment"]

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-[#e51083] to-pink-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Our Blog</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Stories of impact, education, and empowerment from the field
          </p>
          {errorMessage && (
            <div className="mt-4 p-4 bg-yellow-500/20 border border-yellow-400 rounded-lg text-yellow-100">
              ⚠️ {errorMessage}
            </div>
          )}
        </div>
      </section>

      {/* Categories Filter */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-4">Explore by Category</h2>
            <div className="mb-4 text-center">
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Showing {blogPosts.length} blog post{blogPosts.length !== 1 ? 's' : ''} from our database
              </p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category) => (
                <Badge
                  key={category}
                  variant={category === "All" ? "default" : "outline"}
                  className={`cursor-pointer ${
                    category === "All" ? "bg-[#e51083] hover:bg-[#c50e73]" : "hover:bg-[#e51083] hover:text-white"
                  }`}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      {blogPosts.length > 0 ? (
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.map((post) => (
                <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="relative">
                    <Image
                      src={post.image || "/placeholder.svg"}
                      alt={post.title}
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover"
                    />
                    <Badge className="absolute top-4 right-4 bg-[#e51083]">{post.category}</Badge>
                  </div>

                  <CardHeader>
                    <CardTitle className="text-xl line-clamp-2">{post.title}</CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-gray-600 dark:text-gray-400 line-clamp-3">{post.excerpt}</p>

                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <User className="h-4 w-4" />
                          <span>{post.author}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{post.date}</span>
                        </div>
                      </div>
                      <span>{post.readTime}</span>
                    </div>

                    <Link href={`/blog/${post.id}`}>
                      <button className="w-full bg-[#e51083] hover:bg-[#c50e73] text-white py-2 px-4 rounded-md transition-colors duration-300 flex items-center justify-center">
                        Read More <ArrowRight className="ml-2 h-4 w-4" />
                      </button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      ) : (
        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-md mx-auto">
              <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Blog Posts Found</h3>
              <p className="text-gray-600 dark:text-gray-400">
                No blog posts are currently available. Please check back later or contact the administrator.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Newsletter Subscription */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Stay Updated</h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter to get the latest stories and updates from our programs.
          </p>
          <div className="max-w-md mx-auto flex gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e51083]"
            />
            <button className="bg-[#e51083] hover:bg-[#c50e73] text-white px-6 py-2 rounded-md transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
