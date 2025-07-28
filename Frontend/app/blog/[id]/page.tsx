"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, User, Clock, ChevronLeft, ChevronRight, Share2, AlertCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface BlogPost {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
  images: string[];
}

// Error fallback component
function DatabaseError({ message }: { message: string }) {
  return (
    <div className="pt-16 min-h-screen flex items-center justify-center">
      <div className="text-center max-w-md mx-auto">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-8">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-800 dark:text-red-200 mb-2">
            Database Connection Error
          </h2>
          <p className="text-red-600 dark:text-red-300 mb-6">
            {message}
          </p>
          <Link href="/blog">
            <Button className="bg-[#e51083] hover:bg-[#c50e73]">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function BlogPostPage() {
  const params = useParams()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPost() {
      try {
        setLoading(true)
        const response = await fetch(`/api/blog/${params.id}`)
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('Post not found')
          } else {
            const errorData = await response.json()
            setError(errorData.error || 'Failed to fetch blog post')
          }
          return
        }

        const postData = await response.json()
        setPost(postData)
      } catch (err) {
        console.error('Error fetching blog post:', err)
        setError('Failed to connect to the database. Please check your database configuration.')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchPost()
    }
  }, [params.id])

  if (loading) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e51083] mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading blog post...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return <DatabaseError message={error} />
  }

  if (!post) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Post Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The blog post you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/blog">
            <Button className="bg-[#e51083] hover:bg-[#c50e73]">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % (post.images?.length || 1))
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + (post.images?.length || 1)) % (post.images?.length || 1))
  }

  return (
    <div className="pt-16">
      {/* Header */}
      <section className="py-12 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <Link href="/blog">
            <Button variant="ghost" className="mb-6 hover:scale-105 transition-transform">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Button>
          </Link>

          <div className="max-w-4xl mx-auto">
            <Badge className="mb-4 bg-[#e51083]">{post.category}</Badge>
            <h1 className="text-3xl md:text-5xl font-bold mb-6 animate-fade-in-up">{post.title}</h1>

            <div className="flex flex-wrap items-center gap-6 text-gray-600 dark:text-gray-400 mb-8">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>{post.date}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>{post.readTime}</span>
              </div>
              <Button variant="ghost" size="sm" className="ml-auto hover:scale-105 transition-transform">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Featured Image */}
            <div className="mb-12 animate-fade-in-up">
              <Image
                src={post.image || "/placeholder.svg?height=500&width=800"}
                alt={post.title}
                width={800}
                height={500}
                className="w-full rounded-lg shadow-lg"
              />
            </div>

            {/* Article Content */}
            <div
              className="prose prose-lg max-w-none mb-12 animate-fade-in-up animation-delay-200"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Image Carousel */}
            {post.images && post.images.length > 0 && (
              <Card className="mb-12 animate-fade-in-up animation-delay-400">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Photo Gallery</h3>

                  <div className="relative">
                    <div className="aspect-video relative overflow-hidden rounded-lg">
                      <Image
                        src={post.images[currentImageIndex] || "/placeholder.svg"}
                        alt={`Gallery image ${currentImageIndex + 1}`}
                        fill
                        className="object-cover transition-all duration-300"
                      />
                    </div>

                    {post.images.length > 1 && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={prevImage}
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white hover:bg-black/70 hover:scale-110 transition-all"
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={nextImage}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white hover:bg-black/70 hover:scale-110 transition-all"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </Button>
                      </>
                    )}
                  </div>

                  {/* Thumbnail Navigation */}
                  {post.images.length > 1 && (
                    <div className="flex space-x-2 mt-4 overflow-x-auto">
                      {post.images.map((img, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`flex-shrink-0 w-16 h-16 rounded border-2 overflow-hidden transition-all duration-300 hover:scale-105 ${
                            index === currentImageIndex ? "border-[#e51083]" : "border-gray-300"
                          }`}
                        >
                          <Image
                            src={img || "/placeholder.svg"}
                            alt={`Thumbnail ${index + 1}`}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="text-center mt-4 text-sm text-gray-600 dark:text-gray-400">
                    Image {currentImageIndex + 1} of {post.images.length}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Call to Action */}
            <Card className="bg-[#e51083] text-white animate-fade-in-up animation-delay-600">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold mb-4">Join Our Mission</h3>
                <p className="mb-6">
                  Help us continue creating stories like this. Your support makes a real difference in girls' lives.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button className="bg-white text-[#e51083] hover:bg-gray-100 hover:scale-105 transition-all">
                    Donate Now
                  </Button>
                  <Button
                    variant="outline"
                    className="border-white text-white hover:bg-white hover:text-[#e51083] bg-transparent hover:scale-105 transition-all"
                  >
                    Volunteer With Us
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
