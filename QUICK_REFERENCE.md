# TARS AI - Developer Quick Reference

## 🚀 Quick Start

### New Utilities Location
```
app/lib/
├── api-middleware.ts      # API error handling & auth
├── constants.ts           # Centralized config
├── hooks.ts              # React hooks
├── rate-limiter.ts       # Rate limiting
├── types.ts              # Type definitions
├── validation.ts         # Input validation
└── webhook-verification.ts # Webhook security
```

### New Pages
```
app/
├── settings/page.tsx     # User settings
├── help/page.tsx         # Help & FAQ
└── contact/page.tsx      # Contact form
```

---

## 🔧 Common Tasks

### Create a Protected API Route
```typescript
import { withAuth, successResponse, errorResponse } from '@/app/lib/api-middleware';

export const POST = withAuth(async (req, { userId }) => {
  // Your code here
  return successResponse({ data: 'value' });
});
```

### Validate File Upload
```typescript
import { validateFileUpload, errorResponse } from '@/app/lib/validation';
import { PDF_CONFIG } from '@/app/lib/constants';

const validation = validateFileUpload(file, {
  maxSize: PDF_CONFIG.MAX_SIZE,
  allowedTypes: PDF_CONFIG.ALLOWED_TYPES,
});

if (!validation.isValid) {
  return errorResponse(validation.error);
}
```

### Apply Rate Limiting
```typescript
import { chatRateLimiter, getClientIP, checkRateLimit } from '@/app/lib/rate-limiter';

const clientIP = getClientIP(req);
const { allowed, headers } = checkRateLimit(chatRateLimiter, clientIP);

if (!allowed) {
  return new Response('Too many requests', { status: 429, headers });
}
```

### Use Upload Hook
```typescript
import { useFileUpload } from '@/app/lib/hooks';

const { upload, uploading, error } = useFileUpload();

upload(file);
```

### Validate Form Input
```typescript
import { validateRequiredFields, validateEmail } from '@/app/lib/validation';

const emailVal = validateEmail('test@example.com');
const fieldsVal = validateRequiredFields(data, ['name', 'email']);
```

---

## 📋 Type Definitions

### Chat Message Types
```typescript
import { ChatMessage, SanitizedMessage, ContentPart } from '@/app/lib/types';

// Message from user/AI
const msg: ChatMessage = {
  role: 'user' | 'assistant' | 'system',
  content: string | ContentPart[],
};

// Processed message for API
const sanitized: SanitizedMessage = {
  role: 'user' | 'assistant',
  content: string,
};
```

### Error Types
```typescript
import { AuthError, FileUploadError } from '@/app/lib/types';

try {
  // ...
} catch (err: unknown) {
  const error = err as AuthError;
  console.log(error.message, error.code);
}
```

---

## ⚙️ Configuration

### Update Limits
```typescript
// app/lib/constants.ts
export const PDF_CONFIG = {
  MAX_SIZE: 100 * 1024 * 1024, // Change 50MB to 100MB
  // ...
};

export const SUBSCRIPTION_CONFIG = {
  FREE_PLAN_PDF_LIMIT: 5,    // Change 2 to 5
  PRO_PLAN_PDF_LIMIT: 20,    // Change 10 to 20
};
```

### Add Error Message
```typescript
// app/lib/constants.ts
export const ERROR_MESSAGES = {
  // ... existing messages
  CUSTOM_ERROR: 'Your custom error message',
};
```

### Adjust Rate Limits
```typescript
// app/lib/rate-limiter.ts
export const chatRateLimiter = new RateLimiter(
  60 * 1000,  // Window: 1 minute
  50          // Max requests: 50 (was 30)
);
```

---

## 🔒 Security

### Webhook Verification
```typescript
import { verifyDodoSignature, getWebhookSecret } from '@/app/lib/webhook-verification';

const signature = headers.get('x-signature');
const secret = getWebhookSecret('dodo');
const isValid = verifyDodoSignature(body, signature, secret);

if (!isValid) {
  return new Response('Unauthorized', { status: 401 });
}
```

