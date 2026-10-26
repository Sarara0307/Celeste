/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  Bill,
  CategoryBudget,
  Challenge,
  FinancialSummary,
  MoneyWeather,
  PaydayBridgeInfo,
  SavingsJar,
  Transaction,
  UserSettings,
  VisionDream,
} from '../types/finance';
import { FinancialEngine } from '../services/financialEngine';
import {
  INITIAL_BILLS,
  INITIAL_BUDGETS,
  INITIAL_CHALLENGES,
  INITIAL_DREAMS,
  INITIAL_JARS,
  INITIAL_SETTINGS,
  INITIAL_TRANSACTIONS,
  StorageService,
} from '../services/storageService';
import { formatPaise, getTodayDateString } from '../utils/formatters';

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
  paydayBridge: PaydayBridgeInfo;
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

  // Centralized, reconciliated financial summary
  const summary = useMemo(() => {
    return FinancialEngine.calculateSummary(transactions, bills, jars, settings);
  }, [transactions, bills, jars, settings]);

  // Money Weather (calm, human indicator)
  const moneyWeather = useMemo<MoneyWeather>(() => {
    const spendable = summary.spendableBalancePaise;
    const daily = summary.suggestedDailyAllowancePaise;

    if (spendable > 0 && daily >= 20000) {
      return {
        status: 'on_track',
        headline: 'Clear Skies',
        explanation: 'Your upcoming bills and dream contributions are safe. You have a comfortable daily buffer.',
        icon: 'sun',
      };
    } else if (spendable > 0) {
      return {
        status: 'take_care',
        headline: 'Gentle Breeze — Mindful Pacing',
        explanation: 'You are on track, but spending at a mindful pace will keep you comfortable until next payday.',
        icon: 'cloud',
      };
    } else {
      return {
        status: 'needs_attention',
        headline: 'Shelter Mode — Upcoming Obligations',
        explanation: 'Your planned bills and savings exceed current spendable funds. Protect your essentials first.',
        icon: 'rain',
      };
    }
  }, [summary]);

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
    setIsShowcaseActive(true);
    setShowcaseStep(1);
    setActiveTab('home');
    showToast('Loaded demo scenario');
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
        paydayBridge,
        toggleChallengeStreak,
        resetToDemo,
        loadHackathonScenario,
        showcaseStep,
        setShowcaseStep,
        isShowcaseActive,
        setIsShowcaseActive,
        toastMessage,
        showToast,
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
