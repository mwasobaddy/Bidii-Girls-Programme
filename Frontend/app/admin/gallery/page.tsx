"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Eye, Folder, Image as ImageIcon, Trash2 } from "lucide-react"
import Image from "next/image"
import { ImageUploader } from "@/components/admin/image-uploader"

interface GalleryItem {
  name: string;
  url: string;
  category: string;
  size?: number;
  lastModified?: Date;
}

interface Category {
  name: string;
  folder: string;
}

export default function GalleryPage() {
  // State
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([])
  const [filteredItems, setFilteredItems] = useState<GalleryItem[]>([])
  const [categories] = useState<Category[]>([
    { name: "Blog Images", folder: "blog" },
    { name: "Campaign Images", folder: "campaigns" },
    { name: "Project Images", folder: "projects" },
    { name: "Stories", folder: "stories" },
    { name: "Team Photos", folder: "team" },
    { name: "Sponsor Logos", folder: "sponsors" },
    { name: "Author Avatars", folder: "authors" },
    { name: "Gallery", folder: "gallery" },
    { name: "Other", folder: "uploads" },
  ])
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [viewingItem, setViewingItem] = useState<GalleryItem | null>(null)
  
  // Form state
  const [formData, setFormData] = useState({
    image_url: "",
    category: "gallery",
    alt_text: "",
  })
  
  const { toast } = useToast()
  
  // Fetch images from file system
  const fetchGalleryItems = async () => {
    setLoading(true)
    try {
      const categoryParam = selectedCategory === "all" ? "" : `?category=${selectedCategory}`;
      const response = await fetch(`/api/gallery-scan${categoryParam}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch gallery images");
      }
      
      const items = await response.json();
      setGalleryItems(items)
      setFilteredItems(items)
    } catch (error) {
      console.error("Error fetching gallery items:", error)
      toast({
        title: "Error",
        description: "Failed to load gallery images",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    fetchGalleryItems()
  }, [selectedCategory])
  
  // Filter items by category (client-side filtering as backup)
  useEffect(() => {
    if (selectedCategory === "all") {
      setFilteredItems(galleryItems)
    } else {
      setFilteredItems(galleryItems.filter(item => item.category === selectedCategory))
    }
  }, [selectedCategory, galleryItems])
  
  // Handle form input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  // Handle select change
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  // Handle image upload
  const handleImageSelected = (imageUrl: string) => {
    setFormData(prev => ({ ...prev, image_url: imageUrl }))
  }
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // Validation
      if (!formData.image_url) {
        toast({
          title: "Missing Required Image",
          description: "Please upload an image.",
          variant: "destructive",
        })
        return
      }
      
      if (!formData.category) {
        toast({
          title: "Missing Category",
          description: "Please select a category.",
          variant: "destructive",
        })
        return
      }
      
      // Images are automatically uploaded via ImageUploader to the correct folder
      // We just need to refresh the gallery to show the new image
      await fetchGalleryItems()
      
      // Reset form and close dialog
      resetForm()
      setIsDialogOpen(false)
      
      toast({
        title: "Image Uploaded",
        description: "Your image has been uploaded successfully.",
      })
      
    } catch (error) {
      console.error("Error uploading image:", error)
      toast({
        title: "Error",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      })
    }
  }
  
  // Handle view button click
  const handleView = (item: GalleryItem) => {
    setViewingItem(item)
    setIsViewDialogOpen(true)
  }
  
  // Reset form data
  const resetForm = () => {
    setFormData({
      image_url: "",
      category: "gallery",
      alt_text: "",
    })
  }
  
  // Get category display name
  const getCategoryDisplayName = (folder: string) => {
    const category = categories.find(cat => cat.folder === folder)
    return category ? category.name : folder
  }
  
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e51083]"></div>
        <p className="ml-4 text-gray-600 dark:text-gray-400">
          Loading gallery...
        </p>
      </div>
    )
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Manage Gallery</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Upload and organize images by category. Images are automatically sorted into folders.
          </p>
        </div>
        <Dialog 
          open={isDialogOpen} 
          onOpenChange={(open) => {
            setIsDialogOpen(open)
            if (!open) resetForm()
          }}
        >
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                resetForm()
                setIsDialogOpen(true)
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Upload Image
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Upload New Image</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => handleSelectChange("category", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category.folder} value={category.folder}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">
                  Images will be uploaded to /uploads/{formData.category}/ folder
                </p>
              </div>
              
              <div className="space-y-2">
                <Label>Upload Image</Label>
                <ImageUploader 
                  onImageSelected={handleImageSelected}
                  currentImage={formData.image_url || undefined}
                  label={`Upload ${getCategoryDisplayName(formData.category)} Image`}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="alt_text">Alt Text for Accessibility</Label>
                <Input
                  id="alt_text"
                  name="alt_text"
                  value={formData.alt_text}
                  onChange={handleChange}
                  placeholder="Describe the image for screen readers"
                />
              </div>
              
              <Button
                type="submit"
                className="w-full bg-[#e51083] hover:bg-[#c50e73]"
              >
                Upload Image
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Category Filter */}
      <div className="mb-6">
        <Label htmlFor="categoryFilter" className="text-sm font-medium">
          Filter by Category:
        </Label>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-48 mt-2">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(category => (
              <SelectItem key={category.folder} value={category.folder}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Gallery Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filteredItems.length > 0 ? (
          filteredItems.map((item, index) => (
            <Card key={`${item.category}-${item.name}-${index}`} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="relative w-full h-48 group">
                  <Image
                    src={item.url}
                    alt={item.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                    {getCategoryDisplayName(item.category)}
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleView(item)}
                      className="mr-2"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-sm truncate" title={item.name}>
                    {item.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {item.url}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center p-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex justify-center mb-4">
              <ImageIcon className="h-16 w-16 text-gray-400" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {selectedCategory === "all" 
                ? "No images found. Upload your first image to get started."
                : `No images found in ${getCategoryDisplayName(selectedCategory)} category.`
              }
            </p>
            <Button 
              onClick={() => {
                resetForm()
                setIsDialogOpen(true)
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Upload Image
            </Button>
          </div>
        )}
      </div>
      
      {/* View Dialog */}
      {viewingItem && (
        <Dialog
          open={isViewDialogOpen}
          onOpenChange={(open) => {
            setIsViewDialogOpen(open)
            if (!open) setViewingItem(null)
          }}
        >
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Image Preview</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="relative w-full h-[60vh] rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                <Image
                  src={viewingItem.url}
                  alt={viewingItem.name}
                  fill
                  className="object-contain"
                />
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-sm text-gray-500 uppercase tracking-wide">File Name</h3>
                    <p className="text-lg font-medium">{viewingItem.name}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-gray-500 uppercase tracking-wide">Category</h3>
                    <p className="text-lg font-medium">{getCategoryDisplayName(viewingItem.category)}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-sm text-gray-500 uppercase tracking-wide">File Path</h3>
                  <p className="text-sm bg-gray-100 dark:bg-gray-800 p-2 rounded font-mono">
                    {viewingItem.url}
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsViewDialogOpen(false)
                    setViewingItem(null)
                  }}
                >
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
