# VedaAI – Intelligent AI Assessment Creation Platform

> A production-grade full-stack SaaS platform for generating AI-powered educational assessments with real-time progress tracking, structured curriculum alignment, and professional-grade dashboard UX.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19%20RC-61dafb?style=flat-square&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Express](https://img.shields.io/badge/Express-4-000000?style=flat-square&logo=express)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-7-47a248?style=flat-square&logo=mongodb)](https://www.mongodb.com)
[![Redis](https://img.shields.io/badge/Redis-7-dc382d?style=flat-square&logo=redis)](https://redis.io)
[![BullMQ](https://img.shields.io/badge/BullMQ-Job%20Queue-4a7ba7?style=flat-square)](https://docs.bullmq.io)

---

## 🎯 Project Overview

VedaAI is an intelligent assessment generation platform that leverages large language models (LLMs) to help educators create comprehensive, structured exam papers with minimal manual effort. The platform combines a modern React-based frontend with a robust Node.js backend architecture, featuring asynchronous job processing, real-time WebSocket updates, and persistent state management.

### Key Problem Solved
- **Teacher Bottleneck**: Manually creating diverse, well-structured exam papers is time-consuming and error-prone
- **Curriculum Alignment**: Ensuring questions span multiple difficulty levels and learning objectives
- **Content Extraction**: Intelligently parsing educational materials to generate relevant assessments
- **Quality Consistency**: Maintaining professional question formatting and marks distribution

### Architecture Highlights
- **Scalable Job Queue**: BullMQ-powered background processing for long-running AI generation
- **Real-time Feedback**: WebSocket integration for live progress updates during assessment generation
- **Structured Output**: Intelligent parsing and formatting of AI responses into consumable assessment structures
- **Production SaaS UX**: Figma-designed dashboard with responsive layouts and polished micro-interactions

---

## ✨ Features

### Core Features
- **Assignment Creation**: Form-driven interface for defining assessment scope and parameters
- **PDF/Text Extraction**: Intelligent document parsing to extract learning materials
- **Question Generation**: AI-powered question synthesis with structured metadata
- **Difficulty Tagging**: Automatic classification of questions by cognitive level (Easy/Medium/Hard)
- **Marks Distribution**: Algorithmic distribution of marks based on difficulty and question count
- **Question Sections**: Logical grouping of questions with section-level metadata
- **PDF Export**: Generation of professionally formatted exam papers with answer keys

### Backend Architecture
- **Job Queue System**: BullMQ with Redis for reliable background processing
- **Redis Caching**: Multi-layer caching for API responses and computation results
- **MongoDB Persistence**: Document-based storage for flexible schema evolution
- **WebSocket Broadcasting**: Real-time bidirectional communication with status updates
- **Worker Pool**: Distributed job processing with failure recovery and retry logic
- **Structured Logging**: Comprehensive operation tracking for debugging and monitoring

### UI/UX Features
- **Responsive Dashboard**: Mobile-first design with tablet and desktop optimization
- **Modern SaaS Design**: Clean, professional interface aligned with contemporary product standards
- **Figma-Accurate Implementation**: Pixel-perfect adherence to design specifications
- **Loading States & Spinners**: Smooth loading indicators and state transitions
- **Micro-interactions**: Button hover effects, sidebar transitions, and modal animations
- **Professional Interactions**: Polished user flows across assignment creation, viewing, and management
- **Real-time Progress Tracking**: Visual feedback during generation with live status updates

### Additional Enhancements
- **AI Teacher Toolkit**: Collection of supplementary AI-powered tools
  - Quiz Generator: Quick assessment creation
  - Question Difficulty Analyzer: Performance metrics and recommendations
  - Rubric Generator: Automated grading criteria creation
- **Group Management**: Dashboard for viewing and organizing student groups
- **Settings & Preferences**: User configuration and notification management
- **Search & Filtering**: Efficient assignment discovery across the dashboard

---

## 🏗️ Architecture Overview

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│         Frontend Layer (Next.js + React 19)             │
│  ├─ Dashboard (Assignments List)                        │
│  ├─ Create Flow (Form + File Upload)                    │
│  ├─ Assignment Details (Progress + PDF Viewer)          │
│  ├─ Groups Page (Team Management)                       │
│  ├─ AI Toolkit (Supplementary Tools)                    │
│  └─ Settings Modal (Preferences)                        │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP REST API + WebSocket
                     ↓
┌─────────────────────────────────────────────────────────┐
│       Backend Layer (Express + TypeScript)              │
│  ├─ API Controllers (Business Logic)                    │
│  ├─ Services Layer                                      │
│  │  ├─ AI Service (LLM Orchestration)                   │
│  │  ├─ Assignment Service                               │
│  │  └─ Text Extraction Service                          │
│  ├─ Queue Dispatcher (Job Enqueuing)                    │
│  └─ WebSocket Handler (Real-time Updates)              │
└────────┬─────────────────────┬────────────────────────┘
         │                     │
         ↓                     ↓
    ┌─────────────┐      ┌──────────────┐
    │  MongoDB    │      │  Redis       │
    │  (Primary   │      │  (Cache +    │
    │  Storage)   │      │   Queue)     │
    └─────────────┘      └──────────────┘
                              ↑
                              │ Job Processing
                              ↓
                     ┌─────────────────────┐
                     │  Worker Pool        │
                     │  (BullMQ Processor) │
                     │  ├─ Question Gen    │
                     │  ├─ Parsing         │
                     │  └─ PDF Creation    │
                     └─────────────────────┘
```

### Data Flow: Assignment Generation Pipeline

```
1. User Submission
   ├─ Assignment form validation
   └─ File upload to backend

2. Job Enqueuing
   ├─ Create MongoDB document
   ├─ Queue job in BullMQ
   └─ Return assignment ID

3. Real-time Updates
   ├─ WebSocket connection established
   └─ Frontend listens for `assignment:update` events

4. Background Processing
   ├─ Worker fetches job from queue
   ├─ Extract text from uploaded file
   ├─ Call AI service with structured prompt
   ├─ Parse AI response into questions
   ├─ Generate PDF with formatted content
   └─ Update MongoDB with completion status

5. Result Delivery
   ├─ Emit WebSocket event with final data
   └─ Frontend updates UI and displays results
```

---

## 🤖 AI Processing Pipeline

### Prompt Engineering & Structuring

The system employs a multi-stage prompt orchestration approach to ensure consistent, high-quality output:

1. **Context Preparation**
   - Extract curriculum standards from metadata
   - Analyze source material complexity
   - Determine learning objectives alignment

2. **Prompt Composition**
   - Base template with system instructions
   - Dynamic insertion of learning objectives
   - Question count and difficulty distribution parameters
   - Format specification and constraints

3. **Response Parsing**
   - Structured JSON parsing of AI output
   - Validation against schema constraints
   - Fallback handling for malformed responses

4. **Question Processing**
   - Difficulty classification (Easy/Medium/Hard)
   - Marks calculation based on cognitive level
   - Section grouping and categorization
   - Answer key extraction and formatting

5. **Output Generation**
   - Section-wise organization
   - PDF rendering with professional formatting
   - Answer key compilation
   - Metadata persistence

### Quality Assurance

- **Schema Validation**: Questions validated against strict TypeScript interfaces
- **Difficulty Distribution**: Algorithmic verification of difficulty balance
- **Marks Consistency**: Automatic recalculation to ensure total equals expected sum
- **Content Filtering**: Inappropriate content detection and removal
- **Duplication Detection**: Prevents identical or near-duplicate questions

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose | Version |
|-----------|---------|---------|
| **Next.js** | React framework with file-based routing | 15 |
| **React** | UI library | 19 RC |
| **TypeScript** | Type-safe JavaScript | 5 |
| **Tailwind CSS** | Utility-first styling framework | 4 |
| **Zustand** | Lightweight state management | Latest |
| **React Hook Form** | Form state management | Latest |
| **Zod** | Schema validation | Latest |
| **Lucide React** | Icon library | Latest |
| **Socket.io** | Real-time bidirectional communication | Latest |

### Backend
| Technology | Purpose | Version |
|-----------|---------|---------|
| **Node.js** | JavaScript runtime | 18+ |
| **Express** | Web application framework | 4.18+ |
| **TypeScript** | Type-safe JavaScript | 5 |
| **MongoDB** | NoSQL document database | 7 |
| **Redis** | In-memory cache and message broker | 7 |
| **BullMQ** | Job queue built on Redis | Latest |
| **Socket.io** | Real-time communication | Latest |
| **Mongoose** | MongoDB object modeling | Latest |

### AI & Processing
| Technology | Purpose |
|-----------|---------|
| **Google Gemini API** | Primary LLM for question generation |
| **OpenAI API** | Fallback LLM provider |
| **PDFKit** | PDF document generation |
| **pdf-parse** | PDF text extraction |
| **Text Extraction** | NLP-based document parsing |

---

## 📋 Folder Structure

```
VedaAI/
├── frontend/                          # Next.js client application
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx              # Dashboard (assignments list)
│   │   │   ├── layout.tsx            # Root layout with providers
│   │   │   ├── globals.css           # Global Tailwind styles
│   │   │   ├── create/
│   │   │   │   └── page.tsx          # Create assignment form
│   │   │   ├── assignment/
│   │   │   │   └── [id]/page.tsx     # Assignment details & progress
│   │   │   ├── groups/
│   │   │   │   └── page.tsx          # Group management
│   │   │   ├── toolkit/
│   │   │   │   └── page.tsx          # AI toolkit features
│   │   │   └── fonts/                # Custom font files
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Sidebar.tsx       # Desktop navigation
│   │   │   │   ├── MobileNav.tsx     # Mobile header & bottom nav
│   │   │   │   └── TopNav.tsx        # Top navigation bar
│   │   │   ├── ui/
│   │   │   │   ├── EmptyState.tsx    # Empty state placeholder
│   │   │   │   ├── ExamPDF.tsx       # PDF viewer component
│   │   │   │   ├── QuestionPaperDisplay.tsx  # Question display
│   │   │   │   ├── ProgressIndicator.tsx    # Progress visualization
│   │   │   │   ├── AssignmentMenu.tsx       # Assignment actions menu
│   │   │   │   ├── NotificationsDropdown.tsx
│   │   │   │   ├── ProfileModal.tsx
│   │   │   │   └── SettingsModal.tsx
│   │   ├── services/
│   │   │   ├── api.ts               # HTTP API client with typed methods
│   │   │   └── socket.ts            # WebSocket client wrapper
│   │   └── store/
│   │       └── assignmentStore.ts   # Zustand store for assignments
│   ├── public/
│   │   ├── logo.svg                # Full logo (icon + text)
│   │   └── logo-icon.svg           # Icon-only logo
│   ├── tailwind.config.ts          # Tailwind customization
│   ├── next.config.ts              # Next.js configuration
│   ├── tsconfig.json               # TypeScript config
│   ├── postcss.config.mjs          # PostCSS config
│   └── package.json

├── backend/                           # Express backend application
│   ├── src/
│   │   ├── server.ts               # Express app initialization
│   │   ├── config/
│   │   │   ├── db.ts              # MongoDB connection
│   │   │   └── redis.ts           # Redis client setup
│   │   ├── models/
│   │   │   ├── Assignment.ts       # Assignment schema & type
│   │   │   └── QuestionPaper.ts    # Question paper schema
│   │   ├── routes/
│   │   │   └── assignmentRoutes.ts # API route definitions
│   │   ├── controllers/
│   │   │   └── assignmentController.ts  # Request handlers
│   │   ├── services/
│   │   │   ├── aiService.ts        # LLM orchestration & prompting
│   │   │   ├── assignmentService.ts # Business logic
│   │   │   └── textExtractor.ts    # PDF & text parsing
│   │   ├── workers/
│   │   │   └── generationWorker.ts # Job processing logic
│   │   ├── queues/
│   │   │   └── generationQueue.ts  # BullMQ queue setup
│   │   └── sockets/
│   │       └── socketServer.ts     # WebSocket event handlers
│   ├── .env.example                # Environment variable template
│   ├── tsconfig.json               # TypeScript configuration
│   ├── package.json                # Dependencies & scripts
│   └── dist/                       # Compiled JavaScript output

├── docs/                             # Documentation
│   ├── GETTING_STARTED.md
│   ├── API_REFERENCE.md
│   ├── IMPLEMENTATION_CHECKLIST.md
│   └── TESTING_GUIDE.md

├── README.md                        # This file
├── package.json                     # Root package.json
├── setup.sh                         # Linux/Mac setup script
└── setup.bat                        # Windows setup script
```

---

## 🚀 Setup Instructions

### Prerequisites

Ensure the following are installed on your system:

- **Node.js** v18 or higher ([download](https://nodejs.org))
- **npm** or **yarn** package manager
- **MongoDB** v7 or higher ([installation guide](https://docs.mongodb.com/manual/installation/))
- **Redis** v7 or higher ([installation guide](https://redis.io/download))
- **Git** for version control

### API Keys Required

- **Google Gemini API Key** ([get here](https://aistudio.google.com/app/apikey))
- **OpenAI API Key** (optional, for fallback) ([get here](https://platform.openai.com/api-keys))

### Step 1: Clone & Install Dependencies

```bash
# Clone the repository
git clone <repository-url>
cd AI\ Assessment\ Creator

# Install root dependencies (if applicable)
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Return to root
cd ..
```

### Step 2: Configure Backend Environment

```bash
cd backend

# Create .env file
cp .env.example .env

# Edit .env with your configuration
# Windows: notepad .env
# macOS/Linux: nano .env
```

**Required .env variables:**

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/vedaai

# Cache & Queue
REDIS_URL=redis://localhost:6379

# AI Services
GEMINI_API_KEY=your_gemini_api_key_here
OPENAI_API_KEY=your_openai_api_key_here (optional)

# CORS & Frontend
FRONTEND_URL=http://localhost:3000
```

### Step 3: Start Database Services

```bash
# MongoDB (on another terminal/tab)
mongod

# Redis (on another terminal/tab)
redis-server
```

**For production/Docker deployment**, use managed services (MongoDB Atlas, Redis Cloud).

### Step 4: Start Backend Server

```bash
cd backend

# Development mode with hot reload
npm run dev

# Production build
npm run build
npm start
```

Expected output:
```
✅ MongoDB connected
✅ Redis connected
✅ WebSocket server initialized
🚀 Server running at http://localhost:5000
```

### Step 5: Configure Frontend Environment

```bash
cd frontend

# Create .env.local file
cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
EOF
```

### Step 6: Start Frontend Development Server

```bash
cd frontend

# Development mode
npm run dev

# Production build
npm run build
npm start
```

Expected output:
```
✅ Ready in 1.23s
✅ Local:        http://localhost:3000
```

### Step 7: Verification

1. **Open browser** and navigate to `http://localhost:3000`
2. **Check backend health**:
   ```bash
   curl http://localhost:5000/health
   ```
   Expected response: `{"status":"ok"}`

3. **Test assignment creation**:
   - Click "Create Assignment"
   - Fill in assignment details
   - Upload a PDF or text file
   - Monitor progress updates in real-time

---

## 🔍 Key Technical Decisions

### 1. Job Queue Architecture (BullMQ)

**Why**: LLM API calls and PDF generation are I/O intensive and unpredictable in duration.

**Solution**: Asynchronous job queue decouples user requests from processing:
- Immediate response to user (assignment created)
- Background worker processes job
- Real-time WebSocket updates track progress
- Failed jobs automatically retry with exponential backoff

**Trade-offs**:
- ✅ Horizontal scalability (multiple worker processes)
- ✅ Better UX (no request timeouts)
- ✅ Failure resilience
- ⚠️ Added complexity (queue monitoring, job persistence)

### 2. WebSocket Real-time Updates

**Why**: Users need live feedback during potentially long-running generation.

**Solution**: Socket.io bidirectional communication for status updates.

**Implementation**:
- Frontend connects to WebSocket on mount
- Backend emits `assignment:update` events as job progresses
- Frontend updates UI reactively (Zustand store)
- Connection automatically reconnects on disconnect

### 3. Structured AI Output Parsing

**Why**: LLM responses are often unstructured and inconsistent.

**Solution**: Strict JSON schema in prompt + validation + fallback parsing:

```typescript
// Expected AI response structure
{
  "sections": [
    {
      "name": "Mathematics",
      "questions": [
        {
          "text": "...",
          "difficulty": "medium",
          "marks": 5,
          "answer": "..."
        }
      ]
    }
  ]
}
```

**Advantages**:
- Predictable output structure
- Type-safe parsing with Zod
- Easier PDF generation
- Better testing coverage

### 4. MongoDB Document Schema

**Why**: Flexible schema accommodates evolving question formats and metadata.

**Benefits**:
- Add new question types without migrations
- Store arbitrary metadata per assignment
- Natural JSON/BSON serialization
- Scales horizontally with sharding

### 5. Frontend State Management (Zustand)

**Why**: Keep state management lightweight while supporting real-time updates.

**vs Redux**: Simpler API, smaller bundle, sufficient for this scope
**vs Context**: Better performance with selective subscriptions

---

## 📊 Real-time Architecture

### WebSocket Event Flow

```
Frontend                          Backend
   │                                 │
   ├─ Connect Socket────────────────►│
   │                                 │
   ├─ Create Assignment──────────────►│ (HTTP POST)
   │                    Job Enqueued  │
   │◄─────────── 201 + Assignment ID  │
   │                                 │
   │   Background Processing Starts   │
   │                                 │
   │◄─ assignment:update ─────────────┤ (Status: extracting_text)
   │   {progress: 20%}                │
   │                                 │
   │◄─ assignment:update ─────────────┤ (Status: generating_questions)
   │   {progress: 50%}                │
   │                                 │
   │◄─ assignment:update ─────────────┤ (Status: creating_pdf)
   │   {progress: 80%}                │
   │                                 │
   │◄─ assignment:complete ──────────┤ (Status: completed)
   │   {questions, pdf, metadata}     │
   │                                 │
   ├─ Display Results ──────────────►│
   │                                 │
```

---

## 🎯 Challenges Faced & Solutions

### Challenge 1: Figma Design Accuracy
**Problem**: Exact pixel-perfect implementation of Figma designs across responsive breakpoints
**Solution**: 
- Extracted design tokens (colors, spacing, typography) into Tailwind config
- Built reusable component library matching Figma specs
- Validated UI against design at key breakpoints (mobile, tablet, desktop)

### Challenge 2: State Management for Real-time Updates
**Problem**: Frontend state updates from WebSocket events + user interactions
**Solution**:
- Zustand store with action creators for state mutations
- WebSocket integration in custom hooks
- Optimistic UI updates with server reconciliation

### Challenge 3: AI Output Consistency
**Problem**: LLM responses vary wildly in format and quality
**Solution**:
- Structured JSON schema in prompts
- Schema validation with Zod
- Retry logic with temperature adjustment
- Fallback formatting for edge cases

### Challenge 4: Queue Job Reliability
**Problem**: Job failures (network issues, API quota, memory) must not lose user work
**Solution**:
- BullMQ automatic retries with exponential backoff
- Job persistence in Redis
- Failed job recovery with detailed error logs
- Partial result caching for retry efficiency

### Challenge 5: Responsive Layout Complexity
**Problem**: Desktop sidebar layout breaks on mobile; need bottom nav instead
**Solution**:
- Conditional rendering based on screen size (md: breakpoint)
- Separate MobileNav and Sidebar components
- Shared navigation logic in layout wrapper
- CSS Grid for adaptive column layout

### Challenge 6: PDF Generation Performance
**Problem**: Large question sets cause slow PDF generation
**Solution**:
- Chunked processing (questions batched per page)
- Async rendering with progress callback
- Client-side caching of generated PDFs
- Background generation during low-traffic periods

### Challenge 7: Database Query Optimization
**Problem**: N+1 query problem when fetching assignments with related data
**Solution**:
- Mongoose population for related documents
- Indexed queries on frequently filtered fields
- Aggregation pipeline for complex filtering
- Redis caching of frequently accessed assignments

---

## 🚀 Performance Optimizations

### Frontend
- **Code Splitting**: Lazy load toolkit and groups pages
- **Image Optimization**: SVG logos optimized, next/image for responsive images
- **Bundle Analysis**: Monitored with next/bundle-analyzer
- **Tailwind Purging**: Only unused utilities removed in production

### Backend
- **Connection Pooling**: MongoDB and Redis connection reuse
- **Query Optimization**: Indexed lookups, aggregation pipelines
- **Caching Strategy**: Redis cache with 15-min TTL for assignments
- **Worker Scaling**: Multiple BullMQ workers on CPU cores

### Network
- **Compression**: Gzip for API responses
- **Asset Hashing**: Immutable content-hashing for browser caching
- **WebSocket Batching**: Group updates into single broadcast
- **HTTP/2 Server Push**: Push critical assets

---

## 📈 Future Improvements & Roadmap

### Phase 2: Enhanced AI Capabilities
- [ ] **Multi-LLM Support**: Load balancing across multiple providers
- [ ] **Custom AI Models**: Fine-tuned models for subject-specific question generation
- [ ] **Difficulty Prediction**: ML model to predict question difficulty before generation
- [ ] **Plagiarism Detection**: Check questions against existing databases

### Phase 3: Collaborative Features
- [ ] **Teacher Collaboration**: Real-time co-editing of assignments
- [ ] **Version Control**: Assignment revision history and rollback
- [ ] **Team Permissions**: Role-based access control (admin, teacher, reviewer)
- [ ] **Approval Workflows**: Question review and approval processes

### Phase 4: Analytics & Insights
- [ ] **Question Analytics**: Track question performance across student cohorts
- [ ] **Difficulty Calibration**: Learn from student performance to improve difficulty tagging
- [ ] **Usage Analytics**: Dashboard with creation trends and popular topics
- [ ] **Predictive Analytics**: Recommend next assignment topics based on curriculum progress

### Phase 5: Export & Integration
- [ ] **Multiple Export Formats**: Word, Google Docs, Notion integration
- [ ] **LMS Integration**: Canvas, Blackboard, Schoology connectors
- [ ] **Print-Ready Formats**: Optimized PDF for printing
- [ ] **Markdown Export**: For online platforms

### Phase 6: Advanced Content Generation
- [ ] **Video Question Generation**: Auto-create video explanations for answers
- [ ] **Case Study Generator**: Create multi-part scenario-based questions
- [ ] **Answer Key Generation**: Detailed solution steps for each question
- [ ] **Rubric Auto-Generation**: Comprehensive grading rubrics from questions

### Phase 7: Mobile Applications
- [ ] **iOS/Android App**: Native mobile experience
- [ ] **Offline Support**: Generate assignments offline, sync when online
- [ ] **Mobile Question Review**: Approve/reject questions on mobile
- [ ] **Student App**: Track assignment distribution and student progress

---

## 📸 Screenshots

### Dashboard
![Dashboard](/docs/screenshots/dashboard.png)
*Main assignments dashboard showing list of created assignments with real-time sync*

### Create Assignment
![Create Assignment](/docs/screenshots/create.png)
*Assignment creation form with file upload and configuration options*

### Real-time Progress
![Progress Tracking](/docs/screenshots/progress.png)
*Live progress updates during AI question generation and PDF creation*

### Generated Assessment
![Generated Assessment](/docs/screenshots/assessment.png)
*Rendered question paper with organized sections and formatted questions*

### Mobile Responsive
![Mobile View](/docs/screenshots/mobile.png)
*Responsive mobile interface with bottom navigation*

### Groups Management
![Groups](/docs/screenshots/groups.png)
*Group management interface with student counts and progress indicators*

### AI Toolkit
![AI Toolkit](/docs/screenshots/toolkit.png)
*Supplementary AI tools for quiz generation and question analysis*

---

## 🤝 Contributing

This project is part of a hiring assignment. Architecture, design decisions, and implementation patterns follow production SaaS standards.

**Code Quality Standards**:
- TypeScript strict mode enabled
- ESLint and Prettier for consistency
- Component composition and prop interfaces documented
- Test coverage for critical paths (60%+ target)

---

## 📝 License

This project is provided for assessment and demonstration purposes.

---

## 👤 Author

**VedaAI Assessment Implementation**

A production-grade full-stack application demonstrating:
- Modern React/Next.js frontend architecture
- Scalable Node.js backend with job queues
- Real-time WebSocket integration
- LLM integration and prompt engineering
- Production-quality UX/UI implementation

---

## 🔗 Resources & References

### Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [Express.js Guide](https://expressjs.com)
- [MongoDB Manual](https://docs.mongodb.com/manual)
- [Redis Documentation](https://redis.io/documentation)
- [BullMQ Documentation](https://docs.bullmq.io)

### AI & LLM
- [Google Gemini API](https://ai.google.dev)
- [OpenAI API Reference](https://platform.openai.com/docs)
- [Prompt Engineering Guide](https://platform.openai.com/docs/guides/prompt-engineering)

### Tools & Services
- [Figma Design System](https://www.figma.com)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

---

**Last Updated**: May 2026  
**Version**: 1.0.0  
**Status**: Production Ready
