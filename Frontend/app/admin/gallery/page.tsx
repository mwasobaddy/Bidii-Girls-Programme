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
import { Plus, Eye, Edit, Trash2, Image as ImageIcon } from "lucide-react"
import Image from "next/image"
import { DeleteConfirmation } from "@/components/admin/delete-confirmation"
import { ImageUploader } from "@/components/admin/image-uploader"
import { DatabaseError } from "@/components/admin/database-error"
import { Checkbox } from "@/components/ui/checkbox"

interface GalleryItem {
  id: number;
  image_url: string;
  title?: string;
  description?: string;
  category_id?: number | null;
  featured: boolean;
  alt_text?: string;
}

interface Category {
  id: number;
  name: string;
}

export default function GalleryPage() {
  // State
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null)
  const [viewingItem, setViewingItem] = useState<GalleryItem | null>(null)
  const [deletingItemId, setDeletingItemId] = useState<number | null>(null)
  
  // Form state
  const [formData, setFormData] = useState({
    image_url: "",
    title: "",
    description: "",
    category_id: "",
    featured: false,
    alt_text: "",
  })
  
  const { toast } = useToast()
  
  // Fetch gallery items
  const fetchGalleryItems = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/gallery")
      if (!response.ok) throw new Error("Failed to fetch gallery items")
      const data = await response.json()
      setGalleryItems(data)
    } catch (error) {
      console.error("Error fetching gallery items:", error)
      setError("Failed to fetch gallery items from database")
    } finally {
      setLoading(false)
    }
  }
  
  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories")
      if (!response.ok) throw new Error("Failed to fetch categories")
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error("Error fetching categories:", error)
      // Not setting error state as this is secondary data
    }
  }
  
  useEffect(() => {
    Promise.all([fetchGalleryItems(), fetchCategories()])
  }, [])
  
  // Handle form input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  // Handle checkbox change
  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, featured: checked }))
  }
  
  // Handle select change
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  // Handle image upload
  const handleImageSelected = (imageDataUrl: string) => {
    setFormData(prev => ({ ...prev, image_url: imageDataUrl }))
  }
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // Validation
      if (!formData.image_url) {
        toast({
          title: "Missing Required Image",
          description: "An image is required for a gallery item.",
          variant: "destructive",
        })
        return
      }
      
      // Always send all fields, never undefined
      const galleryItemData = {
        image_url: formData.image_url,
        title: formData.title || null,
        description: formData.description || null,
        category_id: formData.category_id !== "" ? Number(formData.category_id) : null,
        featured: formData.featured,
        alt_text: formData.alt_text || formData.title || "Gallery image",
      }
      
      let response
      
      if (editingItem) {
        response = await fetch('/api/gallery', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingItem.id, ...galleryItemData }),
        })
      } else {
        response = await fetch('/api/gallery', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(galleryItemData),
        })
      }
      
      if (!response.ok) {
        throw new Error('Failed to save gallery item')
      }
      
      // Refresh the gallery items list
      fetchGalleryItems()
      
      // Reset form and close dialog
      resetForm()
      setIsDialogOpen(false)
      
      toast({
        title: `Gallery Item ${editingItem ? 'Updated' : 'Created'}`,
        description: `The gallery item was successfully ${editingItem ? 'updated' : 'created'}.`,
      })
      
    } catch (error) {
      console.error("Error saving gallery item:", error)
      toast({
        title: "Error",
        description: `Failed to ${editingItem ? 'update' : 'create'} gallery item. Please try again.`,
        variant: "destructive",
      })
    }
  }
  
  // Handle gallery item deletion
  const handleDelete = async () => {
    if (!deletingItemId) return
    
    try {
      const response = await fetch(`/api/gallery`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: deletingItemId }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete gallery item')
      }
      
      // Update local state
      setGalleryItems(galleryItems.filter((item) => item.id !== deletingItemId))
      setDeletingItemId(null)
      
      toast({
        title: "Gallery Item Deleted",
        description: "The gallery item was successfully deleted.",
      })
    } catch (error) {
      console.error("Error deleting gallery item:", error)
      toast({
        title: "Error",
        description: "Failed to delete gallery item. Please try again.",
        variant: "destructive",
      })
    }
  }
  
  // Handle view button click
  const handleView = (item: GalleryItem) => {
    setViewingItem(item)
    setIsViewDialogOpen(true)
  }
  
  // Handle edit button click
  const handleEdit = (item: GalleryItem) => {
    setEditingItem(item)
    setFormData({
      image_url: item.image_url,
      title: item.title || "",
      description: item.description || "",
      category_id: item.category_id?.toString() || "",
      featured: item.featured || false,
      alt_text: item.alt_text || "",
    })
    setIsDialogOpen(true)
  }
  
  // Reset form data
  const resetForm = () => {
    setFormData({
      image_url: "",
      title: "",
      description: "",
      category_id: "",
      featured: false,
      alt_text: "",
    })
    setEditingItem(null)
  }
  
  // Get category name
  const getCategoryName = (categoryId: number | null | undefined) => {
    if (!categoryId) return "Uncategorized"
    const category = categories.find(cat => cat.id === categoryId)
    return category ? category.name : "Unknown Category"
  }
  
  // Truncate text
  const truncateText = (text: string | undefined | null, maxLength: number) => {
    if (!text) return ""
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
  }
  
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e51083]"></div>
        <p className="ml-4 text-gray-600 dark:text-gray-400">
          Loading gallery items...
        </p>
      </div>
    )
  }
  
  if (error) {
    return <DatabaseError message={error} />
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Gallery</h1>
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
              Add Image
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Edit' : 'Add New'} Gallery Image</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Upload Image</Label>
                <ImageUploader 
                  onImageSelected={handleImageSelected}
                  currentImage={formData.image_url || undefined}
                  label="Upload Image"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="title">Title (optional)</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter a title for this image"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter a description for this image"
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category_id">Category (optional)</Label>
                  <Select 
                    value={formData.category_id} 
                    onValueChange={(value) => handleSelectChange("category_id", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Uncategorized</SelectItem>
                      {categories.map(category => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center h-full">
                  <div className="flex items-center space-x-2 mt-6">
                    <Checkbox 
                      id="featured" 
                      checked={formData.featured}
                      onCheckedChange={handleCheckboxChange}
                    />
                    <Label htmlFor="featured" className="cursor-pointer">
                      Featured Image
                    </Label>
                  </div>
                </div>
              </div>
              
              <Button
                type="submit"
                className="w-full bg-[#e51083] hover:bg-[#c50e73]"
              >
                {editingItem ? 'Update' : 'Add'} Gallery Item
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {galleryItems.length > 0 ? (
          galleryItems.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="relative w-full h-48 group">
                  <Image
                    src={item.image_url}
                    alt={item.alt_text || item.title || "Gallery image"}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                  {item.featured && (
                    <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs">
                      Featured
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleView(item)}
                      className="mr-2"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleEdit(item)}
                      className="mr-2"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => setDeletingItemId(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-sm truncate">
                    {item.title || "Untitled"}
                  </h3>
                  {item.category_id && (
                    <p className="text-xs text-gray-500">
                      {getCategoryName(item.category_id)}
                    </p>
                  )}
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
              Your gallery is empty. Add your first image to get started.
            </p>
            <Button 
              onClick={() => {
                resetForm()
                setIsDialogOpen(true)
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Image
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
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Image Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="relative w-full h-[60vh] rounded-lg overflow-hidden">
                <Image
                  src={viewingItem.image_url}
                  alt={viewingItem.alt_text || viewingItem.title || "Gallery image"}
                  fill
                  className="object-contain"
                />
                {viewingItem.featured && (
                  <div className="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm">
                    Featured
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                <div>
                  <h2 className="text-2xl font-bold">{viewingItem.title || "Untitled"}</h2>
                  {viewingItem.category_id && (
                    <p className="text-sm text-gray-500 mt-1">
                      Category: {getCategoryName(viewingItem.category_id)}
                    </p>
                  )}
                </div>
                
                {viewingItem.description && (
                  <div className="space-y-2">
                    <h3 className="font-semibold">Description</h3>
                    <p className="text-gray-700 dark:text-gray-300">
                      {viewingItem.description}
                    </p>
                  </div>
                )}
                
                <div className="space-y-2">
                  <h3 className="font-semibold">Accessibility</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    Alt Text: {viewingItem.alt_text || "None provided"}
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsViewDialogOpen(false)
                    setViewingItem(null)
                  }}
                >
                  Close
                </Button>
                <Button
                  variant="default"
                  onClick={() => {
                    setIsViewDialogOpen(false)
                    handleEdit(viewingItem)
                  }}
                >
                  Edit
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Delete Confirmation Dialog */}
      <DeleteConfirmation
        isOpen={!!deletingItemId}
        onClose={() => setDeletingItemId(null)}
        onConfirm={handleDelete}
        itemType="gallery image"
        itemName={galleryItems.find(i => i.id === deletingItemId)?.title || "this image"}
      />
    </div>
  )
}
