/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  AvatarPetState,
  Bill,
  CategoryBudget,
  Challenge,
  FinancialSummary,
  HabitCard,
  HarmonyMember,
  HarmonySplitMode,
  HarmonySplitResult,
  MoneyWeather,
  PartnerRewardBadge,
  PaydayBridgeInfo,
  PetStage,
  SavingsJar,
  Transaction,
  UserSettings,
  VisionDream,
} from '../types/finance';
import { FinancialEngine } from '../services/financialEngine';
import { MoneyHarmonyEngine } from '../services/moneyHarmonyEngine';
import {
  INITIAL_AVATAR_PET,
  INITIAL_BILLS,
  INITIAL_BUDGETS,
  INITIAL_CHALLENGES,
  INITIAL_DREAMS,
  INITIAL_HABITS,
  INITIAL_HARMONY_MEMBERS,
  INITIAL_JARS,
  INITIAL_PARTNER_REWARDS,
  INITIAL_SETTINGS,
  INITIAL_TRANSACTIONS,
  StorageService,
} from '../services/storageService';
import { formatPaise, getTodayDateString } from '../utils/formatters';
import confetti from 'canvas-confetti';

interface FinanceContextType {
  transactions: Transaction[];
  bills: Bill[];
  jars: SavingsJar[];
  budgets: CategoryBudget[];
  settings: UserSettings;
  challenges: Challenge[];
  summary: FinancialSummary;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  // Transactions
  addTransaction: (tx: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  // Bills
  addBill: (bill: Omit<Bill, 'id'>) => void;
  updateBill: (id: string, updates: Partial<Bill>) => void;
  deleteBill: (id: string) => void;
  toggleBillPaid: (id: string) => void;
  // Jars
  addJar: (jar: Omit<SavingsJar, 'id'>) => void;
  updateJar: (id: string, updates: Partial<SavingsJar>) => void;
  // Jars
  deleteJar: (id: string) => void;
  depositToJar: (jarId: string, amountPaise: number, note?: string) => void;
  withdrawFromJar: (jarId: string, amountPaise: number, note?: string) => void;
  // Vision Dreams (Signature Feature)
  dreams: VisionDream[];
  addDream: (dream: Omit<VisionDream, 'id'>) => void;
  updateDream: (id: string, updates: Partial<VisionDream>) => void;
  deleteDream: (id: string) => void;
  contributeToDream: (dreamId: string, amountPaise: number, note?: string) => void;
  archiveDream: (id: string) => void;
  celebrateMilestone: (dreamId: string, milestonePercent: number) => void;
  // Budgets
  updateBudget: (category: string, budgetPaise: number, isEssential: boolean) => void;
  // Settings
  updateSettings: (updates: Partial<UserSettings>) => void;
  updateMonthlyIncome: (newIncomePaise: number, syncLedger?: boolean) => void;
  // Monthly Fresh Start
  startFreshMonth: (options?: { newIncomePaise?: number; clearExpenses?: boolean }) => void;
  // Money Weather & Payday Bridge
  moneyWeather: MoneyWeather;
  weatherSimulationMode: 'live' | 'sunny' | 'amber' | 'rainy';
  setWeatherSimulationMode: (mode: 'live' | 'sunny' | 'amber' | 'rainy') => void;
  paydayBridge: PaydayBridgeInfo;
  // Feature 2: Habit-to-Asset Converter
  habits: HabitCard[];
  avatarPet: AvatarPetState;
  partnerRewards: PartnerRewardBadge[];
  logHabitSave: (habitId: string) => {
    xpGained: number;
    leveledUp: boolean;
    newLevel: number;
    newStage: PetStage;
    unlockedBadge?: PartnerRewardBadge;
  };
  addCustomHabit: (title: string, amountPaise: number, category: string, icon: string) => void;
  updatePetName: (newName: string) => void;
  // Feature 3: Money Harmony
  harmonyMembers: HarmonyMember[];
  harmonyTotalBillPaise: number;
  setHarmonyTotalBillPaise: (amtPaise: number) => void;
  harmonySplitMode: HarmonySplitMode;
  setHarmonySplitMode: (mode: HarmonySplitMode) => void;
  harmonySplitResult: HarmonySplitResult;
  addHarmonyMember: (name: string, monthlyIncomePaise: number, paidPaise?: number) => void;
  updateHarmonyMember: (id: string, updates: Partial<HarmonyMember>) => void;
  deleteHarmonyMember: (id: string) => void;
  resetHarmonyExpense: () => void;
  // Challenges
  toggleChallengeStreak: (id: string) => void;
  // System / Demo
  resetToDemo: () => void;
  loadHackathonScenario: () => void;
  // Showcase Walkthrough
  showcaseStep: number;
  setShowcaseStep: (step: number) => void;
  isShowcaseActive: boolean;
  setIsShowcaseActive: (active: boolean) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  triggerConfetti: () => void;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>(() =>
    StorageService.getTransactions()
  );
  const [bills, setBills] = useState<Bill[]>(() => StorageService.getBills());
  const [jars, setJars] = useState<SavingsJar[]>(() => StorageService.getJars());
  const [budgets, setBudgets] = useState<CategoryBudget[]>(() =>
    StorageService.getBudgets()
  );
  const [settings, setSettings] = useState<UserSettings>(() =>
    StorageService.getSettings()
  );
  const [challenges, setChallenges] = useState<Challenge[]>(() =>
    StorageService.getChallenges()
  );
  const [dreams, setDreams] = useState<VisionDream[]>(() =>
    StorageService.getDreams()
  );
  const [habits, setHabits] = useState<HabitCard[]>(() =>
    StorageService.getHabits()
  );
  const [avatarPet, setAvatarPet] = useState<AvatarPetState>(() =>
    StorageService.getAvatarPet()
  );
  const [partnerRewards, setPartnerRewards] = useState<PartnerRewardBadge[]>(() =>
    INITIAL_PARTNER_REWARDS.map((r) => ({
      ...r,
      isUnlocked: (StorageService.getAvatarPet()?.level || 1) >= r.unlockedAtLevel,
    }))
  );
  const [harmonyMembers, setHarmonyMembers] = useState<HarmonyMember[]>(() =>
    StorageService.getHarmonyMembers()
  );
  const [harmonyTotalBillPaise, setHarmonyTotalBillPaise] = useState<number>(240000); // Default ₹2,400 bill
  const [harmonySplitMode, setHarmonySplitMode] = useState<HarmonySplitMode>('proportional');
  const [weatherSimulationMode, setWeatherSimulationMode] = useState<'live' | 'sunny' | 'amber' | 'rainy'>('live');

  const [activeTab, setActiveTab] = useState<string>('home');
  const [showcaseStep, setShowcaseStep] = useState<number>(0);
  const [isShowcaseActive, setIsShowcaseActive] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    StorageService.saveTransactions(transactions);
  }, [transactions]);

  useEffect(() => {
    StorageService.saveBills(bills);
  }, [bills]);

  useEffect(() => {
    StorageService.saveJars(jars);
  }, [jars]);

  useEffect(() => {
    StorageService.saveBudgets(budgets);
  }, [budgets]);

  useEffect(() => {
    StorageService.saveSettings(settings);
  }, [settings]);

  useEffect(() => {
    StorageService.saveChallenges(challenges);
  }, [challenges]);

  useEffect(() => {
    StorageService.saveDreams(dreams);
  }, [dreams]);

  useEffect(() => {
    StorageService.saveHabits(habits);
  }, [habits]);

  useEffect(() => {
    StorageService.saveAvatarPet(avatarPet);
  }, [avatarPet]);

  useEffect(() => {
    StorageService.saveHarmonyMembers(harmonyMembers);
  }, [harmonyMembers]);

  // Centralized, reconciliated financial summary
  const summary = useMemo(() => {
    return FinancialEngine.calculateSummary(transactions, bills, jars, settings);
  }, [transactions, bills, jars, settings]);

  // Feature 1: Money Weather ☀️
  // Formula: (Current Available Balance + Expected Income) - (Upcoming Mandatory Bills + Remaining Daily Budget)
  const moneyWeather = useMemo<MoneyWeather>(() => {
    const currentAvailableBalancePaise = summary.currentAvailableBalancePaise;
    const expectedIncomePaise = settings.monthlyIncomePaise;
    const upcomingMandatoryBillsPaise = summary.unpaidEssentialBillsPaise;
    const daysRemaining = Math.max(1, summary.daysRemainingUntilIncome);
    const suggestedDaily = summary.suggestedDailyAllowancePaise;
    const remainingDailyBudgetPaise = Math.max(0, suggestedDaily * daysRemaining);

    const netCushionPaise =
      currentAvailableBalancePaise +
      expectedIncomePaise -
      (upcomingMandatoryBillsPaise + remainingDailyBudgetPaise);

    // If simulation mode is active for demo/judge preview
    if (weatherSimulationMode === 'sunny') {
      return {
        currentAvailableBalancePaise: 4200000,
        expectedIncomePaise: 2800000,
        upcomingMandatoryBillsPaise: 199900,
        remainingDailyBudgetPaise: 1100000,
        netCushionPaise: 5700100,
        status: 'sunny',
        headline: 'Clear Skies — Smooth Sailing',
        oneSentenceSummary: "You're all clear until your upcoming bills and payday; spending is comfortably on track!",
        explanation: 'All upcoming essential bills are safeguarded, and your daily spending cushion is comfortably funded.',
        icon: 'sun',
      };
    }

    if (weatherSimulationMode === 'amber') {
      return {
        currentAvailableBalancePaise: 140000,
        expectedIncomePaise: 2800000,
        upcomingMandatoryBillsPaise: 120000,
        remainingDailyBudgetPaise: 2600000,
        netCushionPaise: 220000,
        status: 'amber',
        headline: 'Gentle Breeze — Mindful Pacing',
        oneSentenceSummary: "Caution recommended: Spending is approaching safe limits; pacing your purchases will keep you comfortable until payday.",
        explanation: 'Bills are covered, but your daily cushion is tight. Mindful pacing until payday ensures you stay stress-free.',
        icon: 'cloud',
      };
    }

    if (weatherSimulationMode === 'rainy') {
      return {
        currentAvailableBalancePaise: 80000,
        expectedIncomePaise: 2800000,
        upcomingMandatoryBillsPaise: 199900,
        remainingDailyBudgetPaise: 3000000,
        netCushionPaise: -319900,
        status: 'rainy',
        headline: 'Storm Alert — Action Needed',
        oneSentenceSummary: "Alert: Upcoming mandatory bills exceed your available liquid cash before payday.",
        explanation: 'Upcoming essential bills exceed your liquid cash on hand. Shelter your essentials and pause discretionary spending.',
        icon: 'rain',
      };
    }

    // Live calculation:
    // Rainy if current available cash is less than upcoming mandatory bills OR net cushion is negative
    if (currentAvailableBalancePaise < upcomingMandatoryBillsPaise || netCushionPaise < 0) {
      return {
        currentAvailableBalancePaise,
        expectedIncomePaise,
        upcomingMandatoryBillsPaise,
        remainingDailyBudgetPaise,
        netCushionPaise,
        status: 'rainy',
        headline: 'Storm Alert — Action Needed',
        oneSentenceSummary: `Alert: Upcoming mandatory bills of ${formatPaise(upcomingMandatoryBillsPaise)} exceed available liquid cash before payday.`,
        explanation: 'Upcoming mandatory bills exceed your current available funds. Shelter your essentials and pause discretionary buys.',
        icon: 'rain',
      };
    }

    // Amber if cushion is narrow or daily allowance is tight (< ₹150/day)
    if (netCushionPaise < remainingDailyBudgetPaise * 0.4 || suggestedDaily < 15000) {
      return {
        currentAvailableBalancePaise,
        expectedIncomePaise,
        upcomingMandatoryBillsPaise,
        remainingDailyBudgetPaise,
        netCushionPaise,
        status: 'amber',
        headline: 'Gentle Breeze — Mindful Pacing',
        oneSentenceSummary: 'Caution recommended: Spending is approaching safe limits; pacing your purchases will keep you comfortable until payday.',
        explanation: 'Your upcoming obligations are covered, but your discretionary cushion is tight until your next income deposit.',
        icon: 'cloud',
      };
    }

    // Sunny: Bills covered, spending comfortably on track
    return {
      currentAvailableBalancePaise,
      expectedIncomePaise,
      upcomingMandatoryBillsPaise,
      remainingDailyBudgetPaise,
      netCushionPaise,
      status: 'sunny',
      headline: 'Clear Skies — Smooth Sailing',
      oneSentenceSummary: "You're all clear until your upcoming bills and payday; spending is comfortably on track!",
      explanation: 'All upcoming essential bills and planned savings are protected with a comfortable daily spending allowance.',
      icon: 'sun',
    };
  }, [summary, settings.monthlyIncomePaise, weatherSimulationMode]);

  // Payday Bridge
  const paydayBridge = useMemo<PaydayBridgeInfo>(() => {
    const available = Math.max(0, summary.spendableBalancePaise);
    const days = Math.max(1, summary.daysRemainingUntilIncome);
    const dailyPace = summary.suggestedDailyAllowancePaise;

    return {
      availableSpendablePaise: available,
      daysUntilIncome: days,
      dailyAverageSpendPaise: dailyPace,
      safeDailyPacePaise: dailyPace,
      unpaidBillsPaise: summary.unpaidEssentialBillsPaise,
      reservedSavingsPaise: summary.plannedSavingsMonthlyPaise,
      friendlyMessage: `You have ${formatPaise(available)} safely available for the next ${days} day${days > 1 ? 's' : ''}. That's an average of ${formatPaise(dailyPace)} per day.`,
    };
  }, [summary]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Transactions management
  const addTransaction = (tx: Omit<Transaction, 'id'>) => {
    const newTx: Transaction = {
      ...tx,
      id: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      date: tx.date || getTodayDateString(),
    };
    setTransactions((prev) => [newTx, ...prev]);
    showToast(`Recorded: ${tx.description} (₹${(tx.amountPaise / 100).toLocaleString('en-IN')})`);
  };

  const updateTransaction = (id: string, updates: Partial<Transaction>) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
    showToast('Transaction updated');
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    showToast('Transaction removed');
  };

  // Bills management
  const addBill = (bill: Omit<Bill, 'id'>) => {
    const newBill: Bill = {
      ...bill,
      id: `bill-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    };
    setBills((prev) => [...prev, newBill]);
    showToast(`Bill added: ${bill.name}`);
  };

  const updateBill = (id: string, updates: Partial<Bill>) => {
    setBills((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updates } : b))
    );
    showToast('Bill updated');
  };

  const deleteBill = (id: string) => {
    setBills((prev) => prev.filter((b) => b.id !== id));
    showToast('Bill removed');
  };

  const toggleBillPaid = (id: string) => {
    const bill = bills.find((b) => b.id === id);
    if (!bill) return;

    const newPaidStatus = !bill.isPaid;
    setBills((prev) =>
      prev.map((b) =>
        b.id === id
          ? {
              ...b,
              isPaid: newPaidStatus,
              paidDate: newPaidStatus ? getTodayDateString() : undefined,
            }
          : b
      )
    );

    if (newPaidStatus) {
      // Add corresponding expense transaction so available balance decreases and no double counting occurs
      const tx: Transaction = {
        id: `tx-bill-${Date.now()}`,
        date: getTodayDateString(),
        description: `Paid Bill: ${bill.name}`,
        amountPaise: bill.amountPaise,
        type: 'bill_payment',
        category: bill.category,
        billId: bill.id,
        notes: `Scheduled ${bill.frequency} bill payment`,
      };
      setTransactions((prev) => [tx, ...prev]);
      showToast(`Marked paid: ${bill.name}. Spent ₹${(bill.amountPaise / 100).toLocaleString('en-IN')}`);
    } else {
      // Unmarking paid: remove the associated bill payment transaction
      setTransactions((prev) => prev.filter((t) => t.billId !== id));
      showToast(`Marked unpaid: ${bill.name}`);
    }
  };

  // Savings Jars management
  const addJar = (jar: Omit<SavingsJar, 'id'>) => {
    const newJar: SavingsJar = {
      ...jar,
      id: `jar-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    };
    setJars((prev) => [...prev, newJar]);
    showToast(`Created Jar: ${jar.name}`);
  };

  const updateJar = (id: string, updates: Partial<SavingsJar>) => {
    setJars((prev) =>
      prev.map((j) => (j.id === id ? { ...j, ...updates } : j))
    );
    showToast('Jar details updated');
  };

  const deleteJar = (id: string) => {
    setJars((prev) => prev.filter((j) => j.id !== id));
    showToast('Savings Jar removed');
  };

  const depositToJar = (jarId: string, amountPaise: number, note?: string) => {
    const jar = jars.find((j) => j.id === jarId);
    if (!jar || amountPaise <= 0) return;

    // Check available balance
    if (summary.currentAvailableBalancePaise < amountPaise) {
      showToast(`Warning: Low available balance. Transferring anyway.`);
    }

    setJars((prev) =>
      prev.map((j) =>
        j.id === jarId ? { ...j, savedPaise: j.savedPaise + amountPaise } : j
      )
    );

    // Record savings deposit transaction (moves money from general pool into jar, not an expense)
    const tx: Transaction = {
      id: `tx-deposit-${Date.now()}`,
      date: getTodayDateString(),
      description: `Deposit to ${jar.name}`,
      amountPaise,
      type: 'savings_deposit',
      category: 'Investments & Savings',
      jarId: jar.id,
      notes: note || `Contribution to ${jar.name} jar`,
    };
    setTransactions((prev) => [tx, ...prev]);
    showToast(`Deposited ₹${(amountPaise / 100).toLocaleString('en-IN')} to ${jar.name}! 🎉`);
  };

  const withdrawFromJar = (jarId: string, amountPaise: number, note?: string) => {
    const jar = jars.find((j) => j.id === jarId);
    if (!jar || amountPaise <= 0) return;

    if (jar.savedPaise < amountPaise) {
      showToast('Cannot withdraw more than what is saved in this jar.');
      return;
    }

    setJars((prev) =>
      prev.map((j) =>
        j.id === jarId ? { ...j, savedPaise: j.savedPaise - amountPaise } : j
      )
    );

    // Record savings withdrawal transaction (moves money back into general available balance)
    const tx: Transaction = {
      id: `tx-withdraw-${Date.now()}`,
      date: getTodayDateString(),
      description: `Withdrawal from ${jar.name}`,
      amountPaise,
      type: 'savings_withdrawal',
      category: 'Investments & Savings',
      jarId: jar.id,
      notes: note || `Transferred back from ${jar.name} to available funds`,
    };
    setTransactions((prev) => [tx, ...prev]);
    showToast(`Withdrew ₹${(amountPaise / 100).toLocaleString('en-IN')} from ${jar.name}`);
  };

  // Budgets
  const updateBudget = (
    category: string,
    budgetPaise: number,
    isEssential: boolean
  ) => {
    setBudgets((prev) => {
      const exists = prev.some((b) => b.category === category);
      if (exists) {
        return prev.map((b) =>
          b.category === category ? { ...b, budgetPaise, isEssential } : b
        );
      }
      return [...prev, { category, budgetPaise, isEssential }];
    });
    showToast(`Updated budget for ${category}`);
  };

  // Settings
  const updateSettings = (updates: Partial<UserSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
    showToast('Settings saved');
  };

  const updateMonthlyIncome = (newIncomePaise: number, syncLedger: boolean = true) => {
    setSettings((prev) => ({ ...prev, monthlyIncomePaise: newIncomePaise }));

    if (syncLedger) {
      setTransactions((prev) => {
        const incomeTxIndex = prev.findIndex((t) => t.type === 'income');
        if (incomeTxIndex >= 0) {
          const updated = [...prev];
          updated[incomeTxIndex] = {
            ...updated[incomeTxIndex],
            amountPaise: newIncomePaise,
            description: 'Monthly Income / Salary',
            date: getTodayDateString(),
          };
          return updated;
        } else {
          const newTx: Transaction = {
            id: `tx-income-${Date.now()}`,
            date: getTodayDateString(),
            description: 'Monthly Income / Salary',
            amountPaise: newIncomePaise,
            type: 'income',
            category: 'Other',
            notes: 'Primary monthly income deposit',
          };
          return [newTx, ...prev];
        }
      });
    }

    showToast(`Monthly income updated to ₹${(newIncomePaise / 100).toLocaleString('en-IN')}`);
  };

  // Challenges
  const toggleChallengeStreak = (id: string) => {
    setChallenges((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const nextStreak = c.currentStreak + 1;
          const isNowCompleted = nextStreak >= c.targetDays;
          return {
            ...c,
            currentStreak: nextStreak,
            isCompleted: isNowCompleted,
            completedAt: isNowCompleted ? getTodayDateString() : c.completedAt,
          };
        }
        return c;
      })
    );
    showToast('Challenge streak updated! 🚀');
  };

  // Dreams (Signature Financial Vision Board)
  const addDream = (dream: Omit<VisionDream, 'id'>) => {
    const newDream: VisionDream = {
      ...dream,
      id: `dream-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: getTodayDateString(),
      celebratedMilestones: [],
    };
    setDreams((prev) => [newDream, ...prev]);

    // Also optionally reflect as a savings jar so calculations automatically protect it
    const newJar: SavingsJar = {
      id: `jar-${newDream.id}`,
      name: newDream.title,
      category: 'personal',
      targetPaise: newDream.targetPaise,
      savedPaise: newDream.savedPaise,
      targetDate: newDream.targetDate,
      monthlyContributionTargetPaise: newDream.suggestedMonthlyPaise || Math.round(newDream.targetPaise / 6),
      priority: newDream.priority === 'now' ? 'high' : newDream.priority === 'working' ? 'medium' : 'low',
      color: '#49664D',
      iconName: 'Sparkles',
    };
    setJars((prev) => [...prev, newJar]);

    showToast(`Added dream: "${newDream.title}" ✨`);
  };

  const updateDream = (id: string, updates: Partial<VisionDream>) => {
    setDreams((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...updates } : d))
    );
    // Sync with paired jar if any
    setJars((prev) =>
      prev.map((j) =>
        j.id === `jar-${id}`
          ? {
              ...j,
              name: updates.title || j.name,
              targetPaise: updates.targetPaise !== undefined ? updates.targetPaise : j.targetPaise,
              savedPaise: updates.savedPaise !== undefined ? updates.savedPaise : j.savedPaise,
            }
          : j
      )
    );
    showToast('Dream updated ✨');
  };

  const deleteDream = (id: string) => {
    setDreams((prev) => prev.filter((d) => d.id !== id));
    setJars((prev) => prev.filter((j) => j.id !== `jar-${id}`));
    showToast('Dream removed');
  };

  const archiveDream = (id: string) => {
    setDreams((prev) =>
      prev.map((d) => (d.id === id ? { ...d, isArchived: !d.isArchived } : d))
    );
    showToast('Dream archived');
  };

  const celebrateMilestone = (dreamId: string, milestonePercent: number) => {
    setDreams((prev) =>
      prev.map((d) => {
        if (d.id === dreamId) {
          const current = d.celebratedMilestones || [];
          if (!current.includes(milestonePercent)) {
            return {
              ...d,
              celebratedMilestones: [...current, milestonePercent],
            };
          }
        }
        return d;
      })
    );
  };

  const contributeToDream = (dreamId: string, amountPaise: number, note?: string) => {
    const dream = dreams.find((d) => d.id === dreamId);
    if (!dream || amountPaise <= 0) return;

    const newSaved = dream.savedPaise + amountPaise;
    setDreams((prev) =>
      prev.map((d) => (d.id === dreamId ? { ...d, savedPaise: newSaved } : d))
    );

    // Sync corresponding jar if exists
    setJars((prev) =>
      prev.map((j) =>
        j.id === `jar-${dreamId}` || j.name.toLowerCase() === dream.title.toLowerCase()
          ? { ...j, savedPaise: j.savedPaise + amountPaise }
          : j
      )
    );

    // Record ledger entry
    const tx: Transaction = {
      id: `tx-dream-${Date.now()}`,
      date: getTodayDateString(),
      description: `Saved for: ${dream.title}`,
      amountPaise,
      type: 'savings_deposit',
      category: 'Investments & Savings',
      notes: note || `Contribution to "${dream.title}" vision dream`,
    };
    setTransactions((prev) => [tx, ...prev]);

    // Check milestone celebrations
    const pct = Math.floor((newSaved / dream.targetPaise) * 100);
    showToast(`Added ₹${(amountPaise / 100).toLocaleString('en-IN')} to "${dream.title}"! (${Math.min(100, pct)}% complete) 🌱`);
  };

  // Fresh Start Monthly Reset
  const startFreshMonth = (options?: { newIncomePaise?: number; clearExpenses?: boolean }) => {
    const newIncome = options?.newIncomePaise || settings.monthlyIncomePaise;

    // Reset unpaid bills to unpaid
    setBills((prev) =>
      prev.map((b) => ({
        ...b,
        isPaid: false,
        paidDate: undefined,
      }))
    );

    // Update settings with new income and next payday
    const nextPayday = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    setSettings((prev) => ({
      ...prev,
      monthlyIncomePaise: newIncome,
      nextIncomeDate: nextPayday,
    }));

    if (options?.clearExpenses) {
      // Retain starting income transaction only
      const startingIncomeTx: Transaction = {
        id: `tx-income-${Date.now()}`,
        date: getTodayDateString(),
        description: 'New Month Fresh Start Income',
        amountPaise: newIncome,
        type: 'income',
        category: 'Other',
        notes: 'Monthly reset fresh cycle deposit',
      };
      setTransactions([startingIncomeTx]);
    }

    showToast('Fresh Start active! Ready for a peaceful, confident month ahead.');
  };

  const resetToDemo = () => {
    setTransactions(INITIAL_TRANSACTIONS);
    setBills(INITIAL_BILLS);
    setJars(INITIAL_JARS);
    setBudgets(INITIAL_BUDGETS);
    setSettings(INITIAL_SETTINGS);
    setChallenges(INITIAL_CHALLENGES);
    setDreams(INITIAL_DREAMS);
    showToast('Reset to default friendly demo');
  };

  const loadHackathonScenario = () => {
    setSettings({
      ...INITIAL_SETTINGS,
      monthlyIncomePaise: 2800000,
      userName: 'Aarav (Young Adult Showcase)',
    });
    setBills(INITIAL_BILLS);
    setJars(INITIAL_JARS);
    setBudgets(INITIAL_BUDGETS);
    setTransactions(INITIAL_TRANSACTIONS);
    setDreams(INITIAL_DREAMS);
    setHabits(INITIAL_HABITS);
    setAvatarPet(INITIAL_AVATAR_PET);
    setHarmonyMembers(INITIAL_HARMONY_MEMBERS);
    setIsShowcaseActive(true);
    setShowcaseStep(1);
    setActiveTab('home');
    showToast('Loaded demo scenario');
  };

  // Feature 3: Money Harmony Split Result
  const harmonySplitResult = useMemo(() => {
    return MoneyHarmonyEngine.calculateSplit(
      harmonyTotalBillPaise,
      harmonyMembers,
      harmonySplitMode
    );
  }, [harmonyTotalBillPaise, harmonyMembers, harmonySplitMode]);

  const addHarmonyMember = (name: string, monthlyIncomePaise: number, paidPaise: number = 0) => {
    const colors = ['#2B5F8C', '#8C5B2B', '#49664D', '#7B4B8A', '#8A6D3B', '#3B7A8A'];
    const newMember: HarmonyMember = {
      id: `member-${Date.now()}`,
      name: name.trim() || 'Roommate',
      monthlyIncomePaise: Math.max(100000, monthlyIncomePaise),
      paidPaise,
      color: colors[harmonyMembers.length % colors.length],
      avatarInitial: (name.trim()[0] || 'M').toUpperCase(),
    };
    setHarmonyMembers((prev) => [...prev, newMember]);
    showToast(`Added ${newMember.name} to Money Harmony`);
  };

  const updateHarmonyMember = (id: string, updates: Partial<HarmonyMember>) => {
    setHarmonyMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updates } : m))
    );
  };

  const deleteHarmonyMember = (id: string) => {
    setHarmonyMembers((prev) => prev.filter((m) => m.id !== id));
    showToast('Member removed from harmony split');
  };

  const resetHarmonyExpense = () => {
    setHarmonyMembers((prev) =>
      prev.map((m) => ({ ...m, paidPaise: 0 }))
    );
    showToast('Reset all paid balances to 0');
  };

  // Feature 2: Habit-to-Asset Converter
  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 55,
        spread: 65,
        origin: { y: 0.65 },
        colors: ['#49664D', '#B8CBB3', '#E9E1D1', '#D4AF37'],
      });
    } catch {
      // safe fallback
    }
  };

  const logHabitSave = (habitId: string) => {
    const habit = habits.find((h) => h.id === habitId);
    if (!habit) {
      return {
        xpGained: 0,
        leveledUp: false,
        newLevel: avatarPet.level,
        newStage: avatarPet.stage,
      };
    }

    // Update habit count & total
    setHabits((prev) =>
      prev.map((h) =>
        h.id === habitId
          ? {
              ...h,
              timesLogged: h.timesLogged + 1,
              totalSavedPaise: h.totalSavedPaise + h.amountPaise,
            }
          : h
      )
    );

    // XP calculation: $1 = 10 XP
    const xpGained = Math.max(10, Math.round(habit.amountUsd * 10));
    const newXp = avatarPet.xp + xpGained;
    const newTotalSaved = avatarPet.totalSavedPaise + habit.amountPaise;
    const newSavesCount = avatarPet.totalSavesCount + 1;

    // Determine level & stage:
    // Level 1: 0 - 99 XP -> Egg
    // Level 2: 100 - 249 XP -> Sprout
    // Level 3: 250 - 499 XP -> Blossom
    // Level 4: 500 - 999 XP -> Forest Guardian
    // Level 5+: 1000+ XP -> Golden Celestial Guardian
    let newLevel = 1;
    let newStage: PetStage = 'egg';

    if (newXp >= 1000) {
      newLevel = 5;
      newStage = 'golden';
    } else if (newXp >= 500) {
      newLevel = 4;
      newStage = 'guardian';
    } else if (newXp >= 250) {
      newLevel = 3;
      newStage = 'blossom';
    } else if (newXp >= 100) {
      newLevel = 2;
      newStage = 'sprout';
    }

    const leveledUp = newLevel > avatarPet.level;

    // Check newly unlocked rewards
    let unlockedBadge: PartnerRewardBadge | undefined;
    if (leveledUp) {
      setPartnerRewards((prev) =>
        prev.map((r) => {
          if (!r.isUnlocked && newLevel >= r.unlockedAtLevel) {
            unlockedBadge = r;
            return { ...r, isUnlocked: true };
          }
          return r;
        })
      );
    }

    const updatedPet: AvatarPetState = {
      ...avatarPet,
      xp: newXp,
      level: newLevel,
      stage: newStage,
      totalSavedPaise: newTotalSaved,
      totalSavesCount: newSavesCount,
      lastInteractedDate: getTodayDateString(),
    };
    setAvatarPet(updatedPet);

    // Record ledger transaction (savings_deposit into Habit Stash)
    const tx: Transaction = {
      id: `tx-habit-${Date.now()}`,
      date: getTodayDateString(),
      description: `Habit Micro-Save: ${habit.title}`,
      amountPaise: habit.amountPaise,
      type: 'savings_deposit',
      category: 'Investments & Savings',
      notes: `One-tap micro-transfer (+${xpGained} XP)`,
    };
    setTransactions((prev) => [tx, ...prev]);

    triggerConfetti();

    if (leveledUp) {
      showToast(`🎉 Level Up! ${avatarPet.name} evolved into Level ${newLevel} (${newStage.toUpperCase()})! (+${xpGained} XP)`);
    } else {
      showToast(`✨ Saved ${formatPaise(habit.amountPaise)} into Stash! (+${xpGained} XP)`);
    }

    return {
      xpGained,
      leveledUp,
      newLevel,
      newStage,
      unlockedBadge,
    };
  };

  const addCustomHabit = (title: string, amountPaise: number, category: string, icon: string) => {
    const usd = Math.max(1, Math.round(amountPaise / 3000));
    const newHabit: HabitCard = {
      id: `habit-${Date.now()}`,
      title: title.trim() || 'Custom Micro-Save',
      category: category || 'Everyday',
      amountPaise,
      amountUsd: usd,
      icon: icon || 'Sparkles',
      description: 'Custom micro-saving routine.',
      timesLogged: 0,
      totalSavedPaise: 0,
    };
    setHabits((prev) => [newHabit, ...prev]);
    showToast(`Added custom habit: "${newHabit.title}"`);
  };

  const updatePetName = (newName: string) => {
    if (!newName.trim()) return;
    setAvatarPet((prev) => ({ ...prev, name: newName.trim() }));
    showToast(`Avatar companion renamed to "${newName.trim()}"`);
  };

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        bills,
        jars,
        budgets,
        settings,
        challenges,
        summary,
        activeTab,
        setActiveTab,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        addBill,
        updateBill,
        deleteBill,
        toggleBillPaid,
        addJar,
        updateJar,
        deleteJar,
        depositToJar,
        withdrawFromJar,
        // Dreams (Signature Feature)
        dreams,
        addDream,
        updateDream,
        deleteDream,
        contributeToDream,
        archiveDream,
        celebrateMilestone,
        // Budgets
        updateBudget,
        updateSettings,
        updateMonthlyIncome,
        startFreshMonth,
        moneyWeather,
        weatherSimulationMode,
        setWeatherSimulationMode,
        paydayBridge,
        // Habits
        habits,
        avatarPet,
        partnerRewards,
        logHabitSave,
        addCustomHabit,
        updatePetName,
        // Harmony
        harmonyMembers,
        harmonyTotalBillPaise,
        setHarmonyTotalBillPaise,
        harmonySplitMode,
        setHarmonySplitMode,
        harmonySplitResult,
        addHarmonyMember,
        updateHarmonyMember,
        deleteHarmonyMember,
        resetHarmonyExpense,
        toggleChallengeStreak,
        resetToDemo,
        loadHackathonScenario,
        showcaseStep,
        setShowcaseStep,
        isShowcaseActive,
        setIsShowcaseActive,
        toastMessage,
        showToast,
        triggerConfetti,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = (): FinanceContextType => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};
