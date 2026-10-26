/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Bill,
  CategoryBudget,
  FinancialSummary,
  PurchaseSimulationResult,
  SavingsJar,
  Transaction,
  UserSettings,
} from '../types/finance';
import { getDaysDiff, getTodayDateString } from '../utils/formatters';

export class FinancialEngine {
  /**
   * Calculates complete financial summary ensuring strict reconciliation and zero double-counting.
   */
  public static calculateSummary(
    transactions: Transaction[],
    bills: Bill[],
    jars: SavingsJar[],
    settings: UserSettings
  ): FinancialSummary {
    let totalIncomePaise = 0;
    let essentialExpensesPaise = 0;
    let discretionaryExpensesPaise = 0;
    let billPaymentsPaise = 0;
    let jarDepositsFromAvailablePaise = 0;
    let jarWithdrawalsToAvailablePaise = 0;

    for (const tx of transactions) {
      switch (tx.type) {
        case 'income':
          totalIncomePaise += tx.amountPaise;
          break;
        case 'essential_expense':
          essentialExpensesPaise += tx.amountPaise;
          break;
        case 'discretionary_expense':
          discretionaryExpensesPaise += tx.amountPaise;
          break;
        case 'bill_payment':
          billPaymentsPaise += tx.amountPaise;
          break;
        case 'savings_deposit':
          // Moved from general funds into a savings jar
          jarDepositsFromAvailablePaise += tx.amountPaise;
          break;
        case 'savings_withdrawal':
          // Moved from jar back to available funds
          jarWithdrawalsToAvailablePaise += tx.amountPaise;
          break;
        case 'transfer':
          // Between jars: neutral to available funds
          break;
      }
    }

    // Pure expenses for analytics (exclude savings transfers to prevent double counting)
    const totalExpensesPaise =
      essentialExpensesPaise + discretionaryExpensesPaise + billPaymentsPaise;

    // Current liquid available balance in user's operating cash pool:
    // (Total income received) - (Expenses spent) - (Funds transferred into jars) + (Funds withdrawn from jars)
    const currentAvailableBalancePaise =
      totalIncomePaise -
      totalExpensesPaise -
      jarDepositsFromAvailablePaise +
      jarWithdrawalsToAvailablePaise;

    // Total actual saved in jars
    const totalSavedInJarsPaise = jars.reduce(
      (sum, jar) => sum + Math.max(0, jar.savedPaise),
      0
    );

    // Unpaid essential bills that must be honored before the next pay cycle
    let unpaidEssentialBillsPaise = 0;
    let unpaidTotalBillsPaise = 0;

    for (const bill of bills) {
      if (!bill.isPaid) {
        unpaidTotalBillsPaise += bill.amountPaise;
        if (bill.priority === 'essential' || bill.autoDeductFromSpendable) {
          unpaidEssentialBillsPaise += bill.amountPaise;
        }
      }
    }

    // Planned monthly savings contributions across active jars
    // Only count active goals that haven't already hit their target
    const plannedSavingsMonthlyPaise = jars.reduce((sum, jar) => {
      const remainingTarget = Math.max(0, jar.targetPaise - jar.savedPaise);
      if (remainingTarget <= 0) return sum;
      return sum + Math.min(remainingTarget, jar.monthlyContributionTargetPaise);
    }, 0);

    const emergencyReservePaise = Math.max(0, settings.emergencyReservePaise || 0);

    // === SIGNATURE SAFE-TO-SPEND ENGINE ===
    // Spendable balance = Current Available Funds
    //                   - Unpaid Essential Bills
    //                   - Planned Savings Contributions
    //                   - Emergency Reserve Funds
    const rawSpendablePaise =
      currentAvailableBalancePaise -
      unpaidEssentialBillsPaise -
      plannedSavingsMonthlyPaise -
      emergencyReservePaise;

    const isSpendableDeficit = rawSpendablePaise < 0;
    const spendableBalancePaise = rawSpendablePaise;

    // Days remaining until next income
    const today = getTodayDateString();
    let daysRemainingUntilIncome = getDaysDiff(settings.nextIncomeDate, today);
    if (isNaN(daysRemainingUntilIncome) || daysRemainingUntilIncome <= 0) {
      daysRemainingUntilIncome = 1;
    }

    // Suggested Daily Allowance
    let suggestedDailyAllowancePaise = 0;
    if (spendableBalancePaise > 0) {
      suggestedDailyAllowancePaise = Math.floor(
        spendableBalancePaise / daysRemainingUntilIncome
      );
    }

    // Remaining weekly allowance (up to next 7 days or days remaining, whichever is smaller)
    const daysThisWeek = Math.min(7, daysRemainingUntilIncome);
    const remainingWeeklyAllowancePaise =
      suggestedDailyAllowancePaise * daysThisWeek;

    // Savings rate: pure savings contributions / total income (if income > 0)
    let savingsRatePercentage = 0;
    if (totalIncomePaise > 0) {
      const actualSavingsThisPeriod = jarDepositsFromAvailablePaise;
      savingsRatePercentage = Math.round(
        (actualSavingsThisPeriod / totalIncomePaise) * 100
      );
    }

    // Projected end-of-month balance (liquid cash after all unpaid bills & planned savings are fulfilled)
    const endOfMonthProjectedBalancePaise =
      currentAvailableBalancePaise - unpaidTotalBillsPaise - plannedSavingsMonthlyPaise;

    // Health status
    let budgetHealthStatus: 'healthy' | 'caution' | 'critical' = 'healthy';
    let healthMessage = 'Your budget is well-balanced and planned savings are protected.';

    if (currentAvailableBalancePaise < 0 || spendableBalancePaise < 0) {
      budgetHealthStatus = 'critical';
      healthMessage =
        'Warning: Upcoming obligations & planned savings exceed your current available funds.';
    } else if (suggestedDailyAllowancePaise < 15000) {
      // Under ₹150/day spendable
      budgetHealthStatus = 'caution';
      healthMessage =
        'Spendable balance is tight. Consider pausing discretionary purchases until next payday.';
    }

    return {
      totalIncomePaise,
      totalExpensesPaise,
      essentialExpensesPaise,
      discretionaryExpensesPaise,
      currentAvailableBalancePaise,
      unpaidEssentialBillsPaise,
      unpaidTotalBillsPaise,
      plannedSavingsMonthlyPaise,
      emergencyReservePaise,
      spendableBalancePaise,
      isSpendableDeficit,
      suggestedDailyAllowancePaise,
      remainingWeeklyAllowancePaise,
      daysRemainingUntilIncome,
      savingsRatePercentage,
      totalSavedInJarsPaise,
      endOfMonthProjectedBalancePaise,
      budgetHealthStatus,
      healthMessage,
    };
  }

