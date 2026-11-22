# AeroMarine Shipping & Exports — Admin Control Center Operating Guide

**Version**: 2.0 (Production Hardened)  
**System Classification**: Maritime Container Logistics & Financial Ledger Operations  
**Target Environments**:
- Production Frontend: `https://aeromarine.site/admin`
- Production Backend: `https://api.aeromarine.site/api/admin`
- Staging / Local: `http://localhost:5173/admin` | `http://localhost:5000/api/admin`

---

## 1. System Overview & Architecture

The AeroMarine Admin Control Center is an enterprise operations desk engineered for managing international container fleet investments, automated charter yield accruals, member account governance, and manual banking reconciliation.

### Operational Principles
1. **Immutable Ledger Accounting**: Wallet balances (`availableBalance`, `reservedBalance`) are strictly reconciled against append-only transactional ledger records. No raw balance mutators exist in normal operation.
2. **Atomic Financial Transitions**: Recharges, withdrawals, and fleet container leases utilize MongoDB database transactions (`session.withTransaction`) to guarantee that balance debits, ledger recordings, and status transitions occur simultaneously with zero risk of partial updates.
3. **Role-Based Governance**: Access to sensitive operations (approvals, user blocking, fee modifications) is segmented across hierarchical staff roles: `owner`, `admin`, `finance`, `operations`, and `support`.
4. **Permanent Audit Tracing**: Every administrative action (blocking a user, approving a recharge, updating banking coordinates, executing daily batches) writes a tamper-resistant record to `AuditLog`.

---

## 2. Default Administrative Access

| Credential Field | Value | Role |
| :--- | :--- | :--- |
| **Mobile Number** | `8427348239` | `admin` / Protected Owner |
| **Password** | `Monu@2006` | High-Entropy Operator Secret |
| **Immunity** | **Protected Owner** | Cannot be blocked, suspended, or demoted |

> [!IMPORTANT]
> To bootstrap a new administrative account from the terminal, execute:
> ```bash
> cd server
> npm run admin:create
> ```

---

## 3. Module Operations & Standard Procedures

### Module 1: Maritime Operations Overview (`/admin`)
- **Key Metrics**:
  - **Pending Deposits**: Number of pending bank/UPI transfers awaiting verification.
  - **Pending Withdrawals**: Number of user payout requests requiring dispatch.
  - **Total Members**: Active vs. suspended vs. blocked account counts.
  - **Active Fleet Units**: Number of running container leases yielding charter revenue.
  - **Net Treasury**: Total verified deposits less total confirmed dispatches.
- **Real-Time Audit Stream**: Displays the 10 most recent operational events including actor, target, timestamp, and audit reason.

### Module 2: User Account Directory (`/admin/users`)
- **Search & Filter**: Search instantaneously by member name, phone number, referral code, or MongoDB ObjectID. Filter by `active`, `suspended`, or `blocked`.
- **Account Inspection Drawer**:
  - **Overview**: View total recharges, withdrawals, available balance, and linked bank coordinates.
  - **Status Governance**: Change status between `active`, `suspended` (temporary pause), and `blocked` (permanent security lock). Requires mandatory audit reason.
  - **Ledger Non-Destructive Reconciliation**: Computes balance integrity by comparing the cached wallet balance against all credit and debit records.
  - **Fleet Containers Owned**: Lists all container units leased by the user with operational status and timeline.
  - **Ledger Log**: Full chronological statement of user ledger activity.
  - **Internal Admin Notes**: Add operator notes visible exclusively to administrative staff.

### Module 3: Deposit Management Desk (`/admin/deposits`)
- **Verification Workflow**:
  1. Operator reviews deposit request with amount, user phone, and UTR / Transaction Reference.
  2. If proof advice is attached, operator clicks **Inspect** to review the uploaded bank receipt.
  3. Verify bank balance receipt in corporate banking portal.
  4. Click **Approve & Credit Balance**: Executes atomic database transaction crediting `availableBalance` and creating a `recharge` ledger record.
  5. If fraudulent or invalid, operator provides rejection reason and clicks **Reject**.

### Module 4: Withdrawal Payout Desk (`/admin/withdrawals`)
- **Payout Workflow**:
  1. When a user requests withdrawal, funds are atomically moved from `availableBalance` to `reservedBalance`.
  2. Operator reviews destination bank account / UPI ID.
  3. Operator initiates IMPS / NEFT / RTGS transfer via corporate bank.
  4. Operator inputs bank **UTR / IMPS Reference Number** into the payout desk.
  5. Operator clicks **Confirm Dispatched & Mark Paid**: Atomically removes funds from `reservedBalance`, marks withdrawal `paid`, and writes `withdrawal` ledger record.
  6. **Rejection Handling**: If account details are invalid, clicking **Reject & Release Funds** unlocks the reserved funds and atomically credits them back to the user's available balance.

### Module 5: Container Fleet Plan Management (`/admin/plans`)
- **Fleet Catalog Governance**:
  - Add standardized container units (e.g. 20ft Standard Dry Cargo, 40ft High Cube Reefer, 40ft Open Top Marine).
  - Configure duration (terms: 15–180 days), purchase price (₹5,000–₹500,000), and daily return percentage.
  - Set cargo category, route description, and high-resolution vessel imagery.
  - Archive obsolete plans without breaking historical user purchase records.

### Module 6: Daily Fleet Earnings Engine (`/admin/earnings`)
- **Revenue Accrual Batch Execution**:
  1. Select calendar accrual period (YYYY-MM-DD).
  2. Click **Preview Daily Batch**: Engine iterates through all active leases, calculates daily charter yield rate, and previews total payout volume.
  3. Click **Post Daily Batch to Ledger**: Executes idempotent posting. Existing accruals for that date and position are skipped, guaranteeing zero duplicate payouts.

### Module 7: Platform Operational Settings (`/admin/settings`)
- **Configurable Coordinates**:
  - **Deposit Bank Details**: Bank name, account holder name, account number, IFSC code, and branch.
  - **Official UPI ID**: Displayed on customer deposit advice screens.
  - **Financial Limits**: Minimum deposit (₹250), minimum withdrawal (₹120), maximum withdrawal limit, and withdrawal fee percentage.
  - **Platform Announcements**: Broadcast advisory notices to members during weather delays or scheduled maintenance.
  - **Support Email**: Official compliance contact point.

### Module 8: Security Audit Logs (`/admin/audit-logs`)
- Complete historical audit stream showing all operator actions, IP addresses, actor credentials, before/after snapshots, and reasons. Supports pagination.
