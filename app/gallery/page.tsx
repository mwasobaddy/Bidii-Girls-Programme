"use client"

import { useState } from "react"
import Image from "next/image"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const galleryImages = [
  {
    id: 1,
    src: "/placeholder.svg?height=400&width=600",
    alt: "Girls receiving menstrual hygiene education",
    category: "Education",
    title: "Menstrual Health Workshop",
    description: "Girls learning about menstrual health and hygiene practices",
  },
  {
    id: 2,
    src: "/placeholder.svg?height=400&width=600",
    alt: "Distribution of sanitary pads",
    category: "Distribution",
    title: "Sanitary Pad Distribution",
    description: "Monthly distribution of hygiene products to girls in need",
  },
  {
    id: 3,
    src: "/placeholder.svg?height=400&width=600",
    alt: "Girls in empowerment workshop",
    category: "Empowerment",
    title: "Leadership Workshop",
    description: "Building confidence and leadership skills among young girls",
  },
  {
    id: 4,
    src: "/placeholder.svg?height=400&width=600",
    alt: "School infrastructure improvement",
    category: "Infrastructure",
    title: "School Toilet Renovation",
    description: "Improving school facilities for better hygiene and privacy",
  },
  {
    id: 5,
    src: "/placeholder.svg?height=400&width=600",
    alt: "Community meeting",
    category: "Community",
    title: "Community Engagement",
    description: "Working with local communities to address period poverty",
  },
  {
    id: 6,
    src: "/placeholder.svg?height=400&width=600",
    alt: "Girls celebrating graduation",
    category: "Success",
    title: "Program Graduation",
    description: "Celebrating girls who completed our empowerment program",
  },
  {
    id: 7,
    src: "/placeholder.svg?height=400&width=600",
    alt: "Team members at work",
    category: "Team",
    title: "Our Team in Action",
    description: "Bidii Girls team members working in the field",
  },
  {
    id: 8,
    src: "/placeholder.svg?height=400&width=600",
    alt: "Volunteer training session",
    category: "Training",
    title: "Volunteer Training",
    description: "Training volunteers to support our mission",
  },
  {
    id: 9,
    src: "/placeholder.svg?height=400&width=600",
    alt: "Girls studying in improved classroom",
    category: "Education",
    title: "Learning Environment",
    description: "Girls studying in improved learning environments",
  },
]

const categories = [
  "All",
  "Education",
  "Distribution",
  "Empowerment",
  "Infrastructure",
  "Community",
  "Success",
  "Team",
  "Training",
]

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedImage, setSelectedImage] = useState<(typeof galleryImages)[0] | null>(null)

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
          <div className="flex flex-wrap gap-2 justify-center">
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
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredImages.map((image) => (
              <div
                key={image.id}
                className="relative group cursor-pointer overflow-hidden rounded-lg"
                onClick={() => setSelectedImage(image)}
              >
                <Image
                  src={image.src || "/placeholder.svg"}
                  alt={image.alt}
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
        </div>
      </section>

      {/* Image Modal */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl">
          {selectedImage && (
            <div className="space-y-4">
              <Image
                src={selectedImage.src || "/placeholder.svg"}
                alt={selectedImage.alt}
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
