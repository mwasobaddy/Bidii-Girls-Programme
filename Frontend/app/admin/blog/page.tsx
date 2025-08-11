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

interface BlogPost {
  id: number;
  title: string;
  content: string;
  author: string;
  author_image?: string | null;
  published_date: string;
  featured_image?: string | null;
  category?: string | null;
  tags?: string;
  excerpt?: string;
}

export default function BlogPage() {
  // State
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const [viewingPost, setViewingPost] = useState<BlogPost | null>(null)
  const [deletingPostId, setDeletingPostId] = useState<number | null>(null)
  
  // Form state
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    author: "",
    author_image: "",
    published_date: new Date().toISOString().split('T')[0],
    featured_image: "",
    category: "none",
    tags: "",
    excerpt: "",
  })
  const [customCategory, setCustomCategory] = useState("")
  
  const { toast } = useToast()
  
  // Fetch blog posts
  const fetchBlogPosts = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${API_BASE_URL}/blog`)
      if (!response.ok) throw new Error("Failed to fetch blog posts")
      const data = await response.json()
      setBlogPosts(data)
      
      // Extract unique categories from blog posts
      const uniqueCategories = Array.from(
        new Set(
          data
            .map((post: any) => post.category)
            .filter((category: any): category is string => 
              typeof category === 'string' && 
              category !== null && 
              category !== undefined && 
              category.trim() !== ""
            )
        )
      ).sort();
      
      setCategories(uniqueCategories as string[]);
    } catch (error) {
      console.error("Error fetching blog posts:", error)
      setError("Failed to fetch blog posts from database")
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    fetchBlogPosts()
  }, [])
  
  // Handle form input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  // Handle content change from rich text editor
  const handleContentChange = (content: string) => {
    setFormData(prev => ({ ...prev, content }))
  }
  
  // Handle select change
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  // Handle featured image upload
  const handleFeaturedImageSelected = (imageDataUrl: string) => {
    setFormData(prev => ({ ...prev, featured_image: imageDataUrl }))
  }
  
  // Handle author image upload
  const handleAuthorImageSelected = (imageDataUrl: string) => {
    setFormData(prev => ({ ...prev, author_image: imageDataUrl }))
  }
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // Validation
      if (!formData.title || !formData.content) {
        toast({
          title: "Missing Required Fields",
          description: "Title and Content are required for a blog post.",
          variant: "destructive",
        })
        return
      }
      
      // Validate custom category
      if (formData.category === "other" && !customCategory.trim()) {
        toast({
          title: "Missing Custom Category",
          description: "Please enter a custom category name when 'Other' is selected.",
          variant: "destructive",
        })
        return
      }
      
      // Create excerpt if not provided
      let excerpt = formData.excerpt
      if (!excerpt && formData.content) {
        // Strip HTML tags and get first 150 characters
        const tempDiv = document.createElement("div")
        tempDiv.innerHTML = formData.content
        excerpt = tempDiv.textContent?.slice(0, 150) + "..." || ""
      }
      
      // Determine the final category value
      let finalCategory: string | null = formData.category
      if (formData.category === "other" && customCategory.trim()) {
        finalCategory = customCategory.trim()
      } else if (formData.category === "none") {
        finalCategory = null
      }
      
      // Always send all fields, never undefined
      const postData = {
        title: formData.title,
        content: formData.content,
        author: formData.author || "Anonymous",
        author_image: formData.author_image || null,
        published_date: formData.published_date || null,
        featured_image: formData.featured_image || null,
        category: finalCategory === "other" ? null : finalCategory,
        tags: formData.tags || null,
        excerpt: excerpt,
        published: true, // Always publish by default, you can add a checkbox later if needed
      }
      
      let response
      
      if (editingPost) {
        response = await fetch(`${API_BASE_URL}/blog/${editingPost.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(postData),
        })
      } else {
        response = await fetch(`${API_BASE_URL}/blog`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(postData),
        })
      }
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        throw new Error(errorData.error || `Failed to save blog post (${response.status})`)
      }
      
      // Refresh the blog posts list
      fetchBlogPosts()
      
      // Reset form and close dialog
      resetForm()
      setIsDialogOpen(false)
      
      toast({
        title: `Blog Post ${editingPost ? 'Updated' : 'Created'}`,
        description: `The blog post was successfully ${editingPost ? 'updated' : 'created'}.`,
      })
      
    } catch (error) {
      console.error("Error saving blog post:", error)
      toast({
        title: "Error",
        description: `Failed to ${editingPost ? 'update' : 'create'} blog post. Please try again.`,
        variant: "destructive",
      })
    }
  }
  
  // Handle blog post deletion
  const handleDelete = async () => {
    if (!deletingPostId) return
    
    try {
      const response = await fetch(`${API_BASE_URL}/blog`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: deletingPostId }),
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        throw new Error(errorData.error || `Failed to delete blog post (${response.status})`)
      }
      
      // Update local state
      setBlogPosts(blogPosts.filter((item) => item.id !== deletingPostId))
      setDeletingPostId(null)
      
      toast({
        title: "Blog Post Deleted",
        description: "The blog post was successfully deleted.",
      })
    } catch (error) {
      console.error("Error deleting blog post:", error)
      toast({
        title: "Error",
        description: "Failed to delete blog post. Please try again.",
        variant: "destructive",
      })
    }
  }
  
  // Handle view button click
  const handleView = (post: BlogPost) => {
    setViewingPost(post)
    setIsViewDialogOpen(true)
  }
  
  // Handle edit button click
  const handleEdit = (post: BlogPost) => {
    setEditingPost(post)
    
    // Determine if the post's category is a custom one
    const isCustomCategory = post.category && 
      post.category !== "none" && 
      !categories.includes(post.category)
    
    setFormData({
      title: post.title,
      content: post.content,
      author: post.author || "",
      author_image: post.author_image || "",
      published_date: post.published_date || new Date().toISOString().split('T')[0],
      featured_image: post.featured_image || "",
      category: isCustomCategory ? "other" : (post.category || "none"),
      tags: post.tags || "",
      excerpt: post.excerpt || "",
    })
    
    // Set custom category if it's a custom one
    setCustomCategory(isCustomCategory ? post.category || "" : "")
    
    setIsDialogOpen(true)
  }
  
  // Reset form data
  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      author: "",
      author_image: "",
      published_date: new Date().toISOString().split('T')[0],
      featured_image: "",
      category: "none",
      tags: "",
      excerpt: "",
    })
    setCustomCategory("")
    setEditingPost(null)
  }
  
  // Get category name
  const getCategoryName = (category: string | null | undefined) => {
    return category || "Uncategorized"
  }
  
  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }
  
  // Truncate text
  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
  }
  
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e51083]"></div>
        <p className="ml-4 text-gray-600 dark:text-gray-400">
          Loading blog posts...
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
        <h1 className="text-3xl font-bold">Manage Blog</h1>
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
              Add Blog Post
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingPost ? 'Edit' : 'Add New'} Blog Post</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Post Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="author">Author Name</Label>
                  <Input
                    id="author"
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="published_date">Publish Date</Label>
                  <Input
                    id="published_date"
                    name="published_date"
                    type="date"
                    value={formData.published_date}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    value={formData.category || "none"} 
                    onValueChange={(value) => handleSelectChange("category", value === "none" ? "" : value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Uncategorized</SelectItem>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                      <SelectItem value="other">Other (Custom)</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  {formData.category === "other" && (
                    <div className="mt-2">
                      <Label htmlFor="customCategory">Custom Category</Label>
                      <Input
                        id="customCategory"
                        value={customCategory}
                        onChange={(e) => setCustomCategory(e.target.value)}
                        placeholder="Enter your custom category"
                        className="mt-1"
                      />
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (comma separated)</Label>
                  <Input
                    id="tags"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    placeholder="technology, news, update"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Featured Image</Label>
                <ImageUploader 
                  onImageSelected={handleFeaturedImageSelected}
                  currentImage={formData.featured_image || undefined}
                  label="Upload Blog Image"
                  aspectRatio="16:9"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Author Image</Label>
                <ImageUploader 
                  onImageSelected={handleAuthorImageSelected}
                  currentImage={formData.author_image || undefined}
                  label="Upload Author Avatar"
                  aspectRatio="1:1"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt (optional)</Label>
                <Textarea
                  id="excerpt"
                  name="excerpt"
                  rows={3}
                  value={formData.excerpt}
                  onChange={handleChange}
                  placeholder="A brief summary of the blog post. If left empty, one will be generated from the content."
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  className="min-h-[300px]"
                  placeholder="Write your blog post content here..."
                />
              </div>
              
              <Button
                type="submit"
                className="w-full bg-[#e51083] hover:bg-[#c50e73]"
              >
                {editingPost ? 'Update' : 'Add'} Blog Post
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {blogPosts.length > 0 ? (
          blogPosts.map((post) => (
            <Card key={post.id} className="overflow-hidden">
              <CardContent className="p-0">
                {post.featured_image && (
                  <div className="relative w-full h-48">
                    <Image
                      src={post.featured_image}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="font-semibold text-xl mb-2">{post.title}</h3>
                  
                  <div className="flex items-center mb-4">
                    <div className="relative w-8 h-8 rounded-full overflow-hidden mr-2">
                      {post.author_image ? (
                        <Image
                          src={post.author_image}
                          alt={post.author}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <Image
                          src="/placeholder-user.jpg"
                          alt={post.author}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="text-sm">
                      <div className="font-medium">{post.author}</div>
                      <div className="text-gray-500">{formatDate(post.published_date)}</div>
                    </div>
                  </div>
                  
                  {post.excerpt && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                  )}
                  
                  <div className="mb-4 text-sm">
                    <span className="font-medium">Category: </span>
                    <span className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-full px-2.5 py-0.5 text-xs">
                      {getCategoryName(post.category)}
                    </span>
                    
                    {post.tags && (
                      <div className="mt-2">
                        <span className="font-medium">Tags: </span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {post.tags.split(',').map((tag, index) => (
                            <span 
                              key={index} 
                              className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-full px-2.5 py-0.5 text-xs"
                            >
                              {tag.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleView(post)}
                      className="w-full bg-transparent"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(post)}
                      className="w-full bg-transparent"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => setDeletingPostId(post.id)}
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
              No blog posts found. Add your first post to get started.
            </p>
            <Button 
              onClick={() => {
                resetForm()
                setIsDialogOpen(true)
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Blog Post
            </Button>
          </div>
        )}
      </div>
      
      {/* View Dialog */}
      {viewingPost && (
        <Dialog
          open={isViewDialogOpen}
          onOpenChange={(open) => {
            setIsViewDialogOpen(open)
            if (!open) setViewingPost(null)
          }}
        >
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Blog Post Preview</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              {viewingPost.featured_image && (
                <div className="relative w-full h-72 rounded-lg overflow-hidden">
                  <Image
                    src={viewingPost.featured_image}
                    alt={viewingPost.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              
              <div>
                <h2 className="text-2xl font-bold">{viewingPost.title}</h2>
                <div className="flex items-center mt-4">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3">
                    {viewingPost.author_image ? (
                      <Image
                        src={viewingPost.author_image}
                        alt={viewingPost.author}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <Image
                        src="/placeholder-user.jpg"
                        alt={viewingPost.author}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div>
                    <div className="font-medium">{viewingPost.author}</div>
                    <div className="text-sm text-gray-500">
                      Published on {formatDate(viewingPost.published_date)}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-1">
                <div>
                  <span className="font-medium">Category: </span>
                  <span className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-full px-2.5 py-0.5 text-sm">
                    {getCategoryName(viewingPost.category)}
                  </span>
                </div>
                
                {viewingPost.tags && (
                  <div>
                    <span className="font-medium">Tags: </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {viewingPost.tags.split(',').map((tag, index) => (
                        <span 
                          key={index} 
                          className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-full px-2.5 py-0.5 text-sm"
                        >
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="border-l-4 border-gray-200 pl-4 italic text-gray-600 dark:text-gray-400">
                {viewingPost.excerpt}
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">Content</h3>
                <div 
                  className="prose dark:prose-invert max-w-none" 
                  dangerouslySetInnerHTML={{ __html: viewingPost.content }}
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsViewDialogOpen(false)
                    setViewingPost(null)
                  }}
                >
                  Close
                </Button>
                <Button
                  variant="default"
                  onClick={() => {
                    setIsViewDialogOpen(false)
                    handleEdit(viewingPost)
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
        isOpen={!!deletingPostId}
        onClose={() => setDeletingPostId(null)}
        onConfirm={handleDelete}
        itemType="blog post"
        itemName={blogPosts.find(p => p.id === deletingPostId)?.title}
      />
    </div>
  )
}
