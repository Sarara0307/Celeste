/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  AvatarPetState,
  Bill,
  CategoryBudget,
  Challenge,
  HabitCard,
  HarmonyMember,
  PartnerRewardBadge,
  SavingsJar,
  Transaction,
  UserSettings,
  VisionDream,
} from '../types/finance';
import { getTodayDateString } from '../utils/formatters';

const STORAGE_KEYS = {
  TRANSACTIONS: 'savesense_transactions_v1',
  BILLS: 'savesense_bills_v1',
  JARS: 'savesense_jars_v1',
  BUDGETS: 'savesense_budgets_v1',
  SETTINGS: 'savesense_settings_v1',
  CHALLENGES: 'savesense_challenges_v1',
  DREAMS: 'savesense_vision_dreams_v1',
  HABITS: 'savesense_habits_v1',
  AVATAR_PET: 'savesense_avatar_pet_v1',
  HARMONY_MEMBERS: 'savesense_harmony_members_v1',
};

export const INITIAL_SETTINGS: UserSettings = {
  userName: 'Aarav Sharma',
  persona: 'first_job',
  monthlyIncomePaise: 2800000, // ₹28,000 (Young Professional / First Salary)
  nextIncomeDate: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0], // 11 days until payday
  budgetCycleStartDay: 1,
  emergencyReservePaise: 200000, // ₹2,000 safety cushion
  currencySymbol: '₹',
  currencyCode: 'INR',
  onboardingCompleted: true,
  theme: 'warm',
};

export const INITIAL_DREAMS: VisionDream[] = [
  {
    id: 'dream-laptop',
    title: 'M3 MacBook for Design & Dev',
    description: 'High performance laptop to take on freelance design & full-stack development projects.',
    category: 'Gadgets & Technology',
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
    targetPaise: 4800000, // ₹48,000
    savedPaise: 1800000, // ₹18,000 (37.5%)
    targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    priority: 'now',
    personalMotivation: 'Build real client products and unlock my career freedom.',
    suggestedMonthlyPaise: 1000000,
    celebratedMilestones: [10, 25],
  },
  {
    id: 'dream-apartment',
    title: 'Cozy First Apartment Deposit',
    description: 'Security deposit for a sunlit 1BHK close to work with a dedicated balcony plant haven.',
    category: 'First Apartment',
    imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
    targetPaise: 3500000, // ₹35,000
    savedPaise: 1400000, // ₹14,000 (40%)
    targetDate: new Date(Date.now() + 150 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    priority: 'working',
    personalMotivation: 'My own peaceful, independent space to thrive and unwind after work.',
    suggestedMonthlyPaise: 420000,
    celebratedMilestones: [10, 25],
  },
  {
    id: 'dream-travel',
    title: 'Himachal Misty Mountain Trek',
    description: 'A 5-day backpacking trip across Spiti & Kasol with childhood best friends.',
    category: 'Travel & Experiences',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    targetPaise: 1400000, // ₹14,000
    savedPaise: 700000, // ₹7,000 (50%)
    targetDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    priority: 'now',
    personalMotivation: 'Breathe crisp mountain air and create unforgettable memories before winter.',
    suggestedMonthlyPaise: 350000,
    celebratedMilestones: [10, 25, 50],
  },
  {
    id: 'dream-emergency',
    title: 'Rainy Day Peace-of-Mind Fund',
    description: 'A dedicated safety pillow so surprise medical bills or laptop repairs never stress me out.',
    category: 'Emergency Savings',
    imageUrl: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=800&q=80',
    targetPaise: 2500000, // ₹25,000
    savedPaise: 1500000, // ₹15,000 (60%)
    targetDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    priority: 'now',
    personalMotivation: 'Financial resilience means I never have to borrow from parents in an emergency.',
    suggestedMonthlyPaise: 250000,
    celebratedMilestones: [10, 25, 50],
  },
];

export const INITIAL_BUDGETS: CategoryBudget[] = [
  { category: 'Food & Groceries', budgetPaise: 450000, isEssential: true }, // ₹4,500
  { category: 'Housing & Rent', budgetPaise: 300000, isEssential: true }, // ₹3,000
  { category: 'Utilities', budgetPaise: 150000, isEssential: true }, // ₹1,500
  { category: 'Transport', budgetPaise: 100000, isEssential: true }, // ₹1,000
  { category: 'Education & Books', budgetPaise: 150000, isEssential: true }, // ₹1,500
  { category: 'Shopping & Gadgets', budgetPaise: 150000, isEssential: false }, // ₹1,500
  { category: 'Subscriptions', budgetPaise: 50000, isEssential: false }, // ₹500
  { category: 'Entertainment', budgetPaise: 50000, isEssential: false }, // ₹500
  { category: 'Personal Care', budgetPaise: 50000, isEssential: false }, // ₹500
];

export const INITIAL_BILLS: Bill[] = [
  {
    id: 'bill-1',
    name: 'High-Speed Wi-Fi Broadband',
    amountPaise: 79900, // ₹799
    dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0],
    frequency: 'monthly',
    isPaid: false,
    category: 'Utilities',
    priority: 'essential',
    autoDeductFromSpendable: true,
    notes: 'Campus connection bill',
  },
  {
    id: 'bill-2',
    name: 'Hostel Electricity & Maintenance',
    amountPaise: 120000, // ₹1,200
    dueDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0],
    frequency: 'monthly',
    isPaid: false,
    category: 'Utilities',
    priority: 'essential',
    autoDeductFromSpendable: true,
  },
  {
    id: 'bill-3',
    name: 'Prepaid Mobile 5G Plan',
    amountPaise: 29900, // ₹299
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0],
    frequency: 'monthly',
    isPaid: false,
    category: 'Utilities',
    priority: 'essential',
    autoDeductFromSpendable: true,
  },
  {
    id: 'bill-4',
    name: 'Online Learning Platform Subscription',
    amountPaise: 49900, // ₹499
    dueDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0],
    frequency: 'monthly',
    isPaid: false,
    category: 'Subscriptions',
    priority: 'discretionary',
    autoDeductFromSpendable: false,
  },
];

