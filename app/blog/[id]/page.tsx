"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, User, Clock, ChevronLeft, ChevronRight, Share2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// Mock blog data - in real app, this would come from your database
const blogPosts = {
  "1": {
    id: 1,
    title: "Breaking the Silence: Why Period Education Matters",
    content: `
      <p>Period education is crucial for empowering girls and breaking down harmful stigmas that have persisted for generations. In many communities across Kenya, menstruation is still considered a taboo subject, leading to misinformation, shame, and ultimately, girls missing school during their periods.</p>
      
      <h2>The Current Situation</h2>
      <p>According to recent studies, 1 in 10 girls in sub-Saharan Africa miss school during their menstrual period. This absence can lead to falling behind in studies, lower academic performance, and in some cases, dropping out of school entirely.</p>
      
      <h2>Our Approach</h2>
      <p>At Bidii Girls Program, we believe that comprehensive menstrual health education is the foundation of change. Our workshops cover:</p>
      <ul>
        <li>Basic anatomy and menstrual cycle understanding</li>
        <li>Proper hygiene practices</li>
        <li>Myth-busting and addressing cultural taboos</li>
        <li>Building confidence and self-esteem</li>
      </ul>
      
      <h2>Impact Stories</h2>
      <p>Since launching our education program, we've seen remarkable changes in the communities we serve. Girls are more confident, attendance rates have improved by 95%, and mothers are now having open conversations with their daughters about menstrual health.</p>
      
      <p>Education is the key to breaking the cycle of period poverty and empowering the next generation of girls to reach their full potential.</p>
    `,
    excerpt:
      "Exploring the importance of comprehensive menstrual health education in breaking down stigma and empowering young girls.",
    category: "Education",
    author: "Sarah Wanjiku",
    date: "March 15, 2024",
    readTime: "5 min read",
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
  },
  "2": {
    id: 2,
    title: "Success Story: How Maria Overcame Period Poverty",
    content: `
      <p>Maria's story is one of resilience, determination, and the transformative power of support. At 16 years old, Maria was on the verge of dropping out of school due to period poverty when she first encountered our program.</p>
      
      <h2>The Challenge</h2>
      <p>Living in Kibera with her grandmother, Maria couldn't afford sanitary products. Every month, she would miss 3-4 days of school, using old rags or staying home entirely. Her grades were suffering, and she felt hopeless about her future.</p>
      
      <h2>The Intervention</h2>
      <p>When our team visited Maria's school, she was one of the first to join our menstrual health program. We provided her with:</p>
      <ul>
        <li>A year's supply of reusable sanitary pads</li>
        <li>Comprehensive menstrual health education</li>
        <li>Confidence-building workshops</li>
        <li>Academic support and mentoring</li>
      </ul>
      
      <h2>The Transformation</h2>
      <p>Within six months, Maria's attendance improved to 100%. Her grades went from failing to being in the top 10% of her class. More importantly, she became a peer educator, helping other girls in her community.</p>
      
      <p>Today, Maria is in her final year of secondary school and dreams of becoming a doctor. She continues to volunteer with our program, proving that when we invest in girls, they become agents of change in their communities.</p>
    `,
    excerpt: "Meet Maria, a 16-year-old from Kibera who transformed her life through our menstrual hygiene program.",
    category: "Success Stories",
    author: "Grace Muthoni",
    date: "March 10, 2024",
    readTime: "3 min read",
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
  },
  "3": {
    id: 3,
    title: "The Economic Impact of Period Poverty in Kenya",
    content: `
      <p>Period poverty has far-reaching economic consequences that extend beyond individual girls to affect entire communities and the nation's development. Understanding these impacts is crucial for developing effective interventions.</p>
      
      <h2>Direct Economic Costs</h2>
      <p>The average Kenyan girl spends approximately 2,000 KES annually on menstrual products. For families living on less than $2 per day, this represents a significant portion of their income, often forcing difficult choices between basic needs.</p>
      
      <h2>Educational Disruption</h2>
      <p>When girls miss school due to their periods, the economic impact compounds over time:</p>
      <ul>
        <li>Lower educational attainment leads to reduced earning potential</li>
        <li>Early marriage and pregnancy rates increase</li>
        <li>Intergenerational poverty cycles continue</li>
      </ul>
      
      <h2>Workplace Impact</h2>
      <p>Adult women also face challenges in the workplace due to inadequate menstrual hygiene facilities and cultural stigma, leading to:</p>
      <ul>
        <li>Reduced productivity during menstrual periods</li>
        <li>Increased absenteeism</li>
        <li>Limited career advancement opportunities</li>
      </ul>
      
      <h2>The Solution</h2>
      <p>Investing in menstrual health and hygiene programs yields significant returns. For every $1 invested in menstrual health, there's an estimated $5 return in economic benefits through improved education, health, and productivity outcomes.</p>
      
      <p>Our comprehensive approach addresses not just the immediate need for products, but also the systemic barriers that perpetuate period poverty.</p>
    `,
    excerpt:
      "Understanding how period poverty affects girls' education and economic opportunities in Kenyan communities.",
    category: "Research",
    author: "David Kimani",
    date: "March 5, 2024",
    readTime: "7 min read",
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
  },
}

export default function BlogPostPage() {
  const params = useParams()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const post = blogPosts[params.id as keyof typeof blogPosts]

  if (!post) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Post Not Found</h1>
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
    setCurrentImageIndex((prev) => (prev + 1) % post.images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + post.images.length) % post.images.length)
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
                src="/placeholder.svg?height=500&width=800"
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
