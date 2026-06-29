# Backend Integration Plan - ReviewyMe Frontend

## Project Overview

**Frontend:** React 19 + React Router 7, TypeScript, Tailwind CSS  
**Backend:** Microservices architecture (Auth, Resume, Product, Payment, Notification)  
**Current State:** Mock data with simulated delays in `src/services/api.ts`  
**Target:** Integrate real API endpoints (remote server)

---

## 1. Architecture & Setup

### 1.1 API Configuration

**Current:** Mock delays in `api.ts` with hardcoded functions  
**Goal:** Create centralized HTTP client with:
- Base URL configuration (env variables)
- Auth token handling (auto-inject Bearer token)
- Request/response interceptors
- Error handling & token refresh
- Retry logic for failed requests

**Files to Create/Modify:**
- `src/config/api.config.ts` — Environment variables, base URL, timeouts
- `src/services/http-client.ts` — Centralized fetch/axios wrapper
- `src/services/api.ts` — Replace mock functions with real endpoints (keep signatures identical)

### 1.2 Environment Setup

```env
# .env
VITE_API_GATEWAY_URL=http://localhost:8080
VITE_API_TIMEOUT=10000

# .env.production
VITE_API_GATEWAY_URL=https://api.reviewyme.com
```

**Vite Integration:** Update `vite.config.ts` to support env variable expansion

---

## 2. Authentication Flow Integration

### 2.1 Login/Signup
**Endpoint Mapping:**
- `POST /user/signup` → `registerUser(firstName, lastName, email, password, phone, address)`
- `POST /user/login` → `loginJobSeeker(email, password)` returns `{ accessToken, refreshToken, user }`
- `POST /user/refresh-token` → Handle token expiry auto-refresh

**Current Implementation Issues:**
- AuthContext stores `token` but backend returns `{ accessToken, refreshToken }`
- Logout needs to call backend to invalidate tokens
- No auto-refresh on token expiry

**Changes Needed:**
1. Update `AuthContext` to store both tokens:
   ```typescript
   interface AuthState {
     user: User | null;
     accessToken: string | null;
     refreshToken: string | null;
     isAuthenticated: boolean;
   }
   ```

2. Create token refresh interceptor in HTTP client:
   - Catch 401 responses
   - Call `/user/refresh-token` with refresh token
   - Retry original request
   - If refresh fails, logout user

3. Update LoginPage to handle signup option (currently only has login)

### 2.2 Token Storage & Security
- Store tokens in localStorage (current implementation)
- **Consider:** httpOnly cookies for better security (requires backend support)
- Add token expiry tracking
- Clear tokens on logout via `/user/logout/{userId}` endpoint

---

## 3. Resume Management Integration

### 3.1 Save Resume
**Current:** `saveBuilderStep()` is a no-op  
**Endpoints:**
- `POST /resume/resumes` — Save new resume
  - Request: `{ contactDetails, jobUrl }`
  - Response: `{ id, createdAt, ... }`

- `PATCH /resume/resumes/{resume_id}` — Partial update
  - Request: `{ professionalSummary, skills, ... }`

**Implementation:**
1. Replace `submitCV()` to POST entire resume to `/resume/resumes`
2. Store returned `resumeId` in BuilderContext
3. Implement auto-save for drafts using PATCH on step completion
4. Update BuilderPage to show save status (pending, saved, error)

### 3.2 Fetch User's Resumes
**Endpoint:** `GET /resume/resumes/user`  
**Current:** Uses localStorage  
**Goal:** Fetch from backend on login & cache locally

**Changes:**
1. On successful login, fetch `/resume/resumes/user`
2. Store in BuilderContext or new ResumesContext
3. Populate DashboardPage with fetched CVs instead of localStorage
4. Sync deletions/updates back to backend

### 3.3 Delete & Update Resume
**Endpoints:**
- `DELETE /resume/resumes/{resume_id}` — Delete a resume
- `PUT /resume/resumes/{resume_id}` — Full update (not partial)
- `GET /resume/resumes/{resume_id}` — Fetch single resume

**Implementation:**
- Wire up DashboardPage delete/edit buttons to these endpoints
- Add loading states
- Show success/error toasts

---

## 4. AI Features Integration

### 4.1 AI Suggestions Endpoint
**Endpoint:** `POST /resume/resumes/ai-suggestions` (Supports conversational flow)

