# Quick Reference: Environment Configuration

## 30-Second Setup

```bash
# Development (default to localhost:5000)
cd frontend
npm run dev

# Production (use environment variables)
NEXT_PUBLIC_API_URL=https://ai-assesment-creator-x2jv.onrender.com npm run build
npm run start
```

## Environment Variables

| Variable | Dev | Staging | Prod |
|----------|-----|---------|------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:5000` | `https://ai-assesment-creator-x2jv.onrender.com` | `https://ai-assesment-creator-x2jv.onrender.com` |
| `NODE_ENV` | `development` | `development` | `production` |

## Files to Know

| File | Purpose |
|------|---------|
| `frontend/src/lib/apiConfig.ts` | Central config module |
| `frontend/src/services/api.ts` | API client functions |
| `frontend/src/services/socket.ts` | WebSocket management |
| `frontend/.env.local` | Local dev config |
| `frontend/.env.example` | Config template |
| `ENV_CONFIGURATION.md` | Complete setup guide |

## Key Functions

### Get API URL
```typescript
import { buildApiUrl } from '@/lib/apiConfig';

const url = buildApiUrl('/api/assignments');
// → 'https://ai-assesment-creator-x2jv.onrender.com/api/assignments'
```

### Connect WebSocket
```typescript
import { connectSocket } from '@/services/socket';

const socket = connectSocket(assignmentId);
```

### Validate Configuration
```typescript
import { validateApiConfig } from '@/lib/apiConfig';

validateApiConfig();  // Throws error if config invalid
```

## Common Tasks

### Change Backend URL
```env
# In .env.local (dev) or deployment dashboard (prod)
NEXT_PUBLIC_API_URL=https://new-backend-url.com
```

### Test with Different Backend
```bash
NEXT_PUBLIC_API_URL=http://another-server:5000 npm run dev
```

### Debug Configuration
```typescript
// In browser console
import { API_URL, WS_URL } from 'src/lib/apiConfig';
console.log('API:', API_URL);
console.log('WS:', WS_URL);
```

## Troubleshooting

| Problem | Solution |
|---------|----------|
| API 404 errors | Check NEXT_PUBLIC_API_URL matches backend |
| WebSocket fails | Verify WS_URL accessible from browser |
| Env var not applied | Restart dev server / rebuild |
| Different URLs | Check env var in deployment dashboard |

## Checklist Before Deployment

- [ ] NEXT_PUBLIC_API_URL set to production backend
- [ ] NODE_ENV=production
- [ ] Built with `npm run build`
- [ ] Backend server running at specified URL
- [ ] CORS configured on backend
- [ ] Tested API connectivity
- [ ] WebSocket connection verified

## Deployment URLs

**Backend**
- Dev: `http://localhost:5000`
- Prod: `https://ai-assesment-creator-x2jv.onrender.com`

**Frontend**
- Dev: `http://localhost:3000`
- Prod: Deploy to Vercel/Netlify with env vars

## More Info

- 📖 Full guide: [ENV_CONFIGURATION.md](./ENV_CONFIGURATION.md)
- 📋 Changes: [ENVIRONMENT_CONFIGURATION_CHANGES.md](./ENVIRONMENT_CONFIGURATION_CHANGES.md)
- 🚀 Production: [PRODUCTION_ENV_SETUP_COMPLETE.md](./PRODUCTION_ENV_SETUP_COMPLETE.md)
