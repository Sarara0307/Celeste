/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { ExpenseCategory, PurchaseSimulationResult } from '../types/finance';
import { formatDate, formatPaise, rupeesToPaise } from '../utils/formatters';
import { FinancialEngine } from '../services/financialEngine';
import {
  Calculator,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Sparkles,
  ShoppingBag,
  Zap,
  Info,
} from 'lucide-react';

const PRESET_PURCHASES = [
  { name: 'Noise-Cancelling Headphones', amountRupees: '2000', category: 'Shopping & Gadgets' },
  { name: 'Weekend Dining & Cafe Hangout', amountRupees: '850', category: 'Food & Groceries' },
  { name: 'Sneakers / Casual Footwear', amountRupees: '3200', category: 'Shopping & Gadgets' },
  { name: 'Software Development Tools Bundle', amountRupees: '1500', category: 'Subscriptions' },
];

export const BeforeYouBuyPage: React.FC = () => {
  const {
    transactions,
    bills,
    jars,
    budgets,
    settings,
    summary,
    addTransaction,
    showToast,
    setActiveTab,
  } = useFinance();

  const [itemName, setItemName] = useState('Wireless Noise-Canceling Headphones');
  const [amountRupees, setAmountRupees] = useState('2000');
  const [category, setCategory] = useState<ExpenseCategory>('Shopping & Gadgets');
  const [selectedJarId, setSelectedJarId] = useState<string>(
    jars.find((j) => j.name.toLowerCase().includes('laptop'))?.id || jars[0]?.id || ''
  );

  const parsedAmount = parseFloat(amountRupees);
  const purchaseAmountPaise = !isNaN(parsedAmount) && parsedAmount > 0 ? rupeesToPaise(parsedAmount) : 0;

  // Run real-time simulation via FinancialEngine
  const simulation: PurchaseSimulationResult | null =
    purchaseAmountPaise > 0
      ? FinancialEngine.simulatePurchase(
          purchaseAmountPaise,
          category,
          itemName,
          transactions,
          bills,
          jars,
          budgets,
          settings,
          selectedJarId
        )
      : null;

  const handleCommitPurchase = () => {
    if (!simulation) return;

    addTransaction({
      description: simulation.itemName,
      amountPaise: simulation.purchaseAmountPaise,
      type: 'discretionary_expense',
      category: simulation.category,
      date: new Date().toISOString().split('T')[0],
      notes: 'Logged via Before-You-Buy Simulator',
    });

    showToast(`Logged purchase: ${simulation.itemName} (₹${(simulation.purchaseAmountPaise / 100).toLocaleString('en-IN')})`);
    setActiveTab('dashboard');
  };

  return (
    <div className="space-y-7 pb-14">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-indigo-400">
              Interactive Decision Simulator
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Before-You-Buy Simulator
          </h1>
          <p className="text-xs text-slate-400">
            Preview the exact before-and-after financial ripple effect on your goals and daily allowance before spending a single rupee.
          </p>
        </div>

        <div className="p-3 px-4 rounded-2xl bg-[#0a0f1d] border border-white/[0.08] text-right shadow-sm">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
            Current Safe-to-Spend
          </span>
          <span className="text-lg font-black font-mono text-emerald-400">
            {formatPaise(summary.spendableBalancePaise)}
          </span>
        </div>
      </div>

      {/* Common Presets */}
      <div className="rounded-3xl p-5 bg-[#0a0f1d] border border-white/[0.07] space-y-2.5 shadow-lg">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
          Common Purchase Scenarios:
        </span>
        <div className="flex flex-wrap gap-2">
          {PRESET_PURCHASES.map((preset) => (
            <button
              key={preset.name}
              onClick={() => {
                setItemName(preset.name);
                setAmountRupees(preset.amountRupees);
                setCategory(preset.category as ExpenseCategory);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-indigo-600/20 text-slate-300 hover:text-indigo-200 border border-white/[0.07] text-xs font-semibold transition-all"
            >
              {preset.name} (₹{preset.amountRupees})
            </button>
          ))}
        </div>
      </div>

      {/* Simulator Inputs & Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 rounded-3xl p-6 sm:p-7 bg-[#0a0f1d] border border-white/[0.07] space-y-4 shadow-xl">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-indigo-400" />
            <h2 className="text-sm font-bold text-white tracking-tight">Purchase Specifications</h2>
          </div>

          <div className="space-y-4 pt-1">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Item Description
              </label>
              <input
                type="text"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder="What do you plan to buy?"
                className="w-full bg-slate-900 border border-white/[0.08] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Price (₹ INR)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2 text-slate-400 font-bold text-sm">₹</span>
                <input
                  type="number"
                  step="any"
                  min="0"
                  value={amountRupees}
                  onChange={(e) => setAmountRupees(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-slate-900 border border-white/[0.08] rounded-xl pl-8 pr-3 py-2 text-sm text-white font-mono font-bold focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Spending Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                className="w-full bg-slate-900 border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="Shopping & Gadgets">Shopping & Gadgets</option>
                <option value="Food & Groceries">Food & Groceries</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Subscriptions">Subscriptions</option>
                <option value="Transport">Transport</option>
                <option value="Personal Care">Personal Care</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Compare Delay Against Goal
              </label>
              <select
                value={selectedJarId}
                onChange={(e) => setSelectedJarId(e.target.value)}
                className="w-full bg-slate-900 border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                {jars.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.name} (Target: {formatPaise(j.targetPaise)})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Simulation Outcome Comparison */}
        <div className="lg:col-span-2 space-y-4">
          {simulation ? (
            <div className="rounded-3xl p-7 sm:p-8 bg-[#0a0f1d] border border-white/[0.08] space-y-6 shadow-2xl">
              {/* Verdict Header */}
              <div
                className={`p-4 rounded-2xl border flex items-start gap-3.5 backdrop-blur-md ${
                  simulation.recommendationType === 'safe'
                    ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-200'
                    : simulation.recommendationType === 'caution'
                    ? 'bg-amber-950/30 border-amber-500/30 text-amber-200'
                    : 'bg-rose-950/40 border-rose-500/30 text-rose-200'
                }`}
              >
                {simulation.recommendationType === 'safe' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle
                    className={`w-5 h-5 shrink-0 mt-0.5 ${
                      simulation.recommendationType === 'caution'
                        ? 'text-amber-400'
                        : 'text-rose-400'
                    }`}
                  />
                )}
                <div>
                  <h3 className="text-sm font-bold text-white capitalize">
                    {simulation.recommendationType === 'safe'
                      ? 'Safe to Spend'
                      : simulation.recommendationType === 'caution'
                      ? 'Proceed with Caution'
                      : 'High Cashflow Deficit Risk'}
                  </h3>
                  <p className="text-xs mt-0.5 leading-relaxed">{simulation.explanation}</p>
                </div>
              </div>

              {/* Before vs After Comparison Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Before */}
                <div className="p-5 rounded-2xl bg-black/30 border border-white/[0.05] space-y-3">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400 block">
                    Before Purchase
                  </span>
                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Safe-to-Spend Balance:</span>
                      <span className="font-mono font-bold text-emerald-400">
                        {formatPaise(simulation.currentSpendablePaise)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Daily Spending Allowance:</span>
                      <span className="font-mono text-white font-semibold">
                        {formatPaise(simulation.dailyAllowanceBeforePaise)} / day
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">{simulation.category} Spent:</span>
                      <span className="font-mono text-slate-300">
                        {formatPaise(simulation.currentCategorySpentPaise)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* After */}
                <div className="p-5 rounded-2xl bg-black/30 border border-white/[0.05] space-y-3">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-indigo-400 block">
                    After Purchase ({formatPaise(simulation.purchaseAmountPaise)})
                  </span>
                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">New Spendable Balance:</span>
                      <span
                        className={`font-mono font-bold ${
                          simulation.newSpendablePaise < 0
                            ? 'text-rose-400'
                            : 'text-emerald-400'
                        }`}
                      >
                        {formatPaise(simulation.newSpendablePaise)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">New Daily Allowance:</span>
                      <span className="font-mono text-white font-semibold">
                        {formatPaise(simulation.dailyAllowanceAfterPaise)} / day
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">{simulation.category} Total:</span>
                      <span
                        className={`font-mono ${
                          simulation.categoryBudgetExceeded
                            ? 'text-amber-400 font-bold'
                            : 'text-slate-300'
                        }`}
                      >
                        {formatPaise(simulation.newCategorySpentPaise)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Goal Timeline Impact */}
              {simulation.selectedGoalImpact && (
                <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/25 space-y-1.5 text-xs">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-indigo-400" />
                    <span className="font-bold text-white">
                      Impact on {simulation.selectedGoalImpact.goalName}:
                    </span>
                  </div>
                  <p className="text-indigo-200/90 leading-relaxed">
                    Spending {formatPaise(simulation.purchaseAmountPaise)} delays your{' '}
                    <strong className="text-white font-semibold">
                      {simulation.selectedGoalImpact.goalName}
                    </strong>{' '}
                    milestone by approximately{' '}
                    <strong className="text-amber-300 font-mono">
                      ~{simulation.selectedGoalImpact.daysDelayed} days
                    </strong>{' '}
                    (from {formatDate(simulation.selectedGoalImpact.originalTargetDate)} to{' '}
                    {formatDate(simulation.selectedGoalImpact.estimatedNewTargetDate)}).
                  </p>
                </div>
              )}

              {/* Non-judgmental Alternatives */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-widest block">
                  Supportive Observations:
                </span>
                <div className="space-y-1.5 pl-1 text-xs text-slate-400">
                  {simulation.alternativeSuggestions.map((s, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span>{s}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/[0.06]">
                <span className="text-[11px] text-slate-500">
                  Simulation only. Your real ledger will not change until you click confirm.
                </span>

                <button
                  onClick={handleCommitPurchase}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
                >
                  <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                  <span>Confirm & Log Purchase</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-xs text-slate-500 rounded-3xl bg-[#0a0f1d] border border-white/[0.07]">
              Enter a price greater than ₹0 to generate the purchase simulation.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
