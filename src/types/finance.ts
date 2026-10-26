/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type TransactionType =
  | 'income'
  | 'essential_expense'
  | 'discretionary_expense'
  | 'bill_payment'
  | 'savings_deposit'
  | 'savings_withdrawal'
  | 'transfer';

export type ExpenseCategory =
  | 'Food & Groceries'
  | 'Housing & Rent'
  | 'Utilities'
  | 'Transport'
  | 'Education & Books'
  | 'Shopping & Gadgets'
  | 'Entertainment'
  | 'Subscriptions'
  | 'Healthcare'
  | 'Personal Care'
  | 'Investments & Savings'
  | 'Other';

export interface Transaction {
  id: string;
  date: string; // ISO YYYY-MM-DD
  description: string;
  amountPaise: number; // Stored in integer paise (1 INR = 100 paise)
  type: TransactionType;
  category: ExpenseCategory | string;
  jarId?: string; // If tied to a savings jar
  billId?: string; // If tied to a scheduled bill
  notes?: string;
  isRecurring?: boolean;
}

export type JarCategory =
  | 'emergency'
  | 'education'
  | 'gadgets'
  | 'travel'
  | 'personal'
  | 'custom';

export interface SavingsJar {
  id: string;
  name: string;
  category: JarCategory;
  targetPaise: number;
  savedPaise: number;
  targetDate: string; // YYYY-MM-DD
  monthlyContributionTargetPaise: number;
  priority: 'high' | 'medium' | 'low';
  color: string;
  iconName: string;
  isCustom?: boolean;
  notes?: string;
}

export type BillFrequency = 'monthly' | 'weekly' | 'quarterly' | 'annual' | 'one_time';

export interface Bill {
  id: string;
  name: string;
  amountPaise: number;
  dueDate: string; // YYYY-MM-DD
  frequency: BillFrequency;
  isPaid: boolean;
  category: ExpenseCategory | string;
  priority: 'essential' | 'discretionary';
  autoDeductFromSpendable: boolean;
  paidDate?: string;
  notes?: string;
}

export interface CategoryBudget {
  category: ExpenseCategory | string;
  budgetPaise: number;
  isEssential: boolean;
}

export type YoungAdultPersona =
  | 'student'
  | 'first_job'
  | 'freelancer'
  | 'young_professional'
  | 'explorer';

export interface UserSettings {
  userName: string;
  persona?: YoungAdultPersona;
  monthlyIncomePaise: number;
  nextIncomeDate: string; // YYYY-MM-DD
  budgetCycleStartDay: number; // 1-31
  emergencyReservePaise: number;
  currencySymbol: string;
  currencyCode: string;
  onboardingCompleted: boolean;
  theme: 'warm' | 'dark';
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: 'tracking' | 'saving' | 'discipline' | 'review';
  targetDays: number;
  currentStreak: number;
  isCompleted: boolean;
  completedAt?: string;
  xpReward: number;
  badgeName: string;
  icon: string;
  rules: string;
}

export interface FinancialSummary {
  totalIncomePaise: number;
  totalExpensesPaise: number; // Only pure expenses (essential + discretionary + bill payments)
  essentialExpensesPaise: number;
  discretionaryExpensesPaise: number;
  currentAvailableBalancePaise: number; // Income - pure expenses - net jar deposits
  unpaidEssentialBillsPaise: number;
  unpaidTotalBillsPaise: number;
  plannedSavingsMonthlyPaise: number;
  emergencyReservePaise: number;
  spendableBalancePaise: number; // Signature Safe-to-Spend
  isSpendableDeficit: boolean;
  suggestedDailyAllowancePaise: number;
  remainingWeeklyAllowancePaise: number;
  daysRemainingUntilIncome: number;
  savingsRatePercentage: number;
  totalSavedInJarsPaise: number;
  endOfMonthProjectedBalancePaise: number;
  budgetHealthStatus: 'healthy' | 'caution' | 'critical';
  healthMessage: string;
}

export interface PurchaseSimulationResult {
  purchaseAmountPaise: number;
  category: ExpenseCategory | string;
  itemName: string;
  currentSpendablePaise: number;
  newSpendablePaise: number;
  spendableDeltaPaise: number;
  isAffordableWithoutDeficit: boolean;
  currentCategorySpentPaise: number;
  categoryBudgetPaise: number;
  newCategorySpentPaise: number;
  categoryBudgetExceeded: boolean;
  categoryExceededByPaise: number;
  dailyAllowanceBeforePaise: number;
  dailyAllowanceAfterPaise: number;
  affectedBills: Bill[];
  selectedGoalImpact?: {
    goalName: string;
    originalTargetDate: string;
    estimatedNewTargetDate: string;
    daysDelayed: number;
  };
  recommendationType: 'safe' | 'caution' | 'deficit';
  explanation: string;
  alternativeSuggestions: string[];
}

export type DreamCategory =
  | 'Education & Career'
  | 'First Apartment'
  | 'Gadgets & Technology'
  | 'Travel & Experiences'
  | 'Emergency Savings'
  | 'Health & Wellbeing'
  | 'Family & Gifts'
  | 'Personal Growth'
  | 'Custom Dreams';

export type DreamPriority = 'now' | 'working' | 'someday';

export interface VisionDream {
  id: string;
  title: string;
  description: string;
  category: DreamCategory;
  imageUrl: string;
  targetPaise: number;
  savedPaise: number;
  targetDate: string; // YYYY-MM-DD
  priority: DreamPriority;
  personalMotivation: string;
  isArchived?: boolean;
  suggestedMonthlyPaise?: number;
  createdAt?: string;
  celebratedMilestones?: number[]; // e.g. [10, 25, 50, 75, 100]
}

export type MoneyWeatherStatus = 'on_track' | 'take_care' | 'needs_attention';

export interface MoneyWeather {
  status: MoneyWeatherStatus;
  headline: string;
  explanation: string;
  icon: 'sun' | 'cloud' | 'rain';
}

export interface PaydayBridgeInfo {
  availableSpendablePaise: number;
  daysUntilIncome: number;
  dailyAverageSpendPaise: number;
  safeDailyPacePaise: number;
  unpaidBillsPaise: number;
  reservedSavingsPaise: number;
  friendlyMessage: string;
}

