import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { Plus, Eye, Edit, Trash2 } from "lucide-react";
import { DeleteConfirmation } from "@/components/admin/delete-confirmation";
import { ImageUploader } from "@/components/admin/image-uploader";
import { DatabaseError } from "@/components/admin/database-error";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

export default function ProjectsPage() {
  // State
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [viewingProject, setViewingProject] = useState(null);
  const [deletingProjectId, setDeletingProjectId] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    status: "active",
    progress: "0",
    budget: "0",
    raised: "0",
    beneficiaries: "0",
    start_date: "",
    featured_image: "",
  });
  
  const { toast } = useToast();
  
  // Fetch projects
  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/projects`);
      if (!response.ok) throw new Error("Failed to fetch projects");
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setError("Failed to fetch projects from database");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchProjects();
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
    setFormData(prev => ({ ...prev, featured_image: imageDataUrl }));
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Validation
      if (!formData.title || !formData.description) {
        toast({
          title: "Missing Required Fields",
          description: "Title and Description are required for a project.",
          variant: "destructive",
        });
        return;
      }
      
      // Always send all fields, never undefined
      const projectData = {
        title: formData.title,
        description: formData.description,
        location: formData.location || null,
        status: formData.status,
        progress: parseInt(formData.progress) || 0,
        budget: parseFloat(formData.budget) || 0,
        raised: parseFloat(formData.raised) || 0,
        beneficiaries: parseInt(formData.beneficiaries) || 0,
        start_date: formData.start_date || null,
        featured_image: formData.featured_image || null,
      };
      
      console.log("Saving project with data:", projectData);
      
      // Get JWT token for authentication
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }
      
      let response;
      
      if (editingProject) {
        // Update existing project
        response = await fetch(`${API_BASE_URL}/projects/${editingProject.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(projectData),
        });
      } else {
        // Create new project
        response = await fetch(`${API_BASE_URL}/projects`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(projectData),
        });
      }
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save project");
      }
      
      toast({
        title: editingProject ? "Project Updated" : "Project Created",
        description: `"${formData.title}" has been ${editingProject ? 'updated' : 'created'} successfully.`,
      });
      
      // Reset form and close dialog
      resetForm();
      setIsDialogOpen(false);
      
      // Refresh projects
      fetchProjects();
      
    } catch (error) {
      console.error("Error saving project:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save project",
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
      status: "active",
      progress: "0",
      budget: "0",
      raised: "0",
      beneficiaries: "0",
      start_date: "",
      featured_image: "",
    });
    setEditingProject(null);
  };

  // Handle edit
  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData({
      title: project.title || "",
      description: project.description || "",
      location: project.location || "",
      status: project.status || "active",
      progress: project.progress?.toString() || "0",
      budget: project.budget?.toString() || "0",
      raised: project.raised?.toString() || "0",
      beneficiaries: project.beneficiaries?.toString() || "0",
      start_date: project.start_date || "",
      featured_image: project.featured_image || "",
    });
    setIsDialogOpen(true);
  };

  // Handle delete
  const handleDelete = async () => {
    if (!deletingProjectId) return;
    
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }
      
      const response = await fetch(`${API_BASE_URL}/projects/${deletingProjectId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete project");
      }
      
      toast({
        title: "Project Deleted",
        description: "The project has been deleted successfully.",
      });
      
      // Refresh projects
      fetchProjects();
      
    } catch (error) {
      console.error("Error deleting project:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete project",
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setDeletingProjectId(null);
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
          Loading projects...
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
          <h1 className="text-3xl font-bold">Projects Management</h1>
          <p className="text-gray-500 mt-2">Create and manage projects</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProject ? "Edit Project" : "Create New Project"}
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
                      placeholder="Enter project title"
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
                      placeholder="Project location"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => handleSelectChange("status", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="planned">Planned</SelectItem>
                        <SelectItem value="paused">Paused</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="progress">Progress (%)</Label>
                    <Input
                      id="progress"
                      name="progress"
                      type="number"
                      min="0"
                      max="100"
                      value={formData.progress}
                      onChange={handleChange}
                      placeholder="0"
                    />
                  </div>
                  
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
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="budget">Budget ($)</Label>
                    <Input
                      id="budget"
                      name="budget"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.budget}
                      onChange={handleChange}
                      placeholder="0.00"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="raised">Amount Raised ($)</Label>
                    <Input
                      id="raised"
                      name="raised"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.raised}
                      onChange={handleChange}
                      placeholder="0.00"
                    />
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
                      placeholder="0"
                    />
                  </div>
                  
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
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Project description"
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
                  {editingProject ? "Update Project" : "Create Project"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project.id} className="overflow-hidden">
            <div className="aspect-video bg-gray-100 relative">
              {project.featured_image ? (
                <img
                  src={getImageUrl(project.featured_image)}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-2 line-clamp-2">{project.title}</h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{project.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-2" />
                
                <div className="flex justify-between text-sm">
                  <span>Raised: {formatCurrency(project.raised)}</span>
                  <span>Goal: {formatCurrency(project.budget)}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  project.status === 'active' ? 'bg-green-100 text-green-800' :
                  project.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                  project.status === 'planned' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {project.status}
                </span>
                <span className="text-sm text-gray-500">
                  {project.beneficiaries} beneficiaries
                </span>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setViewingProject(project);
                    setIsViewDialogOpen(true);
                  }}
                >
                  <Eye className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(project)}
                >
                  <Edit className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setDeletingProjectId(project.id);
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

      {/* View Project Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{viewingProject?.title}</DialogTitle>
          </DialogHeader>
          {viewingProject && (
            <div className="space-y-4">
              {viewingProject.featured_image && (
                <img
                  src={getImageUrl(viewingProject.featured_image)}
                  alt={viewingProject.title}
                  className="w-full rounded-lg"
                />
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="font-medium">{viewingProject.location || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <p className="font-medium capitalize">{viewingProject.status}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Budget</p>
                  <p className="font-medium">{formatCurrency(viewingProject.budget)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Raised</p>
                  <p className="font-medium">{formatCurrency(viewingProject.raised)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Progress</p>
                  <p className="font-medium">{viewingProject.progress}%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Beneficiaries</p>
                  <p className="font-medium">{viewingProject.beneficiaries}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Description</p>
                <p className="whitespace-pre-wrap">{viewingProject.description}</p>
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
          setDeletingProjectId(null);
        }}
        onConfirm={handleDelete}
        itemName="project"
      />
    </div>
  );
}

ProjectsPage.layout = (page) => <AdminLayout>{page}</AdminLayout>;
