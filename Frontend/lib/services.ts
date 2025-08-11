// ...existing code...
// All service functions should now use the Laravel API endpoints via fetch.
// Example for sponsors:
import { Sponsor } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

export async function getAllSponsors(): Promise<Sponsor[]> {
  const res = await fetch(`${API_BASE_URL}/sponsors`);
  if (!res.ok) throw new Error('Failed to fetch sponsors');
  return res.json();
}

export async function getSponsorById(id: number): Promise<Sponsor | null> {
  const res = await fetch(`${API_BASE_URL}/sponsors/${id}`);
  if (!res.ok) return null;
  return res.json();
}

export async function createSponsor(sponsor: Omit<Sponsor, 'id' | 'created_at'>): Promise<Sponsor> {
  const res = await fetch(`${API_BASE_URL}/sponsors`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(sponsor),
  });
  if (!res.ok) throw new Error('Failed to create sponsor');
  return res.json();
}

export async function updateSponsor(id: number, sponsor: Partial<Omit<Sponsor, 'id' | 'created_at'>>): Promise<Sponsor> {
  const res = await fetch(`${API_BASE_URL}/sponsors/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(sponsor),
  });
  if (!res.ok) throw new Error('Failed to update sponsor');
  return res.json();
}

export async function deleteSponsor(id: number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/sponsors/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete sponsor');
}

import { Project, BlogPost, TeamMember, Campaign } from './types';

// Helper function to format dates for MySQL
function formatDateForDatabase(dateInput: string | Date | null | undefined): string | null {
  if (!dateInput) return null;
  
  // If it's already a string in YYYY-MM-DD format, return as is
  if (typeof dateInput === 'string') {
    if (dateInput === "") return null;
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateInput)) {
      return dateInput;
    }
    
    // If it's an ISO string or other date format, convert to YYYY-MM-DD
    try {
      const date = new Date(dateInput);
      if (isNaN(date.getTime())) return null;
      return date.toISOString().split('T')[0];
    } catch {
      return null;
    }
  }
  
  // If it's a Date object, convert to YYYY-MM-DD
  if (dateInput instanceof Date) {
    if (isNaN(dateInput.getTime())) return null;
    return dateInput.toISOString().split('T')[0];
  }
  
  return null;
}

// Project Services
export async function getAllProjects(): Promise<Project[]> {
  const res = await fetch(`${API_BASE_URL}/projects`);
  if (!res.ok) throw new Error('Failed to fetch projects');
  return res.json();
}

// Campaign Services
export async function getAllCampaigns(): Promise<Campaign[]> {
  const res = await fetch(`${API_BASE_URL}/campaigns`);
  if (!res.ok) throw new Error('Failed to fetch campaigns');
  return res.json();
}

export async function getCampaignById(id: number): Promise<Campaign | null> {
  const res = await fetch(`${API_BASE_URL}/campaigns/${id}`);
  if (!res.ok) return null;
  return res.json();
}

export async function createCampaign(campaign: Omit<Campaign, 'id' | 'created_at' | 'updated_at'>): Promise<Campaign> {
  const res = await fetch(`${API_BASE_URL}/campaigns`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(campaign),
  });
  if (!res.ok) throw new Error('Failed to create campaign');
  return res.json();
}

export async function updateCampaign(id: number, campaign: Partial<Omit<Campaign, 'id' | 'created_at' | 'updated_at'>>): Promise<Campaign> {
  const res = await fetch(`${API_BASE_URL}/campaigns/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(campaign),
  });
  if (!res.ok) throw new Error('Failed to update campaign');
  return res.json();
}

export async function deleteCampaign(id: number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/campaigns/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete campaign');
}

export async function getProjectById(id: number): Promise<Project | null> {
  const res = await fetch(`${API_BASE_URL}/projects/${id}`);
  if (!res.ok) return null;
  return res.json();
}

export async function getActiveProjects(): Promise<Project[]> {
  const res = await fetch(`${API_BASE_URL}/projects?status=active`);
  if (!res.ok) throw new Error('Failed to fetch active projects');
  return res.json();
}

export async function createProject(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<Project> {
  const res = await fetch(`${API_BASE_URL}/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(project),
  });
  if (!res.ok) throw new Error('Failed to create project');
  return res.json();
}

export async function updateProject(id: number, project: Partial<Omit<Project, 'id' | 'created_at' | 'updated_at'>>): Promise<Project> {
  const res = await fetch(`${API_BASE_URL}/projects/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(project),
  });
  if (!res.ok) throw new Error('Failed to update project');
  return res.json();
}

export async function deleteProject(id: number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/projects/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete project');
}

// Blog Services
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const res = await fetch(`${API_BASE_URL}/blog`);
  if (!res.ok) throw new Error('Failed to fetch blog posts');
  return res.json();
}

export async function getAllBlogPostsForAdmin(): Promise<BlogPost[]> {
  const res = await fetch(`${API_BASE_URL}/blog?admin=1`);
  if (!res.ok) throw new Error('Failed to fetch blog posts (admin)');
  return res.json();
}

export async function getBlogPostById(id: number): Promise<BlogPost | null> {
  const res = await fetch(`${API_BASE_URL}/blog/${id}`);
  if (!res.ok) return null;
  return res.json();
}

export async function getBlogPostByIdForAdmin(id: number): Promise<BlogPost | null> {
  const res = await fetch(`${API_BASE_URL}/blog/${id}?admin=1`);
  if (!res.ok) return null;
  return res.json();
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const res = await fetch(`${API_BASE_URL}/blog?slug=${encodeURIComponent(slug)}`);
  if (!res.ok) return null;
  return res.json();
}

export async function createBlogPost(blogPost: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>): Promise<BlogPost> {
  const res = await fetch(`${API_BASE_URL}/blog`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(blogPost),
  });
  if (!res.ok) throw new Error('Failed to create blog post');
  return res.json();
}

export async function updateBlogPost(id: number, blogPost: Partial<Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>>): Promise<BlogPost> {
  const res = await fetch(`${API_BASE_URL}/blog/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(blogPost),
  });
  if (!res.ok) throw new Error('Failed to update blog post');
  return res.json();
}

export async function deleteBlogPost(id: number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/blog/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete blog post');
}

// Team Services
export async function getAllTeamMembers(): Promise<TeamMember[]> {
  const res = await fetch(`${API_BASE_URL}/team`);
  if (!res.ok) throw new Error('Failed to fetch team members');
  return res.json();
}

export async function createTeamMember(member: Omit<TeamMember, 'id' | 'created_at'>): Promise<TeamMember> {
  const res = await fetch(`${API_BASE_URL}/team`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(member),
  });
  if (!res.ok) throw new Error('Failed to create team member');
  return res.json();
}

export async function updateTeamMember(id: number, member: Partial<Omit<TeamMember, 'id' | 'created_at'>>): Promise<TeamMember> {
  const res = await fetch(`${API_BASE_URL}/team/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(member),
  });
  if (!res.ok) throw new Error('Failed to update team member');
  return res.json();
}

export async function deleteTeamMember(id: number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/team/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete team member');
}

// Statistics Services
export async function getProjectStats() {
  const res = await fetch(`${API_BASE_URL}/projects/stats`);
  if (!res.ok) throw new Error('Failed to fetch project stats');
  return res.json();
}
