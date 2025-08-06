"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Tag, Layers } from "lucide-react"
import { DeleteConfirmation } from "@/components/admin/delete-confirmation"
import { DatabaseError } from "@/components/admin/database-error"

interface Category {
  id: number;
  name: string;
  description?: string;
  parent_id?: number | null;
  color?: string;
}

export default function CategoriesPage() {
  // State
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [deletingCategoryId, setDeletingCategoryId] = useState<number | null>(null)
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    parent_id: "",
    color: "#718096", // Default gray color
  })
  
  const { toast } = useToast()
  
  // Fetch categories
  const fetchCategories = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/categories")
      if (!response.ok) throw new Error("Failed to fetch categories")
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error("Error fetching categories:", error)
      setError("Failed to fetch categories from database")
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    fetchCategories()
  }, [])
  
  // Handle form input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // Validation
      if (!formData.name) {
        toast({
          title: "Missing Required Field",
          description: "Category name is required.",
          variant: "destructive",
        })
        return
      }
      
      // Always send all fields, never undefined
      const categoryData = {
        name: formData.name,
        description: formData.description || null,
        parent_id: formData.parent_id !== "" ? Number(formData.parent_id) : null,
        color: formData.color || "#718096",
      }
      
      let response
      
      if (editingCategory) {
        response = await fetch('/api/categories', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingCategory.id, ...categoryData }),
        })
      } else {
        response = await fetch('/api/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(categoryData),
        })
      }
      
      if (!response.ok) {
        throw new Error('Failed to save category')
      }
      
      // Refresh the categories list
      fetchCategories()
      
      // Reset form and close dialog
      resetForm()
      setIsDialogOpen(false)
      
      toast({
        title: `Category ${editingCategory ? 'Updated' : 'Created'}`,
        description: `The category was successfully ${editingCategory ? 'updated' : 'created'}.`,
      })
      
    } catch (error) {
      console.error("Error saving category:", error)
      toast({
        title: "Error",
        description: `Failed to ${editingCategory ? 'update' : 'create'} category. Please try again.`,
        variant: "destructive",
      })
    }
  }
  
  // Handle category deletion
  const handleDelete = async () => {
    if (!deletingCategoryId) return
    
    try {
      const response = await fetch(`/api/categories`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: deletingCategoryId }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete category')
      }
      
      // Update local state
      setCategories(categories.filter((category) => category.id !== deletingCategoryId))
      setDeletingCategoryId(null)
      
      toast({
        title: "Category Deleted",
        description: "The category was successfully deleted.",
      })
    } catch (error) {
      console.error("Error deleting category:", error)
      toast({
        title: "Error",
        description: "Failed to delete category. This category may be in use.",
        variant: "destructive",
      })
    }
  }
  
  // Handle edit button click
  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      description: category.description || "",
      parent_id: category.parent_id?.toString() || "",
      color: category.color || "#718096",
    })
    setIsDialogOpen(true)
  }
  
  // Reset form data
  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      parent_id: "",
      color: "#718096",
    })
    setEditingCategory(null)
  }
  
  // Get parent category name
  const getParentCategoryName = (parentId: number | null | undefined) => {
    if (!parentId) return ""
    const parent = categories.find(cat => cat.id === parentId)
    return parent ? parent.name : ""
  }
  
  // Filter top-level categories (those without a parent)
  const topLevelCategories = categories.filter(category => !category.parent_id)
  
  // Get child categories for a parent
  const getChildCategories = (parentId: number) => {
    return categories.filter(category => category.parent_id === parentId)
  }
  
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e51083]"></div>
        <p className="ml-4 text-gray-600 dark:text-gray-400">
          Loading categories...
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
        <h1 className="text-3xl font-bold">Manage Categories</h1>
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
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingCategory ? 'Edit' : 'Add New'} Category</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Category Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter a description for this category"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="parent_id">Parent Category (optional)</Label>
                <select
                  id="parent_id"
                  name="parent_id"
                  value={formData.parent_id}
                  onChange={handleChange}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">None (Top Level)</option>
                  {categories
                    .filter(cat => (!editingCategory || cat.id !== editingCategory.id) && !cat.parent_id)
                    .map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))
                  }
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="color">Color</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="color"
                    name="color"
                    type="color"
                    value={formData.color}
                    onChange={handleChange}
                    className="w-12 h-10 p-1"
                  />
                  <Input
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    placeholder="#718096"
                    className="flex-1"
                  />
                </div>
              </div>
              
              {/* Preview badge */}
              <div className="pt-2 pb-4">
                <Label className="mb-2 block">Preview:</Label>
                <div className="flex items-center space-x-2">
                  <Badge style={{ backgroundColor: formData.color }}>
                    {formData.name || "Category Name"}
                  </Badge>
                </div>
              </div>
              
              <Button
                type="submit"
                className="w-full bg-[#e51083] hover:bg-[#c50e73]"
              >
                {editingCategory ? 'Update' : 'Add'} Category
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="space-y-8">
        {categories.length > 0 ? (
          topLevelCategories.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {topLevelCategories.map((category) => {
                  const childCategories = getChildCategories(category.id)
                  
                  return (
                    <Card key={category.id} className="overflow-hidden">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center mb-2">
                              <Badge style={{ backgroundColor: category.color || '#718096' }} className="mr-2">
                                {category.name}
                              </Badge>
                              {childCategories.length > 0 && (
                                <Badge variant="outline" className="ml-2">
                                  {childCategories.length} subcategories
                                </Badge>
                              )}
                            </div>
                            
                            {category.description && (
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                {category.description}
                              </p>
                            )}
                          </div>
                          
                          <div className="flex space-x-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEdit(category)}
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setDeletingCategoryId(category.id)}
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </div>
                        
                        {childCategories.length > 0 && (
                          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                            <h4 className="text-sm font-medium mb-2 flex items-center">
                              <Layers className="h-4 w-4 mr-1" />
                              Subcategories
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {childCategories.map(child => (
                                <div key={child.id} className="flex items-center">
                                  <Badge variant="secondary" style={{ borderColor: child.color || '#718096', color: child.color || '#718096' }}>
                                    {child.name}
                                  </Badge>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleEdit(child)}
                                    className="h-6 w-6 p-0 ml-1"
                                  >
                                    <Edit className="h-3 w-3" />
                                    <span className="sr-only">Edit</span>
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => setDeletingCategoryId(child.id)}
                                    className="h-6 w-6 p-0 text-red-500 hover:text-red-600"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                    <span className="sr-only">Delete</span>
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
              
              {/* Standalone subcategories (those with a parent that isn't in the main categories list) */}
              {categories.some(cat => cat.parent_id && !categories.find(p => p.id === cat.parent_id)) && (
                <div className="mt-8">
                  <h2 className="text-xl font-semibold mb-4">Orphaned Subcategories</h2>
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <div className="flex flex-wrap gap-3">
                      {categories
                        .filter(cat => cat.parent_id && !categories.find(p => p.id === cat.parent_id))
                        .map(category => (
                          <div key={category.id} className="flex items-center bg-white dark:bg-gray-700 rounded-lg p-2 shadow-sm">
                            <Badge style={{ backgroundColor: category.color || '#718096' }}>
                              {category.name}
                            </Badge>
                            <div className="text-xs text-gray-500 mx-2">
                              (Missing parent: ID {category.parent_id})
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEdit(category)}
                              className="h-6 w-6 p-0"
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setDeletingCategoryId(category.id)}
                              className="h-6 w-6 p-0 text-red-500"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            // No top-level categories but there are subcategories
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => (
                <Card key={category.id} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center mb-2">
                          <Badge style={{ backgroundColor: category.color || '#718096' }} className="mr-2">
                            {category.name}
                          </Badge>
                          {category.parent_id && (
                            <Badge variant="outline" className="ml-2">
                              Sub of {getParentCategoryName(category.parent_id)}
                            </Badge>
                          )}
                        </div>
                        
                        {category.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            {category.description}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex space-x-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEdit(category)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setDeletingCategoryId(category.id)}
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )
        ) : (
          <div className="text-center p-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex justify-center mb-4">
              <Tag className="h-16 w-16 text-gray-400" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              No categories found. Add your first category to get started.
            </p>
            <Button 
              onClick={() => {
                resetForm()
                setIsDialogOpen(true)
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </div>
        )}
      </div>
      
      {/* Delete Confirmation Dialog */}
      <DeleteConfirmation
        isOpen={!!deletingCategoryId}
        onClose={() => setDeletingCategoryId(null)}
        onConfirm={handleDelete}
        itemType="category"
        itemName={categories.find(c => c.id === deletingCategoryId)?.name}
      />
    </div>
  )
}
