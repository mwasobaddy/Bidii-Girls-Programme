"use client"

import React, { createContext, useContext, ReactNode, useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

// Define types for the various content types
interface Campaign {
  id: number;
  title: string;
  description: string;
  location: string;
  urgency: string;
  beneficiaries: number;
  linked_blog?: number | null;
  feature_image?: string;
  start_date?: string | null;
  end_date?: string | null;
}

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

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  featured_image?: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

interface TeamMember {
  id: number;
  name: string;
  role: string;
  bio: string;
  email: string;
  image?: string;
  order_index: number;
}

interface GalleryImage {
  id: number;
  title: string;
  description: string;
  category: string;
  image_url: string;
  alt_text: string;
  order_index: number;
}

interface Sponsor {
  id: number;
  name: string;
  logo: string | null;
  website: string | null;
  created_at: Date;
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
      const response = await fetch("/api/campaigns");
      if (!response.ok) throw new Error("Failed to fetch campaigns");
      const data = await response.json();
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
      const response = await fetch("/api/projects");
      if (!response.ok) throw new Error("Failed to fetch projects");
      const data = await response.json();
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
      const response = await fetch("/api/blog?admin=true");
      if (!response.ok) throw new Error("Failed to fetch blog posts");
      const data = await response.json();
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
      const response = await fetch("/api/blog?admin=true");
      if (!response.ok) throw new Error("Failed to fetch stories");
      const data = await response.json();
      
      // Filter blog posts that are success stories
      const storiesData = data
        .filter((post: any) => post.category === "Success Stories")
        .map((post: any) => {
          // Try to extract beneficiary info from content
          const lines = post.content.split("\n");
          const beneficiaryLine = lines.find((line: string) =>
            line.includes("**Beneficiary:**")
          );
          const ageLine = lines.find((line: string) =>
            line.includes("**Age:**")
          );
          const locationLine = lines.find((line: string) =>
            line.includes("**Location:**")
          );
  
          return {
            id: post.id,
            title: post.title,
            content: lines[0] || post.excerpt || "", // First line as main content
            beneficiaryName: beneficiaryLine
              ? beneficiaryLine.replace("**Beneficiary:**", "").trim()
              : "",
            beneficiaryAge: ageLine
              ? ageLine.replace("**Age:**", "").trim()
              : "",
            location: locationLine
              ? locationLine.replace("**Location:**", "").trim()
              : "",
            featureImage: post.featured_image || "",
          };
        });
        
      setStories(storiesData);
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
      const response = await fetch("/api/team");
      if (!response.ok) throw new Error("Failed to fetch team members");
      const data = await response.json();
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
      const response = await fetch("/api/sponsors");
      if (!response.ok) throw new Error("Failed to fetch sponsors");
      const data = await response.json();
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
      const response = await fetch("/api/gallery");
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
