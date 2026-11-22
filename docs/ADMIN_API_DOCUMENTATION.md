# AeroMarine Administrative API Documentation

**Base Path**: `/api/admin`  
**Authentication**: Bearer Token (`Authorization: Bearer <JWT>`)  
**Required Role**: `admin`, `owner`, `finance`, `operations`, or `support`  

---

## Endpoint Index

### 1. Operations Overview
#### `GET /api/admin/overview`
Retrieves consolidated platform metrics, queue counters, financial balances, and recent audit activity.
- **Response `200 OK`**:
```json
{
  "status": "success",
  "success": true,
  "data": {
    "totalUsers": 142,
    "users": { "total": 142, "active": 139, "suspended": 2, "newToday": 14 },
    "deposits": { "total": 85, "pendingCount": 4, "approvedCount": 78, "rejectedCount": 3, "totalAmount": 1450000 },
    "withdrawals": { "total": 32, "pendingCount": 2, "approvedCount": 28, "rejectedCount": 2, "totalAmount": 420000 },
    "positions": { "total": 64, "activeCount": 58, "completedCount": 6, "activePlansCount": 8 },
    "financial": { "totalRecharged": 1450000, "totalWithdrawn": 420000, "netTreasury": 1030000 },
    "recentActivity": [
      {
        "_id": "673fa1...",
        "action": "APPROVE_RECHARGE",
        "actorPhone": "8427348239",
        "actorRole": "admin",
        "targetType": "Recharge",
        "targetId": "REC-9944",
        "reason": "Verified bank statement credit",
        "createdAt": "2026-11-22T10:14:00.000Z"
      }
    ]
  }
}
```

---

### 2. User Governance & Inspection
#### `GET /api/admin/users`
Lists members with optional query filters and pagination.
- **Query Parameters**:
  - `search`: String (phone, name, referral code, or ID)
  - `status`: `all` | `active` | `suspended` | `blocked`
  - `page`: Integer (default: 1)
  - `limit`: Integer (default: 50)
- **Response `200 OK`**: Returns array of user objects with wallet summary.

#### `GET /api/admin/users/:id`
Retrieves comprehensive user dossier including owned containers, ledger transactions, recharges, withdrawals, and notes.
- **Response `200 OK`**:
```json
{
  "status": "success",
  "success": true,
  "data": {
    "user": { "_id": "...", "name": "...", "phone": "...", "wallet": { ... }, "adminNotes": [ ... ] },
    "orders": [ ... ],
    "recharges": [ ... ],
    "withdrawals": [ ... ],
    "records": [ ... ],
    "auditLogs": [ ... ]
  }
}
```

#### `PATCH /api/admin/users/:id/status`
Updates account operational status.
- **Request Body**:
```json
{
  "status": "suspended",
  "reason": "Suspicious rapid recharge without banking UTR verification"
}
```
- **Valid Status Values**: `active`, `suspended`, `blocked`.

#### `POST /api/admin/users/:id/notes`
Adds an internal administrative note to the member dossier.
- **Request Body**:
```json
{
  "note": "Verified customer identity via passport scan on support ticket #4912"
}
```

#### `GET /api/admin/reconcile/:userId`
Non-destructive ledger verification. Computes sum of credit/debit records and validates against current wallet balance.

---

### 3. Deposit Request Management
#### `GET /api/admin/deposits` (or `/api/admin/recharges`)
Lists customer deposit requests with optional `?status=pending|approved|rejected|all`.

#### `POST /api/admin/deposits/:id/action`
Approves, rejects, or flags a deposit request.
- **Request Body**:
```json
{
  "action": "approve",
  "adminNote": "Verified ICICI Bank credit statement UTR 2026112299"
}
```
- **Actions**:
  - `approve`: Atomically credits `wallet.availableBalance` and writes a `recharge` ledger entry.
  - `reject`: Marks request rejected with administrative note.
  - `under_review`: Sets status to `under_review` while communicating with banking provider.

---

### 4. Withdrawal Payout Management
#### `GET /api/admin/withdrawals`
Lists customer withdrawal requests with optional `?status=pending|processing|paid|rejected|all`.

#### `POST /api/admin/withdrawals/:id/action`
Processes a withdrawal request.
- **Request Body**:
```json
{
  "action": "mark_paid",
  "payoutReference": "IMPS202611228899",
  "adminNote": "Dispatched via corporate HDFC portal"
}
```
- **Actions**:
  - `mark_paid`: Requires `payoutReference` (UTR). Deducts from `reservedBalance`, marks `paid`, writes ledger entry.
  - `approve`: Moves status to `processing`.
  - `reject`: Releases reserved funds, atomically returning money to the user's `availableBalance`.

---

### 5. Container Fleet Plan Management
#### `GET /api/admin/plans`
Lists all container investment plans including active and archived units.

#### `POST /api/admin/plans`
Creates a standardized container fleet plan.
- **Request Body**:
```json
{
  "name": "40ft High Cube Marine Dry Cargo",
  "slug": "high-cube-40ft",
  "category": "High-Cube Container",
  "description": "Standard international ocean freight container unit",
  "imageUrl": "https://images.unsplash.com/...",
  "price": 25000,
  "durationDays": 45,
  "dailyRatePercent": 1.45,
  "availableUnits": 100
}
```

#### `PATCH /api/admin/plans/:id`
Updates fleet plan parameters.

#### `DELETE /api/admin/plans/:id`
Safely archives a plan (`isActive: false`) without mutating existing user lease agreements.

---

### 6. Daily Earnings Engine
#### `POST /api/admin/earnings/preview`
Simulates daily charter yield accruals for the specified calendar date without writing to the database.
- **Request Body**: `{ "period": "2026-11-22" }`

#### `POST /api/admin/earnings/post`
Executes idempotent daily batch accrual, crediting confirmed daily yield into member wallets.
- **Request Body**: `{ "period": "2026-11-22" }`

---

### 7. Platform Operational Settings
#### `GET /api/admin/settings`
Returns operational configuration including banking coordinates, UPI IDs, financial thresholds, and maintenance status.

#### `PATCH /api/admin/settings`
Updates platform operational parameters and writes an audit log entry.