### Input Sanitization
```typescript
import { sanitizeInput } from '@/app/lib/validation';

const clean = sanitizeInput(userInput); // Prevents XSS
```

---

## 📊 Response Format

All API responses follow this format:

**Success:**
```json
{
  "success": true,
  "data": { /* response data */ }
}
```

**Error:**
```json
{
  "success": false,
  "error": "Error message"
}
```

---

## 🐛 Debugging

### View Rate Limit Status
```typescript
import { chatRateLimiter } from '@/app/lib/rate-limiter';

const remaining = chatRateLimiter.getRemaining('192.168.1.1');
const resetTime = chatRateLimiter.getResetTime('192.168.1.1');

console.log(`Remaining: ${remaining}, Resets at: ${resetTime}`);
```

### Check Types
```typescript
import { ChatMessage } from '@/app/lib/types';

// TypeScript will catch type mismatches
const msg: ChatMessage = {
  role: 'user',
  content: 'Hello', // ✅ Correct
};

// const msg: ChatMessage = {
//   role: 'admin',  // ❌ TypeScript error
//   content: 'test'
// };
```

---

## 🔗 Navigation

### Update Navigation Links
If adding the new routes to navigation:

```typescript
// In your navigation component
const navLinks = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/settings', label: 'Settings' },  // NEW
  { href: '/help', label: 'Help' },         // NEW
  { href: '/contact', label: 'Contact' },   // NEW
];
```

---

## ✅ Checklist for New API Routes

When creating a new API route, ensure:

- [ ] Use `withAuth` for protected routes
- [ ] Use `withErrorHandler` for error handling
- [ ] Return `successResponse()` or `errorResponse()`
- [ ] Add input validation
- [ ] Add rate limiting if needed
- [ ] Document with JSDoc comments
- [ ] Test with Postman/curl
- [ ] Add error cases

---

## 📚 Common Patterns

### Pattern 1: Protected API with Validation
```typescript
import { withAuth, successResponse, errorResponse } from '@/app/lib/api-middleware';
import { validateRequiredFields } from '@/app/lib/validation';

export const POST = withAuth(async (req, { userId }) => {
  const body = await req.json();

  const validation = validateRequiredFields(body, ['field1', 'field2']);
  if (!validation.isValid) return errorResponse(validation.error);

  return successResponse({ success: true });
});
```

### Pattern 2: File Upload with Validation
```typescript
import { validateFileUpload, errorResponse, successResponse } from '@/app/lib/validation';
import { PDF_CONFIG } from '@/app/lib/constants';

export async function upload(file: File) {
  const validation = validateFileUpload(file, {
    maxSize: PDF_CONFIG.MAX_SIZE,
    allowedTypes: PDF_CONFIG.ALLOWED_TYPES,
  });

  if (!validation.isValid) throw new Error(validation.error);

  return await uploadToS3(file);
}
```

### Pattern 3: Rate Limited Endpoint
```typescript
import { chatRateLimiter, checkRateLimit, getClientIP } from '@/app/lib/rate-limiter';
import { errorResponse } from '@/app/lib/api-middleware';

export async function handler(req: Request) {
  const { allowed, headers } = checkRateLimit(chatRateLimiter, getClientIP(req));

  if (!allowed) return errorResponse('Rate limited', 429);

  // Process request
}
```

---

## 🚨 Common Errors

### Error: "Cannot find module '@/app/lib/constants'"
- Ensure you've imported from the correct path
- Check that the file exists: `app/lib/constants.ts`

### Error: "Type 'any' is not assignable to type 'ChatMessage'"
- Import the correct type: `import { ChatMessage } from '@/app/lib/types'`
- Use proper discriminated unions

### Error: "withAuth is not a function"
- Import from correct path: `from '@/app/lib/api-middleware'`
- Ensure you're not using it with incorrect parameters

---

## 📞 Need Help?

1. Check `/help` page in the app
2. See `IMPROVEMENTS.md` for detailed documentation
3. Look at existing route examples in `app/api/`
4. Review inline JSDoc comments in utility files

---

Last Updated: 2026-02-18
