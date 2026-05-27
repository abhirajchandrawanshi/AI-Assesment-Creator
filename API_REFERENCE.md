# API Reference - VedaAI Assessment Creator

Complete API documentation for the VedaAI backend.

## Base URL

```
http://localhost:5000/api
```

## Authentication

⚠️ Currently no authentication required. Add JWT in production.

## Request/Response Format

- **Content-Type**: Depends on endpoint
- **Encoding**: UTF-8
- **Error Format**: JSON with error message

## API Endpoints

---

## 1. Health Check

Check if backend is running.

```
GET /health
```

### Response

```json
{
  "status": "ok"
}
```

### Status Codes

- `200` - Server is healthy

---

## 2. Create Assignment

Create a new assignment with file upload.

```
POST /api/assignments
Content-Type: multipart/form-data
```

### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| title | string | ✓ | Assignment title (3+ chars) |
| dueDate | ISO string | ✓ | Due date (e.g., "2026-06-30T00:00:00Z") |
| config | JSON string | ✓ | Question configuration (see below) |
| material | file | ✓ | PDF or TXT file (max 10MB) |
| description | string | - | Optional assignment description |
| instructions | string | - | Additional instructions for students |

### Config Format

```json
[
  {
    "questionType": "string",  // e.g., "MCQ", "Short Answer"
    "count": number,           // Number of questions (1-100)
    "marks": number            // Marks per question (1-100)
  }
]
```

### Example cURL

```bash
curl -X POST http://localhost:5000/api/assignments \
  -F "title=Computer Networks Exam" \
  -F "dueDate=2026-06-30T00:00:00Z" \
  -F "description=Exam covering TCP/IP basics" \
  -F "instructions=Answer all questions. Time limit: 2 hours" \
  -F "config=[{\"questionType\":\"MCQ\",\"count\":5,\"marks\":1},{\"questionType\":\"Short Answer\",\"count\":3,\"marks\":5}]" \
  -F "material=@exam_material.pdf"
```

### Response

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "title": "Computer Networks Exam",
  "description": "Exam covering TCP/IP basics",
  "dueDate": "2026-06-30T00:00:00.000Z",
  "status": "pending",
  "progress": 0,
  "progressMessage": "Job queued for processing...",
  "materialName": "exam_material.pdf",
  "config": [
    {
      "questionType": "MCQ",
      "count": 5,
      "marks": 1
    },
    {
      "questionType": "Short Answer",
      "count": 3,
      "marks": 5
    }
  ],
  "totalQuestions": 8,
  "totalMarks": 20,
  "instructions": "Answer all questions. Time limit: 2 hours",
  "createdAt": "2026-05-26T13:30:00.000Z"
}
```

### Status Codes

- `201` - Assignment created successfully
- `400` - Invalid input (missing fields, invalid file, etc.)
- `500` - Server error

### Errors

```json
{
  "error": "File too large. Maximum size allowed is 10MB."
}
```

---

## 3. List Assignments

Get all assignments with optional filtering.

```
GET /api/assignments
```

### Query Parameters

| Name | Type | Description |
|------|------|-------------|
| search | string | Search by title (partial match) |
| status | string | Filter by status (pending/processing/completed/failed) |

### Examples

```bash
# Get all assignments
curl http://localhost:5000/api/assignments

# Search by title
curl "http://localhost:5000/api/assignments?search=Networks"

# Filter by status
curl "http://localhost:5000/api/assignments?status=completed"

# Combined
curl "http://localhost:5000/api/assignments?search=Exam&status=completed"
```

### Response

```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Computer Networks Exam",
    "status": "completed",
    "progress": 100,
    "progressMessage": "Complete!",
    "totalQuestions": 8,
    "totalMarks": 20,
    "createdAt": "2026-05-26T13:30:00.000Z"
  },
  {
    "_id": "507f1f77bcf86cd799439012",
    "title": "Database Design Final",
    "status": "processing",
    "progress": 60,
    "progressMessage": "Calling AI service...",
    "totalQuestions": 10,
    "totalMarks": 30,
    "createdAt": "2026-05-26T14:00:00.000Z"
  }
]
```

### Status Codes

- `200` - Success
- `500` - Server error

---

## 4. Get Assignment Details

Get full details of a specific assignment.

```
GET /api/assignments/:id
```

### URL Parameters

| Name | Type | Description |
|------|------|-------------|
| id | string | Assignment ID (MongoDB ObjectId) |

### Example

```bash
curl http://localhost:5000/api/assignments/507f1f77bcf86cd799439011
```

### Response

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "title": "Computer Networks Exam",
  "description": "Exam covering TCP/IP basics",
  "dueDate": "2026-06-30T00:00:00.000Z",
  "status": "completed",
  "progress": 100,
  "progressMessage": "Complete!",
  "materialName": "exam_material.pdf",
  "materialText": "TCP is a transport layer protocol...",
  "config": [
    {
      "questionType": "MCQ",
      "count": 5,
      "marks": 1
    }
  ],
  "totalQuestions": 8,
  "totalMarks": 20,
  "instructions": "Answer all questions",
  "createdAt": "2026-05-26T13:30:00.000Z"
}
```

### Status Codes

- `200` - Success
- `404` - Assignment not found
- `500` - Server error

---

## 5. Get Question Paper

Get the generated question paper for a completed assignment.

```
GET /api/assignments/:id/paper
```

### URL Parameters

| Name | Type | Description |
|------|------|-------------|
| id | string | Assignment ID |

