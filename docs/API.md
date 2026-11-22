# AeroMarine — API Documentation

Base URL: `http://localhost:5000/api/v1`

---

## 1. Authentication (`/api/v1/auth`)

### 1.1 Register
- **Endpoint:** `POST /api/v1/auth/register`
- **Rate Limit:** 20 requests per 15 minutes
- **Body:**
  ```json
  {
    "name": "Captain Rohan Roy",
    "phone": "+919876543210",
    "email": "rohan@example.com",
    "password": "Password123!",
    "confirmPassword": "Password123!",
    "inviteCode": "AMSUPER1",
    "acceptTerms": true
  }
  ```
- **Response (201):**
  ```json
  {
    "success": true,
    "message": "Account created successfully.",
    "data": {
      "user": {
        "_id": "67...",
        "name": "Captain Rohan Roy",
        "phone": "+919876543210",
        "role": "user",
        "referralCode": "AMROH77"
      },
      "accessToken": "eyJhbGci..."
    }
  }
  ```

### 1.2 Login (No OTP)
- **Endpoint:** `POST /api/v1/auth/login`
- **Body:**
  ```json
  {
    "phone": "+919876543210",
    "password": "Password123!"
  }
  ```

### 1.3 Refresh Token Rotation
- **Endpoint:** `POST /api/v1/auth/refresh`
- Uses `HttpOnly` cookie or body token. Automatically invalidates old token and detects replay attacks.

### 1.4 Get Profile
- **Endpoint:** `GET /api/v1/auth/me`
- **Headers:** `Authorization: Bearer <accessToken>` or cookie.

---

## 2. Container Plans (`/api/v1/plans`)

- `GET /api/v1/plans`: List active, publishable plans.
- `GET /api/v1/plans/:slug`: Plan details with full specifications and illustrative breakdown.

---

## 3. Deposits (`/api/v1/deposits`)

- `POST /api/v1/deposits`: Submit manual bank/UPI transfer with reference. Available balance is **not** credited until verified.
- `GET /api/v1/deposits`: User's deposit request history.

---

## 4. Withdrawals (`/api/v1/withdrawals`)

- `POST /api/v1/withdrawals`: Atomically reserves spendable balance and submits request.
- `GET /api/v1/withdrawals`: User's withdrawal history and payout references.

---

## 5. Wallet & Ledger (`/api/v1/wallet`)

- `GET /api/v1/wallet`: Real-time ledger-backed balances.
- `GET /api/v1/wallet/reconcile`: Reconciles user balance against immutable debit/credit entries.
- `GET /api/v1/wallet/transactions`: Filterable ledger operations history.

---

## 6. Admin Control Center (`/api/v1/admin`)
*Requires `role: admin` or `super_admin`*

- `GET /api/v1/admin/overview`: Operations center KPIs.
- `GET /api/v1/admin/deposits`: Deposits queue.
- `POST /api/v1/admin/deposits/:id/action`: Approve (atomic double-entry ledger posting) or Reject (with reason).
- `GET /api/v1/admin/withdrawals`: Withdrawals queue.
- `POST /api/v1/admin/withdrawals/:id/action`: Approve / Mark Paid (with UTR) / Reject (releases reserved balance).
- `GET /api/v1/admin/users`: User directory with ledger balances.
- `PATCH /api/v1/admin/users/:id/status`: Suspend / activate account.
- `POST /api/v1/admin/plans`: Create new container plan.
- `POST /api/v1/admin/earnings/post`: Execute daily simulated earnings batch.
- `GET /api/v1/admin/audit-logs`: Searchable immutable security audit log.
