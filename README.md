# Prospector OS | Lead Intel Engine

![Prospector OS Banner](https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6)

## 🎯 Project Overview

**Prospector OS** is a high-fidelity AI prospecting and lead intelligence system designed for agencies and sales teams. This powerful platform combines AI-powered lead discovery, scoring diagnostics, strategic planning, and outreach management into a unified operating system.

### Key Features

✅ **Lead Intelligence Engine** - Comprehensive lead discovery and scoring system  
✅ **AI-Powered Analytics** - Deep diagnostics with visual, social, and ticket scoring  
✅ **Strategic Planning** - Automated angle identification and personalized hooks  
✅ **Mission Management** - Track leads through SCAN → SCORE → STRATEGIZE → SEND → CLOSE phases  
✅ **Asset Vault** - Centralized media and proposal management  
✅ **Proposal Studio** - Generate and track client proposals  
✅ **Cloudflare D1 Database** - Persistent, globally distributed data storage  
✅ **RESTful API** - Full CRUD operations for leads, assets, and proposals

---

## 🌐 Live Deployment

### Public URLs

- **API Backend**: https://3000-i0cpklycmklcu6n1lnlbc-de59bda9.sandbox.novita.ai
- **Health Check**: https://3000-i0cpklycmklcu6n1lnlbc-de59bda9.sandbox.novita.ai/api/health
- **Leads API**: https://3000-i0cpklycmklcu6n1lnlbc-de59bda9.sandbox.novita.ai/api/leads

### Test the API

```bash
# Health check
curl https://3000-i0cpklycmklcu6n1lnlbc-de59bda9.sandbox.novita.ai/api/health

# Get all leads
curl https://3000-i0cpklycmklcu6n1lnlbc-de59bda9.sandbox.novita.ai/api/leads

# Get specific lead
curl https://3000-i0cpklycmklcu6n1lnlbc-de59bda9.sandbox.novita.ai/api/leads/1
```

---

## 📊 Data Architecture

### Database Schema

The application uses **Cloudflare D1** (SQLite-based) for persistent data storage with three main tables:

#### 1. **Leads Table** - Core lead intelligence data
```sql
- Identity Layer: businessName, websiteUrl, niche, contact info
- Diagnostics Layer: visualScore, socialScore, ticketScore, reachabilityScore
- Strategics Layer: bestAngle, personalizedHook, firstDeliverable
- Mission Layer: currentPhase, status, conversionProbability
```

#### 2. **Assets Table** - Media vault management
```sql
- id, url, title, type (pitch/lab/external/image/report/mockup/sonic/product)
- timestamp, content
```

#### 3. **Proposals Table** - Proposal tracking
```sql
- id, leadName, niche, pitchText, mockupUrl, videoUrl
- timestamp, status (pending/viewed/accepted)
```

### Data Flow

```
React Frontend (Local Storage) 
    ↓
Migration to Cloudflare D1
    ↓
Hono REST API (CRUD Operations)
    ↓
Globally Distributed D1 Database
```

---

## 🛠️ Tech Stack

### Backend
- **Framework**: Hono 4.0+ (Lightweight, fast web framework)
- **Runtime**: Cloudflare Workers (Edge computing)
- **Database**: Cloudflare D1 (Globally distributed SQLite)
- **Language**: TypeScript 5.8+
- **Build Tool**: Vite 6.2+ with @hono/vite-cloudflare-pages plugin

### Frontend (Original)
- **Framework**: React 19.2+
- **AI Integration**: Google Gemini AI API (@google/genai)
- **Styling**: TailwindCSS (CDN)
- **Fonts**: Inter & JetBrains Mono (Google Fonts)

### DevOps
- **Package Manager**: npm
- **Process Manager**: PM2 (development)
- **Deployment**: Wrangler CLI → Cloudflare Pages
- **Version Control**: Git

---

## 📋 API Reference

### Leads Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/leads` | Get all leads |
| GET | `/api/leads/:rank` | Get specific lead by rank |
| POST | `/api/leads` | Create new lead |
| PUT | `/api/leads/:rank` | Update lead |
| DELETE | `/api/leads/:rank` | Delete lead |

### Assets Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/assets` | Get all assets |
| POST | `/api/assets` | Create new asset |
| DELETE | `/api/assets/:id` | Delete asset |

