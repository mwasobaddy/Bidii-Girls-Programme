"use client"

import React, { createContext, useContext, ReactNode, useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { 
  getAllCampaigns, 
  getAllProjects, 
  getAllBlogPostsForAdmin, 
  getAllTeamMembers, 
  getAllSponsors 
} from "@/lib/services"
import { Campaign, Project, BlogPost, TeamMember, Sponsor } from "@/lib/types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

interface GalleryImage {
  id: number;
  title: string;
  description: string;
  category: string;
  image_url: string;
  alt_text: string;
  order_index: number;
}

// Define the context state type
interface AdminContextState {
  // Data states
  campaigns: Campaign[];
  projects: Project[];
  blogPosts: BlogPost[];
  stories: any[]; // This is derived from blog posts
  teamMembers: TeamMember[];
  sponsors: Sponsor[];
  galleryImages: GalleryImage[];
  categories: any[];
  
  // Loading states
  loadingCampaigns: boolean;
  loadingProjects: boolean;
  loadingBlogPosts: boolean;
  loadingTeamMembers: boolean;
  loadingSponsors: boolean;
  loadingGalleryImages: boolean;
  
  // Error states
  error: string | null;
  
  // Action methods
  fetchCampaigns: () => Promise<void>;
  fetchProjects: () => Promise<void>;
  fetchBlogPosts: () => Promise<void>;
  fetchStories: () => Promise<void>;
  fetchTeamMembers: () => Promise<void>;
  fetchSponsors: () => Promise<void>;
  fetchGalleryImages: () => Promise<void>;
  
  // Image upload helper
  handleImageUpload: (callback: (imageUrl: string) => void) => void;
}

// Create the context
const AdminContext = createContext<AdminContextState | undefined>(undefined);

// Provider component
export function AdminProvider({ children }: { children: ReactNode }) {
  // Data states
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [stories, setStories] = useState<any[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  
  // Loading states
  const [loadingCampaigns, setLoadingCampaigns] = useState(false);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [loadingBlogPosts, setLoadingBlogPosts] = useState(false);
  const [loadingTeamMembers, setLoadingTeamMembers] = useState(false);
  const [loadingSponsors, setLoadingSponsors] = useState(false);
  const [loadingGalleryImages, setLoadingGalleryImages] = useState(false);
  
  const [error, setError] = useState<string | null>(null);
  
  const { toast } = useToast();
  
  // Fetch campaigns
  const fetchCampaigns = async () => {
    setLoadingCampaigns(true);
    try {
      const data = await getAllCampaigns();
      setCampaigns(data);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      setError("Failed to load campaigns from database");
    } finally {
      setLoadingCampaigns(false);
    }
  };
  
  // Fetch projects
  const fetchProjects = async () => {
    setLoadingProjects(true);
    try {
      const data = await getAllProjects();
      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setError("Failed to load projects from database");
    } finally {
      setLoadingProjects(false);
    }
  };
  
  // Fetch blog posts
  const fetchBlogPosts = async () => {
    setLoadingBlogPosts(true);
    try {
      const data = await getAllBlogPostsForAdmin();
      setBlogPosts(data);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      setError("Failed to load blog posts from database");
    } finally {
      setLoadingBlogPosts(false);
    }
  };
  
  // Fetch stories (derived from blog posts)
  const fetchStories = async () => {
    setLoadingBlogPosts(true);
    try {
      const data = await getAllBlogPostsForAdmin();
      
      // Filter blog posts that are success stories
      const stories = data.filter(post => 
        post.category?.toLowerCase().includes('story') || 
        post.category?.toLowerCase().includes('success')
      );
      setStories(stories);
    } catch (error) {
      console.error("Error fetching stories:", error);
      setError("Failed to load stories from database");
    } finally {
      setLoadingBlogPosts(false);
    }
  };
  
  // Fetch team members
  const fetchTeamMembers = async () => {
    setLoadingTeamMembers(true);
    try {
      const data = await getAllTeamMembers();
      setTeamMembers(data);
    } catch (error) {
      console.error("Error fetching team members:", error);
      setError("Failed to load team members from database");
    } finally {
      setLoadingTeamMembers(false);
    }
  };
  
  // Fetch sponsors
  const fetchSponsors = async () => {
    setLoadingSponsors(true);
    try {
      const data = await getAllSponsors();
      setSponsors(data);
    } catch (error) {
      console.error("Error fetching sponsors:", error);
      setError("Failed to fetch sponsors");
    } finally {
      setLoadingSponsors(false);
    }
  };
  
  // Fetch gallery images
  const fetchGalleryImages = async () => {
    setLoadingGalleryImages(true);
    try {
      const response = await fetch(`${API_BASE_URL}/gallery`);
      if (!response.ok) throw new Error("Failed to fetch gallery images");
      const data = await response.json();
      setGalleryImages(data);
    } catch (error) {
      console.error("Error fetching gallery images:", error);
      setError("Failed to load gallery images from database");
    } finally {
      setLoadingGalleryImages(false);
    }
  };
  
  // Handle image upload helper
  const handleImageUpload = (callback: (imageUrl: string) => void) => {
    // Create a file input element
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
  
    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const files = target.files;
  
      if (!files || files.length === 0) return;
  
      // Process selected file
      const file = files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        const imageDataUrl = event.target?.result as string;
  
        // Store in localStorage with a unique key
        const imageKey = `admin_image_${Date.now()}_${Math.random()
          .toString(36)
          .substr(2, 9)}`;
          
        try {
          localStorage.setItem(imageKey, imageDataUrl);
          callback(imageDataUrl);
  
          toast({
            title: "Image Uploaded",
            description: `Image "${file.name}" has been uploaded and stored locally.`,
          });
        } catch (error) {
          console.error("Error storing image in localStorage:", error);
          toast({
            title: "Upload Error",
            description: "Failed to store image. File may be too large.",
            variant: "destructive",
          });
        }
      };
  
      reader.onerror = () => {
        toast({
          title: "Upload Error",
          description: "Failed to read the selected file.",
          variant: "destructive",
        });
      };
  
      reader.readAsDataURL(file);
    };
  
    // Trigger the file picker
    input.click();
  };
  
  // Context value
  const contextValue: AdminContextState = {
    // Data states
    campaigns,
    projects,
    blogPosts,
    stories,
    teamMembers,
    sponsors,
    galleryImages,
    categories,
    
    // Loading states
    loadingCampaigns,
    loadingProjects,
    loadingBlogPosts,
    loadingTeamMembers,
    loadingSponsors,
    loadingGalleryImages,
    
    // Error state
    error,
    
    // Action methods
    fetchCampaigns,
    fetchProjects,
    fetchBlogPosts,
    fetchStories,
    fetchTeamMembers,
    fetchSponsors,
    fetchGalleryImages,
    
    // Helper methods
    handleImageUpload,
  };
  
  return (
    <AdminContext.Provider value={contextValue}>
      {children}
    </AdminContext.Provider>
  );
}

// Hook to use admin context
export function useAdminContext() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdminContext must be used within an AdminProvider');
  }
  return context;
}
