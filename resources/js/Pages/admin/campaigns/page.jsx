import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Eye, Edit, Trash2, MapPin, Clock, Users } from "lucide-react";
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

export default function CampaignsPage() {
  // State
  const [campaigns, setCampaigns] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [viewingCampaign, setViewingCampaign] = useState(null);
  const [deletingCampaignId, setDeletingCampaignId] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    urgency: "active",
    beneficiaries: "",
    linked_blog: "none",
    feature_image: "",
    start_date: "",
    end_date: "",
  });
  
  const { toast } = useToast();
  
  // Fetch campaigns
  const fetchCampaigns = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/campaigns`);
      if (!response.ok) throw new Error("Failed to fetch campaigns");
      const data = await response.json();
      setCampaigns(data);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      setError("Failed to fetch campaigns from database");
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch blog posts for linking
  const fetchBlogPosts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/blog`);
      if (!response.ok) throw new Error("Failed to fetch blog posts");
      const data = await response.json();
      setBlogPosts(data);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
    }
  };
  
  useEffect(() => {
    fetchCampaigns();
    fetchBlogPosts();
  }, []);
  
  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle select change
  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle featured image upload
  const handleFeaturedImageSelected = (imageDataUrl) => {
    setFormData(prev => ({ ...prev, feature_image: imageDataUrl }));
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Validation
      if (!formData.title || !formData.description) {
        toast({
          title: "Missing Required Fields",
          description: "Title and Description are required for a campaign.",
          variant: "destructive",
        });
        return;
      }
      
      // Always send all fields, never undefined
      const campaignData = {
        title: formData.title,
        description: formData.description,
        location: formData.location || null,
        urgency: formData.urgency,
        beneficiaries: parseInt(formData.beneficiaries) || 0,
        linked_blog: formData.linked_blog === "none" ? null : parseInt(formData.linked_blog),
        feature_image: formData.feature_image || null,
        start_date: formData.start_date || null,
        end_date: formData.end_date || null,
      };
      
      console.log("Saving campaign with data:", campaignData);
      
      // Get JWT token for authentication
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }
      
      let response;
      
      if (editingCampaign) {
        // Update existing campaign
        response = await fetch(`${API_BASE_URL}/campaigns/${editingCampaign.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(campaignData),
        });
      } else {
        // Create new campaign
        response = await fetch(`${API_BASE_URL}/campaigns`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(campaignData),
        });
      }
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save campaign");
      }
      
      toast({
        title: editingCampaign ? "Campaign Updated" : "Campaign Created",
        description: `"${formData.title}" has been ${editingCampaign ? 'updated' : 'created'} successfully.`,
      });
      
      // Reset form and close dialog
      resetForm();
      setIsDialogOpen(false);
      
      // Refresh campaigns
      fetchCampaigns();
      
    } catch (error) {
      console.error("Error saving campaign:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save campaign",
        variant: "destructive",
      });
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      location: "",
      urgency: "active",
      beneficiaries: "",
      linked_blog: "none",
      feature_image: "",
      start_date: "",
      end_date: "",
    });
    setEditingCampaign(null);
  };

  // Handle edit
  const handleEdit = (campaign) => {
    setEditingCampaign(campaign);
    setFormData({
      title: campaign.title || "",
      description: campaign.description || "",
      location: campaign.location || "",
      urgency: campaign.urgency || "active",
      beneficiaries: campaign.beneficiaries?.toString() || "",
      linked_blog: campaign.linked_blog?.toString() || "none",
      feature_image: campaign.feature_image || "",
      start_date: campaign.start_date || "",
      end_date: campaign.end_date || "",
    });
    setIsDialogOpen(true);
  };

  // Handle delete
  const handleDelete = async () => {
    if (!deletingCampaignId) return;
    
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }
      
      const response = await fetch(`${API_BASE_URL}/campaigns/${deletingCampaignId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete campaign");
      }
      
      toast({
        title: "Campaign Deleted",
        description: "The campaign has been deleted successfully.",
      });
      
      // Refresh campaigns
      fetchCampaigns();
      
    } catch (error) {
      console.error("Error deleting campaign:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete campaign",
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setDeletingCampaignId(null);
    }
  };

  // Get urgency color
  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e51083]"></div>
        <p className="ml-4 text-gray-600 dark:text-gray-400">
          Loading campaigns...
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
          <h1 className="text-3xl font-bold">Campaigns Management</h1>
          <p className="text-gray-500 mt-2">Create and manage campaigns</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              New Campaign
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingCampaign ? "Edit Campaign" : "Create New Campaign"}
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
                      placeholder="Enter campaign title"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="Campaign location"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="urgency">Urgency</Label>
                    <Select
                      value={formData.urgency}
                      onValueChange={(value) => handleSelectChange("urgency", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select urgency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="urgent">Urgent</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="beneficiaries">Beneficiaries</Label>
                    <Input
                      id="beneficiaries"
                      name="beneficiaries"
                      type="number"
                      min="0"
                      value={formData.beneficiaries}
                      onChange={handleChange}
                      placeholder="Number of beneficiaries"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="linked_blog">Linked Blog Post</Label>
                    <Select
                      value={formData.linked_blog}
                      onValueChange={(value) => handleSelectChange("linked_blog", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select blog post" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No Blog Post</SelectItem>
                        {blogPosts.map((post) => (
                          <SelectItem key={post.id} value={post.id.toString()}>
                            {post.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="start_date">Start Date</Label>
                    <Input
                      id="start_date"
                      name="start_date"
                      type="date"
                      value={formData.start_date}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="end_date">End Date</Label>
                    <Input
                      id="end_date"
                      name="end_date"
                      type="date"
                      value={formData.end_date}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div>
                    <Label>Featured Image</Label>
                    <ImageUploader
                      currentImage={formData.feature_image}
                      onImageSelected={handleFeaturedImageSelected}
                      aspectRatio="16:9"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Campaign description"
                  rows={5}
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
                  {editingCampaign ? "Update Campaign" : "Create Campaign"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.map((campaign) => (
          <Card key={campaign.id} className="overflow-hidden">
            <div className="aspect-video bg-gray-100 relative">
              {campaign.feature_image ? (
                <img
                  src={getImageUrl(campaign.feature_image)}
                  alt={campaign.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-2 line-clamp-2">{campaign.title}</h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{campaign.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-3 w-3 mr-1" />
                  {campaign.location || 'Location not specified'}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="h-3 w-3 mr-1" />
                  {campaign.beneficiaries} beneficiaries
                </div>
                {(campaign.start_date || campaign.end_date) && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-3 w-3 mr-1" />
                    {campaign.start_date && new Date(campaign.start_date).toLocaleDateString()}
                    {campaign.start_date && campaign.end_date && ' - '}
                    {campaign.end_date && new Date(campaign.end_date).toLocaleDateString()}
                  </div>
                )}
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(campaign.urgency)}`}>
                  {campaign.urgency}
                </span>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setViewingCampaign(campaign);
                    setIsViewDialogOpen(true);
                  }}
                >
                  <Eye className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(campaign)}
                >
                  <Edit className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setDeletingCampaignId(campaign.id);
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

      {/* View Campaign Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{viewingCampaign?.title}</DialogTitle>
          </DialogHeader>
          {viewingCampaign && (
            <div className="space-y-4">
              {viewingCampaign.feature_image && (
                <img
                  src={getImageUrl(viewingCampaign.feature_image)}
                  alt={viewingCampaign.title}
                  className="w-full rounded-lg"
                />
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="font-medium">{viewingCampaign.location || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Urgency</p>
                  <p className="font-medium capitalize">{viewingCampaign.urgency}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Beneficiaries</p>
                  <p className="font-medium">{viewingCampaign.beneficiaries}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Duration</p>
                  <p className="font-medium">
                    {viewingCampaign.start_date && new Date(viewingCampaign.start_date).toLocaleDateString()}
                    {viewingCampaign.start_date && viewingCampaign.end_date && ' - '}
                    {viewingCampaign.end_date && new Date(viewingCampaign.end_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Description</p>
                <p className="whitespace-pre-wrap">{viewingCampaign.description}</p>
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
          setDeletingCampaignId(null);
        }}
        onConfirm={handleDelete}
        itemName="campaign"
      />
    </div>
  );
}

CampaignsPage.layout = (page) => <AdminLayout>{page}</AdminLayout>;
