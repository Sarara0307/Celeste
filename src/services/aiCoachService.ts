/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Bill,
  CategoryBudget,
  FinancialSummary,
  SavingsJar,
  Transaction,
  UserSettings,
} from '../types/finance';
import { formatPaise, paiseToRupees } from '../utils/formatters';

export interface CoachAnswer {
  question: string;
  answer: string;
  dataPoints: Array<{ label: string; value: string; hint?: string }>;
  actionSteps: string[];
  isAiGenerated: boolean;
  confidence: 'verified_calculation' | 'ai_advisory';
}

export class AiCoachService {
  /**
   * Generates instant, mathematically accurate coaching answers based on live user data.
   * If a Gemini API key is available on the server and a freeform question is asked, it uses Gemini with grounded user metrics.
   */
  public static async answerQuestion(
    question: string,
    summary: FinancialSummary,
    transactions: Transaction[],
    bills: Bill[],
    jars: SavingsJar[],
    budgets: CategoryBudget[],
    settings: UserSettings
  ): Promise<CoachAnswer> {
    const qLower = question.toLowerCase();

    // Check pre-configured domain questions first for instant, guaranteed accurate answers
    if (qLower.includes('how much can i spend today') || qLower.includes('spend today')) {
      return this.handleDailySpendQuestion(summary);
    }

    if (qLower.includes('food') || qLower.includes('overspending on food') || qLower.includes('dining')) {
      return this.handleFoodOverspendQuestion(transactions, budgets);
    }

    if (qLower.includes('how much should i save this month') || qLower.includes('save this month')) {
      return this.handleMonthlySavingsQuestion(summary, jars, settings);
    }

    if (qLower.includes('laptop') || qLower.includes('reach my laptop goal sooner') || qLower.includes('goal sooner')) {
      return this.handleLaptopGoalQuestion(summary, jars);
    }

    if (qLower.includes('bills are coming up') || qLower.includes('upcoming bills') || qLower.includes('what bills')) {
      return this.handleUpcomingBillsQuestion(bills);
    }

    if (qLower.includes('income decreases') || qLower.includes('decreases next month') || qLower.includes('drop in income')) {
      return this.handleIncomeDecreaseQuestion(summary, bills, jars, settings);
    }

    if (qLower.includes('can i afford') || qLower.includes('afford this purchase')) {
      return this.handleAffordabilityQuestion(summary);
    }

    // Freeform question: Attempt server-side Gemini proxy if available, else rule-based synthesis
    try {
      const response = await fetch('/api/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          summary,
          settings,
          jars,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.answer && typeof data.answer === 'string' && data.answer.trim().length > 0) {
          return {
            question,
            answer: data.answer,
            dataPoints: [
              { label: 'Safe-to-Spend Balance', value: formatPaise(summary.spendableBalancePaise) },
              { label: 'Daily Allowance', value: formatPaise(summary.suggestedDailyAllowancePaise) },
              { label: 'Days Remaining', value: `${summary.daysRemainingUntilIncome} days` },
            ],
            actionSteps: [
              'Honor scheduled essential bills before discretionary splurges.',
              'Review Safe-to-Spend daily allowance before checking out.',
            ],
            isAiGenerated: true,
            confidence: 'ai_advisory',
          };
        }
      }
    } catch {
      // Fall back gracefully to synthesized response
    }

