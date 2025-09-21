# TalentFlow Project Documentation

## 1. Project Requirements and Scope Documentation

**Project Name:** TalentFlow

**Purpose:**
TalentFlow is a modern hiring platform designed to streamline recruitment, candidate management, job postings, and assessments for organizations.

**Core Features:**
- Job posting and management
- Candidate application and tracking
- Assessment creation and submission
- Dashboard analytics
- User authentication (Recruiter & Applicant roles)
- Responsive UI/UX

**Scope:**
- Frontend SPA (Single Page Application) using React and TypeScript
- Local data storage using IndexedDB (Dexie)
- API mocking for development using Mirage JS
- Deployment on Vercel

---

## 2. Technical Documentation

**Main Technologies:**
- React (TypeScript)
- Vite (Build tool)
- Tailwind CSS (Styling)
- Dexie (IndexedDB wrapper)
- Mirage JS (API mocking)
- Vercel (Deployment)

**Key Directories:**
- `src/components/` - UI components (layout, sidebar, header, etc.)
- `src/features/` - Feature modules (jobs, candidates, assessments)
- `src/lib/` - Core libraries (auth, database, mirage)
- `src/pages/` - Page-level components

**Authentication:**
- Local authentication using Dexie for user storage
- Context-based auth provider (`src/lib/auth.tsx`)

**Data Storage:**
- Dexie manages users, jobs, candidates, assessments in IndexedDB
- Mirage JS mocks API endpoints for development

---

## 3. Tech Stack Diagram

```mermaid
flowchart TD
    A[React + TypeScript] --> B[Vite]
    A --> C[Tailwind CSS]
    A --> D[Dexie (IndexedDB)]
    A --> E[Mirage JS]
    B --> F[Vercel]
    D -->|Local Data| A
    E -->|Mock API| A
    F -->|Deployment| B
```

---

## 4. Information Architecture (IA) and UX Project Assets

**Pages:**
- Dashboard
- Jobs (List, Create, Update)
- Candidates (List, Create, Update)
- Assessments (List, Create, Update)
- Login / Signup
- Settings
- NotFound (404)

**Navigation:**
- Sidebar navigation for main features
- Header with search and user profile
- Responsive design for mobile and desktop

**UX Assets:**
- Custom UI components (cards, buttons, forms)
- Toast notifications
- Loading indicators
- Accessible forms and navigation

---

## 5. Deployment and Operations

**Deployment Platform:** Vercel

**Build & Deploy:**
- Vite build process
- Automatic deployment on push to `master` branch
- Environment variables managed via Vercel dashboard

**Operations:**
- Mirage JS only runs in development (`import.meta.env.DEV`)
- Production expects a real backend or serverless functions
- IndexedDB data is local to each browser/user

**Maintenance:**
- Update dependencies via `bun` or `npm`
- Monitor Vercel deployments for errors
- Regularly review and update UX assets

---

**Author:** ShivamKumarDubey
**Year:** 2025
