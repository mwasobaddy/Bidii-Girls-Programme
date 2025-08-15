import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Plus, Eye, Edit, Trash2, Mail, Linkedin, Twitter } from "lucide-react";
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

export default function TeamMembersPage() {
  // State
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [viewingMember, setViewingMember] = useState(null);
  const [deletingMemberId, setDeletingMemberId] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    bio: "",
    email: "",
    image: "",
    linkedin: "",
    twitter: "",
  });
  
  const { toast } = useToast();
  
  // Fetch team members
  const fetchTeamMembers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/team`);
      if (!response.ok) throw new Error("Failed to fetch team members");
      const data = await response.json();
      setTeamMembers(data);
    } catch (error) {
      console.error("Error fetching team members:", error);
      setError("Failed to fetch team members from database");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchTeamMembers();
  }, []);
  
  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle image upload
  const handleImageSelected = (imageDataUrl) => {
    setFormData(prev => ({ ...prev, image: imageDataUrl }));
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Validation
      if (!formData.name || !formData.role) {
        toast({
          title: "Missing Required Fields",
          description: "Name and Role are required for a team member.",
          variant: "destructive",
        });
        return;
      }
      
      const teamData = {
        name: formData.name,
        role: formData.role,
        bio: formData.bio,
        email: formData.email,
        image: formData.image,
        linkedin: formData.linkedin || null,
        twitter: formData.twitter || null,
        order_index: editingMember?.order_index || teamMembers.length + 1,
        active: true,
      };
      
      console.log("Saving team member with data:", teamData);
      
      // Get JWT token for authentication
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }
      
      let response;
      
      if (editingMember) {
        // Update existing member
        response = await fetch(`${API_BASE_URL}/team/${editingMember.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(teamData),
        });
      } else {
        // Create new member
        response = await fetch(`${API_BASE_URL}/team`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(teamData),
        });
      }
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save team member");
      }
      
      toast({
        title: editingMember ? "Team Member Updated" : "Team Member Created",
        description: `"${formData.name}" has been ${editingMember ? 'updated' : 'added'} successfully.`,
      });
      
      // Reset form and close dialog
      resetForm();
      setIsDialogOpen(false);
      
      // Refresh team members
      fetchTeamMembers();
      
    } catch (error) {
      console.error("Error saving team member:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save team member",
        variant: "destructive",
      });
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      role: "",
      bio: "",
      email: "",
      image: "",
      linkedin: "",
      twitter: "",
    });
    setEditingMember(null);
  };

  // Handle edit
  const handleEdit = (member) => {
    setEditingMember(member);
    setFormData({
      name: member.name || "",
      role: member.role || "",
      bio: member.bio || "",
      email: member.email || "",
      image: member.image || "",
      linkedin: member.linkedin || "",
      twitter: member.twitter || "",
    });
    setIsDialogOpen(true);
  };

  // Handle delete
  const handleDelete = async () => {
    if (!deletingMemberId) return;
    
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }
      
      const response = await fetch(`${API_BASE_URL}/team/${deletingMemberId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete team member");
      }
      
      toast({
        title: "Team Member Deleted",
        description: "The team member has been deleted successfully.",
      });
      
      // Refresh team members
      fetchTeamMembers();
      
    } catch (error) {
      console.error("Error deleting team member:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete team member",
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setDeletingMemberId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e51083]"></div>
        <p className="ml-4 text-gray-600 dark:text-gray-400">
          Loading team members...
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
          <h1 className="text-3xl font-bold">Team Management</h1>
          <p className="text-gray-500 mt-2">Manage team members and their information</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              New Team Member
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingMember ? "Edit Team Member" : "Add New Team Member"}
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
                      placeholder="Enter full name"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="role">Role *</Label>
                    <Input
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      placeholder="Enter role/position"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter email address"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="linkedin">LinkedIn URL</Label>
                    <Input
                      id="linkedin"
                      name="linkedin"
                      value={formData.linkedin}
                      onChange={handleChange}
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="twitter">Twitter URL</Label>
                    <Input
                      id="twitter"
                      name="twitter"
                      value={formData.twitter}
                      onChange={handleChange}
                      placeholder="https://twitter.com/username"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label>Profile Image</Label>
                    <ImageUploader
                      currentImage={formData.image}
                      onImageSelected={handleImageSelected}
                      aspectRatio="1:1"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <Label htmlFor="bio">Biography</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Enter biography"
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
                  {editingMember ? "Update Member" : "Add Member"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teamMembers.map((member) => (
          <Card key={member.id} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full overflow-hidden mb-4 bg-gray-100">
                  {member.image ? (
                    <img
                      src={getImageUrl(member.image)}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <Plus className="h-8 w-8" />
                    </div>
                  )}
                </div>
                
                <h3 className="font-semibold text-lg mb-1">{member.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{member.role}</p>
                
                {member.bio && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">{member.bio}</p>
                )}
                
                <div className="flex space-x-2 mb-4">
                  {member.email && (
                    <a
                      href={`mailto:${member.email}`}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      <Mail className="h-4 w-4" />
                    </a>
                  )}
                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      <Linkedin className="h-4 w-4" />
                    </a>
                  )}
                  {member.twitter && (
                    <a
                      href={member.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
                    >
                      <Twitter className="h-4 w-4" />
                    </a>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setViewingMember(member);
                      setIsViewDialogOpen(true);
                    }}
                  >
                    <Eye className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(member)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setDeletingMemberId(member.id);
                      setIsDeleteDialogOpen(true);
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* View Member Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{viewingMember?.name}</DialogTitle>
          </DialogHeader>
          {viewingMember && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100">
                  {viewingMember.image ? (
                    <img
                      src={getImageUrl(viewingMember.image)}
                      alt={viewingMember.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <Plus className="h-6 w-6" />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{viewingMember.name}</h3>
                  <p className="text-gray-600">{viewingMember.role}</p>
                  {viewingMember.email && (
                    <p className="text-sm text-gray-500">{viewingMember.email}</p>
                  )}
                </div>
              </div>
              
              {viewingMember.bio && (
                <div>
                  <h4 className="font-medium mb-2">Biography</h4>
                  <p className="text-gray-600 whitespace-pre-wrap">{viewingMember.bio}</p>
                </div>
              )}
              
              {(viewingMember.linkedin || viewingMember.twitter) && (
                <div>
                  <h4 className="font-medium mb-2">Social Links</h4>
                  <div className="flex space-x-4">
                    {viewingMember.linkedin && (
                      <a
                        href={viewingMember.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-blue-600 hover:underline"
                      >
                        <Linkedin className="h-4 w-4" />
                        <span>LinkedIn</span>
                      </a>
                    )}
                    {viewingMember.twitter && (
                      <a
                        href={viewingMember.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-blue-400 hover:underline"
                      >
                        <Twitter className="h-4 w-4" />
                        <span>Twitter</span>
                      </a>
                    )}
                  </div>
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
          setDeletingMemberId(null);
        }}
        onConfirm={handleDelete}
        itemName="team member"
      />
    </div>
  );
}

TeamMembersPage.layout = (page) => <AdminLayout>{page}</AdminLayout>;
