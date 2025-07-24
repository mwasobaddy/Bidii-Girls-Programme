import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"
import { Calendar, User, ArrowRight } from "lucide-react"

const blogPosts = [
  {
    id: 1,
    title: "Breaking the Silence: Why Period Education Matters",
    excerpt:
      "Exploring the importance of comprehensive menstrual health education in breaking down stigma and empowering young girls.",
    image: "/placeholder.svg?height=200&width=300",
    author: "Sarah Wanjiku",
    date: "March 15, 2024",
    category: "Education",
    readTime: "5 min read",
  },
  {
    id: 2,
    title: "Success Story: How Maria Overcame Period Poverty",
    excerpt: "Meet Maria, a 16-year-old from Kibera who transformed her life through our menstrual hygiene program.",
    image: "/placeholder.svg?height=200&width=300",
    author: "Grace Muthoni",
    date: "March 10, 2024",
    category: "Success Stories",
    readTime: "3 min read",
  },
  {
    id: 3,
    title: "The Economic Impact of Period Poverty in Kenya",
    excerpt:
      "Understanding how period poverty affects girls' education and economic opportunities in Kenyan communities.",
    image: "/placeholder.svg?height=200&width=300",
    author: "David Kimani",
    date: "March 5, 2024",
    category: "Research",
    readTime: "7 min read",
  },
  {
    id: 4,
    title: "Community Champions: Local Leaders Making a Difference",
    excerpt: "Highlighting the incredible work of community leaders who are helping us reach more girls in need.",
    image: "/placeholder.svg?height=200&width=300",
    author: "Mary Akinyi",
    date: "February 28, 2024",
    category: "Community",
    readTime: "4 min read",
  },
  {
    id: 5,
    title: "Sustainable Solutions: Reusable Sanitary Pads Program",
    excerpt:
      "How our reusable sanitary pad initiative is creating lasting impact while being environmentally conscious.",
    image: "/placeholder.svg?height=200&width=300",
    author: "Sarah Wanjiku",
    date: "February 20, 2024",
    category: "Sustainability",
    readTime: "6 min read",
  },
  {
    id: 6,
    title: "Building Confidence: The Power of Peer Support Groups",
    excerpt:
      "Exploring how peer support groups are helping girls build confidence and support each other through challenges.",
    image: "/placeholder.svg?height=200&width=300",
    author: "Grace Muthoni",
    date: "February 15, 2024",
    category: "Empowerment",
    readTime: "5 min read",
  },
]

const categories = ["All", "Education", "Success Stories", "Research", "Community", "Sustainability", "Empowerment"]

export default function BlogPage() {
  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-[#e51083] to-pink-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Our Blog</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Stories, insights, and updates from the frontlines of our mission to empower girls
          </p>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="py-8 border-b">
        <div className="container mx-auto px-4">
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
      </section>

      {/* Blog Posts Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <Image
                    src={post.image || "/placeholder.svg"}
                    alt={post.title}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover"
                  />
                  <Badge className="absolute top-4 left-4 bg-[#e51083]">{post.category}</Badge>
                </div>

                <CardHeader>
                  <CardTitle className="text-lg line-clamp-2">{post.title}</CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-gray-600 dark:text-gray-400 line-clamp-3">{post.excerpt}</p>

                  <div className="flex items-center justify-between text-sm text-gray-500">
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

                  <Link
                    href={`/blog/${post.id}`}
                    className="inline-flex items-center text-[#e51083] hover:text-[#c50e73] font-semibold"
                  >
                    Read More <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Stay Updated</h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter to receive the latest stories and updates from Bidii Girls Program.
          </p>
          <div className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e51083]"
            />
            <button className="bg-[#e51083] hover:bg-[#c50e73] text-white px-6 py-2 rounded-lg font-semibold">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