### Example

```bash
curl http://localhost:5000/api/assignments/507f1f77bcf86cd799439011/paper
```

### Response

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
          "question": "What does TCP stand for?",
          "difficulty": "easy",
          "marks": 1,
          "answer": "Transmission Control Protocol"
        },
        {
          "question": "Explain the three-way handshake in TCP.",
          "difficulty": "hard",
          "marks": 5,
          "answer": "The three-way handshake is: 1. SYN, 2. SYN-ACK, 3. ACK"
        }
      ]
    },
    {
      "title": "Section B",
      "instruction": "Attempt any 2 questions",
      "questions": [
        {
          "question": "What is congestion control?",
          "difficulty": "medium",
          "marks": 3,
          "answer": "Mechanism to reduce data transmission rate..."
        }
      ]
    }
  ],
  "answerKey": "ANSWER KEY\n\nSection A:\n1. TCP = Transmission Control Protocol\n...",
  "createdAt": "2026-05-26T14:00:00.000Z"
}
```

### Status Codes

- `200` - Success (paper found)
- `404` - Paper not yet generated or assignment not found
- `500` - Server error

---

## 6. Delete Assignment

Delete an assignment and its generated paper.

```
DELETE /api/assignments/:id
```

### URL Parameters

| Name | Type | Description |
|------|------|-------------|
| id | string | Assignment ID |

### Example

```bash
curl -X DELETE http://localhost:5000/api/assignments/507f1f77bcf86cd799439011
```

### Response

```json
{
  "success": true
}
```

### Status Codes

- `200` - Successfully deleted
- `404` - Assignment not found
- `500` - Server error

---

## WebSocket Events

Real-time updates via Socket.IO.

### Connection

```javascript
const socket = io('http://localhost:5000');

socket.on('connect', () => {
  console.log('Connected');
  // Join room for specific assignment
  socket.emit('join_assignment', 'assignment_id');
});
```

### Events from Server

#### `generation_started`

Emitted when generation begins.

```javascript
socket.on('generation_started', (data) => {
  console.log(data);
  // {
  //   assignmentId: "507f1f77bcf86cd799439011",
  //   progress: 10,
  //   message: "Starting generation..."
  // }
});
```

#### `generation_progress`

Emitted during processing.

```javascript
socket.on('generation_progress', (data) => {
  console.log(data);
  // {
  //   assignmentId: "507f1f77bcf86cd799439011",
  //   progress: 60,
  //   message: "Calling AI service..."
  // }
});
```

#### `generation_completed`

Emitted when generation is done.

```javascript
socket.on('generation_completed', (data) => {
  console.log(data);
  // {
  //   assignmentId: "507f1f77bcf86cd799439011",
  //   progress: 100,
  //   message: "Complete!",
  //   paper: { /* QuestionPaper object */ }
  // }
});
```

#### `generation_failed`

Emitted if generation fails.

```javascript
socket.on('generation_failed', (data) => {
  console.error(data);
  // {
  //   assignmentId: "507f1f77bcf86cd799439011",
  //   error: "AI service unavailable"
  // }
});
```

---

## Error Handling

All errors return JSON with error details:

```json
{
  "error": "Error message"
}
```

### Common Errors

| Error | Status | Cause |
|-------|--------|-------|
| Invalid file type | 400 | Only PDF/TXT allowed |
| File too large | 400 | File > 10MB |
| Missing required field | 400 | Missing title, dueDate, config, or material |
| Assignment not found | 404 | Invalid assignment ID |
| Paper not ready | 404 | Generation not complete |
| Internal server error | 500 | Database/AI service issues |

---

## Rate Limiting

⚠️ Currently no rate limiting. Add in production!

Suggested:
- 100 requests per minute per IP
- 10 concurrent uploads per user
- 1 assignment per 10 seconds per user

---

## Data Types

### Assignment Status

```typescript
type Status = 'pending' | 'processing' | 'completed' | 'failed'
```

### Question Difficulty

```typescript
type Difficulty = 'easy' | 'medium' | 'hard'
```

### Question Type

```
Examples: "MCQ", "Short Answer", "Long Answer", "Essay", "Numerical"
(Custom types supported - specified in config during creation)
```

---

## Pagination

Currently returns all results. Add in production:

```
GET /api/assignments?skip=0&limit=10
```

---

## Validation Rules

### Title
- Minimum 3 characters
- Maximum 200 characters
- Required

### Due Date
- Must be valid ISO 8601 format
- Must be in future
- Required

### Question Config
- At least 1 type required
- Count: 1-100
- Marks: 1-100

### Material File
- Only PDF or TXT
- Maximum 10MB
- Required

---

## Response Time

Typical response times:

| Endpoint | Time |
|----------|------|
| GET /health | <10ms |
| GET /api/assignments | 50ms |
| GET /api/assignments/:id | 50ms |
| POST /api/assignments | 200ms |
| DELETE /api/assignments/:id | 100ms |
| GET /paper (after generation) | 100ms |

Generation time depends on material size and AI service:
- Small file (< 1MB): 30-60 seconds
- Medium file (1-5MB): 60-120 seconds
- Large file (5-10MB): 120+ seconds

---

## Version

**API Version**: 1.0.0
**Last Updated**: May 26, 2026
**Status**: Production-Ready

---

## Support

For API issues:
1. Check status code and error message
2. Review TESTING_GUIDE.md for examples
3. Check backend logs in terminal
4. See README.md for troubleshooting
