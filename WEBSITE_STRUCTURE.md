# Website Structure Guide

## 📂 Directory Architecture

```
genesoft-main/
├── app/                           # Next.js 14 App Router
│   ├── api/                       # API Routes (Backend)
│   │   ├── animations/            # Animation settings CRUD
│   │   │   ├── route.js          # GET, POST
│   │   │   └── [id]/route.js     # PUT
│   │   ├── applicants/            # Job applicants (Paginated)
│   │   │   ├── route.js          # GET (paginated), POST
│   │   │   └── [id]/route.js     # PUT
│   │   ├── auth/                  # Authentication
│   │   │   ├── check-setup/      # Initial setup check
│   │   │   ├── login/            # Admin login
│   │   │   ├── setup/            # First-time setup
│   │   │   └── update-password/  # Password updates
│   │   ├── blogs/                 # Blog management
│   │   │   ├── route.js          # GET, POST
│   │   │   └── [id]/route.js     # GET, PUT, DELETE
│   │   ├── careers/               # Job postings
│   │   │   ├── route.js          # GET, POST
│   │   │   └── [id]/route.js     # GET, PUT, DELETE
│   │   ├── clients/               # Client logos
│   │   │   ├── route.js          # GET, POST
│   │   │   └── [id]/route.js     # DELETE
│   │   ├── leads/                 # Contact leads (Paginated)
│   │   │   ├── route.js          # GET (paginated), POST
│   │   │   └── [id]/route.js     # PUT, DELETE
│   │   ├── media-kit/             # Media kit downloads
│   │   │   └── download/
│   │   ├── services/              # Services management
│   │   │   ├── route.js          # GET, POST
│   │   │   └── [id]/route.js     # GET, PUT, DELETE
│   │   ├── settings/              # Site configuration
│   │   │   └── route.js          # GET, PUT
│   │   └── stats/                 # Dashboard statistics
│   │       └── route.js          # GET
│   ├── layout.js                  # Root layout (metadata, GA, fonts)
│   ├── globals.css                # Global Tailwind styles
│   └── page.js                    # Homepage (SSR)
│
├── components/                    # React Components
│   ├── admin/                     # Admin Dashboard
│   │   └── AdminDashboard.js     # Full admin CMS (1400+ lines)
│   ├── layout/                    # Site Layout
│   │   ├── Navigation.js         # Header navigation
│   │   └── Footer.js             # Site footer
│   ├── pages/                     # Page Components
│   │   ├── BlogPage.js           # Blog listing
│   │   ├── BlogDetailPage.js     # Individual blog post
│   │   ├── ServiceDetailPage.js  # Service details
│   │   ├── CareerDetailPage.js   # Job posting details
│   │   ├── AboutPage.js          # About us page
│   │   └── ContactPage.js        # Contact form
│   ├── sections/                  # Homepage Sections
│   │   ├── HeroSection.js        # Hero banner with stats
│   │   ├── ServicesSection.js    # Services showcase
│   │   ├── ClientLogosSection.js # Client logo carousel
│   │   ├── CTASection.js         # Call-to-action
│   │   ├── ProcessSection.js     # Process steps
│   │   ├── FAQSection.js         # FAQs
│   │   └── TestimonialsSection.js # Client testimonials
│   ├── shared/                    # Reusable Components
│   │   ├── CountingNumber.js     # Animated number counter
│   │   └── Loader.js             # Loading spinner
│   ├── ui/                        # Radix UI Components
│   │   ├── button.jsx            # Button variants
│   │   ├── card.jsx              # Card layout
│   │   ├── dialog.jsx            # Modal dialogs
│   │   ├── input.jsx             # Form inputs
│   │   ├── tabs.jsx              # Tab navigation
│   │   └── ...                   # 30+ UI primitives
│   └── ClientShell.js             # Client-side navigation wrapper
│
├── lib/                           # Utilities & Helpers
│   ├── db.js                     # MongoDB connection singleton
│   └── utils.js                  # Utility functions (cn, etc.)
│
├── public/                        # Static Assets
│   ├── uploads/                  # User-uploaded content
│   │   ├── logos/                # Header & footer logos
│   │   ├── site/                 # Favicon & site assets
│   │   ├── services/             # Service images
│   │   └── mediakit/             # Media kit files
│   └── mediakit/                 # Default media kit
│
├── scripts/                       # Utility Scripts
│   └── ...                       # Database seeding, etc.
│
├── hooks/                         # Custom React Hooks
│   └── ...                       # useDebounce, etc.
│
├── database-export/               # MongoDB Schema Examples
│   └── ...                       # Collection exports
│
├── next.config.js                 # Next.js Configuration
├── tailwind.config.js             # Tailwind CSS config
├── postcss.config.js              # PostCSS config
├── jsconfig.json                  # JavaScript path aliases
├── package.json                   # Dependencies
└── ecosystem.config.js            # PM2 config for production
```