**Request:**
```json
{
  "fieldName": "workExperience|skills|professionalSummary|certifications",
  "currentContent": "...",
  "jobDescription": "...",
  "conversationId": "optional-for-context"
}
```

**Response:**
```json
{
  "conversationId": "uuid",
  "items": ["suggestion1", "suggestion2"],
  "fieldName": "...",
  "reasoning": "..."
}
```

**Current Implementation:**
- Separate functions: `getAIBulletPoints()`, `getAISkillSuggestions()`, `generateSummary()`
- Returns mock arrays

**Changes:**
1. Create unified `requestAISuggestions()` function
2. Support conversational context (maintain `conversationId` across calls)
3. Merge responses into builder state
4. Show loading state in Step 5 & 6 where AI is used

**Integration Points:**
- Step 3 (Work History) — Suggest work experience bullets
- Step 5 (Skills) — Suggest skills
- Step 6 (Summary) — Generate professional summary
- Step 7 (Additional) — Suggest certifications

---

## 5. User Products & Payments (Optional - Phase 2)

### 5.1 Products
**Endpoints:**
- `GET /product/active` — List all CV review packages
- `GET /product/find/{product_id}` — Get single product

**Current:** Not used in frontend  
**Future:** Pricing page, product selection before checkout

### 5.2 Payments
**Endpoints:**
- `POST /payment/initiate` — Start payment for a product
- `GET /payment/verify/{transaction_id}` — Check payment status
- `GET /payment/user-payments?userId={user_id}` — Payment history

**Current:** Not implemented  
**Future:** Payment checkout flow, transaction history on dashboard

### 5.3 Purchased Products
**Endpoint:** `GET /user-product/get/{user_id}` — Get user's purchased services

**Current:** Not used  
**Future:** Dashboard display of purchased credits/services

---

## 6. Error Handling & Interceptors

### 6.1 HTTP Client Interceptors
**Request Interceptor:**
- Inject `Authorization: Bearer {accessToken}` header
- Add `X-User-Id` and `X-User-Roles` headers (from Postman docs)
- Add request timestamp/correlation ID

**Response Interceptor:**
- 401 Unauthorized → Auto-refresh token
- 403 Forbidden → Show "Access Denied" error
- 4xx → Show user-friendly error message
- 5xx → Show "Server Error, try again later"
- Network errors → Retry with exponential backoff

### 6.2 Error Messages
- Create standardized error handler
- Map backend error codes to user-friendly messages
- Log errors for debugging

### 6.3 Loading States
- Show spinners during API calls
- Disable form submissions during requests
- Show success/error toasts using UI library

---

## 7. Implementation Phases

### Phase 1: Foundation (Week 1)
- [ ] Setup environment variables & configuration
- [ ] Create HTTP client with auth & error handling
- [ ] Update AuthContext for dual tokens (access + refresh)
- [ ] Implement login/signup integration
- [ ] Test auth flow end-to-end

### Phase 2: Resume Management (Week 2)
- [ ] Implement `submitCV()` to save resume to backend
- [ ] Fetch user resumes on login
- [ ] Wire up DashboardPage to backend data
- [ ] Implement delete/update resume
- [ ] Test CRUD operations

### Phase 3: AI Features (Week 2-3)
- [ ] Integrate AI suggestions endpoint
- [ ] Update Step 3, 5, 6 components
- [ ] Test conversational context across multiple requests
- [ ] Add loading states for AI requests

### Phase 4: Polish & Testing (Week 3)
- [ ] End-to-end testing of all user flows
- [ ] Handle edge cases (network timeouts, token expiry)
- [ ] Performance optimization (caching)
- [ ] Security review (token handling, XSS prevention)

### Phase 5: Future Enhancements (Phase 2)
- [ ] Payment integration
- [ ] Product listing & checkout
- [ ] Notifications system
- [ ] Admin dashboard for products

---

## 8. Key Files to Modify

