# Environment Configuration Guide

## Overview

VedaAI uses environment variables to manage backend API URLs across different environments (development, staging, production). This ensures the frontend can connect to different backend instances without code changes.

## Frontend Environment Variables

### Primary Variables

#### `NEXT_PUBLIC_API_URL` (Required)
The base URL for all backend API calls and WebSocket connections.

- **Development**: `http://localhost:5000`
- **Production**: `https://ai-assesment-creator-x2jv.onrender.com`

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

#### `NEXT_PUBLIC_WS_URL` (Optional)
The WebSocket server URL. If not set, defaults to `NEXT_PUBLIC_API_URL`.

```env
NEXT_PUBLIC_WS_URL=http://localhost:5000
```

### Additional Variables

#### `NODE_ENV`
Controls Next.js behavior and logging verbosity.

```env
NODE_ENV=development  # or production
```

## Setup Instructions

### 1. Development Setup

```bash
cd frontend

# Copy example env file
cp .env.example .env.local

# Edit with your local development URLs
nano .env.local
```

Default development `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NODE_ENV=development
```

### 2. Production Setup

For production deployment (e.g., Vercel, Render):

```env
NEXT_PUBLIC_API_URL=https://ai-assesment-creator-x2jv.onrender.com
NODE_ENV=production
```

**On Vercel:**
1. Go to Project Settings → Environment Variables
2. Add the variables above
3. Redeploy

**On Render (or similar):**
1. Go to Dashboard → Environment
2. Add the variables
3. Trigger redeploy

### 3. Staging Setup

For testing against production backend:

```env
NEXT_PUBLIC_API_URL=https://ai-assesment-creator-x2jv.onrender.com
NODE_ENV=development
```

## API Configuration Architecture

The frontend uses a centralized API configuration system:

### File Structure

```
frontend/
├── src/
│   ├── lib/
│   │   └── apiConfig.ts          # Centralized configuration
│   ├── services/
│   │   ├── api.ts                # API client functions
│   │   └── socket.ts             # WebSocket management
│   └── store/
│       └── assignmentStore.ts    # State management
```

### Configuration Hierarchy

```
apiConfig.ts (Central Config)
    ↓
api.ts (REST API Client)
    ↓
React Components & Hooks
```

### Key Functions

#### `buildApiUrl(endpoint: string): string`
Constructs full API URLs from relative endpoints.

```typescript
import { buildApiUrl } from '@/lib/apiConfig';

const url = buildApiUrl('/api/assignments');
// Returns: 'https://api.example.com/api/assignments'
```

#### `validateApiConfig(): void`
Validates that required environment variables are set during app initialization.

```typescript
import { validateApiConfig } from '@/lib/apiConfig';

// Call in app initialization
validateApiConfig();
```

## API Endpoints

All API endpoints use the configured `NEXT_PUBLIC_API_URL`:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/assignments` | GET | Fetch all assignments |
| `/api/assignments` | POST | Create new assignment |
| `/api/assignments/:id` | GET | Fetch assignment details |
| `/api/assignments/:id` | DELETE | Delete assignment |
| `/api/assignments/:id/paper` | GET | Fetch generated question paper |
| `/api/user/profile` | PUT | Update user profile |
| `/api/notifications` | GET | Fetch notifications |

## WebSocket Connection

WebSocket connections also use the configured URL:

```typescript
import { connectSocket } from '@/services/socket';

// Automatically uses NEXT_PUBLIC_WS_URL (or API_URL as fallback)
const socket = connectSocket(assignmentId);
```

## Troubleshooting

### API Calls Return 404
- Verify `NEXT_PUBLIC_API_URL` is correct
- Ensure backend server is running
- Check CORS configuration on backend

### WebSocket Connection Fails
- Verify `NEXT_PUBLIC_WS_URL` is accessible
- Check browser console for detailed error messages
- Ensure WebSocket support is enabled on backend

### Environment Variable Not Recognized
- Environment variables must start with `NEXT_PUBLIC_` to be accessible in browser
- Restart dev server after changing `.env.local`
- Rebuild Next.js after changing variables

### Different URL in Browser vs Server
- Browser code: Use `NEXT_PUBLIC_` variables
- Server-side code: Can use regular `process.env`
- Never use non-public variables in client-side code

## Best Practices

1. **Never commit `.env.local`** - Add to `.gitignore`
2. **Use `.env.example` as template** - Document all variables
3. **Validate on startup** - Use `validateApiConfig()`
4. **Test different environments** - Verify all deployment targets
5. **Log configuration in development** - Use `logApiConfig()`

## Production Checklist

- [ ] Update `NEXT_PUBLIC_API_URL` to production backend URL
- [ ] Set `NODE_ENV=production`
- [ ] Remove debug logging from apiConfig
- [ ] Test API connectivity before deploying
- [ ] Verify CORS is properly configured on backend
- [ ] Enable HTTPS for production URLs
- [ ] Test WebSocket connection in production

## References

- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [API Configuration Module](../src/lib/apiConfig.ts)
- [API Client](../src/services/api.ts)