  /**
   * Before-You-Buy Purchase Simulator
   * Predicts impact on spendable balance, category budget, affected bills, and goal timelines.
   */
  public static simulatePurchase(
    purchaseAmountPaise: number,
    category: string,
    itemName: string,
    transactions: Transaction[],
    bills: Bill[],
    jars: SavingsJar[],
    budgets: CategoryBudget[],
    settings: UserSettings,
    selectedJarId?: string
  ): PurchaseSimulationResult {
    const summaryBefore = this.calculateSummary(transactions, bills, jars, settings);

    // Current spending in this category
    const currentCategorySpentPaise = transactions
      .filter((t) => t.category === category && (t.type === 'essential_expense' || t.type === 'discretionary_expense' || t.type === 'bill_payment'))
      .reduce((sum, t) => sum + t.amountPaise, 0);

    const targetCategoryBudget = budgets.find((b) => b.category === category);
    const categoryBudgetPaise = targetCategoryBudget ? targetCategoryBudget.budgetPaise : 0;
    const newCategorySpentPaise = currentCategorySpentPaise + purchaseAmountPaise;
    const categoryBudgetExceeded =
      categoryBudgetPaise > 0 && newCategorySpentPaise > categoryBudgetPaise;
    const categoryExceededByPaise = categoryBudgetExceeded
      ? newCategorySpentPaise - categoryBudgetPaise
      : 0;

    const currentSpendablePaise = summaryBefore.spendableBalancePaise;
    const newSpendablePaise = currentSpendablePaise - purchaseAmountPaise;
    const spendableDeltaPaise = -purchaseAmountPaise;
    const isAffordableWithoutDeficit = newSpendablePaise >= 0;

    const daysRemaining = summaryBefore.daysRemainingUntilIncome;
    const dailyAllowanceBeforePaise = summaryBefore.suggestedDailyAllowancePaise;
    const dailyAllowanceAfterPaise =
      newSpendablePaise > 0 ? Math.floor(newSpendablePaise / daysRemaining) : 0;

    // Check if any upcoming unpaid essential bills would be endangered
    const availableFundsAfterPurchase = summaryBefore.currentAvailableBalancePaise - purchaseAmountPaise;
    const affectedBills = bills.filter(
      (b) => !b.isPaid && (b.priority === 'essential' || b.autoDeductFromSpendable) && availableFundsAfterPurchase < b.amountPaise
    );

    // Goal delay simulation
    let selectedGoalImpact: PurchaseSimulationResult['selectedGoalImpact'] | undefined;
    const jarToAnalyze = selectedJarId
      ? jars.find((j) => j.id === selectedJarId)
      : jars.find((j) => j.targetPaise > j.savedPaise);

    if (jarToAnalyze && jarToAnalyze.monthlyContributionTargetPaise > 0) {
      const remainingNeeded = Math.max(0, jarToAnalyze.targetPaise - jarToAnalyze.savedPaise);
      const monthlyRate = jarToAnalyze.monthlyContributionTargetPaise;
      
      // If purchase would force reducing savings contribution
      const monthsToGoalNow = Math.ceil(remainingNeeded / monthlyRate);
      
      // If spendable goes negative or takes from planned savings
      let delayDays = 0;
      if (newSpendablePaise < 0) {
        const shortfall = Math.abs(newSpendablePaise);
        // Estimate days delayed based on daily income run-rate
        const dailyIncomePaise = Math.max(1, settings.monthlyIncomePaise / 30);
        delayDays = Math.ceil(shortfall / dailyIncomePaise);
      } else {
        // Opportunity cost delay: if that money went to goal instead
        const dailyJarSaving = monthlyRate / 30;
        delayDays = Math.round(purchaseAmountPaise / (dailyJarSaving || 1));
      }

      const origDate = new Date(jarToAnalyze.targetDate);
      const newDate = new Date(origDate.getTime() + delayDays * 24 * 60 * 60 * 1000);

      selectedGoalImpact = {
        goalName: jarToAnalyze.name,
        originalTargetDate: jarToAnalyze.targetDate,
        estimatedNewTargetDate: newDate.toISOString().split('T')[0],
        daysDelayed: Math.max(1, delayDays),
      };
    }

    let recommendationType: 'safe' | 'caution' | 'deficit' = 'safe';
    let explanation = '';
    const alternativeSuggestions: string[] = [];

    if (newSpendablePaise < 0) {
      recommendationType = 'deficit';
      const deficitPaise = Math.abs(newSpendablePaise);
      explanation = `This purchase would put your spendable funds into a ₹${(deficitPaise / 100).toLocaleString('en-IN')} deficit, threatening your upcoming bills and planned savings.`;
      alternativeSuggestions.push(
        'Wait until your next income deposit on ' + settings.nextIncomeDate + ' to purchase safely.'
      );
      alternativeSuggestions.push(
        'Check if you can find a refurbished, pre-owned, or discounted model.'
      );
      alternativeSuggestions.push(
        'Create a dedicated Smart Savings Jar to save for this item over 2 to 3 months without touching bill funds.'
      );
    } else if (categoryBudgetExceeded || dailyAllowanceAfterPaise < 15000) {
      recommendationType = 'caution';
      explanation = `You have enough cash, but this purchase reduces your daily spending allowance from ₹${(dailyAllowanceBeforePaise / 100).toFixed(0)} to ₹${(dailyAllowanceAfterPaise / 100).toFixed(0)} per day for the next ${daysRemaining} days.`;
      if (categoryBudgetExceeded) {
        alternativeSuggestions.push(
          `This purchase exceeds your ${category} monthly budget by ₹${(categoryExceededByPaise / 100).toLocaleString('en-IN')}.`
        );
      }
      alternativeSuggestions.push(
        'Consider spacing out other discretionary spending this week to maintain balance.'
      );
    } else {
      recommendationType = 'safe';
      explanation = `Safe to spend! All upcoming essential bills and planned savings remain 100% funded, leaving ₹${(newSpendablePaise / 100).toLocaleString('en-IN')} spendable.`;
      alternativeSuggestions.push(
        `Your daily spending cushion will be ₹${(dailyAllowanceAfterPaise / 100).toFixed(0)}/day for the next ${daysRemaining} days.`
      );
    }

    return {
      purchaseAmountPaise,
      category,
      itemName: itemName || 'Planned Item',
      currentSpendablePaise,
      newSpendablePaise,
      spendableDeltaPaise,
      isAffordableWithoutDeficit,
      currentCategorySpentPaise,
      categoryBudgetPaise,
      newCategorySpentPaise,
      categoryBudgetExceeded,
      categoryExceededByPaise,
      dailyAllowanceBeforePaise,
      dailyAllowanceAfterPaise,
      affectedBills,
      selectedGoalImpact,
      recommendationType,
      explanation,
      alternativeSuggestions,
    };
  }

