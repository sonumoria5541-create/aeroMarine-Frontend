# AEROMARINE — COMPREHENSIVE ADMIN PANEL & CMS USER GUIDE

Welcome to the **AeroMarine Website Management System & Operations Control Center**.

This production-ready Content Management System (CMS) enables you to independently manage every user-facing aspect of your website without requiring a developer.

---

## Table of Contents
1. [Logging In and Accessing the Control Center](#1-logging-in-and-accessing-the-control-center)
2. [Operations Dashboard & Digital Presence Hub](#2-operations-dashboard--digital-presence-hub)
3. [Page Management & Live Section Builder](#3-page-management--live-section-builder)
4. [Centralized Media Library & Asset Picker](#4-centralized-media-library--asset-picker)
5. [Website Appearance & Global Branding](#5-website-appearance--global-branding)
6. [Navigation Menus & Header/Footer Links](#6-navigation-menus--headerfooter-links)
7. [Customer Inquiries & Leads Desk](#7-customer-inquiries--leads-desk)
8. [Automated SEO Engine & Dynamic XML Sitemap](#8-automated-seo-engine--dynamic-xml-sitemap)
9. [Fleet Container Plans & Commercial Pricing](#9-fleet-container-plans--commercial-pricing)
10. [Deposits, Withdrawals & Ledger Governance](#10-deposits-withdrawals--ledger-governance)
11. [Staff Administration & Granular Permissions](#11-staff-administration--granular-permissions)
12. [Troubleshooting, Backups & Disaster Recovery](#12-troubleshooting-backups--disaster-recovery)

---

## 1. Logging In and Accessing the Control Center

### Access URL
Navigate to:  
`https://www.aeromarine.site/login` (or click **Sign In** in the top navigation).

### Authentication
1. Enter your registered administrative phone number (e.g., `8427348239`).
2. Enter your secure password.
3. Upon authentication, click the **Admin Control** badge in the header or visit `https://www.aeromarine.site/admin`.

> [!IMPORTANT]
> The primary owner account (`8427348239`) possesses immutable system ownership (`isProtectedOwner: true`). It can never be deleted, suspended, or demoted by any other staff member.

---

## 2. Operations Dashboard & Digital Presence Hub

The Operations Overview (`/admin`) serves as a unified dual-engine control room:
1. **Financial & Operations Desk**:
   - Live count of pending deposits requiring bank transaction slip verification.
   - Live count of pending withdrawals awaiting payment dispatch.
   - Total inflow verified, total confirmed payouts, and net treasury balance.
2. **Website CMS & Digital Presence Hub**:
   - Real-time count of published CMS pages.
   - Pending customer inquiries from the contact desk.
   - Total assets stored in the Media Library.
   - Live SEO health score (%) and direct link to the dynamic sitemap.
   - Quick Action buttons: *Create Page*, *Media Library*, *Inquiries*, *Appearance*, *Nav Menus*, *SEO Audit*, and *Visit Live Site*.
3. **Real-Time Operational Audit Feed**:
   - Chronological immutable log of all administrative actions, timestamps, and staff actors.

---

## 3. Page Management & Live Section Builder

Access via the sidebar: **Website Management → Website Pages** (`/admin/pages`).

### Creating a New Page
1. Click the **+ Create New Page** button.
2. Provide a **Page Title** (e.g., `Global Air Charter Lines`).
3. Set the **URL Slug** (e.g., `air-cargo`). The full URL will automatically become `https://www.aeromarine.site/air-cargo`.
4. Choose **Status**:
   - `draft`: Only visible to administrators in preview mode.
   - `published`: Immediately accessible to the general public.
5. Enter per-page **SEO Meta Title** and **Meta Description** with live character counters.

### Protected System Pages
System-critical pages (`home`, `about`, `contact`, `terms`, `privacy`, `risk-disclosure`, `refund-policy`, `containers`) are marked with a purple **System Page** badge. They cannot be accidentally deleted, ensuring your core website navigation remains intact.

### Building & Reordering Sections
Each page is composed of flexible, modular visual blocks:
1. Click **+ Add Section** and choose a section block:
   - **Hero Section**: High-impact banner with headline, subtitle, badge tag, CTA button, and background image/video.
   - **Statistics Counters**: Grid of numerical metrics (e.g., "120,000 TEU Capacity", "48 Global Hubs").
   - **Features & Capabilities**: 3-column card grid with custom icons, titles, and explanations.
   - **Fleet Plans Catalog**: Displays live interactive container leasing plans.
   - **About Maritime Story**: Two-column layout featuring high-resolution photography and company history.
   - **Testimonials & Social Proof**: Client reviews and logistics partner quotes.
   - **Frequently Asked Questions (FAQ)**: Accordion list for answers to customer questions.
   - **Rich Text / Legal Content**: Formatted policy text, articles, or contract specifications.
   - **Call To Action (CTA)**: High-conversion banner driving users to open an account or contact operations.
   - **Contact & Inquiry Block**: Integrated contact details and submission form.
2. **Reordering Sections**: Use the **↑ Move Up** and **↓ Move Down** arrows to adjust the visual order on the page.
3. **Visibility Toggle**: Click the eye icon to temporarily hide a section without deleting it.
4. **Duplicate Section**: Clone an existing section layout with a single click.
5. **Interactive Live Preview**: Toggle between **Desktop** and **Mobile** viewports directly inside the editor to verify your layout before saving.

---

## 4. Centralized Media Library & Asset Picker

Access via the sidebar: **Website Management → Media Library** (`/admin/media`).

### Uploading Assets
1. Drag and drop any image (`.jpg`, `.jpeg`, `.png`, `.webp`, `.svg`, `.gif`) into the upload zone or click **Browse Files**.
2. Files up to 25MB are accepted.
3. Images are automatically processed, formatted, and stored with fallback support.
4. Select a category folder (*General*, *Hero & Banners*, *Containers & Vessels*, *Logistics Icons*, *Legal & Documents*).

### Managing Media Metadata
Click on any asset in the gallery to open the **Asset Inspector**:
- View file dimensions, MIME type, and exact file size.
- Set descriptive **Alt Text** for Google Image SEO and accessibility.
- Set a **Caption** or internal description.
- Copy the public CDN URL to your clipboard with one click.

### Integrated Media Picker
When editing any page section (such as a Hero background or story image), click **Choose from Media Library** to open the modal, search your media catalog, or upload a new asset directly without leaving the page editor.

### Safe Deletion Protection
Before an asset is deleted, the system checks whether the image is actively used on any published CMS page or branding setting. If in use, the system warns the administrator to prevent broken images on your public website.

---

## 5. Website Appearance & Global Branding

Access via the sidebar: **Website Management → Appearance & Design** (`/admin/appearance`).

Manage your website's visual brand identity in one centralized panel:
- **Branding**:
  - Site Name (e.g., `AeroMarine`).
  - Tagline (e.g., `Global Maritime Logistics & Cargo Container Platform`).
  - Website Logo URL (select from Media Library).
  - Favicon URL (tab icon).
- **Brand Color Palette**:
  - Primary Brand Color (e.g., `#0B2545` Maritime Navy).
  - Secondary Accent Color (e.g., `#00A896` Sea Teal).
  - Contrast Action Color (e.g., `#E76F51` Cargo Orange).
- **Header Settings**:
  - Sticky navigation bar toggle (remains visible as visitors scroll).
- **Footer Information**:
  - Company overview paragraph.
  - Operations headquarters address.
  - Support contact email and phone number.
  - Copyright statement and legal registration lines.
- **Live Announcement Marquee**:
  - Toggle on/off the announcement banner ticker.
  - Customize the real-time announcement text displayed across the website.

---

## 6. Navigation Menus & Header/Footer Links

Access via the sidebar: **Website Management → Navigation Menus** (`/admin/navigation`).

Control where links point across your header and footer:
1. Select the menu you wish to edit (**Main Header Navigation** or **Footer Navigation**).
2. Click **+ Add Menu Link**.
3. Enter the link text (e.g., `Cold-Chain Reefers`) and destination URL (e.g., `/containers`).
4. Choose whether the link should open in a **New Tab** (ideal for external partner sites).
5. Use the arrow controls to rearrange the display sequence of menu items.
6. Click **Save Navigation Menu**. Changes reflect immediately on the live website.

---

## 7. Customer Inquiries & Leads Desk

Access via the sidebar: **Operations & Business → Customer Inquiries** (`/admin/inquiries`).

Every message submitted through the public website contact desk (`/contact`) is automatically captured, assigned a unique tracking identifier (e.g., `INQ-48201-9842`), and backed by an instant email notification.

### Inquiries Desk Features
- **KPI Summary Cards**: Total Inquiries, New Unassigned Leads, Under Review, and Resolved.
- **Search & Filter**: Find inquiries by customer name, email, phone number, status, or priority.
- **Triage & Status Updates**:
  - Move status between `new`, `in_progress`, `resolved`, `closed`, and `spam`.
  - Set priority to `low`, `medium`, `high`, or `urgent`.
- **Internal Coordinator Notes**: Add private internal notes and audit history for other staff officers.
- **Export to CSV**: Export your customer leads to spreadsheet format for CRM import or offline archiving.

---

## 8. Automated SEO Engine & Dynamic XML Sitemap

Access via the sidebar: **Website Management → SEO & Sitemap** (`/admin/seo`).

### Automated SEO Audit Report
The built-in SEO Engine automatically scans every published page and returns an overall health rating (0–100%) alongside prioritized warnings:
- Checks for missing or overly short page titles (< 30 characters).
- Checks for missing meta descriptions (< 60 characters).
- Warns against duplicate titles or descriptions across pages.
- Flags images missing descriptive alt tags.
- Provides direct **Fix in Editor** links for each detected issue.

### Dynamic Search Engine Feeds
- **XML Sitemap**: Accessible at `https://www.aeromarine.site/sitemap.xml`. Automatically regenerates dynamically from your published pages with accurate `<lastmod>` timestamps and priorities.
- **Robots.txt**: Accessible at `https://www.aeromarine.site/robots.txt`. Grants search engine crawlers access to public routes while protecting admin, wallet, and authentication routes.

---

## 9. Fleet Container Plans & Commercial Pricing

Access via the sidebar: **Commercial & Fleet → Container Plans** (`/admin/plans`).

### Managing Fleet Offerings
- Create, modify, and manage container leasing contracts.
- Commercial Fleet Yield rules:
  - Minimum plan investment starts at **₹750** (with subsequent tiers: ₹1,000, ₹2,000, ₹3,000, ₹4,500, ₹5,500, ₹6,500, ₹8,000, ₹10,000, ₹15,000, ₹25,000+).
  - Yield: **13.3% daily payout** calculated on automated cron cycles.
  - Multi-tier Referral Rewards: **Tier 1: 30%**, **Tier 2: 10%**, **Tier 3: 5%** credited on member deposit activations.

> [!CAUTION]
> Changing the pricing or yield on an active plan only affects future container leases. It will never retroactively modify or disrupt active member lease agreements already recorded in the financial ledger.

---

## 10. Deposits, Withdrawals & Ledger Governance

### Reviewing Deposits (`/admin/deposits`)
1. Filter by `Pending` to view recent bank/UPI transfers.
2. Inspect the submitted UTR (Unique Transaction Reference) and proof screenshot.
3. Click **Approve** to credit the user's recharge wallet, or **Reject** with a recorded reason if the transaction is unverified.

### Reviewing Withdrawals (`/admin/withdrawals`)
1. Review member withdrawal requests, IFSC codes, and account details.
2. Confirm bank transfer dispatch.
3. Click **Approve** to finalize the payout, or **Reject** to refund the funds back to the user's available balance.

---

## 11. Staff Administration & Granular Permissions

Access via the sidebar: **Operations & Business → Staff & Roles** (`/admin/staff`).

Manage your operations team with role-based access control (RBAC):
- **Roles**:
  - `Admin`: Full control over CMS, media, appearance, commercial plans, and operations.
  - `Finance Officer`: Specialized access to deposit verifications, withdrawal queues, and bank reconciliation.
  - `Support Officer`: Access to inquiries desk, customer communication, and verification logs.
  - `Operations Officer`: Access to fleet orders, user status, and daily operations.
- **Granular Permissions Checklist**:
  - `canManagePages`: Create and edit website pages.
  - `canManageContent`: Modify page sections and text.
  - `canManageMedia`: Upload and delete media assets.
  - `canManageAppearance`: Change website branding and theme colors.
  - `canManageNav`: Update navigation and header/footer links.
  - `canManageSEO`: Configure SEO metadata and sitemaps.
  - `canManageForms`: Triage customer inquiries and export leads.
  - `canManageStaff`: Add or modify administrative officers.
  - `canPublish`: Authorize live publishing of website content.
- **Owner Account Protection**: The primary owner account (`8427348239`) is hard-coded as non-removable and non-demotable.

---

## 12. Troubleshooting, Backups & Disaster Recovery

### Common Scenarios

| Issue | Cause | Solution |
|---|---|---|
| Page changes not visible on live site | Page is saved in `draft` mode | Open page in editor, set Status to `published`, and click Save. |
| Cannot delete a page | Page is protected as a System Page | System pages cannot be deleted to prevent broken URLs. Change page status to `draft` instead if you wish to hide it. |
| Image upload fails | File exceeds 25MB or invalid format | Compress the image or convert to JPG, PNG, or WebP before uploading. |
| Contact form not receiving emails | Resend API key missing or unverified domain | Ensure `RESEND_API_KEY` is configured in `server/.env`. All submissions remain safely backed up in the Inquiries Desk (`/admin/inquiries`) regardless of email status. |

### Emergency Support
For infrastructure or hosting assistance, contact your designated system administrator or DevOps team.