### Proposals Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/proposals` | Get all proposals |
| POST | `/api/proposals` | Create new proposal |
| DELETE | `/api/proposals/:id` | Delete proposal |

### System Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/` | API documentation page |

---

## 🚀 Development Guide

### Prerequisites
- Node.js 20+ 
- npm 10+
- Git

### Installation

```bash
# Clone or extract project
cd /home/user/webapp

# Install dependencies
npm install

# Configure environment variables
cp .env.local.example .env.local
# Add your GEMINI_API_KEY=your_key_here
```

### Database Setup

```bash
# Apply migrations locally
npm run db:migrate:local

# Seed with sample data
npm run db:seed

# Reset database (clear and re-seed)
npm run db:reset

# Query local database
npm run db:console:local
```

### Development Workflow

```bash
# Build the project
npm run build

# Start development server with PM2
pm2 start ecosystem.config.cjs

# Test the API
npm run test

# Check logs
pm2 logs prospector-os --nostream

# Restart server
pm2 restart prospector-os

# Stop server
pm2 stop prospector-os
```

### Available Scripts

```json
{
  "dev": "vite",
  "dev:sandbox": "wrangler pages dev dist --d1=webapp-production --local --ip 0.0.0.0 --port 3000",
  "build": "vite build",
  "deploy": "npm run build && wrangler pages deploy dist",
  "deploy:prod": "npm run build && wrangler pages deploy dist --project-name webapp",
  "db:migrate:local": "wrangler d1 migrations apply webapp-production --local",
  "db:migrate:prod": "wrangler d1 migrations apply webapp-production",
  "db:seed": "wrangler d1 execute webapp-production --local --file=./seed.sql",
  "db:reset": "rm -rf .wrangler/state/v3/d1 && npm run db:migrate:local && npm run db:seed"
}
```

---

## 🌍 Production Deployment

### Prerequisites
1. Cloudflare account
2. Wrangler CLI configured
3. D1 database created

### Deployment Steps

```bash
# 1. Create production D1 database
npx wrangler d1 create webapp-production

# 2. Update wrangler.jsonc with database_id
# Copy the database_id from step 1

# 3. Apply migrations to production
npm run db:migrate:prod

# 4. Build and deploy
npm run deploy:prod
```

### Post-Deployment

```bash
# Set production environment variables
npx wrangler pages secret put GEMINI_API_KEY --project-name webapp

# Verify deployment
curl https://your-project.pages.dev/api/health
```

---

## 📂 Project Structure

```
webapp/
├── src/
│   └── index.tsx          # Hono backend API server
├── migrations/
│   └── 0001_initial_schema.sql  # D1 database schema
├── public/                # Frontend React components (original)
│   ├── App.tsx
│   ├── components/        # 60+ React components
│   ├── types.ts
│   └── utils/
├── dist/                  # Build output directory
│   ├── _worker.js         # Compiled Hono worker
│   └── _routes.json       # Cloudflare Pages routing
├── .git/                  # Git repository
├── .gitignore             # Git ignore patterns
├── .dev.vars              # Local environment variables
├── ecosystem.config.cjs   # PM2 configuration
├── wrangler.jsonc         # Cloudflare configuration
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── vite.config.ts         # Vite build configuration
├── seed.sql               # Sample test data
└── README.md              # This file
```

---

## ✅ Currently Completed Features

### Backend Infrastructure ✅
- [x] Hono REST API with TypeScript
- [x] Cloudflare D1 database integration
- [x] Complete CRUD operations for leads
- [x] Complete CRUD operations for assets
- [x] Complete CRUD operations for proposals
- [x] Database migrations and seeding
- [x] Local development environment with PM2
- [x] API documentation page

### Data Models ✅
- [x] Lead entity (identity + diagnostics + strategics + mission)
- [x] Asset entity (media vault)
- [x] Proposal entity (pitch tracking)
- [x] Database indexes for performance
- [x] Sample test data (3 leads, 3 assets, 2 proposals)

### Development Tools ✅
- [x] Git version control
- [x] Comprehensive .gitignore
- [x] PM2 process management
- [x] Environment variable configuration
- [x] Build and deployment scripts

---

## 🚧 Features Not Yet Implemented

### Frontend Integration 🔨
- [ ] Connect React components to REST API
- [ ] Replace localStorage with API calls
- [ ] Update state management for async operations
- [ ] Implement error handling and loading states
- [ ] Add authentication/authorization

