# Backend Testing Guide

## Prerequisites

- Backend running: `cd backend && npm run dev` (should be on http://localhost:5000)
- Sample PDF file (optional): `docs/sample.pdf`

## Quick Tests

### 1. Health Check

```bash
curl http://localhost:5000/health
```

**Expected Response:**
```json
{
  "status": "ok"
}
```

---

### 2. List Assignments

```bash
curl http://localhost:5000/api/assignments
```

**Expected Response:**
```json
[]  # Empty array initially
```

---

### 3. Create Assignment

This is the most important test. It requires a multipart form with a file.

#### Using cURL (with sample PDF):

```bash
curl -X POST http://localhost:5000/api/assignments \
  -F "title=Computer Networks Exam" \
  -F "dueDate=2026-06-30T00:00:00Z" \
  -F "config=[{\"questionType\":\"MCQ\",\"count\":5,\"marks\":1},{\"questionType\":\"Short Answer\",\"count\":3,\"marks\":5}]" \
  -F "material=@docs/sample.pdf"
```

**Expected Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "title": "Computer Networks Exam",
  "status": "pending",
  "progress": 0,
  "progressMessage": "Job queued for processing..."
}
```

#### Using JavaScript/Node.js:

```javascript
const FormData = require('form-data');
const fs = require('fs');
const axios = require('axios');

const form = new FormData();
form.append('title', 'Computer Networks Exam');
form.append('dueDate', '2026-06-30T00:00:00Z');
form.append('config', JSON.stringify([
  { questionType: 'MCQ', count: 5, marks: 1 },
  { questionType: 'Short Answer', count: 3, marks: 5 }
]));
form.append('material', fs.createReadStream('docs/sample.pdf'));

axios.post('http://localhost:5000/api/assignments', form, {
  headers: form.getHeaders()
})
.then(res => console.log(res.data))
.catch(err => console.error(err));
```

#### Using Python:

```python
import requests

files = {
    'material': open('docs/sample.pdf', 'rb')
}
data = {
    'title': 'Computer Networks Exam',
    'dueDate': '2026-06-30T00:00:00Z',
    'config': '[{"questionType":"MCQ","count":5,"marks":1},{"questionType":"Short Answer","count":3,"marks":5}]'
}

response = requests.post('http://localhost:5000/api/assignments', files=files, data=data)
print(response.json())
```

---

### 4. Get Assignment Details

After creating an assignment, use the returned `_id`:

```bash
curl http://localhost:5000/api/assignments/{assignment_id}
```

**Expected Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "title": "Computer Networks Exam",
  "status": "processing",  # May be "completed" if processing is done
  "progress": 60,          # Will increase as processing happens
  "progressMessage": "Calling AI service...",
  "config": [...],
  "totalQuestions": 8,
  "totalMarks": 20
}
```

---

### 5. Get Generated Question Paper

```bash
curl http://localhost:5000/api/assignments/{assignment_id}/paper
```

**Expected Response:**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "assignmentId": "507f1f77bcf86cd799439011",
  "sections": [
    {
      "title": "Section A",
      "instruction": "Attempt all questions",
      "questions": [
        {
          "question": "What is TCP?",
          "difficulty": "easy",
          "marks": 1,
          "answer": "Transmission Control Protocol"
        }
      ]
    }
  ],
  "answerKey": "Answer key content..."
}
```

---

### 6. Delete Assignment

```bash
curl -X DELETE http://localhost:5000/api/assignments/{assignment_id}
```

**Expected Response:**
```json
{
  "success": true
}
```

---

## Testing with UI

### 1. Navigate to Frontend

Open http://localhost:3000 in your browser.

### 2. Go to Create Assignment

Click "Create Assignment" button (or navigate to `/create`).

### 3. Fill Form

- **Title**: Computer Networks - Midterm Exam
- **Due Date**: Select a date in the future
- **Description**: Exam covering TCP/IP, DNS, and HTTP
- **Instructions**: Answer all questions. Time limit: 2 hours
- **Question Config**:
  - MCQ: 5 questions, 1 mark each
  - Short Answer: 3 questions, 5 marks each

### 4. Upload File

Drag and drop a PDF or TXT file into the upload zone. The file should contain study material relevant to the subject.

### 5. Submit Form

Click "Create Assignment" button.

### 6. Monitor Progress

You should see:
- Initial: "Starting generation..." (10%)
- Then: "Extracting material..." (30%)
- Then: "Calling AI service..." (60%)
- Then: "Saving results..." (85%)
- Finally: "Complete!" (100%)

The progress updates in real-time via WebSocket.

### 7. View Results

Once 100%, the question paper should display showing:
- Sections (A, B, C, etc.)
- Questions under each section
- Difficulty badges (Easy/Moderate/Hard)
- Marks for each question

### 8. Download PDF

Click "Download PDF" button to export the question paper as a professional PDF file.

---

## WebSocket Testing

### Monitor Socket Events

Open browser developer tools (F12) and run:

```javascript
// In browser console
const socket = io('http://localhost:5000');

