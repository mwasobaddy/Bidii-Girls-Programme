"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Progress } from "@/components/ui/progress"
import { Plus, Eye, Edit, Trash2 } from "lucide-react"
import Image from "next/image"
import { DeleteConfirmation } from "@/components/admin/delete-confirmation"
import { ImageUploader } from "@/components/admin/image-uploader"
import { DatabaseError } from "@/components/admin/database-error"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Project {
  id: number;
  title: string;
  description: string;
  location: string;
  status: string;
  progress: number;
  budget: number;
  raised: number;
  beneficiaries: number;
  start_date: string;
  featured_image?: string;
  created_at: string;
  updated_at: string;
}

export default function ProjectsPage() {
  // State
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [viewingProject, setViewingProject] = useState<Project | null>(null)
  const [deletingProjectId, setDeletingProjectId] = useState<number | null>(null)
  
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
  })
  
  const { toast } = useToast()
  
  // Fetch projects
  const fetchProjects = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/projects")
      if (!response.ok) throw new Error("Failed to fetch projects")
      const data = await response.json()
      setProjects(data)
    } catch (error) {
      console.error("Error fetching projects:", error)
      setError("Failed to fetch projects from database")
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    fetchProjects()
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
    setFormData(prev => ({ ...prev, featured_image: imageDataUrl }))
  }
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const projectData = {
        title: formData.title,
        description: formData.description,
        location: formData.location,
        status: formData.status,
        progress: parseInt(formData.progress) || 0,
        budget: parseFloat(formData.budget) || 0,
        raised: parseFloat(formData.raised) || 0,
        beneficiaries: parseInt(formData.beneficiaries) || 0,
        start_date: formData.start_date || null,
        featured_image: formData.featured_image || null,
      }
      
      let response;
      
      if (editingProject) {
        // Update existing project
        response = await fetch(`/api/projects`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            id: editingProject.id,
            ...projectData 
          }),
        })
      } else {
        // Create new project
        response = await fetch('/api/projects', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(projectData),
        })
      }
      
      if (!response.ok) {
        throw new Error(`Failed to ${editingProject ? 'update' : 'create'} project`)
      }
      
      // Refresh the projects list
      fetchProjects()
      
      // Reset form and close dialog
      resetForm()
      setIsDialogOpen(false)
      
      toast({
        title: `Project ${editingProject ? 'Updated' : 'Created'}`,
        description: `The project was successfully ${editingProject ? 'updated' : 'created'}.`,
      })
      
    } catch (error) {
      console.error("Error saving project:", error)
      toast({
        title: "Error",
        description: `Failed to ${editingProject ? 'update' : 'create'} project. Please try again.`,
        variant: "destructive",
      })
    }
  }
  
  // Handle project deletion
  const handleDelete = async () => {
    if (!deletingProjectId) return
    
    const response = await fetch(`/api/projects`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: deletingProjectId }),
    })
    
    if (!response.ok) {
      throw new Error('Failed to delete project')
    }
    
    // Update local state
    setProjects(projects.filter((item) => item.id !== deletingProjectId))
    setDeletingProjectId(null)
  }
  
  // Handle view button click
  const handleView = (project: Project) => {
    setViewingProject(project)
    setIsViewDialogOpen(true)
  }
  
  // Handle edit button click
  const handleEdit = (project: Project) => {
    setEditingProject(project)
    setFormData({
      title: project.title,
      description: project.description,
      location: project.location || "",
      status: project.status || "active",
      progress: project.progress?.toString() || "0",
      budget: project.budget?.toString() || "0",
      raised: project.raised?.toString() || "0",
      beneficiaries: project.beneficiaries?.toString() || "0",
      start_date: project.start_date || "",
      featured_image: project.featured_image || "",
    })
    setIsDialogOpen(true)
  }
  
  // Reset form data
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
    })
    setEditingProject(null)
  }
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'KES'
    }).format(amount)
  }
  
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e51083]"></div>
        <p className="ml-4 text-gray-600 dark:text-gray-400">
          Loading projects...
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
        <h1 className="text-3xl font-bold">Manage Projects</h1>
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
              Add Project
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingProject ? 'Edit' : 'Add New'} Project</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Project Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Project Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  rows={5}
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
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
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="planned">Planned</SelectItem>
                      <SelectItem value="paused">Paused</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="progress">Progress (%)</Label>
                  <Input
                    id="progress"
                    name="progress"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.progress}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="beneficiaries">Beneficiaries</Label>
                  <Input
                    id="beneficiaries"
                    name="beneficiaries"
                    type="number"
                    min="0"
                    value={formData.beneficiaries}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="budget">Budget (KES)</Label>
                  <Input
                    id="budget"
                    name="budget"
                    type="number"
                    min="0"
                    value={formData.budget}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="raised">Amount Raised (KES)</Label>
                  <Input
                    id="raised"
                    name="raised"
                    type="number"
                    min="0"
                    value={formData.raised}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2">
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
              
              <div className="space-y-2">
                <Label>Featured Image</Label>
                <ImageUploader 
                  onImageSelected={handleImageSelected}
                  currentImage={formData.featured_image || undefined}
                  label="Upload Project Image"
                  aspectRatio="16:9"
                />
              </div>
              
              <Button
                type="submit"
                className="w-full bg-[#e51083] hover:bg-[#c50e73]"
              >
                {editingProject ? 'Update' : 'Add'} Project
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.length > 0 ? (
          projects.map((project) => (
            <Card key={project.id} className="overflow-hidden">
              <CardContent className="p-0">
                {project.featured_image && (
                  <div className="relative w-full h-48">
                    <Image
                      src={project.featured_image}
                      alt={project.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="font-semibold text-lg mb-2">{project.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                    {project.description}
                  </p>
                  
                  <div className="space-y-4 mb-4">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Progress</span>
                        <span>{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="block text-gray-500">Status</span>
                        <span className="font-medium capitalize">{project.status}</span>
                      </div>
                      <div>
                        <span className="block text-gray-500">Location</span>
                        <span className="font-medium">{project.location || "N/A"}</span>
                      </div>
                      <div>
                        <span className="block text-gray-500">Budget</span>
                        <span className="font-medium">{formatCurrency(project.budget)}</span>
                      </div>
                      <div>
                        <span className="block text-gray-500">Raised</span>
                        <span className="font-medium">{formatCurrency(project.raised)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleView(project)}
                      className="w-full bg-transparent"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(project)}
                      className="w-full bg-transparent"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => setDeletingProjectId(project.id)}
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
              No projects found. Add your first project to get started.
            </p>
            <Button 
              onClick={() => {
                resetForm()
                setIsDialogOpen(true)
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Project
            </Button>
          </div>
        )}
      </div>
      
      {/* View Dialog */}
      {viewingProject && (
        <Dialog
          open={isViewDialogOpen}
          onOpenChange={(open) => {
            setIsViewDialogOpen(open)
            if (!open) setViewingProject(null)
          }}
        >
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Project Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              {viewingProject.featured_image && (
                <div className="relative w-full h-64 rounded-lg overflow-hidden">
                  <Image
                    src={viewingProject.featured_image}
                    alt={viewingProject.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              
              <div>
                <h2 className="text-2xl font-bold">{viewingProject.title}</h2>
                <p className="text-gray-500 dark:text-gray-400">
                  Added on {new Date(viewingProject.created_at).toLocaleDateString()}
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold">Description</h3>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {viewingProject.description}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold">Progress</h3>
                    <div className="flex justify-between text-sm mb-1 mt-2">
                      <span>Completion</span>
                      <span>{viewingProject.progress}%</span>
                    </div>
                    <Progress value={viewingProject.progress} className="h-3" />
                  </div>
                  
                  <div>
                    <h3 className="font-semibold">Funding</h3>
                    <div className="mt-2 space-y-2">
                      <div className="flex justify-between">
                        <span>Budget:</span>
                        <span className="font-medium">{formatCurrency(viewingProject.budget)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Raised:</span>
                        <span className="font-medium">{formatCurrency(viewingProject.raised)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Remaining:</span>
                        <span className="font-medium">
                          {formatCurrency(Math.max(0, viewingProject.budget - viewingProject.raised))}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold">Details</h3>
                    <div className="mt-2 space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="block text-sm text-gray-500">Status</span>
                          <span className="font-medium capitalize">{viewingProject.status}</span>
                        </div>
                        <div>
                          <span className="block text-sm text-gray-500">Location</span>
                          <span className="font-medium">{viewingProject.location || "N/A"}</span>
                        </div>
                        <div>
                          <span className="block text-sm text-gray-500">Start Date</span>
                          <span className="font-medium">
                            {viewingProject.start_date 
                              ? new Date(viewingProject.start_date).toLocaleDateString() 
                              : "N/A"}
                          </span>
                        </div>
                        <div>
                          <span className="block text-sm text-gray-500">Beneficiaries</span>
                          <span className="font-medium">{viewingProject.beneficiaries} people</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsViewDialogOpen(false)
                    setViewingProject(null)
                  }}
                >
                  Close
                </Button>
                <Button
                  variant="default"
                  onClick={() => {
                    setIsViewDialogOpen(false)
                    handleEdit(viewingProject)
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
        isOpen={!!deletingProjectId}
        onClose={() => setDeletingProjectId(null)}
        onConfirm={handleDelete}
        itemType="project"
        itemName={projects.find(p => p.id === deletingProjectId)?.title}
      />
    </div>
  )
}
