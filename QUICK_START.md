# 🚀 Quick Start Guide - VedaAI Assessment Creator

Get your AI Assessment Creator running in **5 minutes**!

## What You Have

A complete, production-ready full-stack application with:
- ✅ Next.js + React frontend with real-time updates
- ✅ Express.js + Node.js backend with AI integration  
- ✅ MongoDB + Redis with fallbacks
- ✅ WebSocket real-time progress tracking
- ✅ Professional PDF generation
- ✅ AI-powered question generation (Gemini/OpenAI/Mock)

## Step 1: Automatic Setup (Recommended)

### On macOS/Linux:
```bash
cd /path/to/AI\ Assessment\ Creator
chmod +x setup.sh
./setup.sh
```

### On Windows:
```cmd
cd path\to\AI Assessment Creator
setup.bat
```

This will:
1. Create necessary `.env` files
2. Install all dependencies
3. Guide you on next steps

**Time: ~2 minutes**

---

## Step 2: Start Backend

Open a **new terminal** and run:
```bash
cd backend
npm run dev
```

**Expected Output:**
```
[✓] Server running on http://localhost:5000
[✓] Socket.IO connected
[✓] Database ready (in-memory fallback)
[✓] Queue system ready (mock fallback)
```

**If you see connection errors, that's OK** - Fallbacks are active.

---

## Step 3: Start Frontend

Open **another terminal** and run:
```bash
cd frontend
npm run dev
```

**Expected Output:**
```
- ready started server on 0.0.0.0:3000, url: http://localhost:3000
```

Open http://localhost:3000 in your browser.

**Time: ~1 minute**

---

## Step 4: Test It Out

### Test 1: View Dashboard
- You should see the VedaAI dashboard
- "No assignments yet" - this is correct
- Click "+Create Assignment"

### Test 2: Create an Assignment
1. Fill the form:
   - **Title**: Computer Networks - Exam
   - **Due Date**: Pick a future date
   - **Question Config**:
     - MCQ: 5 questions, 1 mark each
     - Short Answer: 3 questions, 5 marks each

2. Upload a PDF/TXT file (sample in `docs/sample.pdf` or any PDF)

3. Click **"Create Assignment"**

### Test 3: Watch Real-Time Generation
You should see progress:
- ⏳ Starting generation... (10%)
- 📄 Extracting material... (30%)
- 🤖 Calling AI service... (60%)
- 💾 Saving results... (85%)
- ✅ Complete! (100%)

### Test 4: View Generated Paper
After generation completes:
- Questions appear organized by section
- Each question shows difficulty (Easy/Moderate/Hard)
- Marks are displayed
- Click "Download PDF" to export

**Time: ~3 minutes**

---

## All Tests Pass? ✅

Congratulations! Your system is working perfectly.

Now you can:
- Create multiple assignments
- Search assignments by title
- Delete assignments
- Download PDFs
- See real-time generation progress
- Regenerate papers

---

## Troubleshooting (2 Minutes)

### Issue: Port 5000 in use
```bash
# Kill the process using port 5000
# macOS/Linux:
lsof -i :5000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Windows:
netstat -ano | findstr :5000
taskkill /PID {PID} /F
```

### Issue: "API connection failed"
Check:
1. Backend is running (`npm run dev` in backend folder)
2. Frontend env var: `NEXT_PUBLIC_API_URL=http://localhost:5000`
3. Both servers are on correct ports

### Issue: PDF Upload fails
- File size must be < 10MB
- Only PDF and TXT files allowed
- Try with `docs/sample.pdf` first

### Issue: Generation stuck at 50%
- This is OK on first run - backend might be initializing
- Check browser console for errors
- Refresh and try again

---

## Get API Keys (Optional for Full AI)

The system works great with mock generation, but to use real AI:

### Google Gemini (Recommended)
1. Go to https://aistudio.google.com
2. Click "Get API Key"
3. Copy your key
4. Open `backend/.env`
5. Paste: `GEMINI_API_KEY=your_key_here`
6. Restart backend

### OpenAI (Fallback)
1. Go to https://platform.openai.com/api-keys
2. Create new secret key
3. Open `backend/.env`
4. Add: `OPENAI_API_KEY=your_key_here`
5. Restart backend

After adding keys, generation will use real AI models!

---

## File Structure Explained