socket.on('connect', () => {
  console.log('✓ Connected to server');
});

socket.on('generation_started', (data) => {
  console.log('Started:', data);
});

socket.on('generation_progress', (data) => {
  console.log('Progress:', data);
});

socket.on('generation_completed', (data) => {
  console.log('Completed:', data);
});

socket.on('generation_failed', (data) => {
  console.log('Failed:', data);
});
```

---

## Troubleshooting Common Issues

### Issue: "Connection refused" Error

**Solution:**
- Ensure backend is running: `cd backend && npm run dev`
- Check port 5000 is not in use: `lsof -i :5000` (macOS/Linux) or `netstat -ano | findstr :5000` (Windows)
- Kill any process using port 5000 and restart backend

### Issue: "File too large" Error

**Solution:**
- Maximum file size is 10MB
- Compress PDF if larger
- Check file size: `ls -lh docs/sample.pdf`

### Issue: "API key not provided" Warning

**Solution:**
- This is OK - backend will use mock AI generation
- For actual AI generation, set `GEMINI_API_KEY` in `backend/.env`
- See README for getting API keys

### Issue: WebSocket not connecting

**Solution:**
- Check backend is running
- Check browser console for errors
- Verify `NEXT_PUBLIC_API_URL` is set correctly in frontend
- Restart both frontend and backend

### Issue: MongoDB connection error

**Solution:**
- This is OK - backend uses in-memory database fallback
- For persistent storage, install MongoDB and set `MONGODB_URI`
- Or use MongoDB Atlas: `MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/vedaai`

### Issue: Question paper not showing after 100%

**Solution:**
- Refresh the page
- Check browser console for errors
- Check backend logs for processing errors
- Try creating another assignment with simpler config

---

## Performance Testing

### 1. Create Multiple Assignments

```bash
for i in {1..5}; do
  curl -X POST http://localhost:5000/api/assignments \
    -F "title=Assignment $i" \
    -F "dueDate=2026-06-30T00:00:00Z" \
    -F "config=[{\"questionType\":\"MCQ\",\"count\":3,\"marks\":1}]" \
    -F "material=@docs/sample.pdf"
  sleep 1
done
```

### 2. Monitor Processing

```bash
watch -n 1 'curl http://localhost:5000/api/assignments | jq ". | length"'
```

### 3. Check System Resources

Monitor CPU and memory usage while processing multiple assignments.

---

## API Response Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | Success | GET assignment list |
| 201 | Created | POST assignment created |
| 400 | Bad Request | Invalid form data |
| 404 | Not Found | Assignment not found |
| 500 | Server Error | Database connection failed |

---

## Sample PDF Creation

For testing without a real PDF:

```bash
# Create a simple text file (used as material)
cat > docs/sample.txt << 'EOF'
# Computer Networks Study Material

## Chapter 1: Fundamentals

TCP (Transmission Control Protocol) is a core protocol of the Internet Protocol Suite.
It provides a reliable, ordered delivery mechanism for data.

### Key Concepts:
- Connection-oriented
- Reliable delivery
- Flow control
- Congestion control

## Chapter 2: Network Layers

The OSI model has 7 layers:
1. Physical
2. Data Link
3. Network
4. Transport
5. Session
6. Presentation
7. Application

## Chapter 3: IP Addressing

IP addresses are 32-bit identifiers in IPv4.
Format: A.B.C.D where each part is 0-255.

Examples:
- 192.168.1.1
- 10.0.0.1
- 8.8.8.8
EOF
```

Then use this file instead of PDF:

```bash
curl -X POST http://localhost:5000/api/assignments \
  -F "title=Test Assignment" \
  -F "dueDate=2026-06-30T00:00:00Z" \
  -F "config=[{\"questionType\":\"MCQ\",\"count\":3,\"marks\":1}]" \
  -F "material=@docs/sample.txt"
```

---

## Conclusion

If all tests pass:
✅ Backend API is working correctly
✅ File upload is functioning
✅ AI generation is configured
✅ Database storage is working
✅ WebSocket real-time updates are connected
✅ PDF export is ready to use

Your VedaAI system is ready for use! 🎉