## 🔄 Data Flow

### Frontend → Backend
```
User Interaction
    ↓
React Component (e.g., ContactPage.js)
    ↓
Fetch API Call (/api/leads)
    ↓
Next.js API Route (app/api/leads/route.js)
    ↓
MongoDB Collection (via lib/db.js)
    ↓
Response to Frontend
```

### SSR Flow (Homepage)
```
User Request (GET /)
    ↓
app/page.js (Server Component)
    ↓
Fetch data from MongoDB directly
    ↓
Render HTML on server
    ↓
Send fully-rendered page to browser
    ↓
Hydrate with React on client
```

## 📊 Database Collections

### MongoDB Schema Overview

**Collections:**
- `settings` - Site configuration (logos, contact info, stats)
- `services` - Service offerings
- `clients` - Client logos and info
- `blogs` - Blog posts
- `careers` - Job postings
- `applicants` - Job applications
- `leads` - Contact form submissions
- `animations` - Homepage animation settings

### Example: Settings Document
```json
{
  "_id": ObjectId("..."),
  "id": "uuid-v4",
  "type": "general",
  "headerLogo": "/uploads/logos/header-logo-*.png",
  "footerLogo": "/uploads/logos/footer-logo-*.png",
  "favicon": "/uploads/site/favicon-*.png",
  "companyEmail": "info@genesoftinfotech.com",
  "companyPhone": "+1 (555) 123-4567",
  "companyAddress": "...",
  "adminPassword": "hashed-password",
  "foundingYear": 2021,
  "statsYearsExperience": "3+",
  "statsProjectsDelivered": "200+",
  "statsClientSatisfaction": "98%",
  "statsDataPoints": "50M+",
  "linkedinUrl": "https://...",
  "twitterUrl": "https://...",
  "mediaKitUrl": "/uploads/mediakit/...",
  "createdAt": ISODate("..."),
  "updatedAt": ISODate("...")
}
```

## 🔐 Authentication Flow

```
User presses Ctrl+Shift+A
    ↓
ClientShell.js triggers admin modal
    ↓
User enters password
    ↓
POST /api/auth/login { password: "..." }
    ↓
API checks settings.adminPassword
    ↓
Returns { success: true, token: "..." }
    ↓
AdminDashboard.js renders
```

## 🎨 Styling Architecture

### Tailwind CSS + Radix UI
- **Base Styles**: `app/globals.css`
- **Component Styles**: Inline Tailwind classes
- **UI Primitives**: Radix UI (headless, accessible)
- **Animations**: Framer Motion + Tailwind Animate

### Theme Configuration
`tailwind.config.js` defines:
- Custom colors (orange primary, blue-gray)
- Typography scales
- Container queries
- Animation keyframes

## 📱 Responsive Design

**Breakpoints:**
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

All components use mobile-first design.

## 🚀 Performance Features

1. **Server-Side Rendering**: Homepage pre-rendered on server
2. **Image Optimization**: Next.js Image with Sharp library
3. **Code Splitting**: Automatic route-based splitting
4. **Pagination**: API responses limited to 20 items per page
5. **Lazy Loading**: Components loaded on demand
6. **Caching**: MongoDB connection pooling

## 🔧 Key Technologies

- **Framework**: Next.js 14 (App Router)
- **Language**: JavaScript (React 18)
- **Database**: MongoDB
- **Styling**: Tailwind CSS 3.4
- **UI Components**: Radix UI
- **Animations**: Framer Motion, GSAP
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod

## 📝 File Naming Conventions

- **Components**: PascalCase (e.g., `HeroSection.js`)
- **Pages**: PascalCase with Page suffix (e.g., `BlogPage.js`)
- **API Routes**: kebab-case folders (e.g., `media-kit/`)
- **Utilities**: camelCase (e.g., `db.js`)
- **Routes**: lowercase `route.js` for API endpoints

## 🌐 Client vs Server Components

**Server Components (default):**
- `app/page.js` - Homepage
- API routes (all)

**Client Components ("use client"):**
- All components in `components/` directory
- Admin dashboard
- Interactive forms
- Animations

---

**Last Updated**: January 2026
**Architecture Version**: 2.0 (Post-Refactor)
