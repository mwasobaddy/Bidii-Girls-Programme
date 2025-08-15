import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Eye, Edit, Trash2, Calendar, User } from "lucide-react";
import { DeleteConfirmation } from "@/components/admin/delete-confirmation";
import { ImageUploader } from "@/components/admin/image-uploader";
import { DatabaseError } from "@/components/admin/database-error";
import AdminLayout from "../AdminLayout";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
const BACKEND_URL = API_BASE_URL.replace('/api', ''); // Get base backend URL without /api

// Helper function to get full image URL
const getImageUrl = (imagePath) => {
  if (!imagePath) return "/placeholder.svg";
  if (imagePath.startsWith('data:')) return imagePath; // Base64 images
  if (imagePath.startsWith('http')) return imagePath; // Already full URL
  return `${BACKEND_URL}${imagePath}`; // Prepend backend URL for relative paths
};

export default function BlogPage() {
  // State
  const [blogPosts, setBlogPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [viewingPost, setViewingPost] = useState(null);
  const [deletingPostId, setDeletingPostId] = useState(null);
  
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
  });
  const [customCategory, setCustomCategory] = useState("");
  
  const { toast } = useToast();
  
  // Fetch blog posts
  const fetchBlogPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/blog`);
      if (!response.ok) throw new Error("Failed to fetch blog posts");
      const data = await response.json();
      setBlogPosts(data);
      
      // Extract unique categories from blog posts
      const uniqueCategories = Array.from(
        new Set(
          data
            .map((post) => post.category)
            .filter((category) => 
              typeof category === 'string' && 
              category !== null && 
              category !== undefined && 
              category.trim() !== ""
            )
        )
      ).sort();
      
      setCategories(uniqueCategories);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      setError("Failed to fetch blog posts from database");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchBlogPosts();
  }, []);
  
  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle content change from rich text editor
  const handleContentChange = (content) => {
    setFormData(prev => ({ ...prev, content }));
  };
  
  // Handle select change
  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle featured image upload
  const handleFeaturedImageSelected = (imageDataUrl) => {
    setFormData(prev => ({ ...prev, featured_image: imageDataUrl }));
  };
  
  // Handle author image upload
  const handleAuthorImageSelected = (imageDataUrl) => {
    setFormData(prev => ({ ...prev, author_image: imageDataUrl }));
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Validation
      if (!formData.title || !formData.content) {
        toast({
          title: "Missing Required Fields",
          description: "Title and Content are required for a blog post.",
          variant: "destructive",
        });
        return;
      }
      
      // Validate custom category
      if (formData.category === "other" && !customCategory.trim()) {
        toast({
          title: "Missing Custom Category",
          description: "Please enter a custom category name when 'Other' is selected.",
          variant: "destructive",
        });
        return;
      }
      
      // Create excerpt if not provided
      let excerpt = formData.excerpt;
      if (!excerpt && formData.content) {
        // Strip HTML tags and get first 150 characters
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = formData.content;
        excerpt = tempDiv.textContent?.slice(0, 150) + "..." || "";
      }
      
      // Determine the final category value
      let finalCategory = formData.category;
      if (formData.category === "other" && customCategory.trim()) {
        finalCategory = customCategory.trim();
      } else if (formData.category === "none") {
        finalCategory = null;
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
        published: true, // Always publish by default
      };
      
      console.log("Saving blog post with data:", postData);
      
      // Get JWT token for authentication
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }
      
      let response;
      
      if (editingPost) {
        // Update existing post
        response = await fetch(`${API_BASE_URL}/blog/${editingPost.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(postData),
        });
      } else {
        // Create new post
        response = await fetch(`${API_BASE_URL}/blog`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(postData),
        });
      }
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save blog post");
      }
      
      toast({
        title: editingPost ? "Blog Post Updated" : "Blog Post Created",
        description: `"${formData.title}" has been ${editingPost ? 'updated' : 'created'} successfully.`,
      });
      
      // Reset form and close dialog
      resetForm();
      setIsDialogOpen(false);
      
      // Refresh blog posts
      fetchBlogPosts();
      
    } catch (error) {
      console.error("Error saving blog post:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save blog post",
        variant: "destructive",
      });
    }
  };

  // Reset form
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
    });
    setCustomCategory("");
    setEditingPost(null);
  };

  // Handle edit
  const handleEdit = (post) => {
    setEditingPost(post);
    setFormData({
      title: post.title || "",
      content: post.content || "",
      author: post.author || "",
      author_image: post.author_image || "",
      published_date: post.published_date || new Date().toISOString().split('T')[0],
      featured_image: post.featured_image || "",
      category: post.category || "none",
      tags: post.tags || "",
      excerpt: post.excerpt || "",
    });
    setIsDialogOpen(true);
  };

  // Handle delete
  const handleDelete = async () => {
    if (!deletingPostId) return;
    
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }
      
      const response = await fetch(`${API_BASE_URL}/blog/${deletingPostId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete blog post");
      }
      
      toast({
        title: "Blog Post Deleted",
        description: "The blog post has been deleted successfully.",
      });
      
      // Refresh blog posts
      fetchBlogPosts();
      
    } catch (error) {
      console.error("Error deleting blog post:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete blog post",
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setDeletingPostId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e51083]"></div>
        <p className="ml-4 text-gray-600 dark:text-gray-400">
          Loading blog posts...
        </p>
      </div>
    );
  }

  if (error) {
    return <DatabaseError message={error} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Blog Management</h1>
          <p className="text-gray-500 mt-2">Create and manage blog posts</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              New Blog Post
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingPost ? "Edit Blog Post" : "Create New Blog Post"}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="Enter blog post title"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="author">Author</Label>
                    <Input
                      id="author"
                      name="author"
                      value={formData.author}
                      onChange={handleChange}
                      placeholder="Author name"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="published_date">Published Date</Label>
                    <Input
                      id="published_date"
                      name="published_date"
                      type="date"
                      value={formData.published_date}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => handleSelectChange("category", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No Category</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                        <SelectItem value="other">Other (specify below)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {formData.category === "other" && (
                    <div>
                      <Label htmlFor="customCategory">Custom Category</Label>
                      <Input
                        id="customCategory"
                        value={customCategory}
                        onChange={(e) => setCustomCategory(e.target.value)}
                        placeholder="Enter custom category"
                      />
                    </div>
                  )}
                  
                  <div>
                    <Label htmlFor="tags">Tags</Label>
                    <Input
                      id="tags"
                      name="tags"
                      value={formData.tags}
                      onChange={handleChange}
                      placeholder="Comma-separated tags"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label>Featured Image</Label>
                    <ImageUploader
                      currentImage={formData.featured_image}
                      onImageSelected={handleFeaturedImageSelected}
                      aspectRatio="16:9"
                    />
                  </div>
                  
                  <div>
                    <Label>Author Image</Label>
                    <ImageUploader
                      currentImage={formData.author_image}
                      onImageSelected={handleAuthorImageSelected}
                      aspectRatio="1:1"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleChange}
                  placeholder="Brief description of the blog post"
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="content">Content *</Label>
                <Textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  placeholder="Write your blog post content here..."
                  rows={10}
                  required
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    resetForm();
                    setIsDialogOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingPost ? "Update Post" : "Create Post"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Blog Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogPosts.map((post) => (
          <Card key={post.id} className="overflow-hidden">
            <div className="aspect-video bg-gray-100 relative">
              {post.featured_image ? (
                <img
                  src={getImageUrl(post.featured_image)}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-2 line-clamp-2">{post.title}</h3>
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">{post.excerpt}</p>
              <div className="flex items-center text-xs text-gray-500 mb-4">
                <User className="h-3 w-3 mr-1" />
                {post.author}
                <Calendar className="h-3 w-3 ml-3 mr-1" />
                {new Date(post.published_date).toLocaleDateString()}
              </div>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setViewingPost(post);
                    setIsViewDialogOpen(true);
                  }}
                >
                  <Eye className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(post)}
                >
                  <Edit className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setDeletingPostId(post.id);
                    setIsDeleteDialogOpen(true);
                  }}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* View Post Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{viewingPost?.title}</DialogTitle>
          </DialogHeader>
          {viewingPost && (
            <div className="space-y-4">
              <div className="flex items-center text-sm text-gray-600">
                <User className="h-4 w-4 mr-1" />
                {viewingPost.author}
                <Calendar className="h-4 w-4 ml-4 mr-1" />
                {new Date(viewingPost.published_date).toLocaleDateString()}
              </div>
              {viewingPost.featured_image && (
                <img
                  src={getImageUrl(viewingPost.featured_image)}
                  alt={viewingPost.title}
                  className="w-full rounded-lg"
                />
              )}
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: viewingPost.content }} />
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmation
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setDeletingPostId(null);
        }}
        onConfirm={handleDelete}
        itemName="blog post"
      />
    </div>
  );
}

// Wrap with layout
BlogPage.layout = (page) => <AdminLayout>{page}</AdminLayout>;
