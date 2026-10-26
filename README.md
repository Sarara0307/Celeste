# SaveSense — Your money, your dreams, your pace.

> **Tagline**: *“Your money, your dreams, your pace.”*  
> **Audience**: Young adults, students, first-job earners, freelancers, and first-time savers.

---

## 📌 Product Vision

**SaveSense** is a beginner-friendly, calm financial management and vision board application designed for young adults experiencing financial independence for the first time.

Instead of intimidating Wall Street jargon, dense tables, or judgmental alerts about spending, SaveSense brings a warm, editorial lifestyle aesthetic that helps users answer four essential questions:

1. **Where is my money going?**
2. **How much can I safely spend?**
3. **How can I save without feeling overwhelmed?**
4. **How can I turn my financial dreams into achievable goals?**

---

## 🎨 Visual Identity & Design System

- **Cream Background**: `#F7F5EC`
- **White Surface Cards**: `#FFFFFF` with warm subtle borders (`#E9E1D1`)
- **Sage Green**: `#B8CBB3` (progress rings, milestone badges)
- **Deep Forest Green**: `#49664D` (primary buttons, major headers)
- **Soft Sand**: `#E9E1D1` / `#FAF7F0` (secondary surfaces, tag pills)
- **Muted Gray-Green**: `#657365` (calm helper copy)
- **Primary Text**: `#2C382E` (high contrast, accessible readability)
- **Typography**: Editorial serif accents (`Newsreader`), clean UI body (`Plus Jakarta Sans`), and tabular figures (`JetBrains Mono`).

---

## 🌟 Core Features & 5-Tab Architecture

### 1. Home (`home`)
- **"Here's where you stand"**: Warm morning/afternoon greeting with persona badge.
- **Money Weather Card**: Human-first calm indicators (*Clear Skies*, *Gentle Breeze*, or *Shelter Mode*) with weather icons.
- **The Payday Bridge**: Available money after upcoming essential bills and planned dreams divided by days remaining until next income (*"You have ₹14,200 available for the next 11 days. That's an average of ₹1,290 per day."*).
- **"Coming up soon"**: Ring-fenced Bill Shield preview with 1-tap "Mark Paid".
- **"Your next little win"**: Encouragement card for the dream closest to its next milestone.
- **"Your dreams in progress"**: Grid preview of active vision board dreams.

### 2. My Money (`money`)
- **Two-Tap Expense Logger**: Quick amount input, instant category buttons, and tags (Chai, Mess, Metro, Coffee).
- **Payday Bridge Engine**: Detailed calculation formula with zero double-counting.
- **Bill Shield**: Unpaid bills ring-fenced from spendable balance with toggle between List View and Calendar Timeline.
- **Leftover Finder**: Allocates unspent surplus directly into a Vision Board dream.
- **Full Transaction Ledger**: Search, category filters, and CSV export.

### 3. Vision Board (`vision`) — Signature Feature
- **Visual Dreams Grid**: Curated photography and personal dreams for the current year (MacBook, First Apartment, Mountain Trek, Emergency Fund, Education).
- **Priority Tags**: *Important now*, *Working toward it*, *Someday*.
- **"Make It Happen" Goal Planner**: Reality Check feasibility summary comparing required monthly contributions with real available budget.
- **Milestone Celebrations**: Gentle celebrations and confetti at 10%, 25%, 50%, 75%, and 100%.
- **Year-End Reflection**: Gratitude summary of total money saved toward dreams.

### 4. Goals (`goals`)
- **Virtual Savings Buckets / Jars**: Target amounts, current saved amounts, and monthly contribution pacing.
- **"Buy, Wait, or Skip" Purchase Simulator**:
  - Tests non-essential purchases before spending.
  - Predicts spendable balance change, daily pace drop, and goal delays.
  - Offers 3 supportive choices:
    1. *Buy Now* (logs expense if budget allows)
    2. *Wait 48 Hours* (adds to gentle cooling-off wishlist)
    3. *Skip & Save to Dream* (redirects the impulse amount directly into savings).

### 5. Profile & Settings (`profile`)
- **Young Adult Persona Selector**: Student, First Job, Freelancer, Young Professional, Explorer.
- **Monthly Income & Payday Editor**: Instant update to monthly earnings and next payday date.
- **Monthly Fresh Start Wizard**: Clean cycle reset that preserves all vision board history.
- **Data Ownership & Backup**: Local browser storage, zero tracking, and JSON backup export.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS v4
- **Animation & Confetti**: Canvas-Confetti, Motion
- **Icons**: Lucide React
- **Typography**: Newsreader, Plus Jakarta Sans, JetBrains Mono
- **Build Tool**: Vite
- **Storage**: Client-side LocalStorage in integer paise (1 INR = 100 paise)
