// Database model types

export interface Project {
  id: number;
  title: string;
  description: string;
  location: string | null;
  status: string;
  progress: number;
  budget: number | null;
  raised: number;
  beneficiaries: number | null;
  start_date: Date | null;
  featured_image: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  category: string | null;
  author: string | null;
  featured_image: string | null;
  published: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  bio: string | null;
  image: string | null;
  email: string | null;
  linkedin: string | null;
  twitter: string | null;
  order_index: number;
  active: boolean;
  created_at: Date;
}

export interface GalleryImage {
  id: number;
  title: string;
  description: string | null;
  category: string | null;
  image_url: string;
  alt_text: string | null;
  order_index: number;
  active: boolean;
  created_at: Date;
}

export interface Donation {
  id: number;
  donor_email: string;
  donor_phone: string | null;
  amount: number;
  currency: string;
  payment_method: string;
  payment_status: string;
  transaction_id: string | null;
  project_id: number | null;
  created_at: Date;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  created_at: Date;
}

export interface NewsletterSubscriber {
  id: number;
  email: string;
  status: string;
  subscribed_at: Date;
}

export interface User {
  id: number;
  email: string;
  password_hash: string;
  role: string;
  created_at: Date;
}
