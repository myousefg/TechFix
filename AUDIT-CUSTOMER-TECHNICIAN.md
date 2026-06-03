# Audit Report: Customer & Technician Portal
**Date**: 3 Juni 2026  
**Scope**: Customer portal (`/customer/*`) + Technician portal (`/technician/*`)  
**Files**: `src/pages/customer/index.jsx` (644 lines), `src/pages/technician/index.jsx` (365 lines), AccountSettings, CustomerOrderDetail, TechnicianOrderDetailPage

---

## Executive Summary

Total issues found: **31 issues**
- **Critical (P0)**: 8 - Dead buttons, hardcoded data, missing pages
- **High (P1)**: 12 - UI/UX polish, missing charts/stats, incomplete flows
- **Medium (P2)**: 11 - Nice-to-have features, improvements

---

## 🔴 Critical Issues (P0) - 8 items

### Customer Portal

**C1. Notification center incomplete**
- Bell icon exists, dropdown shows notifications
- **Missing**: No `/customer/notifications` page for full list
- **Missing**: Notification actions don't navigate anywhere (just mark read)
- Current: 4 hardcoded notifs in dropdown
- Need: Full notification history page with filter, search

**C2. Orders list shows ALL orders (not filtered by customer)**
- `CustomerOrders` does `getOrders()` without filtering by current customer
- Shows orders from ALL customers
- Need: Filter by `customerId` or `customer` name

**C3. Subscription flow incomplete**
- Can subscribe/change plan via UI
- **Missing**: No payment confirmation step (just toast.success)
- **Missing**: No subscription history (when subscribed, when renewed, payment logs)
- **Missing**: Auto-renewal toggle
- Need: Payment modal + history tab

**C4. Account settings hardcoded**
- `getAccountSettings()` returns hardcoded object `{ name: 'Andi Saputra', email: 'andi@email.com', ... }`
- Not tied to real customer data from store
- Need: Pull from getCurrentCustomer() / store

### Technician Portal

**T1. Dashboard stats hardcoded**
- Total earnings: hardcoded "Rp2.4jt" text
- Order count: hardcoded "48 order"
- Need: Pull from real orders (filter by techId, sum amount, count)

**T2. Orders list shows ALL orders (not filtered by technician)**
- `TechnicianOrders` does `getOrders()` and displays all
- Shows customer orders too
- Need: Filter by `techId` or `tech` name

**T3. Earnings chart hardcoded**
- Chart data: `[800, 1200, 1500, 1800, 2100, 2400]` hardcoded
- Months: Jan-Jun 2025 (outdated, should be 2026)
- Need: Calculate from real completed orders grouped by month

**T4. Withdraw flow dead button**
- "Cairkan Dana" button exists
- No backend, no confirmation modal, no withdrawal history
- Need: Withdrawal modal + history + status tracking

---

## 🟡 High Priority (P1) - 12 items

### Customer Portal

**C5. Technician comparison missing**
- Can view individual tech profiles
- **Missing**: Compare 2-3 technicians side-by-side (price, rating, reviews, availability)
- Would improve decision-making

**C6. Booking history no filters**
- CustomerOrders shows all orders as flat list
- **Missing**: Filter by status (waiting/in_progress/done), date range, technician
- **Missing**: Search by order ID or service name

**C7. Review flow incomplete**
- Order detail has rating display
- **Missing**: "Write review" button for completed orders without review
- **Missing**: Review submission form
- Need: Review modal with rating + text + photo upload

**C8. Favorite/bookmark technicians missing**
- Can browse technicians
- **Missing**: Save favorite technicians for quick rebooking
- **Missing**: "Favorites" tab in customer home

**C9. Dispute/refund flow missing**
- Escrow shows status but no action
- **Missing**: "Request refund" or "File dispute" button for failed orders
- Need: Dispute form + reason selection + evidence upload

**C10. Payment proof upload missing**
- Booking flow selects payment method
- **Missing**: Upload payment proof (screenshot/receipt)
- **Missing**: Payment status tracking (pending/verified/failed)

### Technician Portal

**T5. Order acceptance flow unclear**
- Order detail shows order info
- **Missing**: Clear "Accept Order" / "Reject Order" buttons for new orders
- Currently no way for tech to confirm availability

**T6. Job status update missing**
- Can view order detail
- **Missing**: Update status buttons: "Start Job", "Mark Complete", "Upload Proof"
- **Missing**: Add notes/remarks to order

**T7. Rating/review from customers not visible**
- Dashboard shows aggregate rating
- **Missing**: List of reviews received (per order)
- **Missing**: Reply to customer reviews

**T8. Premium listing upgrade dead**
- Settings page shows 3 plans (Basic/Gold/Platinum)
- "Upgrade ke Gold" button exists but does nothing
- Need: Payment modal for upgrade + confirmation

**T9. KYC status not displayed**
- Register flow submits KYC
- **Missing**: KYC status check in dashboard/settings
- **Missing**: Rejection reason if rejected
- Need: KYC status card in settings

**T10. Profile edit missing**
- Settings shows profile card with name/email
- **Missing**: Edit profile button
- **Missing**: Update specialty, location, pricing, availability

---

## 🟢 Medium Priority (P2) - 11 items

### Customer Portal

**C11. Location picker uses generic getUserLocation()**
- "Terdekat" filter calls getUserLocation() but no location picker UI
- Need: Location picker modal (select from map or search)

