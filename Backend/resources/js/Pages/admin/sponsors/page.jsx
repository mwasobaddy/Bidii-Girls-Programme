import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Plus, Eye, Edit, Trash2, ExternalLink } from "lucide-react";
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

export default function SponsorsPage() {
  // State
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingSponsor, setEditingSponsor] = useState(null);
  const [viewingSponsor, setViewingSponsor] = useState(null);
  const [deletingSponsorId, setDeletingSponsorId] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    website: "",
    contact_email: "",
    logo: "",
    contribution_amount: "",
    partnership_type: "financial",
  });
  
  const { toast } = useToast();
  
  // Fetch sponsors
  const fetchSponsors = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/sponsors`);
      if (!response.ok) throw new Error("Failed to fetch sponsors");
      const data = await response.json();
      setSponsors(data);
    } catch (error) {
      console.error("Error fetching sponsors:", error);
      setError("Failed to fetch sponsors from database");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchSponsors();
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
  
  // Handle logo upload
  const handleLogoSelected = (imageDataUrl) => {
    setFormData(prev => ({ ...prev, logo: imageDataUrl }));
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Validation
      if (!formData.name) {
        toast({
          title: "Missing Required Fields",
          description: "Name is required for a sponsor.",
          variant: "destructive",
        });
        return;
      }
      
      const sponsorData = {
        name: formData.name,
        description: formData.description || null,
        website: formData.website || null,
        contact_email: formData.contact_email || null,
        logo: formData.logo || null,
        contribution_amount: parseFloat(formData.contribution_amount) || 0,
        partnership_type: formData.partnership_type,
        active: true,
      };
      
      console.log("Saving sponsor with data:", sponsorData);
      
      // Get JWT token for authentication
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }
      
      let response;
      
      if (editingSponsor) {
        // Update existing sponsor
        response = await fetch(`${API_BASE_URL}/sponsors/${editingSponsor.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(sponsorData),
        });
      } else {
        // Create new sponsor
        response = await fetch(`${API_BASE_URL}/sponsors`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(sponsorData),
        });
      }
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save sponsor");
      }
      
      toast({
        title: editingSponsor ? "Sponsor Updated" : "Sponsor Created",
        description: `"${formData.name}" has been ${editingSponsor ? 'updated' : 'created'} successfully.`,
      });
      
      // Reset form and close dialog
      resetForm();
      setIsDialogOpen(false);
      
      // Refresh sponsors
      fetchSponsors();
      
    } catch (error) {
      console.error("Error saving sponsor:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save sponsor",
        variant: "destructive",
      });
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      website: "",
      contact_email: "",
      logo: "",
      contribution_amount: "",
      partnership_type: "financial",
    });
    setEditingSponsor(null);
  };

  // Handle edit
  const handleEdit = (sponsor) => {
    setEditingSponsor(sponsor);
    setFormData({
      name: sponsor.name || "",
      description: sponsor.description || "",
      website: sponsor.website || "",
      contact_email: sponsor.contact_email || "",
      logo: sponsor.logo || "",
      contribution_amount: sponsor.contribution_amount?.toString() || "",
      partnership_type: sponsor.partnership_type || "financial",
    });
    setIsDialogOpen(true);
  };

  // Handle delete
  const handleDelete = async () => {
    if (!deletingSponsorId) return;
    
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }
      
      const response = await fetch(`${API_BASE_URL}/sponsors/${deletingSponsorId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete sponsor");
      }
      
      toast({
        title: "Sponsor Deleted",
        description: "The sponsor has been deleted successfully.",
      });
      
      // Refresh sponsors
      fetchSponsors();
      
    } catch (error) {
      console.error("Error deleting sponsor:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete sponsor",
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setDeletingSponsorId(null);
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e51083]"></div>
        <p className="ml-4 text-gray-600 dark:text-gray-400">
          Loading sponsors...
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
          <h1 className="text-3xl font-bold">Sponsors Management</h1>
          <p className="text-gray-500 mt-2">Manage sponsors and partnerships</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              New Sponsor
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingSponsor ? "Edit Sponsor" : "Add New Sponsor"}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter sponsor name"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      name="website"
                      type="url"
                      value={formData.website}
                      onChange={handleChange}
                      placeholder="https://example.com"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="contact_email">Contact Email</Label>
                    <Input
                      id="contact_email"
                      name="contact_email"
                      type="email"
                      value={formData.contact_email}
                      onChange={handleChange}
                      placeholder="contact@sponsor.com"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="contribution_amount">Contribution Amount ($)</Label>
                    <Input
                      id="contribution_amount"
                      name="contribution_amount"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.contribution_amount}
                      onChange={handleChange}
                      placeholder="0.00"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="partnership_type">Partnership Type</Label>
                    <select
                      id="partnership_type"
                      name="partnership_type"
                      value={formData.partnership_type}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="financial">Financial</option>
                      <option value="in-kind">In-Kind</option>
                      <option value="service">Service</option>
                      <option value="strategic">Strategic</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label>Logo</Label>
                    <ImageUploader
                      currentImage={formData.logo}
                      onImageSelected={handleLogoSelected}
                      aspectRatio="16:9"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Sponsor description"
                  rows={4}
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
                  {editingSponsor ? "Update Sponsor" : "Add Sponsor"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Sponsors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sponsors.map((sponsor) => (
          <Card key={sponsor.id} className="overflow-hidden">
            <div className="aspect-video bg-gray-100 relative">
              {sponsor.logo ? (
                <img
                  src={getImageUrl(sponsor.logo)}
                  alt={sponsor.name}
                  className="w-full h-full object-contain p-4"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No Logo
                </div>
              )}
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-2">{sponsor.name}</h3>
              {sponsor.description && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{sponsor.description}</p>
              )}
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Partnership:</span>
                  <span className="capitalize font-medium">{sponsor.partnership_type}</span>
                </div>
                {sponsor.contribution_amount > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Contribution:</span>
                    <span className="font-medium">{formatCurrency(sponsor.contribution_amount)}</span>
                  </div>
                )}
                {sponsor.website && (
                  <div className="flex items-center space-x-1 text-sm">
                    <ExternalLink className="h-3 w-3" />
                    <a
                      href={sponsor.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline truncate"
                    >
                      {sponsor.website.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                )}
              </div>
              
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setViewingSponsor(sponsor);
                    setIsViewDialogOpen(true);
                  }}
                >
                  <Eye className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(sponsor)}
                >
                  <Edit className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setDeletingSponsorId(sponsor.id);
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

      {/* View Sponsor Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{viewingSponsor?.name}</DialogTitle>
          </DialogHeader>
          {viewingSponsor && (
            <div className="space-y-4">
              {viewingSponsor.logo && (
                <div className="flex justify-center">
                  <img
                    src={getImageUrl(viewingSponsor.logo)}
                    alt={viewingSponsor.name}
                    className="max-w-full max-h-32 object-contain"
                  />
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Partnership Type</p>
                  <p className="font-medium capitalize">{viewingSponsor.partnership_type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Contribution</p>
                  <p className="font-medium">{formatCurrency(viewingSponsor.contribution_amount)}</p>
                </div>
                {viewingSponsor.contact_email && (
                  <div>
                    <p className="text-sm text-gray-600">Contact Email</p>
                    <p className="font-medium">{viewingSponsor.contact_email}</p>
                  </div>
                )}
                {viewingSponsor.website && (
                  <div>
                    <p className="text-sm text-gray-600">Website</p>
                    <a
                      href={viewingSponsor.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-blue-600 hover:underline"
                    >
                      {viewingSponsor.website}
                    </a>
                  </div>
                )}
              </div>
              {viewingSponsor.description && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">Description</p>
                  <p className="whitespace-pre-wrap">{viewingSponsor.description}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmation
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setDeletingSponsorId(null);
        }}
        onConfirm={handleDelete}
        itemName="sponsor"
      />
    </div>
  );
}

SponsorsPage.layout = (page) => <AdminLayout>{page}</AdminLayout>;
