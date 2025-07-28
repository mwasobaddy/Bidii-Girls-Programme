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