export const INITIAL_JARS: SavingsJar[] = [
  {
    id: 'jar-laptop',
    name: 'Engineering Laptop',
    category: 'gadgets',
    targetPaise: 1200000, // ₹12,000 target
    savedPaise: 400000, // ₹4,000 saved
    targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0], // 3 months
    monthlyContributionTargetPaise: 200000, // ₹2,000 / month
    priority: 'high',
    color: '#6366f1', // Indigo
    iconName: 'Laptop',
    notes: 'For coding projects & hackathons',
  },
  {
    id: 'jar-emergency',
    name: 'Rainy Day Emergency Fund',
    category: 'emergency',
    targetPaise: 1000000, // ₹10,000
    savedPaise: 350000, // ₹3,500 saved
    targetDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0],
    monthlyContributionTargetPaise: 150000, // ₹1,500 / month
    priority: 'high',
    color: '#10b981', // Emerald
    iconName: 'ShieldCheck',
    notes: 'Unforeseen medical or device repair buffer',
  },
  {
    id: 'jar-travel',
    name: 'Hackathon Travel & Trip',
    category: 'travel',
    targetPaise: 600000, // ₹6,000
    savedPaise: 150000, // ₹1,500 saved
    targetDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0],
    monthlyContributionTargetPaise: 100000, // ₹1,000 / month
    priority: 'medium',
    color: '#06b6d4', // Cyan
    iconName: 'Plane',
    notes: 'Train tickets & stay for regional tech fest',
  },
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-1',
    date: getTodayDateString(),
    description: 'Monthly Research Fellowship / Stipend',
    amountPaise: 1500000, // ₹15,000
    type: 'income',
    category: 'Other',
    notes: 'Direct university deposit',
  },
  {
    id: 'tx-2',
    date: getTodayDateString(),
    description: 'Monthly contribution to Laptop Jar',
    amountPaise: 200000, // ₹2,000
    type: 'savings_deposit',
    category: 'Investments & Savings',
    jarId: 'jar-laptop',
    notes: 'Reserved for upcoming laptop purchase',
  },
  {
    id: 'tx-3',
    date: getTodayDateString(),
    description: 'Weekly Mess & Groceries',
    amountPaise: 245000, // ₹2,450
    type: 'essential_expense',
    category: 'Food & Groceries',
    notes: 'Weekly fresh meal prep',
  },
  {
    id: 'tx-4',
    date: getTodayDateString(),
    description: 'Metro Card Monthly Pass Recharge',
    amountPaise: 60000, // ₹600
    type: 'essential_expense',
    category: 'Transport',
    notes: 'Daily commute to campus labs',
  },
  {
    id: 'tx-5',
    date: getTodayDateString(),
    description: 'Algorithms & Data Structures Textbook',
    amountPaise: 85000, // ₹850
    type: 'essential_expense',
    category: 'Education & Books',
    notes: 'Required semester reference textbook',
  },
  {
    id: 'tx-6',
    date: getTodayDateString(),
    description: 'Campus Cafe & Evening Chai with study group',
    amountPaise: 28000, // ₹280
    type: 'discretionary_expense',
    category: 'Food & Groceries',
    notes: 'Weekend project discussion',
  },
];

