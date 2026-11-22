# AeroMarine — Security & Financial Invariants

## 1. Financial Correctness Invariants
1. **Single Source of Truth:** The backend immutable ledger is the only source of truth for funds. Client requests cannot supply balance values.
2. **Integer Minor Units:** All internal calculations store integer minor units (paise: 1 INR = 100 paise) to prevent floating-point rounding errors.
3. **Double-Entry Balanced Accounting:** Every posted operation generates balancing debit and credit entries.
4. **Deposit Safety:** Submitting a deposit request sets status to `pending` and increments `pendingDepositsPaise`. It **never** touches available balance until an authorized admin explicitly verifies the bank credit.
5. **Withdrawal Reservation:** Submitting a withdrawal atomically reserves available funds in the ledger. Concurrent requests cannot double-spend or create a negative balance.
6. **Reservation Release:** Rejecting or cancelling a withdrawal releases the reserved balance back to available balance exactly once.
7. **Simulation Isolation:** In DEMO mode, all earnings records carry `isDemo: true` and are isolated from live banking balances.

---

## 2. Authentication & Session Security
- **Bcrypt:** Work factor 10 hashing for passwords. Plaintext passwords and hashes are never exposed.
- **Tokens:** Short-lived access token (15 mins) and rotating refresh token in `HttpOnly`, `SameSite: 'lax'`, `Secure` cookies.
- **Session Hash:** Refresh tokens are hashed using SHA-256 before storage in MongoDB.
- **Replay Protection:** If an expired or already-revoked refresh token is re-submitted, all active refresh sessions for that user account are revoked.
- **Suspension Middleware:** Inactive or suspended accounts are rejected on every authenticated API endpoint.

---

## 3. Rate Limiting & Input Validation
- Rate limits applied to authentication (`/auth/login`, `/auth/register`), financial actions, and contact forms.
- Request payload validation and sanitization using Zod.
- Payment proof uploads restricted to JPEG, PNG, WEBP, and PDF under 5MB.
