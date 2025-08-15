import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
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

export default function StoriesPage() {
  // State
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingStory, setEditingStory] = useState(null);
  const [viewingStory, setViewingStory] = useState(null);
  const [deletingStoryId, setDeletingStoryId] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    author: "",
    location: "",
    date_published: new Date().toISOString().split('T')[0],
    featured_image: "",
    impact_summary: "",
    beneficiary_name: "",
  });
  
  const { toast } = useToast();
  
  // Fetch stories
  const fetchStories = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/stories`);
      if (!response.ok) throw new Error("Failed to fetch stories");
      const data = await response.json();
      setStories(data);
    } catch (error) {
      console.error("Error fetching stories:", error);
      setError("Failed to fetch stories from database");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchStories();
  }, []);
  
  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle featured image upload
  const handleFeaturedImageSelected = (imageDataUrl) => {
    setFormData(prev => ({ ...prev, featured_image: imageDataUrl }));
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Validation
      if (!formData.title || !formData.content) {
        toast({
          title: "Missing Required Fields",
          description: "Title and Content are required for a story.",
          variant: "destructive",
        });
        return;
      }
      
      const storyData = {
        title: formData.title,
        content: formData.content,
        author: formData.author || "Anonymous",
        location: formData.location || null,
        date_published: formData.date_published || null,
        featured_image: formData.featured_image || null,
        impact_summary: formData.impact_summary || null,
        beneficiary_name: formData.beneficiary_name || null,
        published: true,
      };
      
      console.log("Saving story with data:", storyData);
      
      // Get JWT token for authentication
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }
      
      let response;
      
      if (editingStory) {
        // Update existing story
        response = await fetch(`${API_BASE_URL}/stories/${editingStory.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(storyData),
        });
      } else {
        // Create new story
        response = await fetch(`${API_BASE_URL}/stories`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(storyData),
        });
      }
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save story");
      }
      
      toast({
        title: editingStory ? "Story Updated" : "Story Created",
        description: `"${formData.title}" has been ${editingStory ? 'updated' : 'created'} successfully.`,
      });
      
      // Reset form and close dialog
      resetForm();
      setIsDialogOpen(false);
      
      // Refresh stories
      fetchStories();
      
    } catch (error) {
      console.error("Error saving story:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save story",
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
      location: "",
      date_published: new Date().toISOString().split('T')[0],
      featured_image: "",
      impact_summary: "",
      beneficiary_name: "",
    });
    setEditingStory(null);
  };

  // Handle edit
  const handleEdit = (story) => {
    setEditingStory(story);
    setFormData({
      title: story.title || "",
      content: story.content || "",
      author: story.author || "",
      location: story.location || "",
      date_published: story.date_published || new Date().toISOString().split('T')[0],
      featured_image: story.featured_image || "",
      impact_summary: story.impact_summary || "",
      beneficiary_name: story.beneficiary_name || "",
    });
    setIsDialogOpen(true);
  };

  // Handle delete
  const handleDelete = async () => {
    if (!deletingStoryId) return;
    
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }
      
      const response = await fetch(`${API_BASE_URL}/stories/${deletingStoryId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete story");
      }
      
      toast({
        title: "Story Deleted",
        description: "The story has been deleted successfully.",
      });
      
      // Refresh stories
      fetchStories();
      
    } catch (error) {
      console.error("Error deleting story:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete story",
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setDeletingStoryId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e51083]"></div>
        <p className="ml-4 text-gray-600 dark:text-gray-400">
          Loading stories...
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
          <h1 className="text-3xl font-bold">Stories Management</h1>
          <p className="text-gray-500 mt-2">Share inspiring stories and testimonials</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              New Story
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingStory ? "Edit Story" : "Create New Story"}
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
                      placeholder="Enter story title"
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
                      placeholder="Story author"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="beneficiary_name">Beneficiary Name</Label>
                    <Input
                      id="beneficiary_name"
                      name="beneficiary_name"
                      value={formData.beneficiary_name}
                      onChange={handleChange}
                      placeholder="Name of the person featured in the story"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="Story location"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="date_published">Published Date</Label>
                    <Input
                      id="date_published"
                      name="date_published"
                      type="date"
                      value={formData.date_published}
                      onChange={handleChange}
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
                </div>
              </div>
              
              <div>
                <Label htmlFor="impact_summary">Impact Summary</Label>
                <Textarea
                  id="impact_summary"
                  name="impact_summary"
                  value={formData.impact_summary}
                  onChange={handleChange}
                  placeholder="Brief summary of the impact or outcome"
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="content">Story Content *</Label>
                <Textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  placeholder="Write the full story here..."
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
                  {editingStory ? "Update Story" : "Create Story"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stories.map((story) => (
          <Card key={story.id} className="overflow-hidden">
            <div className="aspect-video bg-gray-100 relative">
              {story.featured_image ? (
                <img
                  src={getImageUrl(story.featured_image)}
                  alt={story.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-2 line-clamp-2">{story.title}</h3>
              {story.impact_summary && (
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{story.impact_summary}</p>
              )}
              {story.beneficiary_name && (
                <p className="text-sm font-medium text-blue-600 mb-2">
                  Story of {story.beneficiary_name}
                </p>
              )}
              <div className="flex items-center text-xs text-gray-500 mb-4">
                <User className="h-3 w-3 mr-1" />
                {story.author}
                <Calendar className="h-3 w-3 ml-3 mr-1" />
                {new Date(story.date_published).toLocaleDateString()}
              </div>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setViewingStory(story);
                    setIsViewDialogOpen(true);
                  }}
                >
                  <Eye className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(story)}
                >
                  <Edit className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setDeletingStoryId(story.id);
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

      {/* View Story Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{viewingStory?.title}</DialogTitle>
          </DialogHeader>
          {viewingStory && (
            <div className="space-y-4">
              <div className="flex items-center text-sm text-gray-600">
                <User className="h-4 w-4 mr-1" />
                {viewingStory.author}
                <Calendar className="h-4 w-4 ml-4 mr-1" />
                {new Date(viewingStory.date_published).toLocaleDateString()}
              </div>
              {viewingStory.featured_image && (
                <img
                  src={getImageUrl(viewingStory.featured_image)}
                  alt={viewingStory.title}
                  className="w-full rounded-lg"
                />
              )}
              {viewingStory.beneficiary_name && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-600 font-medium">
                    Story of {viewingStory.beneficiary_name}
                  </p>
                  {viewingStory.location && (
                    <p className="text-sm text-blue-500">
                      Location: {viewingStory.location}
                    </p>
                  )}
                </div>
              )}
              {viewingStory.impact_summary && (
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-700 mb-2">Impact Summary</h4>
                  <p className="text-green-600">{viewingStory.impact_summary}</p>
                </div>
              )}
              <div className="prose max-w-none">
                <div className="whitespace-pre-wrap">{viewingStory.content}</div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmation
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setDeletingStoryId(null);
        }}
        onConfirm={handleDelete}
        itemName="story"
      />
    </div>
  );
}

StoriesPage.layout = (page) => <AdminLayout>{page}</AdminLayout>;