export const INITIAL_CHALLENGES: Challenge[] = [
  {
    id: 'chal-track-7',
    title: '7-Day Logging Streak',
    description: 'Log every expense daily for 7 consecutive days without missing a single entry.',
    category: 'tracking',
    targetDays: 7,
    currentStreak: 5,
    isCompleted: false,
    xpReward: 100,
    badgeName: 'Clarity Champion',
    icon: 'Flame',
    rules: 'Record at least 1 expense or confirm a zero-spend day.',
  },
  {
    id: 'chal-sub-audit',
    title: 'Subscription Spring Cleaning',
    description: 'Review all recurring apps & subscriptions. Cancel or pause at least one unused subscription.',
    category: 'discipline',
    targetDays: 1,
    currentStreak: 1,
    isCompleted: true,
    completedAt: getTodayDateString(),
    xpReward: 150,
    badgeName: 'Leaky Bucket Plugger',
    icon: 'Scissors',
    rules: 'Audit recurring bills calendar and toggle off inactive subscriptions.',
  },
  {
    id: 'chal-micro-save',
    title: 'Weekly ₹500 Micro-Save',
    description: 'Deposit an extra ₹500 into your Emergency Fund Jar without touching essentials.',
    category: 'saving',
    targetDays: 4,
    currentStreak: 2,
    isCompleted: false,
    xpReward: 200,
    badgeName: 'Micro-Stacker',
    icon: 'PiggyBank',
    rules: 'Automate or deposit ₹500 per week into any smart savings jar.',
  },
  {
    id: 'chal-discretionary-cap',
    title: 'Weekend Spend Cap',
    description: 'Keep discretionary coffee, snacks, and shopping under ₹800 this weekend.',
    category: 'discipline',
    targetDays: 2,
    currentStreak: 2,
    isCompleted: true,
    completedAt: getTodayDateString(),
    xpReward: 120,
    badgeName: 'Weekend Warrior',
    icon: 'Target',
    rules: 'Review safe-to-spend allowance before making non-essential purchases.',
  },
];