```
VedaAI/
├── README.md                 # Full documentation
├── QUICK_START.md           # This file
├── TESTING_GUIDE.md         # Detailed testing
├── setup.sh / setup.bat     # Auto setup
├── backend/
│   ├── src/server.ts        # Express app
│   ├── src/models/          # Database schemas
│   ├── src/routes/          # API endpoints
│   ├── src/services/        # Business logic
│   ├── src/workers/         # Job processing
│   └── .env                 # Configuration
└── frontend/
    ├── src/app/             # Pages
    ├── src/components/      # React components
    ├── src/services/        # API client
    ├── src/store/           # State management
    └── .env.local           # Configuration
```

---

## Key URLs

| URL | Purpose |
|-----|---------|
| http://localhost:3000 | Frontend Application |
| http://localhost:5000/health | Backend Health Check |
| http://localhost:5000/api/assignments | List Assignments (API) |

---

## Next Steps

### Want to Extend?
- Add authentication: See `backend/src/middleware/`
- Add more AI models: Update `backend/src/services/aiService.ts`
- Customize styling: Edit `frontend/src/app/globals.css`
- Add new question types: Update database schema

### Want to Deploy?
- See README.md for deployment guide
- Docker support: Coming soon
- Environment-based config ready

### Want to Understand Architecture?
- Backend: See `backend/README.md` (coming soon)
- Frontend: Check `frontend/src/README.md` (coming soon)

---

## Important Notes

### Security
⚠️ **No authentication** - This is for development/demo only.
In production, add JWT authentication.

### Data Storage
- Default: In-memory (data lost on restart)
- For persistence: Install MongoDB
- See README.md for database setup

### API Keys
- Never commit API keys to Git
- Use `.env` files (already in .gitignore)
- Environment-based config for deployment

---

## Need Help?

### Common Questions

**Q: Can I use this without MongoDB?**
A: Yes! In-memory storage works for development.

**Q: Can I use this without AI API keys?**
A: Yes! Mock generation works for testing.

**Q: Is this production-ready?**
A: Architecture is, but add authentication before deploying.

**Q: How do I generate questions offline?**
A: Set up OpenAI or Gemini API keys, or use mock mode.

**Q: Can I customize the PDF format?**
A: Yes, edit `frontend/src/components/ui/ExamPDF.tsx`

### Getting Help
1. Check TESTING_GUIDE.md for detailed tests
2. Review README.md for architecture
3. Check browser console for errors (F12)
4. Check backend terminal for logs

---

## Success Indicators ✨

You've successfully set up VedaAI when:

- [x] Dashboard loads at http://localhost:3000
- [x] "No assignments yet" displays
- [x] Can create an assignment
- [x] See real-time progress updates
- [x] Question paper generates
- [x] Can download PDF

---

## Time Breakdown

| Step | Time | Status |
|------|------|--------|
| Setup | 2 min | ✅ Automated |
| Start Backend | 30 sec | ✅ Auto reload |
| Start Frontend | 30 sec | ✅ Auto reload |
| Test | 2 min | ✅ Easy |
| **Total** | **5 min** | **✅ DONE** |

---

## What's Next?

1. **Explore the Code**: Full TypeScript codebase
2. **Add Features**: Architecture supports extensions
3. **Deploy**: Production-ready setup
4. **Integrate**: Add to existing systems
5. **Scale**: Horizontal scaling ready

---

## Quick Reference Commands

```bash
# Setup everything
./setup.sh              # macOS/Linux
setup.bat             # Windows

# Start development servers
cd backend && npm run dev     # Terminal 1
cd frontend && npm run dev    # Terminal 2

# Build for production
cd backend && npm run build
cd frontend && npm run build

# Test API
curl http://localhost:5000/health

# Create assignment (bash)
curl -X POST http://localhost:5000/api/assignments \
  -F "title=Test" \
  -F "dueDate=2026-06-30T00:00:00Z" \
  -F "config=[{\"questionType\":\"MCQ\",\"count\":3,\"marks\":1}]" \
  -F "material=@docs/sample.pdf"

# List assignments
curl http://localhost:5000/api/assignments

# Clean installation
rm -rf backend/node_modules frontend/node_modules
npm install # in both directories
```

---

## Architecture at a Glance

```
User Opens Browser
        ↓
Frontend (Next.js) ← REST API + WebSocket → Backend (Express)
    ↓                                            ↓
React Components                         Job Queue (BullMQ)
Zustand Store                                ↓
Socket.IO Client                         Worker Process
PDF Generation                                ↓
                                       AI Service (Gemini/OpenAI/Mock)
                                       Text Extraction
                                       Database (MongoDB/In-Memory)
```

---

**Ready to get started? Run `./setup.sh` or `setup.bat` now!** 🎉

---

**Last Updated**: May 26, 2026
**Version**: 1.0.0
**Status**: Production-Ready Architecture
