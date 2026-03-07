

# Wakala Business Management System (WBMS) — Frontend with Mock Data

## Overview
A modern, colorful dashboard-based management system for Wakala (mobile money agent) businesses. Frontend-only with mock data, English UI.

## Pages & Layout

### Layout
- **Sidebar navigation** with colorful icons, collapsible
- Two views: **Admin** and **Office Staff** (toggle via a role switcher in the sidebar for demo purposes)
- Modern design: gradient header, colored stat cards, vibrant accent colors (blues, greens, oranges)

### Pages

1. **Admin Dashboard** (`/`)
   - Summary cards: Total Float, Total Balance, Total Transactions Today, Active Offices
   - Bar/line chart: daily transaction volume across offices
   - Office-wise float breakdown table
   - Alerts panel: low float warnings, abnormal activity flags

2. **Offices** (`/offices`)
   - List/grid of offices with status, location, assigned staff count, float summary
   - Add/Edit/Delete office modal (name, location, GPS optional)

3. **Staff** (`/staff`)
   - Table of staff with office assignment, role (Manager/Staff), transaction count
   - Add/Edit/Delete staff modal with office & role selection

4. **Float Management** (`/float`)
   - Record deposit/withdrawal form (select office, network: M-Pesa/Tigo/Airtel, amount)
   - Float balance table per office & network
   - Admin sees all offices; staff sees own office only

5. **Transactions** (`/transactions`)
   - Record transaction form: type (Cash In/Cash Out/Bill Payment/Airtime), network, amount, office, staff
   - Transaction history table with filters (date, office, staff, type, network)
   - Optional receipt preview/print

6. **Reports** (`/reports`)
   - Date range & office filters
   - Summary cards + charts for daily/weekly/monthly
   - Transaction summary per office table
   - Commission tracking section

7. **Alerts** (`/alerts`)
   - List of alerts: low float (per network/office), high transaction volume
   - Alert status (new/acknowledged)

### Office Staff View
When role is switched to "Staff", sidebar shows only: Office Dashboard, Float, Transactions, and limited Reports. The Office Dashboard mirrors the admin dashboard but scoped to one office.

## Mock Data
- 3–4 sample offices, 8–10 staff members, ~50 sample transactions
- Networks: M-Pesa, Tigo Pesa, Airtel Money
- Realistic Tanzanian-style data (TZS currency)

## Key UI Elements
- Colorful gradient stat cards (green for float, blue for transactions, orange for alerts)
- Recharts for charts
- Shadcn tables, forms, modals, and toasts
- Responsive layout for desktop and tablet