export const INITIAL_HABITS: HabitCard[] = [
  {
    id: 'habit-coffee',
    title: 'Skipped $5 Coffee / Boba',
    category: 'Dining & Drinks',
    amountPaise: 15000, // ₹150 (~$5)
    amountUsd: 5,
    icon: 'Coffee',
    description: 'Brewed coffee at home instead of buying a latte on the go.',
    timesLogged: 4,
    totalSavedPaise: 60000,
  },
  {
    id: 'habit-dinner',
    title: 'Cooked Dinner at Home',
    category: 'Food & Groceries',
    amountPaise: 35000, // ₹350 (~$12)
    amountUsd: 12,
    icon: 'UtensilsCrossed',
    description: 'Whipped up a tasty pantry meal instead of ordering takeout.',
    timesLogged: 3,
    totalSavedPaise: 105000,
  },
  {
    id: 'habit-transit',
    title: 'Took Metro / Walked',
    category: 'Transport',
    amountPaise: 12000, // ₹120 (~$4)
    amountUsd: 4,
    icon: 'Footprints',
    description: 'Walked or hopped on the bus instead of booking a rideshare.',
    timesLogged: 5,
    totalSavedPaise: 60000,
  },
  {
    id: 'habit-water',
    title: 'Refilled Own Water Bottle',
    category: 'Everyday',
    amountPaise: 8000, // ₹80 (~$3)
    amountUsd: 3,
    icon: 'Droplet',
    description: 'Carried reusable bottle and avoided buying single-use bottled water.',
    timesLogged: 6,
    totalSavedPaise: 48000,
  },
  {
    id: 'habit-sub',
    title: 'Paused Unused Subscription',
    category: 'Subscriptions',
    amountPaise: 45000, // ₹450 (~$15)
    amountUsd: 15,
    icon: 'Tv',
    description: 'Audited monthly subscriptions and cancelled an idle streaming app.',
    timesLogged: 1,
    totalSavedPaise: 45000,
  },
  {
    id: 'habit-impulse',
    title: 'Waited 24h on Impulse Buy',
    category: 'Shopping',
    amountPaise: 80000, // ₹800 (~$25)
    amountUsd: 25,
    icon: 'Clock',
    description: 'Put an item on the 24-hour cooling-off wishlist and decided to skip it.',
    timesLogged: 2,
    totalSavedPaise: 160000,
  },
];

export const INITIAL_AVATAR_PET: AvatarPetState = {
  name: 'Sproutling',
  level: 2,
  xp: 180,
  stage: 'sprout',
  totalSavedPaise: 478000, // ₹4,780 in micro-savings
  totalSavesCount: 21,
  streakDays: 4,
  lastInteractedDate: getTodayDateString(),
  favoriteFood: 'Green Leaves & Saved Pennies',
};

export const INITIAL_PARTNER_REWARDS: PartnerRewardBadge[] = [
  {
    id: 'reward-groceries',
    brand: 'FreshMart Organics',
    title: '10% Off Pantry Essentials',
    discountCode: 'SAVESENSE10',
    unlockedAtLevel: 2,
    category: 'Groceries',
    icon: 'ShoppingBag',
    description: '10% discount on orders over $25 at any FreshMart partner store.',
    isUnlocked: true,
  },
  {
    id: 'reward-books',
    brand: 'BookNook Learning',
    title: '15% Off Coding & Finance Books',
    discountCode: 'READSAVE15',
    unlockedAtLevel: 3,
    category: 'Education',
    icon: 'BookOpen',
    description: '15% discount on all non-fiction and tech development titles.',
    isUnlocked: false,
  },
  {
    id: 'reward-fitness',
    brand: 'FitPulse Yoga & Gym',
    title: '1-Month Free Guest Pass',
    discountCode: 'HEALTHYFINANCE',
    unlockedAtLevel: 4,
    category: 'Wellness',
    icon: 'Heart',
    description: 'Free 30-day membership access to all community yoga & gym sessions.',
    isUnlocked: false,
  },
  {
    id: 'reward-transit',
    brand: 'GreenTransit Network',
    title: '$20 / ₹500 Metro Transit Pass Credit',
    discountCode: 'CLEANRIDE20',
    unlockedAtLevel: 5,
    category: 'Transport',
    icon: 'Zap',
    description: 'Direct transit voucher credit toward your contactless metro or bus pass.',
    isUnlocked: false,
  },
];