  /**
   * Evaluates if total desired savings contributions are realistic given income and obligations.
   */
  public static analyzeSavingsFeasibility(
    monthlyIncomePaise: number,
    budgets: CategoryBudget[],
    jars: SavingsJar[]
  ): {
    totalPlannedSavingsPaise: number;
    totalEssentialBudgetsPaise: number;
    maximumFeasibleSavingsPaise: number;
    isRealistic: boolean;
    deficitPaise: number;
    suggestions: string[];
  } {
    const totalEssentialBudgetsPaise = budgets
      .filter((b) => b.isEssential)
      .reduce((sum, b) => sum + b.budgetPaise, 0);

    const maximumFeasibleSavingsPaise = Math.max(
      0,
      monthlyIncomePaise - totalEssentialBudgetsPaise
    );

    const totalPlannedSavingsPaise = jars.reduce(
      (sum, j) => sum + j.monthlyContributionTargetPaise,
      0
    );

    const isRealistic = totalPlannedSavingsPaise <= maximumFeasibleSavingsPaise;
    const deficitPaise = isRealistic
      ? 0
      : totalPlannedSavingsPaise - maximumFeasibleSavingsPaise;

    const suggestions: string[] = [];

    if (!isRealistic) {
      suggestions.push(
        `Total planned savings of ₹${(totalPlannedSavingsPaise / 100).toLocaleString('en-IN')} exceeds your available margin after essential needs by ₹${(deficitPaise / 100).toLocaleString('en-IN')}.`
      );
      suggestions.push(
        'Extend target dates for lower-priority goals to reduce monthly required contributions.'
      );
      suggestions.push(
        'Temporarily pause non-urgent jars (e.g. Travel or Gadgets) and focus first on your Emergency Fund.'
      );
      suggestions.push(
        'Never compromise essential needs (rent, groceries, utilities) to meet ambitious savings numbers.'
      );
    } else {
      suggestions.push(
        `Your savings plan is realistic! You are allocating ${Math.round((totalPlannedSavingsPaise / (monthlyIncomePaise || 1)) * 100)}% of your monthly income towards your goals.`
      );
    }

    return {
      totalPlannedSavingsPaise,
      totalEssentialBudgetsPaise,
      maximumFeasibleSavingsPaise,
      isRealistic,
      deficitPaise,
      suggestions,
    };
  }
}