**C12. Service categories only show 6**
- Homepage grid shows `services.slice(0,6)`
- Total 10+ services in data.js
- Need: "Lihat semua" button → full service list page

**C13. Promo/voucher code missing**
- Booking flow has payment selection
- **Missing**: Voucher/promo code input field
- **Missing**: Show discount applied

**C14. Rebook/repeat order missing**
- Order history shows past orders
- **Missing**: "Book again" button to repeat order with same tech

**C15. Chat with technician missing**
- After booking, no direct contact
- **Missing**: In-app chat or WhatsApp quick link

**C16. Schedule/calendar picker basic**
- Booking shows date/time inputs as text fields
- Need: Visual calendar picker with tech availability

### Technician Portal

**T11. Availability calendar missing**
- No way to set available dates/hours
- Need: Calendar where tech marks available slots

**T12. Performance insights missing**
- Earnings page shows bar chart
- **Missing**: Completion rate, avg rating trend, busiest days
- Need: More analytics widgets

**T13. Marketing tools missing**
- Premium listing exists
- **Missing**: Promo campaigns (discount for new customers)
- **Missing**: Share referral link

**T14. Training/certification badges missing**
- Profile shows verified badge
- **Missing**: Upload certifications (Apple certified, etc.)
- **Missing**: Skill badges display

**T15. Notification preferences missing**
- Settings page exists
- **Missing**: Toggle notifications (new order, payment received, review posted)

---

## Data Integrity Issues

**D1. Orders not filtered by user**
- Both CustomerOrders and TechnicianOrders call `getOrders()` globally
- Need: `getOrders().filter(o => o.customerId === currentCustomerId)` for customer
- Need: `getOrders().filter(o => o.techId === currentTechId)` for technician

**D2. Hardcoded stats**
- Customer subscription: "Aktif hingga 30 Jun 2025" hardcoded
- Technician earnings: "Total 2025" should be "Total 2026"
- Technician premium: "Aktif hingga 30 Jun 2025" should use subscription data

**D3. Profile data mismatch**
- Customer settings shows "Andi Saputra" hardcoded
- Technician settings shows "Budi Santoso" hardcoded
- Need: Pull from store based on current session

---

## Missing Pages

1. `/customer/notifications` - Full notification history
2. `/customer/favorites` - Saved technicians
3. `/customer/compare` - Compare technicians
4. `/customer/dispute/:id` - Dispute detail & tracking
5. `/technician/reviews` - Reviews received
6. `/technician/availability` - Calendar for availability
7. `/technician/analytics` - Performance insights

---

## Quick Wins (Can fix in 1 phase)

1. Filter orders by customer/technician (C2, T2) - store.js helper
2. Pull real stats (T1, T3) - calculate from orders
3. Add "Write Review" button (C7) - modal component
4. Add "Accept/Reject Order" buttons (T5) - status update
5. Show KYC status in tech settings (T9) - pull from getKYCRequests
6. Update hardcoded dates to 2026 (D2)
7. Fix account settings to pull from store (C4, D3)
8. Add notification page route (C1)
9. Add subscription history tab (C3)
10. Add order filters (C6)

---

## Recommendations

### Phase 1: Data Integrity (1-2 hours)
- Fix order filtering (C2, T2)
- Pull real stats (T1, T3, D2)
- Connect account settings to store (C4, D3)
- Add store helpers: `getCustomerOrders(customerId)`, `getTechnicianOrders(techId)`, `getTechnicianEarnings(techId)`

### Phase 2: Core UX (2-3 hours)
- Order action buttons: Accept/Reject for tech (T5), Write Review for customer (C7)
- Status update flow: Start Job, Mark Complete, Add Notes (T6)
- Payment/withdrawal modals: Payment confirmation (C3), Withdraw modal (T4)
- KYC status display in tech settings (T9)

### Phase 3: Missing Pages (3-4 hours)
- Notification center page (C1)
- Subscription history (C3)
- Reviews list for technician (T7)
- Favorite technicians (C8)
- Technician profile edit (T10)

### Phase 4: Advanced Features (4-5 hours)
- Technician comparison (C5)
- Dispute/refund flow (C9)
- Availability calendar (T11)
- Performance analytics (T12)
- Review reply system (T7)

---

## Priority Matrix

```
High Impact + Easy = DO FIRST
├─ C2, T2: Filter orders (30 min)
├─ T1, T3: Real stats (1 hour)
├─ C4, D3: Account settings (30 min)
├─ T5, T6: Order actions (1 hour)
└─ C7: Write review (1 hour)

High Impact + Medium = DO NEXT
├─ C1: Notification page (1.5 hours)
├─ C3: Subscription history (1 hour)
├─ T9: KYC status (30 min)
├─ T7: Reviews received (1.5 hours)
└─ C9: Dispute flow (2 hours)

Lower Impact = LATER
├─ C5: Tech comparison (2 hours)
├─ T11: Availability calendar (3 hours)
├─ T12: Analytics (2 hours)
└─ C8: Favorites (1.5 hours)
```

---

## Summary

**Customer portal** is 60% complete - core flows work but missing crucial features like review submission, dispute handling, and notification center.

**Technician portal** is 55% complete - can view orders but can't act on them (accept/reject), earnings data is hardcoded, KYC status invisible.

Both portals need immediate data integrity fixes (order filtering) before adding new features.

**Estimated effort**: 12-16 hours total for full completion across 4 phases.
