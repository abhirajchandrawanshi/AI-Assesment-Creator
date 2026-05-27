# VedaAI Frontend - Production Environment Configuration

## Summary of Changes

Updated the VedaAI frontend codebase to support production backend integration using centralized environment variable configuration. All hardcoded localhost URLs have been replaced with dynamic configuration.

**Status**: ✅ Production Ready

---

## Files Created/Modified

### New Files Created

1. **`frontend/src/lib/apiConfig.ts`** - Centralized API configuration module
   - Exports `API_URL`, `WS_URL`, and helper functions
   - Provides `buildApiUrl()` for constructing full API URLs
   - Includes `FETCH_CONFIG` with sensible defaults
   - Validation and debugging utilities

2. **`frontend/.env.example`** - Environment variable template for frontend
   - Documents all required and optional variables
   - Includes default development and production values

3. **`frontend/.env.local`** - Local development environment (development default)
   - Default to localhost:5000 for development

4. **`.env.example`** (root) - Complete project environment template
   - Covers both frontend and backend configuration
   - Production URL: `https://ai-assesment-creator-x2jv.onrender.com`

5. **`ENV_CONFIGURATION.md`** - Comprehensive configuration guide
   - Setup instructions for all environments
   - Troubleshooting guide
   - Best practices and production checklist

### Modified Files

1. **`frontend/src/services/api.ts`**
   - Changed imports to use centralized `apiConfig.ts`
   - All fetch calls now use `buildApiUrl()` instead of string concatenation
   - Proper fallback handling for all endpoints
   - Exported `API_URL` for backward compatibility

2. **`frontend/src/services/socket.ts`**
   - Updated imports to use `WS_URL` from `apiConfig.ts`
   - Enhanced socket connection configuration with reconnection settings
   - Proper URL resolution for WebSocket connections

---

## Configuration Architecture

### Before
```
Components & Services
        ↓
Hardcoded URLs (localhost:5000)
        ↓
Backend (localhost:5000)
```

### After
```
Components & Services
        ↓
API Functions (api.ts)
        ↓
Config Module (apiConfig.ts)
        ↓
Environment Variables
        ↓
Backend (Dynamic URL)
```

---

## Environment Variables

### Frontend Only (Next.js)

```env
# Primary - Required for API communication
NEXT_PUBLIC_API_URL=http://localhost:5000

# Optional - WebSocket specific URL (defaults to API_URL)
NEXT_PUBLIC_WS_URL=http://localhost:5000

# Standard Next.js variable
NODE_ENV=development
```

### Key Points

- **`NEXT_PUBLIC_` prefix**: Makes variables accessible in browser code
- **Default fallback**: `http://localhost:5000` (development)
- **Production value**: `https://ai-assesment-creator-x2jv.onrender.com`

---

## Usage Examples

### Development

1. Copy environment template:
```bash
cd frontend
cp .env.example .env.local
```

2. Start with default localhost setup:
```bash
npm run dev  # Uses http://localhost:5000
```

### Production (Vercel/Netlify)

1. Set environment variables in deployment dashboard:
```
NEXT_PUBLIC_API_URL=https://ai-assesment-creator-x2jv.onrender.com
NODE_ENV=production
```

2. Deploy as normal - frontend will automatically use production backend

### Staging

```env
NEXT_PUBLIC_API_URL=https://ai-assesment-creator-x2jv.onrender.com
NODE_ENV=development  # Keep debug mode for testing
```

---

## API Endpoint Configuration

All endpoints use centralized URL construction:

```typescript
// Before
fetch("http://localhost:5000/api/assignments")

// After
import { buildApiUrl } from '@/lib/apiConfig';
fetch(buildApiUrl('/api/assignments'))
```

### Supported Endpoints

```
/api/assignments          - Assignment CRUD
/api/assignments/:id      - Single assignment
/api/assignments/:id/paper - Question paper
/api/user/profile         - User settings
/api/notifications        - Notifications
```

---

## WebSocket Configuration

### Before
```typescript
io("http://localhost:5000")
```

