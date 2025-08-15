import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "@inertiajs/react";
import { Calendar, User, ArrowRight, AlertCircle } from "lucide-react";

const API_BASE_URL = window.location.origin + '/api';

// Helper function to construct proper image URLs
function getImageUrl(imagePath) {
  if (!imagePath) return "/placeholder.svg";
  
  // If it's already a full URL or base64, return as is
  if (imagePath.startsWith('http') || imagePath.startsWith('data:')) {
    return imagePath;
  }
  
  // If it's a relative path, prepend the backend URL
  const BACKEND_URL = API_BASE_URL.replace('/api', '');
  return `${BACKEND_URL}${imagePath}`;
}

export function BlogFilter({ categories, blogPosts }) {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredPosts = selectedCategory === "All" 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  return (
    <>
      {/* Categories Filter */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-4">Explore by Category</h2>
            <div className="mb-4 text-center">
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Showing {filteredPosts.length} of {blogPosts.length} blog post
                {filteredPosts.length !== 1 ? "s" : ""} 
                {selectedCategory !== "All" && ` in "${selectedCategory}"`}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category) => (
                <Badge
                  key={category}
                  variant={category === selectedCategory ? "default" : "outline"}
                  className={`cursor-pointer transition-colors ${
                    category === selectedCategory
                      ? "bg-[#e51083] hover:bg-[#c50e73]"
                      : "hover:bg-[#e51083] hover:text-white"
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      {filteredPosts.length > 0 ? (
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <Card
                  key={post.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="relative">
                    <img
                      src={getImageUrl(post.image)}
                      alt={post.title}
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover"
                    />
                    <Badge className="absolute top-4 right-4 bg-[#e51083]">
                      {post.category}
                    </Badge>
                  </div>

                  <CardHeader>
                    <CardTitle className="text-xl line-clamp-2">
                      {post.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-gray-600 dark:text-gray-400 line-clamp-3">
                      {post.excerpt}
                    </p>

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
                      <button className="w-full bg-[#e51083] hover:bg-[#c50e73] text-white py-2 px-4 rounded-md transition-colors duration-300 flex items-center justify-center mt-4">
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
              <h3 className="text-xl font-semibold mb-2">
                No Blog Posts Found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {selectedCategory === "All" 
                  ? "No blog posts are currently available. Please check back later or contact the administrator."
                  : `No blog posts found in the "${selectedCategory}" category. Try selecting a different category.`
                }
              </p>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