| File | Change | Priority |
|------|--------|----------|
| `src/config/api.config.ts` | NEW: Env config | P0 |
| `src/services/http-client.ts` | NEW: HTTP wrapper | P0 |
| `src/services/api.ts` | Replace mocks with real calls | P0 |
| `src/context/AuthContext.tsx` | Support dual tokens + refresh | P0 |
| `src/pages/auth/LoginPage.tsx` | Handle signup, better errors | P1 |
| `src/pages/builder/BuilderPage.tsx` | Auto-save drafts to backend | P1 |
| `src/pages/builder/BuilderResultPage.tsx` | Submit to backend resume endpoint | P1 |
| `src/pages/dashboard/DashboardPage.tsx` | Load CVs from backend | P1 |
| `.env` | Add API URL variables | P0 |
| `vite.config.ts` | Configure env loading | P0 |
| `package.json` | Add axios/fetch (if needed) | P0 |

---

## 9. Testing Strategy

### 9.1 Unit Tests
- HTTP client interceptors
- Token refresh logic
- Error handling

### 9.2 Integration Tests
- Auth flow: signup → login → token refresh → logout
- Resume flow: save → fetch → update → delete
- AI suggestions: multiple sequential requests with conversation ID

### 9.3 Manual Testing Checklist
- [ ] Login with valid/invalid credentials
- [ ] Token refresh on expiry
- [ ] Logout invalidates session
- [ ] Save resume and find in dashboard
- [ ] AI suggestions work for all field types
- [ ] Network error handling (simulate offline)
- [ ] Concurrent requests (multiple saves)

---

## 10. API Gateway Configuration

**Base URL Pattern:** `http://localhost:8080` (dev), `https://api.reviewyme.com` (prod)

**All requests route through:**
```
{GATEWAY_URL}/{service}/{endpoint}
```

Examples:
- `POST {GATEWAY_URL}/user/login`
- `POST {GATEWAY_URL}/resume/resumes`
- `POST {GATEWAY_URL}/resume/resumes/ai-suggestions`
- `GET {GATEWAY_URL}/product/active`

**Auth Header:** `Authorization: Bearer {accessToken}`

---

## 11. Postman Collection Reference

The Postman collection (`Reviewyme API Collection Shared.postman_collection-shared-v1.json`) contains:

**Auth Service:**
- Register Customer: `POST /user/signup`
- Login: `POST /user/login` → returns `accessToken`, `refreshToken`
- Refresh Token: `POST /user/refresh-token`
- Get Own Profile: `GET /user/profile`
- Get User by ID: `GET /user/{user_id}`
- Logout: `DELETE /user/logout/{user_id}`

**Resume Service:**
- Save Resume: `POST /resume/resumes`
- Get Resume: `GET /resume/resumes/{resume_id}`
- Update Resume: `PATCH /resume/resumes/{resume_id}`
- Delete Resume: `DELETE /resume/resumes/{resume_id}`
- Get User CVs: `GET /resume/resumes/user`
- AI Suggestions: `POST /resume/resumes/ai-suggestions` (supports conversation flow)

**Product Service:**
- List Active: `GET /product/active`
- Get Product: `GET /product/find/{product_id}`
- Create/Update/Deactivate: Requires admin auth

**Payment Service:**
- Initiate: `POST /payment/initiate`
- Verify: `GET /payment/verify/{transaction_id}`
- History: `GET /payment/user-payments?userId={user_id}`

**Notification & User-Product Services:** Also available but not critical for MVP

---

## 12. Questions to Clarify

1. **API Gateway:** Is the gateway URL environment-specific or does it route all services?
2. **Authentication:** Should we use httpOnly cookies or Bearer tokens in localStorage?
3. **Auto-save:** How frequently should resume drafts auto-save? (on blur? on step complete? manual?)
4. **Token Expiry:** What's the TTL for access/refresh tokens? How should we handle expiry?
5. **Error Handling:** Should we show a generic error dialog or inline field-level errors?
6. **Payment Flow:** Is payment integration required for MVP or Phase 2?
7. **AI Conversations:** Should we persist conversation IDs locally or start fresh each session?
8. **Rate Limiting:** Does the backend have rate limits we should respect?

---

## Next Steps

1. **Setup Phase:** Create config, HTTP client, update environment
2. **Auth Phase:** Integrate login/signup with real endpoints
3. **Validation:** Test auth flow end-to-end
4. **Resume Phase:** Wire up save/fetch/delete operations
5. **AI Phase:** Integrate suggestions with conversational context
6. **Polish:** Handle errors, loading states, edge cases
7. **Testing:** Full QA and performance testing

---

**Document Status:** Ready for discussion  
**Last Updated:** 2026-06-24  
**Created By:** Claude Code