### After
```typescript
import { WS_URL, SOCKET_CONFIG } from '@/lib/apiConfig';

io(WS_URL, {
  transports: ['websocket'],
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5,
})
```

---

## Validation & Debugging

### Validation Function
```typescript
import { validateApiConfig, logApiConfig } from '@/lib/apiConfig';

// Call during app initialization
validateApiConfig();

// Log config in development
if (!isProduction) {
  logApiConfig();
}
```

### Console Output (Development)
```
✅ API Configuration loaded: http://localhost:5000

🔧 API Configuration
API URL: http://localhost:5000
WS URL: http://localhost:5000
Environment: development
```

---

## Deployment Checklist

### Pre-Deployment

- [ ] All API calls use `buildApiUrl()`
- [ ] WebSocket uses `WS_URL` from config
- [ ] `.env.local` is in `.gitignore`
- [ ] Environment variables documented in `.env.example`

### Deployment Configuration

- [ ] Set `NEXT_PUBLIC_API_URL` to production backend URL
- [ ] Set `NODE_ENV=production`
- [ ] Verify CORS headers on backend
- [ ] Test API connectivity before going live

### Post-Deployment

- [ ] Verify API calls reach correct backend
- [ ] Test WebSocket connection
- [ ] Check error handling for API failures
- [ ] Monitor API response times

---

## Troubleshooting

### API Returns 404 or Connection Refused
```
✓ Check NEXT_PUBLIC_API_URL is correct
✓ Ensure backend server is running
✓ Verify CORS configuration on backend
✓ Check browser network tab for actual URL being used
```

### WebSocket Connection Fails
```
✓ Verify WS_URL is accessible
✓ Check WebSocket port matches backend
✓ Verify WebSocket support on backend
✓ Check browser console for specific error
```

### Environment Variables Not Recognized
```
✓ Restart Next.js dev server
✓ Rebuild Next.js after env changes
✓ Use NEXT_PUBLIC_ prefix for client-side vars
✓ Never use sensitive data in client-side env vars
```

---

## Backward Compatibility

- ✅ Existing API function signatures unchanged
- ✅ Socket.io integration works identically
- ✅ State management unaffected
- ✅ Component props/imports unchanged
- ✅ UI/UX design preserved

---

## Security Considerations

1. **No sensitive data in NEXT_PUBLIC_ variables**
   - These are visible in browser code
   - Only use for non-secret URLs and public config

2. **CORS configuration**
   - Backend must allow requests from frontend URL
   - Configure in production deployment

3. **Environment isolation**
   - Different backends for dev/staging/prod
   - Clear environment variable separation

---

## Performance Impact

- ✅ No additional network overhead
- ✅ Configuration computed at build time
- ✅ String concatenation replaced with function calls (negligible)
- ✅ Maintains same caching behavior
- ✅ WebSocket reconnection improved with new settings

---

## Testing

### Manual Testing

1. **Local Development**
```bash
NEXT_PUBLIC_API_URL=http://localhost:5000 npm run dev
```

2. **Production Simulation**
```bash
NEXT_PUBLIC_API_URL=https://ai-assesment-creator-x2jv.onrender.com npm run build
npm run start
```

3. **Network Inspection**
   - Open DevTools Network tab
   - Verify requests go to correct backend URL
   - Check WebSocket connection details

---

## Documentation References

- [ENV_CONFIGURATION.md](../ENV_CONFIGURATION.md) - Detailed configuration guide
- [.env.example](../.env.example) - Environment variable template
- [frontend/.env.example](../frontend/.env.example) - Frontend-specific vars
- [README_PRODUCTION.md](../README_PRODUCTION.md) - Production deployment guide

---

## Contact & Support

For issues with environment configuration:
1. Check `ENV_CONFIGURATION.md` troubleshooting section
2. Review browser console for error messages
3. Verify backend URL is accessible
4. Check environment variables are set correctly

---

**Last Updated**: May 27, 2026  
**Status**: Production Ready ✅  
**Version**: 1.0.0
