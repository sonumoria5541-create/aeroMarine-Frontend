# AeroMarine Administrative Security & Permissions Matrix

**Specification ID**: SEC-RBAC-2026-V2  
**Framework**: Express.js Middleware + MongoDB Mongoose Schemas  

---

## 1. Role Hierarchy

AeroMarine categorizes administrative users into five segmented tiers:

```
[owner] (Unrestricted, Protected Super Admin)
   │
   ├── [admin] (Full Operational & System Access)
   │      │
   │      ├── [finance] (Deposit / Withdrawal Ledgers & Reconciliation)
   │      │
   │      ├── [operations] (Container Plans, Fleet Orders & Yield Engine)
   │      │
   │      └── [support] (User Directory, Support Notes & Inquiries)
```

---

## 2. Permissions Matrix

| Operational Capability | `owner` | `admin` | `finance` | `operations` | `support` | User |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **View Dashboard Overview** | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| **View User Directory** | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| **Inspect User Full Profile** | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| **Suspend / Reactivate User** | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Permanently Block User** | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Add Internal Admin Note** | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| **Reconcile User Ledger** | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Approve Deposit (Credit Balance)** | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Reject Deposit (Invalid UTR)** | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Mark Withdrawal Paid (Record UTR)**| ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Reject Withdrawal (Refund User)** | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Create / Edit Container Plan** | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ |
| **Archive Container Plan** | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ |
| **Preview / Post Daily Yields** | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ |
| **Update Platform Bank Settings** | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Update Financial Thresholds** | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **View Security Audit Logs** | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |

---

## 3. Protected Owner Guard

To prevent catastrophic administrative lockout or rogue employee privilege escalation:
- The root administrative account (`8427348239`) is flagged with `isProtectedOwner: true`.
- Backend controller middleware explicitly prevents `isProtectedOwner` accounts from being blocked, suspended, or having their administrative permissions modified.
- Attempting to block a protected owner returns HTTP `403 Forbidden`: `"Protected Owner account cannot be modified or suspended."`

---

## 4. Token & Session Revocation

1. **Access Tokens**: Short-lived (15 minutes), signed with `JWT_ACCESS_SECRET`.
2. **Refresh Tokens**: Stored in HTTP-only, SameSite cookies or persistent `RefreshSession` collection.
3. **Emergency Revocation**:
   - Suspending or blocking a user account immediately invalidates their session.
   - The authentication middleware checks `user.status` on every request. If status is `suspended` or `blocked`, HTTP `403 Forbidden` is returned immediately, terminating all open tabs.
