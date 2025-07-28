import { executeQuery, executeQuerySingle } from './database';
import { Project, BlogPost, TeamMember, GalleryImage } from './types';

// Project Services
export async function getAllProjects(): Promise<Project[]> {
  const query = `
    SELECT 
      id, title, description, location, status, progress, 
      budget, raised, beneficiaries, start_date, featured_image,
      created_at, updated_at
    FROM projects 
    ORDER BY created_at DESC
  `;
  return executeQuery<Project>(query);
}

export async function getProjectById(id: number): Promise<Project | null> {
  const query = `
    SELECT 
      id, title, description, location, status, progress, 
      budget, raised, beneficiaries, start_date, featured_image,
      created_at, updated_at
    FROM projects 
    WHERE id = ?
  `;
  return executeQuerySingle<Project>(query, [id]);
}

export async function getActiveProjects(): Promise<Project[]> {
  const query = `
    SELECT 
      id, title, description, location, status, progress, 
      budget, raised, beneficiaries, start_date, featured_image,
      created_at, updated_at
    FROM projects 
    WHERE status = 'active'
    ORDER BY created_at DESC
  `;
  return executeQuery<Project>(query);
}

// Blog Services
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const query = `
    SELECT 
      id, title, slug, excerpt, content, category, author, 
      featured_image, published, created_at, updated_at
    FROM blog_posts 
    WHERE published = true
    ORDER BY created_at DESC
  `;
  return executeQuery<BlogPost>(query);
}

export async function getBlogPostById(id: number): Promise<BlogPost | null> {
  const query = `
    SELECT 
      id, title, slug, excerpt, content, category, author, 
      featured_image, published, created_at, updated_at
    FROM blog_posts 
    WHERE id = ? AND published = true
  `;
  return executeQuerySingle<BlogPost>(query, [id]);
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const query = `
    SELECT 
      id, title, slug, excerpt, content, category, author, 
      featured_image, published, created_at, updated_at
    FROM blog_posts 
    WHERE slug = ? AND published = true
  `;
  return executeQuerySingle<BlogPost>(query, [slug]);
}

// Team Services
export async function getAllTeamMembers(): Promise<TeamMember[]> {
  const query = `
    SELECT 
      id, name, role, bio, image, email, linkedin, twitter, 
      order_index, active, created_at
    FROM team_members 
    WHERE active = true
    ORDER BY order_index ASC
  `;
  return executeQuery<TeamMember>(query);
}

// Gallery Services
export async function getAllGalleryImages(): Promise<GalleryImage[]> {
  const query = `
    SELECT 
      id, title, description, category, image_url, alt_text, 
      order_index, active, created_at
    FROM gallery_images 
    WHERE active = true
    ORDER BY order_index ASC
  `;
  return executeQuery<GalleryImage>(query);
}

export async function getGalleryImagesByCategory(category: string): Promise<GalleryImage[]> {
  const query = `
    SELECT 
      id, title, description, category, image_url, alt_text, 
      order_index, active, created_at
    FROM gallery_images 
    WHERE category = ? AND active = true
    ORDER BY order_index ASC
  `;
  return executeQuery<GalleryImage>(query, [category]);
}

// Statistics Services
export async function getProjectStats() {
  const totalProjectsQuery = 'SELECT COUNT(*) as total FROM projects';
  const activeProjectsQuery = 'SELECT COUNT(*) as active FROM projects WHERE status = "active"';
  const totalBeneficiariesQuery = 'SELECT SUM(beneficiaries) as total FROM projects WHERE beneficiaries IS NOT NULL';
  const totalRaisedQuery = 'SELECT SUM(raised) as total FROM projects WHERE raised IS NOT NULL';

  const [totalProjects, activeProjects, totalBeneficiaries, totalRaised] = await Promise.all([
    executeQuerySingle(totalProjectsQuery),
    executeQuerySingle(activeProjectsQuery),
    executeQuerySingle(totalBeneficiariesQuery),
    executeQuerySingle(totalRaisedQuery),
  ]);

  return {
    totalProjects: totalProjects?.total || 0,
    activeProjects: activeProjects?.active || 0,
    totalBeneficiaries: totalBeneficiaries?.total || 0,
    totalRaised: totalRaised?.total || 0,
  };
}
