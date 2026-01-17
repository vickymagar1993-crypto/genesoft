# Genesoft Infotech Website

A modern B2B services website built with Next.js 14, featuring Server-Side Rendering, MongoDB integration, and a comprehensive admin dashboard.

## 🚀 Features

- **Server-Side Rendering (SSR)**: Lightning-fast page loads with pre-rendered content
- **Modern Tech Stack**: Next.js 14, React 18, MongoDB, Tailwind CSS
- **Admin Dashboard**: Full-featured CMS for managing content
- **Responsive Design**: Mobile-first design with beautiful animations
- **SEO Optimized**: Meta tags, OpenGraph, and structured data
- **Google Analytics**: Integrated tracking (ID: G-EHMPVRWR62)
- **Image Optimization**: Next.js Image component with Sharp
- **API-Driven**: RESTful API with pagination support

## 📋 Requirements

- Node.js 18+ or Node.js 20+
- MongoDB 4.4+
- NPM or Yarn package manager

## 🛠️ Installation

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

Create a `.env.local` file in the root directory:

```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=genesoft_db
NODE_ENV=development
```

### 3. Start Development Server

```bash
npm run dev
```

The website will be available at `http://localhost:3000`

## 🏗️ Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```text
genesoft-main/
├── app/                    # Next.js App Router
│   ├── api/               # API routes (20+ modular endpoints)
│   ├── layout.js          # Root layout with metadata
│   └── page.js            # Homepage (SSR)
├── components/            # React components
│   ├── admin/            # Admin dashboard
│   ├── layout/           # Header, Footer, Navigation
│   ├── pages/            # Page components
│   ├── sections/         # Homepage sections
│   ├── shared/           # Reusable components
│   └── ui/               # Radix UI components
├── lib/                   # Utilities
│   └── db.js             # MongoDB connection
├── public/                # Static assets
│   └── uploads/          # User-uploaded files
└── next.config.js         # Next.js configuration
```

## 🎨 Admin Dashboard

Access the admin panel by pressing **`Ctrl + Shift + A`** on the homepage or navigating to `/admin`.

**Default Password**: Check your database `settings` collection for `adminPassword`.

### Admin Features

- **Services Management**: Add, edit, delete services
- **Client Logos**: Upload and manage client logos
- **Blog Posts**: Create and publish blog articles
- **Careers**: Post job openings and manage applicants
- **Leads Management**: View and manage contact form submissions
- **Site Settings**: Configure logos, favicon, contact info, and stats

## 🔌 API Endpoints

### Services

- `GET /api/services` - List all services
- `POST /api/services` - Create service
- `GET /api/services/[id]` - Get service by ID
- `PUT /api/services/[id]` - Update service
- `DELETE /api/services/[id]` - Delete service

### Leads (Paginated)

- `GET /api/leads?page=1&limit=20` - List leads with pagination
- `POST /api/leads` - Create lead
- `PUT /api/leads/[id]` - Update lead
- `DELETE /api/leads/[id]` - Delete lead

### Applicants (Paginated)

- `GET /api/applicants?page=1&limit=20` - List applicants with pagination
- `POST /api/applicants` - Submit application
- `PUT /api/applicants/[id]` - Update applicant status

### Settings

- `GET /api/settings` - Get site settings
- `PUT /api/settings` - Update settings (supports file uploads)

## 🚀 Deployment

See `DEPLOYMENT_GUIDE_VPS.md` and `DEPLOYMENT_GUIDE_AWS.md` for detailed deployment instructions.

## 🔧 Development Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
```

## 📦 Key Dependencies

- **next**: 14.2.35
- **react**: 18
- **mongodb**: 6.6.0
- **framer-motion**: 12.26.2
- **radix-ui**: Various UI components
- **tailwindcss**: 3.4.1
- **lucide-react**: 0.516.0

## 🎯 Performance Optimizations

- Server-Side Rendering for instant page loads
- Image optimization with Next.js Image and Sharp
- Code splitting and lazy loading
- Pagination for large datasets
- Optimized MongoDB queries

## 📝 License

Proprietary - Genesoft Infotech © 2024

## 💬 Support

For technical support or questions, contact: <info@genesoftinfotech.com>
