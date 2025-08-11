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
import { Plus, Eye, Edit, Trash2, Calendar, User } from "lucide-react"
import Image from "next/image"
import { DeleteConfirmation } from "@/components/admin/delete-confirmation"
import { ImageUploader } from "@/components/admin/image-uploader"
import { DatabaseError } from "@/components/admin/database-error"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

interface Story {
  id: number;
  title: string;
  content: string;
  author_name: string;
  feature_image?: string;
  date_published?: string | null;
  status: string;
  category_id?: number | null;
}

interface Category {
  id: number;
  name: string;
}

export default function StoriesPage() {
  // State
  const [stories, setStories] = useState<Story[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingStory, setEditingStory] = useState<Story | null>(null)
  const [viewingStory, setViewingStory] = useState<Story | null>(null)
  const [deletingStoryId, setDeletingStoryId] = useState<number | null>(null)
  
  // Form state
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    author_name: "",
    feature_image: "",
    date_published: "",
    status: "draft",
    category_id: "",
  })
  
  const { toast } = useToast()
  
  // Fetch stories
  const fetchStories = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${API_BASE_URL}/stories`)
      if (!response.ok) throw new Error("Failed to fetch stories")
      const data = await response.json()
      setStories(data)
    } catch (error) {
      console.error("Error fetching stories:", error)
      setError("Failed to fetch stories from database")
    } finally {
      setLoading(false)
    }
  }
  
  // Fetch categories for linking
  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`)
      if (!response.ok) throw new Error("Failed to fetch categories")
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error("Error fetching categories:", error)
      // Not setting error state as this is secondary data
    }
  }
  
  useEffect(() => {
    Promise.all([fetchStories(), fetchCategories()])
  }, [])
  
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
  const handleImageSelected = (imageDataUrl: string) => {
    setFormData(prev => ({ ...prev, feature_image: imageDataUrl }))
  }
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // Validation
      if (!formData.title || !formData.content) {
        toast({
          title: "Missing Required Fields",
          description: "Title and Content are required for a story.",
          variant: "destructive",
        })
        return
      }
      
      // Always send all fields, never undefined
      const storyData = {
        title: formData.title,
        content: formData.content,
        author_name: formData.author_name || "Anonymous",
        feature_image: formData.feature_image !== "" ? formData.feature_image : null,
        date_published: formData.date_published !== "" ? formData.date_published : null,
        status: formData.status || "draft",
        category_id: formData.category_id !== "" ? Number(formData.category_id) : null,
      }
      
      let response
      
      if (editingStory) {
        response = await fetch(`${API_BASE_URL}/stories/${editingStory.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(storyData),
        })
      } else {
        response = await fetch(`${API_BASE_URL}/stories`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(storyData),
        })
      }
      
      if (!response.ok) {
        throw new Error('Failed to save story')
      }
      
      // Refresh the stories list
      fetchStories()
      
      // Reset form and close dialog
      resetForm()
      setIsDialogOpen(false)
      
      toast({
        title: `Story ${editingStory ? 'Updated' : 'Created'}`,
        description: `The story was successfully ${editingStory ? 'updated' : 'created'}.`,
      })
      
    } catch (error) {
      console.error("Error saving story:", error)
      toast({
        title: "Error",
        description: `Failed to ${editingStory ? 'update' : 'create'} story. Please try again.`,
        variant: "destructive",
      })
    }
  }
  
  // Handle story deletion
  const handleDelete = async () => {
    if (!deletingStoryId) return
    
    try {
      const response = await fetch(`${API_BASE_URL}/stories`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: deletingStoryId }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete story')
      }
      
      // Update local state
      setStories(stories.filter((item) => item.id !== deletingStoryId))
      setDeletingStoryId(null)
      
      toast({
        title: "Story Deleted",
        description: "The story was successfully deleted.",
      })
    } catch (error) {
      console.error("Error deleting story:", error)
      toast({
        title: "Error",
        description: "Failed to delete story. Please try again.",
        variant: "destructive",
      })
    }
  }
  
  // Handle view button click
  const handleView = (story: Story) => {
    setViewingStory(story)
    setIsViewDialogOpen(true)
  }
  
  // Handle edit button click
  const handleEdit = (story: Story) => {
    setEditingStory(story)
    setFormData({
      title: story.title,
      content: story.content,
      author_name: story.author_name || "",
      feature_image: story.feature_image || "",
      date_published: story.date_published || "",
      status: story.status?.toLowerCase() || "draft",
      category_id: story.category_id?.toString() || "",
    })
    setIsDialogOpen(true)
  }
  
  // Reset form data
  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      author_name: "",
      feature_image: "",
      date_published: "",
      status: "draft",
      category_id: "",
    })
    setEditingStory(null)
  }
  
  // Get category name
  const getCategoryName = (categoryId: number | null | undefined) => {
    if (!categoryId) return "Uncategorized"
    const category = categories.find(cat => cat.id === categoryId)
    return category ? category.name : "Unknown Category"
  }
  
  // Format date
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "Not published"
    return new Date(dateString).toLocaleDateString()
  }
  
  // Get status badge class
  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'published':
        return 'bg-green-500'
      case 'draft':
        return 'bg-yellow-500'
      case 'archived':
        return 'bg-gray-500'
      default:
        return 'bg-blue-500'
    }
  }
  
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e51083]"></div>
        <p className="ml-4 text-gray-600 dark:text-gray-400">
          Loading stories...
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
        <h1 className="text-3xl font-bold">Manage Stories</h1>
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
              Add Story
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingStory ? 'Edit' : 'Add New'} Story</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Story Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="content">Story Content</Label>
                <Textarea
                  id="content"
                  name="content"
                  rows={8}
                  value={formData.content}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="author_name">Author Name</Label>
                  <Input
                    id="author_name"
                    name="author_name"
                    value={formData.author_name}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(value) => handleSelectChange("status", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category_id">Category</Label>
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
                
                <div className="space-y-2">
                  <Label htmlFor="date_published">Publish Date</Label>
                  <Input
                    id="date_published"
                    name="date_published"
                    type="date"
                    value={formData.date_published}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Feature Image</Label>
                <ImageUploader 
                  onImageSelected={handleImageSelected}
                  currentImage={formData.feature_image || undefined}
                  label="Upload Story Image"
                  aspectRatio="16:9"
                />
              </div>
              
              <Button
                type="submit"
                className="w-full bg-[#e51083] hover:bg-[#c50e73]"
              >
                {editingStory ? 'Update' : 'Add'} Story
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stories.length > 0 ? (
          stories.map((story) => (
            <Card key={story.id} className="overflow-hidden">
              <CardContent className="p-0">
                {story.feature_image && (
                  <div className="relative w-full h-48">
                    <Image
                      src={story.feature_image}
                      alt={story.title}
                      fill
                      className="object-cover"
                    />
                    <div className={`absolute top-2 right-2 ${getStatusBadgeClass(story.status)} text-white px-3 py-1 rounded-full text-xs uppercase`}>
                      {story.status}
                    </div>
                  </div>
                )}
                <div className="p-6">
                  <h3 className="font-semibold text-lg mb-2">{story.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                    {story.content}
                  </p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm">
                      <User className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{story.author_name || "Anonymous"}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{formatDate(story.date_published)}</span>
                    </div>
                    <div className="text-sm">
                      <strong>Category:</strong> {getCategoryName(story.category_id)}
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleView(story)}
                      className="w-full bg-transparent"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(story)}
                      className="w-full bg-transparent"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => setDeletingStoryId(story.id)}
                      className="w-full"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center p-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              No stories found. Add your first story to get started.
            </p>
            <Button 
              onClick={() => {
                resetForm()
                setIsDialogOpen(true)
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Story
            </Button>
          </div>
        )}
      </div>
      
      {/* View Dialog */}
      {viewingStory && (
        <Dialog
          open={isViewDialogOpen}
          onOpenChange={(open) => {
            setIsViewDialogOpen(open)
            if (!open) setViewingStory(null)
          }}
        >
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Story Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              {viewingStory.feature_image && (
                <div className="relative w-full h-64 rounded-lg overflow-hidden">
                  <Image
                    src={viewingStory.feature_image}
                    alt={viewingStory.title}
                    fill
                    className="object-cover"
                  />
                  <div className={`absolute top-4 right-4 ${getStatusBadgeClass(viewingStory.status)} text-white px-4 py-1 rounded-full uppercase font-semibold`}>
                    {viewingStory.status}
                  </div>
                </div>
              )}
              
              <div>
                <h2 className="text-2xl font-bold">{viewingStory.title}</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-500 flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    {viewingStory.author_name || "Anonymous"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    {formatDate(viewingStory.date_published)}
                  </span>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold">Category</h3>
                <p>{getCategoryName(viewingStory.category_id)}</p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold">Content</h3>
                <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {viewingStory.content}
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsViewDialogOpen(false)
                    setViewingStory(null)
                  }}
                >
                  Close
                </Button>
                <Button
                  variant="default"
                  onClick={() => {
                    setIsViewDialogOpen(false)
                    handleEdit(viewingStory)
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
        isOpen={!!deletingStoryId}
        onClose={() => setDeletingStoryId(null)}
        onConfirm={handleDelete}
        itemType="story"
        itemName={stories.find(s => s.id === deletingStoryId)?.title}
      />
    </div>
  )
}
