# Bidii Girls - Charity Website

*Empowering girls and fighting period poverty through technology and community engagement*

[![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js%2015-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

## 🌟 Overview

Bidii Girls is a comprehensive charity website built to combat period poverty and empower young girls in Kenya. The platform features a modern, responsive design with a full-stack architecture including database integration, admin dashboard, and content management system.

## 🚀 Features

### Public Website
- **Homepage**: Hero section with mission statement and key statistics
- **About Page**: Organization story, mission, and impact metrics
- **Projects**: Database-driven project showcase with real-time data
- **Gallery**: Dynamic image gallery with category filtering
- **Blog**: Content management system for articles and updates
- **Contact**: Contact forms and partnership applications
- **Team**: Meet the team section with member profiles

### Admin Dashboard
- **Secure Authentication**: Database-driven login with bcrypt password hashing
- **Content Management**: CRUD operations for projects, blogs, team members, and gallery
- **Real-time Statistics**: Live dashboard with project and content metrics
- **Database Integration**: All content sourced from MySQL database
- **Application Management**: Handle volunteer and partnership applications

### Technical Features
- **Database-Driven**: MySQL integration with connection pooling
- **Authentication**: JWT-based admin authentication with secure cookies
- **API Architecture**: RESTful API endpoints for all data operations
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Type Safety**: Full TypeScript implementation
- **Performance**: Optimized images and lazy loading

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15.2.4 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Shadcn/ui components
- **State Management**: React hooks and context
- **Forms**: React Hook Form with validation
- **Images**: Next.js Image optimization

### Backend
- **Runtime**: Node.js
- **Database**: MySQL with mysql2 connection pooling
- **Authentication**: JWT tokens + bcryptjs password hashing
- **API**: Next.js API routes
- **Environment**: Environment variables for configuration

### Database Schema
- **Users**: Admin authentication and user management
- **Projects**: Project details, progress tracking, and metrics
- **Blog Posts**: Content management with categories and publishing
- **Team Members**: Staff profiles with social media links
- **Gallery Images**: Categorized image gallery with metadata
- **Applications**: Volunteer and partnership application storage

## 🏗️ Project Structure

```
bidiifinali/
├── Frontend/                 # Next.js application
│   ├── app/                 # App Router pages
│   │   ├── admin/          # Admin dashboard
│   │   ├── api/            # API endpoints
│   │   ├── blog/           # Blog pages
│   │   ├── gallery/        # Gallery page
│   │   └── ...             # Other pages
│   ├── components/         # Reusable UI components
│   │   ├── ui/            # Shadcn/ui components
│   │   └── ...            # Custom components
│   ├── lib/               # Utilities and database config
│   └── public/            # Static assets
├── Backend/                # Database and server config
│   └── database/          # SQL scripts and configuration
└── README.md             # Project documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/pnpm
- MySQL 8.0+
- XAMPP (for local development) or MySQL server

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Hiikey7/bidiifinali.git
   cd bidiifinali/Frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Database Setup**
   ```bash
   # Start XAMPP or your MySQL server
   # Create database using provided SQL scripts
   mysql -u root -p < ../Backend/database/create-database.sql
   mysql -u root -p < ../Backend/database/seed-data.sql
   ```

4. **Environment Configuration**
   ```bash
   cp .env.local.example .env.local
   # Update with your database credentials
   ```

5. **Run the development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

6. **Access the application**
   - Website: [http://localhost:3000](http://localhost:3000)
   - Admin Dashboard: [http://localhost:3000/admin](http://localhost:3000/admin)

## 🗃️ Database Configuration

### Environment Variables (.env.local)
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=bidii_girls
JWT_SECRET=your_jwt_secret_key
```

### Default Admin Credentials
```
Username: admin
Password: admin123
```
*Change these in production!*

## 📊 Database Schema Overview

### Key Tables
- **`users`**: Admin authentication and user management
- **`projects`**: Project information with progress tracking
- **`blog_posts`**: Blog content with publishing workflow
- **`team_members`**: Team profiles with social media integration
- **`gallery_images`**: Categorized image gallery
- **`volunteer_applications`**: Volunteer registration data
- **`partnership_applications`**: Partnership inquiry management

## 🎯 API Endpoints

### Public APIs
- `GET /api/projects` - Fetch all projects
- `GET /api/blog` - Fetch published blog posts
- `GET /api/team` - Fetch team members
- `GET /api/gallery` - Fetch gallery images

### Admin APIs
- `POST /api/auth/login` - Admin authentication
- `POST /api/auth/logout` - Admin logout
- `GET /api/admin/*` - Admin dashboard data

## 🔒 Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Authentication**: Secure token-based auth
- **HTTP-only Cookies**: Secure session management
- **Environment Variables**: Sensitive data protection
- **Input Validation**: Form validation and sanitization

## 🌐 Deployment

### Vercel Deployment (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Configure environment variables
4. Deploy automatically on push

### Manual Deployment
1. Build the application: `npm run build`
2. Configure production database
3. Set production environment variables
4. Deploy using your preferred hosting service

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is built for Bidii Girls charity organization. For licensing and usage inquiries, please contact the organization.

## 🙏 Acknowledgments

- Built with love for the Bidii Girls mission
- Powered by modern web technologies
- Community-driven development approach
- Focused on empowering girls and fighting period poverty

## 📞 Support

For technical support or questions:
- Open an issue on GitHub
- Contact the development team
- Check the documentation in `/docs`

---

**Made with ❤️ for Bidii Girls - Empowering girls, one period at a time**


-- Sponsors table
CREATE TABLE IF NOT EXISTS sponsors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    logo LONGTEXT,
    website VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Create database tables for Bidii Girls Program

-- Users table for admin authentication
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Blog posts table
CREATE TABLE IF NOT EXISTS blog_posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    category VARCHAR(100),
    author VARCHAR(255),
    author_image VARCHAR(500),
    featured_image VARCHAR(500),
    published BOOLEAN DEFAULT false,
    published_date DATE,
    tags TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255),
    status VARCHAR(50) DEFAULT 'planning',
    progress INTEGER DEFAULT 0,
    budget DECIMAL(10,2),
    raised DECIMAL(10,2) DEFAULT 0,
    beneficiaries INTEGER,
    start_date DATE,
    featured_image VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Team members table
CREATE TABLE IF NOT EXISTS team_members (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    bio TEXT,
    image LONGTEXT,
    email VARCHAR(255),
    linkedin VARCHAR(500),
    twitter VARCHAR(500),
    order_index INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Donations table
CREATE TABLE IF NOT EXISTS donations (
    id SERIAL PRIMARY KEY,
    donor_email VARCHAR(255) NOT NULL,
    donor_phone VARCHAR(50),
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    payment_method VARCHAR(50) NOT NULL,
    payment_status VARCHAR(50) DEFAULT 'pending',
    transaction_id VARCHAR(255),
    project_id INTEGER REFERENCES projects(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contact messages table
CREATE TABLE IF NOT EXISTS contact_messages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'unread',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Newsletter subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Campaigns table
CREATE TABLE IF NOT EXISTS campaigns (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255),
    urgency VARCHAR(50) DEFAULT 'active',
    beneficiaries INTEGER,
    linked_blog INTEGER,
    feature_image VARCHAR(500),
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Insert sponsors
INSERT INTO sponsors (name, logo, website) VALUES
('UNICEF', '/placeholder.svg?height=80&width=120', 'https://unicef.org'),
('World Vision', '/placeholder.svg?height=80&width=120', 'https://worldvision.org');
-- Seed data for Bidii Girls Program

-- Insert admin users (password is hashed for 'admin123')
INSERT INTO users (email, password_hash, role) VALUES
('admin@bidiigirls.org', '$2b$10$2Ar68X1fTWvN2cVVCIGQUOUNQfpYEe/Oz4O3vEOFBoDpYj/kYup/u', 'admin'),
('sarah@bidiigirls.org', '$2b$10$2Ar68X1fTWvN2cVVCIGQUOUNQfpYEe/Oz4O3vEOFBoDpYj/kYup/u', 'admin');

-- Insert team members
INSERT INTO team_members (name, role, bio, email, order_index) VALUES
('Sarah Wanjiku', 'Founder & Executive Director', 'Sarah founded Bidii Girls Program in 2021 after witnessing firsthand the challenges girls face due to period poverty. With over 10 years of experience in community development, she leads our mission with passion and dedication.', 'sarah@bidiigirls.org', 1),
('Grace Muthoni', 'Program Manager', 'Grace oversees our educational programs and community outreach initiatives. Her background in social work and her deep understanding of local communities make her invaluable to our mission.', 'grace@bidiigirls.org', 2),
('David Kimani', 'Operations Director', 'David manages our day-to-day operations and ensures efficient distribution of resources. His expertise in logistics and supply chain management helps us reach more girls effectively.', 'david@bidiigirls.org', 3),
('Mary Akinyi', 'Community Coordinator', 'Mary works directly with schools and communities to implement our programs. Her grassroots approach and cultural sensitivity ensure our initiatives are well-received and effective.', 'mary@bidiigirls.org', 4);

-- Insert projects
INSERT INTO projects (title, description, location, status, progress, budget, raised, beneficiaries, start_date) VALUES
('Menstrual Hygiene Education Program', 'Comprehensive education program teaching girls about menstrual health, hygiene practices, and body positivity in 10 schools across Kibera slum.', 'Kibera, Nairobi', 'active', 75, 15000.00, 11250.00, 250, '2024-01-01'),
('Sanitary Pad Distribution Initiative', 'Monthly distribution of reusable sanitary pads and hygiene kits to girls in Mathare slum, ensuring they don''t miss school during their periods.', 'Mathare, Nairobi', 'active', 60, 8000.00, 4800.00, 180, '2024-03-01'),
('Girls Empowerment Workshops', 'Weekly workshops focusing on leadership skills, self-confidence, and career guidance for teenage girls in Mukuru slum.', 'Mukuru, Nairobi', 'planning', 25, 5000.00, 1250.00, 120, '2024-06-01'),
('School Infrastructure Improvement', 'Building and renovating toilet facilities in schools to provide private, clean spaces for girls to manage their periods with dignity.', 'Kawangware, Nairobi', 'completed', 100, 25000.00, 25000.00, 300, '2023-09-01');

-- Insert blog posts
INSERT INTO blog_posts (title, slug, excerpt, content, category, author, published) VALUES
('Breaking the Silence: Why Period Education Matters', 'breaking-silence-period-education-matters', 'Exploring the importance of comprehensive menstrual health education in breaking down stigma and empowering young girls.', 'Period education is crucial for empowering girls and breaking down harmful stigmas...', 'Education', 'Sarah Wanjiku', true),
('Success Story: How Maria Overcame Period Poverty', 'success-story-maria-overcame-period-poverty', 'Meet Maria, a 16-year-old from Kibera who transformed her life through our menstrual hygiene program.', 'Maria''s story is one of resilience and transformation...', 'Success Stories', 'Grace Muthoni', true),
('The Economic Impact of Period Poverty in Kenya', 'economic-impact-period-poverty-kenya', 'Understanding how period poverty affects girls'' education and economic opportunities in Kenyan communities.', 'Period poverty has far-reaching economic consequences...', 'Research', 'David Kimani', true);

-- Insert campaigns
INSERT INTO campaigns (title, description, location, urgency, beneficiaries, linked_blog, feature_image, start_date, end_date)
VALUES
('Emergency Period Kits for Kibera', 'Providing immediate relief with emergency menstrual hygiene kits for 200 girls in Kibera slum.', 'Kibera, Nairobi', 'Urgent', 200, 1, '/placeholder.svg?height=300&width=400', '2024-07-01', '2024-08-01'),
('School Toilet Renovation Project', 'Building private, clean toilet facilities in 5 schools to ensure girls have dignified spaces.', 'Mathare, Nairobi', 'Active', 500, 2, '/placeholder.svg?height=300&width=400', '2024-09-01', '2024-12-01');