### AI Features 🤖
- [ ] Gemini AI integration for lead scoring
- [ ] Automated best angle detection
- [ ] Personalized hook generation
- [ ] Brand kit extraction from websites
- [ ] Voice and vision intelligence agents

### Advanced Functionality 🚀
- [ ] Real-time mission tracking
- [ ] Outreach template system
- [ ] Email/WhatsApp integration
- [ ] Proposal PDF generation
- [ ] Analytics dashboard
- [ ] Export functionality (CSV/PDF)

### Production Features 🔐
- [ ] User authentication
- [ ] Multi-tenancy support
- [ ] Rate limiting
- [ ] Caching layer
- [ ] Monitoring and logging
- [ ] Backup and recovery

---

## 🎯 Recommended Next Steps

### Phase 1: Frontend Connection (High Priority)
1. **Create API service layer** - Centralized fetch wrappers for all API calls
2. **Update App.tsx** - Replace localStorage hooks with API calls
3. **Add loading states** - Implement spinners and skeleton screens
4. **Error handling** - Toast notifications for API errors
5. **Testing** - Verify all CRUD operations work end-to-end

### Phase 2: AI Integration (Medium Priority)
6. **Gemini API proxy** - Create backend endpoint to call Gemini API
7. **Lead scoring automation** - AI-powered diagnostics
8. **Hook generation** - AI-generated personalized messaging
9. **Vision intelligence** - Website screenshot analysis

### Phase 3: Production Readiness (Medium Priority)
10. **Authentication** - Add user login system
11. **Deploy to Cloudflare Pages** - Production deployment
12. **Custom domain** - Set up professional domain
13. **Monitoring** - Add error tracking and analytics

### Phase 4: Advanced Features (Low Priority)
14. **Email integration** - Automated outreach
15. **Calendar integration** - Mission scheduling
16. **Export functionality** - PDF reports and CSV exports
17. **Team collaboration** - Multi-user support

---

## 📖 User Guide

### Getting Started

1. **Access the API**: Navigate to the public URL
2. **Test health check**: `GET /api/health`
3. **View leads**: `GET /api/leads`
4. **Create a lead**: `POST /api/leads` with lead data
5. **Update lead**: `PUT /api/leads/:rank` with updated data
6. **Delete lead**: `DELETE /api/leads/:rank`

### Lead Management Workflow

```
1. SCAN → Discover potential leads
2. SCORE → Analyze and rate leads
3. STRATEGIZE → Plan approach and hooks
4. SEND → Execute outreach campaign
5. CLOSE → Convert to customer
```

### Mission Phases

- **SCAN**: Initial lead discovery
- **SCORE**: Diagnostic scoring (visual, social, ticket, reachability)
- **STRATEGIZE**: Strategic planning (angle, hook, deliverable)
- **SEND**: Outreach execution
- **CLOSE**: Deal closure

### Asset Grades

- **A Grade**: High-value, high-engagement leads
- **B Grade**: Medium-value prospects
- **C Grade**: Low-priority or nurture leads

---

## 🔒 Environment Variables

```bash
# .dev.vars (local development)
GEMINI_API_KEY=your_gemini_api_key_here

# Production (set via wrangler)
npx wrangler pages secret put GEMINI_API_KEY --project-name webapp
```

---

## 🐛 Troubleshooting

### Port 3000 in use
```bash
npm run clean-port
# or
fuser -k 3000/tcp
```

### Database issues
```bash
npm run db:reset
```

### PM2 not starting
```bash
pm2 delete all
pm2 start ecosystem.config.cjs
```

### Build errors
```bash
rm -rf node_modules dist .wrangler
npm install
npm run build
```

---

## 📝 Git Workflow

```bash
# Check status
npm run git:status

# Commit changes
npm run git:commit "Your commit message"

# View history
npm run git:log
```

---

## 📄 License

This project is part of the AI Studio ecosystem.

---

## 🤝 Contributing

This is a proprietary project. For contributions or inquiries, please contact the project maintainers.

---

## 📞 Support

For issues or questions:
- Check the API documentation at `/`
- Review the troubleshooting section
- Examine PM2 logs: `pm2 logs prospector-os`

---

**Last Updated**: 2025-12-31  
**Version**: 1.0.0  
**Status**: ✅ Backend API Active | 🔨 Frontend Integration Pending

---

Made with 💜 by the Prospector OS Team