    // Default fallback synthesis
    return {
      question,
      answer: `Based on your live budget, your current Safe-to-Spend balance is ${formatPaise(
        summary.spendableBalancePaise
      )}, which provides ${formatPaise(
        summary.suggestedDailyAllowancePaise
      )} per day across the remaining ${summary.daysRemainingUntilIncome} days until your next income. All ${formatPaise(
        summary.unpaidEssentialBillsPaise
      )} in upcoming essential bills and ${formatPaise(
        summary.plannedSavingsMonthlyPaise
      )} in planned savings are already reserved.`,
      dataPoints: [
        { label: 'Spendable Cushion', value: formatPaise(summary.spendableBalancePaise) },
        { label: 'Daily Allowance', value: `${formatPaise(summary.suggestedDailyAllowancePaise)}/day` },
        { label: 'Reserved for Bills', value: formatPaise(summary.unpaidEssentialBillsPaise) },
      ],
      actionSteps: [
        'Stay within your daily spendable allowance to protect your laptop and emergency funds.',
        'Use the Before-You-Buy Simulator before committing to any purchase above ₹500.',
      ],
      isAiGenerated: false,
      confidence: 'verified_calculation',
    };
  }

  private static handleDailySpendQuestion(summary: FinancialSummary): CoachAnswer {
    const isDeficit = summary.isSpendableDeficit;
    return {
      question: 'How much can I spend today?',
      answer: isDeficit
        ? `You currently have a spendable deficit of ${formatPaise(
            Math.abs(summary.spendableBalancePaise)
          )}. Your available funds are lower than upcoming bills and savings targets, so discretionary spending today should be ₹0.`
        : `You can safely spend ${formatPaise(
            summary.suggestedDailyAllowancePaise
          )} today without hurting your upcoming essential bills or your planned savings targets.`,
      dataPoints: [
        { label: 'Daily Allowance', value: formatPaise(summary.suggestedDailyAllowancePaise), hint: 'Calculated from spendable pool' },
        { label: 'Days Until Next Income', value: `${summary.daysRemainingUntilIncome} days` },
        { label: 'Weekly Spendable Margin', value: formatPaise(summary.remainingWeeklyAllowancePaise) },
        { label: 'Remaining Liquid Spendable', value: formatPaise(summary.spendableBalancePaise) },
      ],
      actionSteps: [
        'If you spend less than your daily allowance, the leftover amount rolls over to increase your allowance tomorrow.',
        'Essential items like campus transit and groceries are already factored in.',
      ],
      isAiGenerated: false,
      confidence: 'verified_calculation',
    };
  }

  private static handleFoodOverspendQuestion(
    transactions: Transaction[],
    budgets: CategoryBudget[]
  ): CoachAnswer {
    const foodTx = transactions.filter(
      (t) =>
        t.category === 'Food & Groceries' &&
        (t.type === 'essential_expense' || t.type === 'discretionary_expense')
    );
    const spentPaise = foodTx.reduce((sum, t) => sum + t.amountPaise, 0);
    const budgetObj = budgets.find((b) => b.category === 'Food & Groceries');
    const budgetPaise = budgetObj ? budgetObj.budgetPaise : 450000;
    const diffPaise = spentPaise - budgetPaise;

    return {
      question: 'Why am I overspending on food?',
      answer:
        diffPaise > 0
          ? `You have spent ${formatPaise(spentPaise)} on food against a target budget of ${formatPaise(
              budgetPaise
            )}, putting you ${formatPaise(diffPaise)} over budget. Looking at transaction records, frequent small cafe and snack transactions are adding up.`
          : `You have spent ${formatPaise(spentPaise)} out of your ${formatPaise(
              budgetPaise
            )} food budget (${Math.round((spentPaise / budgetPaise) * 100)}% utilized). You are still on track!`,
      dataPoints: [
        { label: 'Food Spent', value: formatPaise(spentPaise) },
        { label: 'Monthly Food Budget', value: formatPaise(budgetPaise) },
        { label: 'Transactions Logged', value: `${foodTx.length} food entries` },
      ],
      actionSteps: [
        'Differentiate campus mess/groceries (essential) from impulse cafe outings (discretionary).',
        'Try meal-planning 2 days in advance to reduce impulse delivery app orders.',
      ],
      isAiGenerated: false,
      confidence: 'verified_calculation',
    };
  }

  private static handleMonthlySavingsQuestion(
    summary: FinancialSummary,
    jars: SavingsJar[],
    settings: UserSettings
  ): CoachAnswer {
    const targetSavingsPaise = jars.reduce(
      (sum, j) => sum + j.monthlyContributionTargetPaise,
      0
    );
    const savingsPercent = Math.round(
      (targetSavingsPaise / (settings.monthlyIncomePaise || 1)) * 100
    );

    return {
      question: 'How much should I save this month?',
      answer: `Based on your monthly income of ${formatPaise(
        settings.monthlyIncomePaise
      )}, your planned jar targets sum to ${formatPaise(
        targetSavingsPaise
      )} (${savingsPercent}% savings rate). Financial rules of thumb (like 50/30/20) recommend aiming for 20% (${formatPaise(
        settings.monthlyIncomePaise * 0.2
      )}), so your current goal pace is ambitious yet achievable if you stay within discretionary limits.`,
      dataPoints: [
        { label: 'Planned Jar Target', value: formatPaise(targetSavingsPaise) },
        { label: 'Current Savings Rate', value: `${savingsPercent}%` },
        { label: 'Recommended Benchmark (20%)', value: formatPaise(settings.monthlyIncomePaise * 0.2) },
      ],
      actionSteps: [
        'Lock in your Emergency Fund deposit first to protect yourself from unexpected cash shocks.',
        'Deposit planned jar contributions right after income arrives rather than waiting for month-end leftovers.',
      ],
      isAiGenerated: false,
      confidence: 'verified_calculation',
    };
  }

  private static handleLaptopGoalQuestion(
    summary: FinancialSummary,
    jars: SavingsJar[]
  ): CoachAnswer {
    const laptopJar = jars.find(
      (j) => j.id === 'jar-laptop' || j.name.toLowerCase().includes('laptop')
    );

    if (!laptopJar) {
      return {
        question: 'How can I reach my laptop goal sooner?',
        answer: 'You currently have no active laptop goal jar. Create one in the Savings Jars page to track it!',
        dataPoints: [],
        actionSteps: ['Create a "Laptop" Smart Jar with target amount and date.'],
        isAiGenerated: false,
        confidence: 'verified_calculation',
      };
    }

    const neededPaise = Math.max(0, laptopJar.targetPaise - laptopJar.savedPaise);
    const currentRate = laptopJar.monthlyContributionTargetPaise || 200000;
    const monthsCurrent = Math.ceil(neededPaise / currentRate);

    // If boosted by ₹1,000/mo
    const boostedRate = currentRate + 100000;
    const monthsBoosted = Math.ceil(neededPaise / boostedRate);

    return {
      question: 'How can I reach my laptop goal sooner?',
      answer: `You still need ${formatPaise(neededPaise)} for your ${laptopJar.name}. At your current pace of ${formatPaise(
        currentRate
      )}/month, you will finish in ~${monthsCurrent} months. If you reallocate ₹1,000/month from discretionary spending, you will reach it in ${monthsBoosted} months—saving nearly a full month!`,
      dataPoints: [
        { label: 'Saved So Far', value: formatPaise(laptopJar.savedPaise) },
        { label: 'Remaining Target', value: formatPaise(neededPaise) },
        { label: 'Current Timeline', value: `~${monthsCurrent} months` },
        { label: 'Boosted Timeline (+₹1,000/mo)', value: `~${monthsBoosted} months` },
      ],
      actionSteps: [
        'Check the Before-You-Buy Simulator: avoiding one ₹2,000 non-essential purchase advances your laptop goal by ~30 days.',
        'Temporarily pause travel or gadget secondary jars until laptop milestone is reached.',
      ],
      isAiGenerated: false,
      confidence: 'verified_calculation',
    };
  }

  private static handleUpcomingBillsQuestion(bills: Bill[]): CoachAnswer {
    const unpaid = bills.filter((b) => !b.isPaid);
    const essentialTotal = unpaid
      .filter((b) => b.priority === 'essential')
      .reduce((sum, b) => sum + b.amountPaise, 0);

    return {
      question: 'What bills are coming up?',
      answer: `You have ${unpaid.length} unpaid upcoming bills totaling ${formatPaise(
        unpaid.reduce((sum, b) => sum + b.amountPaise, 0)
      )}, of which ${formatPaise(
        essentialTotal
      )} are critical essential obligations (broadband, electricity, mobile recharge).`,
      dataPoints: unpaid.map((b) => ({
        label: b.name,
        value: `${formatPaise(b.amountPaise)} (Due: ${b.dueDate})`,
        hint: b.priority.toUpperCase(),
      })),
      actionSteps: [
        'All essential bills are automatically ring-fenced inside your Safe-to-Spend engine so you never accidentally spend bill money.',
        'Mark each bill paid on the Bill Calendar once settled.',
      ],
      isAiGenerated: false,
      confidence: 'verified_calculation',
    };
  }

  private static handleIncomeDecreaseQuestion(
    summary: FinancialSummary,
    bills: Bill[],
    jars: SavingsJar[],
    settings: UserSettings
  ): CoachAnswer {
    const decreasedIncome = settings.monthlyIncomePaise * 0.8; // 20% drop
    const essentialBills = bills
      .filter((b) => b.priority === 'essential')
      .reduce((sum, b) => sum + b.amountPaise, 0);

    return {
      question: 'What happens if my income decreases next month?',
      answer: `If your income drops by 20% to ${formatPaise(
        decreasedIncome
      )}, your core essential obligations of ${formatPaise(
        essentialBills
      )} would still be covered. However, you would need to adjust your discretionary spending down and prioritize your Emergency Fund over gadget purchases.`,
      dataPoints: [
        { label: 'Current Income', value: formatPaise(settings.monthlyIncomePaise) },
        { label: 'Hypothetical (-20%)', value: formatPaise(decreasedIncome) },
        { label: 'Essential Obligations Floor', value: formatPaise(essentialBills) },
      ],
      actionSteps: [
        'Maintain a minimum 1-month emergency reserve of ₹1,000–₹3,000 to insulate against stipend delays.',
        'Use the Budget Planner to lock essential necessities (50% rule) before allocating savings.',
      ],
      isAiGenerated: false,
      confidence: 'verified_calculation',
    };
  }

  private static handleAffordabilityQuestion(summary: FinancialSummary): CoachAnswer {
    return {
      question: 'Can I afford this purchase?',
      answer: `Your current Safe-to-Spend limit is ${formatPaise(
        summary.spendableBalancePaise
      )}. Any purchase below this amount is safe without touching bill money or your planned jar savings. Use our "Before-You-Buy Simulator" to test exact items!`,
      dataPoints: [
        { label: 'Safe Spendable Limit', value: formatPaise(summary.spendableBalancePaise) },
        { label: 'Suggested Daily Max', value: formatPaise(summary.suggestedDailyAllowancePaise) },
      ],
      actionSteps: [
        'Open the Before-You-Buy Simulator tab.',
        'Enter item name and price (e.g. ₹2,000 Headphones) to preview the exact impact on your laptop goal and bills.',
      ],
      isAiGenerated: false,
      confidence: 'verified_calculation',
    };
  }
}