export const INITIAL_HARMONY_MEMBERS: HarmonyMember[] = [
  {
    id: 'member-me',
    name: 'Aarav (You)',
    monthlyIncomePaise: 2800000, // ₹28,000 / mo
    paidPaise: 79900, // Paid ₹799 Wi-Fi bill upfront
    color: '#49664D',
    avatarInitial: 'A',
    isCurrentUser: true,
  },
  {
    id: 'member-riya',
    name: 'Riya (Roommate)',
    monthlyIncomePaise: 4200000, // ₹42,000 / mo
    paidPaise: 0,
    color: '#2B5F8C',
    avatarInitial: 'R',
  },
  {
    id: 'member-dev',
    name: 'Dev (Study Partner)',
    monthlyIncomePaise: 2000000, // ₹20,000 / mo
    paidPaise: 0,
    color: '#8C5B2B',
    avatarInitial: 'D',
  },
];

export class StorageService {
  public static getTransactions(): Transaction[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      return data ? JSON.parse(data) : INITIAL_TRANSACTIONS;
    } catch {
      return INITIAL_TRANSACTIONS;
    }
  }

  public static saveTransactions(transactions: Transaction[]): void {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  }

  public static getBills(): Bill[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BILLS);
      return data ? JSON.parse(data) : INITIAL_BILLS;
    } catch {
      return INITIAL_BILLS;
    }
  }

  public static saveBills(bills: Bill[]): void {
    localStorage.setItem(STORAGE_KEYS.BILLS, JSON.stringify(bills));
  }

  public static getJars(): SavingsJar[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.JARS);
      return data ? JSON.parse(data) : INITIAL_JARS;
    } catch {
      return INITIAL_JARS;
    }
  }

  public static saveJars(jars: SavingsJar[]): void {
    localStorage.setItem(STORAGE_KEYS.JARS, JSON.stringify(jars));
  }

  public static getBudgets(): CategoryBudget[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BUDGETS);
      return data ? JSON.parse(data) : INITIAL_BUDGETS;
    } catch {
      return INITIAL_BUDGETS;
    }
  }

  public static saveBudgets(budgets: CategoryBudget[]): void {
    localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(budgets));
  }

  public static getSettings(): UserSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? JSON.parse(data) : INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  }

  public static saveSettings(settings: UserSettings): void {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }

  public static getChallenges(): Challenge[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CHALLENGES);
      return data ? JSON.parse(data) : INITIAL_CHALLENGES;
    } catch {
      return INITIAL_CHALLENGES;
    }
  }

  public static saveChallenges(challenges: Challenge[]): void {
    localStorage.setItem(STORAGE_KEYS.CHALLENGES, JSON.stringify(challenges));
  }

  public static getDreams(): VisionDream[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DREAMS);
      return data ? JSON.parse(data) : INITIAL_DREAMS;
    } catch {
      return INITIAL_DREAMS;
    }
  }

  public static saveDreams(dreams: VisionDream[]): void {
    localStorage.setItem(STORAGE_KEYS.DREAMS, JSON.stringify(dreams));
  }

  public static getHabits(): HabitCard[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.HABITS);
      return data ? JSON.parse(data) : INITIAL_HABITS;
    } catch {
      return INITIAL_HABITS;
    }
  }

  public static saveHabits(habits: HabitCard[]): void {
    localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits));
  }

  public static getAvatarPet(): AvatarPetState {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.AVATAR_PET);
      return data ? JSON.parse(data) : INITIAL_AVATAR_PET;
    } catch {
      return INITIAL_AVATAR_PET;
    }
  }

  public static saveAvatarPet(pet: AvatarPetState): void {
    localStorage.setItem(STORAGE_KEYS.AVATAR_PET, JSON.stringify(pet));
  }

  public static getHarmonyMembers(): HarmonyMember[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.HARMONY_MEMBERS);
      return data ? JSON.parse(data) : INITIAL_HARMONY_MEMBERS;
    } catch {
      return INITIAL_HARMONY_MEMBERS;
    }
  }

  public static saveHarmonyMembers(members: HarmonyMember[]): void {
    localStorage.setItem(STORAGE_KEYS.HARMONY_MEMBERS, JSON.stringify(members));
  }

  /**
   * Resets entire store to initial clean hackathon state
   */
  public static resetToDemo(): void {
    this.saveSettings(INITIAL_SETTINGS);
    this.saveTransactions(INITIAL_TRANSACTIONS);
    this.saveBills(INITIAL_BILLS);
    this.saveJars(INITIAL_JARS);
    this.saveBudgets(INITIAL_BUDGETS);
    this.saveChallenges(INITIAL_CHALLENGES);
    this.saveDreams(INITIAL_DREAMS);
    this.saveHabits(INITIAL_HABITS);
    this.saveAvatarPet(INITIAL_AVATAR_PET);
    this.saveHarmonyMembers(INITIAL_HARMONY_MEMBERS);
  }

  /**
   * Export all user data as JSON
   */
  public static exportFullBackup(): string {
    const backup = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      settings: this.getSettings(),
      transactions: this.getTransactions(),
      bills: this.getBills(),
      jars: this.getJars(),
      budgets: this.getBudgets(),
      challenges: this.getChallenges(),
      dreams: this.getDreams(),
      habits: this.getHabits(),
      avatarPet: this.getAvatarPet(),
      harmonyMembers: this.getHarmonyMembers(),
    };
    return JSON.stringify(backup, null, 2);
  }

  /**
   * Export transactions as CSV
   */
  public static exportTransactionsCSV(): string {
    const txs = this.getTransactions();
    const headers = ['ID', 'Date', 'Description', 'Amount_Rupees', 'Type', 'Category', 'Notes'];
    const rows = txs.map((t) => [
      t.id,
      t.date,
      `"${t.description.replace(/"/g, '""')}"`,
      (t.amountPaise / 100).toFixed(2),
      t.type,
      `"${t.category}"`,
      `"${(t.notes || '').replace(/"/g, '""')}"`,
    ]);
    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  }

  /**
   * Import CSV transactions safely
   */
  public static importTransactionsCSV(csvContent: string): {
    success: boolean;
    importedCount: number;
    errors: string[];
  } {
    const lines = csvContent.trim().split('\n');
    if (lines.length < 2) {
      return { success: false, importedCount: 0, errors: ['CSV file is empty or missing headers.'] };
    }

    const currentTxs = this.getTransactions();
    const newTxs: Transaction[] = [];
    const errors: string[] = [];

    // Parse CSV lines
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      // Basic regex parser for comma separated values with quotes
      const matches = line.match(/(?:^|,)(?:"([^"]*)"|([^,]*))/g);
      if (!matches || matches.length < 3) {
        errors.push(`Row ${i + 1}: Malformed row.`);
        continue;
      }

      const cleanCol = (colStr: string) => colStr.replace(/^,/, '').replace(/^"/, '').replace(/"$/, '').trim();
      const date = cleanCol(matches[1] || matches[0]) || getTodayDateString();
      const desc = cleanCol(matches[2] || matches[1]) || 'Imported Transaction';
      const rawAmt = parseFloat(cleanCol(matches[3] || matches[2])) || 0;
      const typeRaw = matches[4] ? cleanCol(matches[4]) : 'discretionary_expense';
      const category = matches[5] ? cleanCol(matches[5]) : 'Other';

      if (rawAmt <= 0) {
        errors.push(`Row ${i + 1}: Invalid amount ₹${rawAmt}. Must be positive.`);
        continue;
      }

      newTxs.push({
        id: `tx-csv-${Date.now()}-${i}`,
        date,
        description: desc,
        amountPaise: Math.round(rawAmt * 100),
        type: (typeRaw as any) || 'discretionary_expense',
        category,
        notes: 'Imported via CSV',
      });
    }

    if (newTxs.length > 0) {
      this.saveTransactions([...newTxs, ...currentTxs]);
      return { success: true, importedCount: newTxs.length, errors };
    }

    return { success: false, importedCount: 0, errors };
  }
}
