import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Eye, Folder, Image as ImageIcon, Trash2, Upload } from "lucide-react";
import { ImageUploader } from "@/components/admin/image-uploader";
import { DatabaseError } from "@/components/admin/database-error";
import AdminLayout from "../AdminLayout";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

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

export default function GalleryPage() {
  // State
  const [galleryItems, setGalleryItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [categories] = useState([
    { name: "Blog Images", folder: "blog" },
    { name: "Project Images", folder: "projects" },
    { name: "Campaign Images", folder: "campaigns" },
    { name: "Team Images", folder: "team" },
    { name: "Other Images", folder: "other" }
  ]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [viewingImage, setViewingImage] = useState(null);
  
  // Form state for upload
  const [uploadData, setUploadData] = useState({
    image: "",
    category: "other",
    alt_text: "",
    caption: "",
  });
  
  const { toast } = useToast();
  
  // Fetch gallery items
  const fetchGalleryItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/gallery-scan`);
      if (!response.ok) throw new Error("Failed to fetch gallery items");
      const data = await response.json();
      setGalleryItems(data);
      setFilteredItems(data);
    } catch (error) {
      console.error("Error fetching gallery items:", error);
      setError("Failed to fetch gallery items from server");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchGalleryItems();
  }, []);
  
  // Filter items by category
  useEffect(() => {
    if (selectedCategory === "all") {
      setFilteredItems(galleryItems);
    } else {
      setFilteredItems(galleryItems.filter(item => item.category === selectedCategory));
    }
  }, [selectedCategory, galleryItems]);
  
  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUploadData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle select change
  const handleSelectChange = (name, value) => {
    setUploadData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle image upload
  const handleImageSelected = (imageDataUrl) => {
    setUploadData(prev => ({ ...prev, image: imageDataUrl }));
  };
  
  // Handle upload form submission
  const handleUpload = async (e) => {
    e.preventDefault();
    
    try {
      // Validation
      if (!uploadData.image) {
        toast({
          title: "Missing Image",
          description: "Please select an image to upload.",
          variant: "destructive",
        });
        return;
      }
      
      const imageData = {
        image: uploadData.image,
        category: uploadData.category,
        alt_text: uploadData.alt_text || null,
        caption: uploadData.caption || null,
      };
      
      console.log("Uploading image with data:", imageData);
      
      // Get JWT token for authentication
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }
      
      const response = await fetch(`${API_BASE_URL}/gallery`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(imageData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to upload image");
      }
      
      toast({
        title: "Image Uploaded",
        description: "The image has been uploaded successfully.",
      });
      
      // Reset form and close dialog
      resetUploadForm();
      setIsUploadDialogOpen(false);
      
      // Refresh gallery items
      fetchGalleryItems();
      
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to upload image",
        variant: "destructive",
      });
    }
  };

  // Reset upload form
  const resetUploadForm = () => {
    setUploadData({
      image: "",
      category: "other",
      alt_text: "",
      caption: "",
    });
  };

  // Handle delete image
  const handleDeleteImage = async (imageName) => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }
      
      const response = await fetch(`${API_BASE_URL}/gallery/${encodeURIComponent(imageName)}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete image");
      }
      
      toast({
        title: "Image Deleted",
        description: "The image has been deleted successfully.",
      });
      
      // Refresh gallery items
      fetchGalleryItems();
      
    } catch (error) {
      console.error("Error deleting image:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete image",
        variant: "destructive",
      });
    }
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (!bytes) return 'Unknown size';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e51083]"></div>
        <p className="ml-4 text-gray-600 dark:text-gray-400">
          Loading gallery...
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
          <h1 className="text-3xl font-bold">Gallery Management</h1>
          <p className="text-gray-500 mt-2">Manage gallery images and uploads</p>
        </div>
        <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetUploadForm}>
              <Upload className="h-4 w-4 mr-2" />
              Upload Image
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Upload New Image</DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleUpload} className="space-y-6">
              <div>
                <Label>Select Image</Label>
                <ImageUploader
                  currentImage={uploadData.image}
                  onImageSelected={handleImageSelected}
                  aspectRatio="16:9"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={uploadData.category}
                    onValueChange={(value) => handleSelectChange("category", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.folder} value={category.folder}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="alt_text">Alt Text</Label>
                  <Input
                    id="alt_text"
                    name="alt_text"
                    value={uploadData.alt_text}
                    onChange={handleChange}
                    placeholder="Alternative text for accessibility"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="caption">Caption</Label>
                <Textarea
                  id="caption"
                  name="caption"
                  value={uploadData.caption}
                  onChange={handleChange}
                  placeholder="Image caption"
                  rows={3}
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    resetUploadForm();
                    setIsUploadDialogOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  Upload Image
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Category Filter */}
      <div className="flex items-center space-x-4">
        <span className="text-sm font-medium">Filter by category:</span>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.folder} value={category.folder}>
                <div className="flex items-center space-x-2">
                  <Folder className="h-4 w-4" />
                  <span>{category.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-sm text-gray-500">
          {filteredItems.length} {filteredItems.length === 1 ? 'image' : 'images'}
        </span>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredItems.map((item, index) => (
          <Card key={index} className="overflow-hidden">
            <div className="aspect-square bg-gray-100 relative group">
              <img
                src={getImageUrl(item.url)}
                alt={item.alt_text || item.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center space-x-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    setViewingImage(item);
                    setIsViewDialogOpen(true);
                  }}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDeleteImage(item.name)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Folder className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600 capitalize">{item.category}</span>
              </div>
              <p className="font-medium text-sm truncate mb-1">{item.name}</p>
              <p className="text-xs text-gray-500">
                {formatFileSize(item.size)}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-20">
          <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">No images found</h3>
          <p className="text-gray-500">
            {selectedCategory === "all" 
              ? "Upload some images to get started" 
              : `No images in the ${categories.find(c => c.folder === selectedCategory)?.name} category`
            }
          </p>
        </div>
      )}

      {/* View Image Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{viewingImage?.name}</DialogTitle>
          </DialogHeader>
          {viewingImage && (
            <div className="space-y-4">
              <div className="flex justify-center">
                <img
                  src={getImageUrl(viewingImage.url)}
                  alt={viewingImage.alt_text || viewingImage.name}
                  className="max-w-full max-h-96 object-contain rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Category</p>
                  <p className="font-medium capitalize">{viewingImage.category}</p>
                </div>
                <div>
                  <p className="text-gray-600">File Size</p>
                  <p className="font-medium">{formatFileSize(viewingImage.size)}</p>
                </div>
                <div>
                  <p className="text-gray-600">File Name</p>
                  <p className="font-medium">{viewingImage.name}</p>
                </div>
                <div>
                  <p className="text-gray-600">Last Modified</p>
                  <p className="font-medium">
                    {viewingImage.lastModified 
                      ? new Date(viewingImage.lastModified).toLocaleDateString()
                      : 'Unknown'
                    }
                  </p>
                </div>
              </div>
              {viewingImage.caption && (
                <div>
                  <p className="text-gray-600 text-sm">Caption</p>
                  <p className="text-sm">{viewingImage.caption}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

GalleryPage.layout = (page) => <AdminLayout>{page}</AdminLayout>;
