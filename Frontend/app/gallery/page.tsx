"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

// Database Types
interface GalleryImage {
  id: number;
  title: string;
  description: string;
  category: string;
  image_url: string;
  alt_text: string;
  order_index: number;
}

interface DatabaseErrorProps {
  message: string;
}

function DatabaseError({ message }: DatabaseErrorProps) {
  return (
    <div className="flex items-center justify-center p-8 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
      <div className="text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-red-700 dark:text-red-400 mb-2">Database Error</h3>
        <p className="text-red-600 dark:text-red-300 mb-4">{message}</p>
        <p className="text-sm text-red-500 dark:text-red-400">
          Please check your database connection or contact the administrator.
        </p>
      </div>
    </div>
  );
}

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [categories, setCategories] = useState<string[]>(["All"])

  // Fetch gallery images from database
  const fetchGalleryImages = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/gallery')
      if (!response.ok) {
        throw new Error(`Failed to fetch gallery images: ${response.status} ${response.statusText}`)
      }
      
      const data: GalleryImage[] = await response.json()
      setGalleryImages(data)
      
      // Extract unique categories from the data
      const uniqueCategories = ["All", ...Array.from(new Set(data.map(img => img.category).filter(Boolean)))]
      setCategories(uniqueCategories)
      
    } catch (error) {
      console.error('Error fetching gallery images:', error)
      setError(error instanceof Error ? error.message : 'Failed to load gallery images from database')
    } finally {
      setLoading(false)
    }
  }

  // Retry function for failed requests
  const handleRetry = () => {
    fetchGalleryImages()
  }

  useEffect(() => {
    fetchGalleryImages()
  }, [])

  const filteredImages =
    selectedCategory === "All" ? galleryImages : galleryImages.filter((img) => img.category === selectedCategory)

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-[#e51083] to-pink-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Gallery</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Capturing moments of impact, empowerment, and transformation in our communities
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-2 justify-center mb-4">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className={
                  selectedCategory === category
                    ? "bg-[#e51083] hover:bg-[#c50e73]"
                    : "hover:bg-[#e51083] hover:text-white"
                }
              >
                {category}
              </Button>
            ))}
          </div>
          {!loading && !error && (
            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
              Showing {filteredImages.length} of {galleryImages.length} images
            </div>
          )}
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e51083]"></div>
              <p className="ml-4 text-gray-600 dark:text-gray-400">Loading gallery images...</p>
            </div>
          ) : error ? (
            <div className="mb-8">
              <DatabaseError message={error} />
              <div className="text-center mt-4">
                <Button 
                  onClick={handleRetry}
                  className="bg-[#e51083] hover:bg-[#c50e73]"
                >
                  Try Again
                </Button>
              </div>
            </div>
          ) : filteredImages.length === 0 ? (
            <div className="text-center py-20">
              <h3 className="text-xl font-semibold mb-2">No Images Found</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {selectedCategory === "All" 
                  ? "No gallery images are currently available in the database."
                  : `No images found in the "${selectedCategory}" category.`
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredImages.map((image) => (
                <div
                  key={image.id}
                  className="relative group cursor-pointer overflow-hidden rounded-lg"
                  onClick={() => setSelectedImage(image)}
                >
                  <Image
                    src={image.image_url || "/placeholder.svg"}
                    alt={image.alt_text || image.title}
                    width={600}
                    height={400}
                    className="w-full h-64 object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end">
                    <div className="p-4 text-white">
                      <Badge className="mb-2 bg-[#e51083]">{image.category}</Badge>
                      <h3 className="font-semibold">{image.title}</h3>
                      <p className="text-sm text-gray-200">{image.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Image Modal */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl">
          {selectedImage && (
            <div className="space-y-4">
              <Image
                src={selectedImage.image_url || "/placeholder.svg"}
                alt={selectedImage.alt_text || selectedImage.title}
                width={800}
                height={600}
                className="w-full h-auto rounded-lg"
              />
              <div>
                <Badge className="mb-2 bg-[#e51083]">{selectedImage.category}</Badge>
                <h3 className="text-xl font-semibold mb-2">{selectedImage.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{selectedImage.description}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Call to Action */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Be Part of Our Story</h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Join us in creating more moments of impact and transformation. Your support helps us reach more girls and
            communities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-[#e51083] hover:bg-[#c50e73]">Donate Now</Button>
            <Button
              variant="outline"
              className="border-[#e51083] text-[#e51083] hover:bg-[#e51083] hover:text-white bg-transparent"
            >
              Volunteer With Us
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
