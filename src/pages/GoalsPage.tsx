/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { formatPaise, rupeesToPaise } from '../utils/formatters';
import { FinancialEngine } from '../services/financialEngine';
import { SavingsJar } from '../types/finance';
import {
  Target,
  Plus,
  Sparkles,
  ShoppingBag,
  Clock,
  ArrowRight,
  ShieldAlert,
  ShieldCheck,
  CheckCircle,
  HelpCircle,
  X,
  Laptop,
  Umbrella,
  Plane,
  GraduationCap,
  Heart,
  TrendingUp,
} from 'lucide-react';

export const GoalsPage: React.FC = () => {
  const {
    jars,
    addJar,
    depositToJar,
    withdrawFromJar,
    deleteJar,
    summary,
    transactions,
    bills,
    budgets,
    settings,
    dreams,
    contributeToDream,
    addTransaction,
    showToast,
  } = useFinance();

  const [activeTab, setActiveTab] = useState<'jars' | 'simulator'>('jars');
  const [isAddJarOpen, setIsAddJarOpen] = useState(false);
  const [selectedJar, setSelectedJar] = useState<SavingsJar | null>(null);
  const [jarAmountStr, setJarAmountStr] = useState('1000');
  const [jarActionType, setJarActionType] = useState<'deposit' | 'withdraw'>('deposit');

  // Simulator state
  const [itemName, setItemName] = useState('');
  const [itemPriceStr, setItemPriceStr] = useState('');
  const [itemCategory, setItemCategory] = useState('Shopping & Gadgets');
  const [targetGoalId, setTargetGoalId] = useState(jars[0]?.id || '');
  const [simulationResult, setSimulationResult] = useState<any | null>(null);
  const [coolingList, setCoolingList] = useState<
    Array<{ id: string; name: string; amountPaise: number; createdAt: string }>
  >([
    {
      id: 'cool-1',
      name: 'Wireless Noise-Canceling Earbuds',
      amountPaise: 349900,
      createdAt: '2 days ago',
    },
  ]);

  // New jar state
  const [newJarName, setNewJarName] = useState('');
  const [newJarTargetStr, setNewJarTargetStr] = useState('15000');
  const [newJarCategory, setNewJarCategory] = useState<any>('gadgets');

  const handleSimulate = (e: React.FormEvent) => {
    e.preventDefault();
    const priceRupees = parseFloat(itemPriceStr);
    if (!itemName.trim() || isNaN(priceRupees) || priceRupees <= 0) return;

    const purchaseAmountPaise = rupeesToPaise(priceRupees);
    const result = FinancialEngine.simulatePurchase(
      purchaseAmountPaise,
      itemCategory,
      itemName,
      transactions,
      bills,
      jars,
      budgets,
      settings,
      targetGoalId
    );

    setSimulationResult(result);
  };

  const handleChoiceBuyNow = () => {
    if (!simulationResult) return;
    addTransaction({
      date: new Date().toISOString().split('T')[0],
      description: itemName,
      amountPaise: simulationResult.purchaseAmountPaise,
      type: 'discretionary_expense',
      category: itemCategory,
      notes: 'Purchased after simulator review',
    });
    setSimulationResult(null);
    setItemName('');
    setItemPriceStr('');
  };

  const handleChoiceWait48Hours = () => {
    if (!simulationResult) return;
    setCoolingList((prev) => [
      {
        id: `cool-${Date.now()}`,
        name: itemName,
        amountPaise: simulationResult.purchaseAmountPaise,
        createdAt: 'Just now',
      },
      ...prev,
    ]);
    showToast(`Added "${itemName}" to 48-Hour Wishlist. Sleep on it! 🌙`);
    setSimulationResult(null);
    setItemName('');
    setItemPriceStr('');
  };

  const handleChoiceSkipAndSave = () => {
    if (!simulationResult) return;
    // Save to the selected goal or top dream
    if (dreams.length > 0) {
      contributeToDream(dreams[0].id, simulationResult.purchaseAmountPaise);
    } else if (jars.length > 0) {
      depositToJar(jars[0].id, simulationResult.purchaseAmountPaise);
    }
    showToast(`Skipped "${itemName}" and transferred to your savings! Proud moment 🎉`);
    setSimulationResult(null);
    setItemName('');
    setItemPriceStr('');
  };

  const handleJarTransaction = () => {
    if (!selectedJar) return;
    const amt = parseFloat(jarAmountStr);
    if (isNaN(amt) || amt <= 0) return;
    const paise = rupeesToPaise(amt);

    if (jarActionType === 'deposit') {
      depositToJar(selectedJar.id, paise);
    } else {
      withdrawFromJar(selectedJar.id, paise);
    }

    setSelectedJar(null);
    setJarAmountStr('1000');
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E9E1D1] text-xs text-[#49664D] mb-2 font-medium">
            <Target className="w-3.5 h-3.5" />
            <span>Savings Jars & Purchase Decisions</span>
          </div>
          <h1 className="font-editorial text-3xl font-bold text-[#2C382E]">
            Goals & Mindful Spending
          </h1>
          <p className="text-xs text-[#657365] mt-1">
            Grow your dedicated savings buckets and simulate purchases before spending.
          </p>
        </div>

        {/* View toggle */}
        <div className="flex items-center p-1 rounded-2xl bg-[#FAF7F0] border border-[#E9E1D1] text-xs">
          <button
            onClick={() => setActiveTab('jars')}
            className={`px-4 py-2 rounded-xl font-semibold transition-all ${
              activeTab === 'jars'
                ? 'bg-[#49664D] text-white shadow-xs'
                : 'text-[#657365] hover:text-[#2C382E]'
            }`}
          >
            Savings Jars ({jars.length})
          </button>
          <button
            onClick={() => setActiveTab('simulator')}
            className={`px-4 py-2 rounded-xl font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'simulator'
                ? 'bg-[#49664D] text-white shadow-xs'
                : 'text-[#657365] hover:text-[#2C382E]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Buy, Wait, or Skip</span>
          </button>
        </div>
      </div>

      {activeTab === 'jars' ? (
        /* JARS VIEW */
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-editorial text-xl font-bold text-[#2C382E]">
                Virtual Savings Buckets
              </h2>
              <p className="text-xs text-[#657365]">
                Ring-fenced money kept safe from your everyday spending balance.
              </p>
            </div>
            <button
              onClick={() => setIsAddJarOpen(true)}
              className="px-4 py-2 rounded-2xl bg-[#49664D] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Create Jar</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jars.map((jar) => {
              const pct = Math.min(100, Math.floor((jar.savedPaise / jar.targetPaise) * 100));
              const remaining = Math.max(0, jar.targetPaise - jar.savedPaise);
              return (
                <div
                  key={jar.id}
                  className="warm-card rounded-3xl p-6 flex flex-col justify-between hover:border-[#B8CBB3] transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-2xl bg-[#FAF7F0] border border-[#E9E1D1] text-[#49664D] flex items-center justify-center font-bold">
                          ★
                        </div>
                        <div>
                          <h3 className="font-editorial text-base font-bold text-[#2C382E]">
                            {jar.name}
                          </h3>
                          <span className="text-[10px] uppercase font-semibold text-[#657365]">
                            {jar.category}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-[#49664D]">{pct}%</span>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-xs">
                        <span className="font-bold font-mono text-[#2C382E]">
                          {formatPaise(jar.savedPaise)}
                        </span>
                        <span className="text-[#657365]">Target: {formatPaise(jar.targetPaise)}</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-[#FAF7F0] border border-[#E9E1D1] overflow-hidden">
                        <div
                          className="h-full bg-[#49664D] rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-[#FAF7F0] border border-[#E9E1D1] text-xs space-y-1">
                      <div className="flex justify-between text-[#657365]">
                        <span>Remaining:</span>
                        <span className="font-mono font-medium text-[#2C382E]">
                          {formatPaise(remaining)}
                        </span>
                      </div>
                      <div className="flex justify-between text-[#657365]">
                        <span>Suggested monthly:</span>
                        <span className="font-mono font-medium text-[#49664D]">
                          {formatPaise(jar.monthlyContributionTargetPaise)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-[#E9E1D1] flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedJar(jar);
                        setJarActionType('deposit');
                        setJarAmountStr('1000');
                      }}
                      className="flex-1 py-2 rounded-xl bg-[#49664D] text-white text-xs font-semibold shadow-xs hover:bg-[#3D5540] transition-colors"
                    >
                      + Deposit
                    </button>
                    <button
                      onClick={() => {
                        setSelectedJar(jar);
                        setJarActionType('withdraw');
                        setJarAmountStr('500');
                      }}
                      className="px-3 py-2 rounded-xl bg-[#FAF7F0] hover:bg-[#E9E1D1] text-[#2C382E] text-xs font-semibold transition-colors"
                    >
                      Withdraw
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* "BUY, WAIT, OR SKIP" SIMULATOR */
        <div className="space-y-8">
          <div className="warm-card rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-white to-[#FAF7F0]">
            <div className="max-w-2xl">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#49664D] block mb-1">
                Mindful Decision Engine
              </span>
              <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#2C382E]">
                Buy, Wait, or Skip Simulator
              </h2>
              <p className="text-xs text-[#657365] mt-1.5 leading-relaxed">
                Thinking about buying something non-essential? Test it here first. See exactly how it
                alters your daily safe-to-spend pace and whether it delays your dreams.
              </p>
            </div>

            <form onSubmit={handleSimulate} className="mt-6 grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#657365] mb-1">
                  What do you want to buy?
                </label>
                <input
                  type="text"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  placeholder="e.g. Wireless Headphones, Jacket, Sneakers"
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#E9E1D1] text-xs font-medium text-[#2C382E] focus:outline-none focus:ring-2 focus:ring-[#49664D]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#657365] mb-1">
                  Price (₹)
                </label>
                <input
                  type="number"
                  value={itemPriceStr}
                  onChange={(e) => setItemPriceStr(e.target.value)}
                  placeholder="2000"
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#E9E1D1] text-xs font-bold font-mono text-[#2C382E] focus:outline-none focus:ring-2 focus:ring-[#49664D]"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#49664D] hover:bg-[#3D5540] text-white text-xs font-semibold shadow-xs flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Simulate Impact</span>
                </button>
              </div>
            </form>
          </div>

          {/* Simulation Result */}
          {simulationResult && (
            <div className="warm-card rounded-3xl p-6 sm:p-7 space-y-6 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between pb-4 border-b border-[#E9E1D1]">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#657365]">
                    Simulation Results for:
                  </span>
                  <h3 className="font-editorial text-xl font-bold text-[#2C382E]">
                    {simulationResult.itemName} (
                    {formatPaise(simulationResult.purchaseAmountPaise)})
                  </h3>
                </div>

                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    simulationResult.recommendationType === 'safe'
                      ? 'bg-emerald-100 text-emerald-800'
                      : simulationResult.recommendationType === 'caution'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {simulationResult.recommendationType === 'safe'
                    ? 'Safe to Buy'
                    : simulationResult.recommendationType === 'caution'
                    ? 'Requires Caution'
                    : 'Causes Budget Deficit'}
                </span>
              </div>

              {/* Impact Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-[#FAF7F0] border border-[#E9E1D1]">
                  <span className="text-[10px] text-[#657365] uppercase font-bold block mb-1">
                    Spendable Pool Change
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-sm line-through text-[#657365]">
                      {formatPaise(simulationResult.currentSpendablePaise)}
                    </span>
                    <span className="text-base font-bold font-mono text-[#2C382E]">
                      → {formatPaise(Math.max(0, simulationResult.newSpendablePaise))}
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF7F0] border border-[#E9E1D1]">
                  <span className="text-[10px] text-[#657365] uppercase font-bold block mb-1">
                    Daily Safe Pace
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-sm text-[#657365]">
                      {formatPaise(simulationResult.dailyAllowanceBeforePaise)}
                    </span>
                    <span className="text-base font-bold font-mono text-[#49664D]">
                      → {formatPaise(simulationResult.dailyAllowanceAfterPaise)}/d
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF7F0] border border-[#E9E1D1]">
                  <span className="text-[10px] text-[#657365] uppercase font-bold block mb-1">
                    Goal Delay Impact
                  </span>
                  <p className="text-xs text-[#2C382E] font-medium mt-1">
                    {simulationResult.selectedGoalImpact
                      ? `Delays "${simulationResult.selectedGoalImpact.goalName}" by ~${simulationResult.selectedGoalImpact.daysDelayed} days.`
                      : 'Zero delay on your planned savings!'}
                  </p>
                </div>
              </div>

              {/* Three Supportive Choices */}
              <div>
                <span className="text-xs font-bold text-[#2C382E] block mb-3">
                  How would you like to handle this purchase?
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Choice 1: Buy Now */}
                  <button
                    onClick={handleChoiceBuyNow}
                    className="p-4 rounded-2xl bg-[#FAF7F0] hover:bg-[#E9E1D1] border border-[#E9E1D1] text-left transition-colors group"
                  >
                    <span className="font-bold text-xs text-[#2C382E] block group-hover:text-[#49664D]">
                      1. Buy Now
                    </span>
                    <span className="text-[11px] text-[#657365] block mt-1">
                      {simulationResult.recommendationType === 'safe'
                        ? 'Fits within budget. Log it directly into your ledger.'
                        : 'Tight budget, but you choose to spend now.'}
                    </span>
                  </button>

                  {/* Choice 2: Wait 48 Hours */}
                  <button
                    onClick={handleChoiceWait48Hours}
                    className="p-4 rounded-2xl bg-[#FAF7F0] hover:bg-[#E9E1D1] border border-[#E9E1D1] text-left transition-colors group"
                  >
                    <span className="font-bold text-xs text-[#49664D] block">
                      2. Wait 48 Hours 🌙
                    </span>
                    <span className="text-[11px] text-[#657365] block mt-1">
                      Add to your cooling wishlist. 80% of impulsive urges disappear after 2 days.
                    </span>
                  </button>

                  {/* Choice 3: Skip & Save */}
                  <button
                    onClick={handleChoiceSkipAndSave}
                    className="p-4 rounded-2xl bg-[#F1F5F0] hover:bg-[#D5E1D2] border border-[#D5E1D2] text-left transition-colors group"
                  >
                    <span className="font-bold text-xs text-[#49664D] block">
                      3. Skip & Save to Dream ✨
                    </span>
                    <span className="text-[11px] text-[#2C382E] block mt-1">
                      Celebrate your willpower! Transfer this ₹{itemPriceStr} directly to your
                      dream instead.
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 48-Hour Cooling Wishlist */}
          <div className="warm-card rounded-3xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#49664D]" />
                <h3 className="font-editorial text-lg font-bold text-[#2C382E]">
                  48-Hour Cooling Off Wishlist
                </h3>
              </div>
              <span className="text-xs text-[#657365]">
                {coolingList.length} items waiting
              </span>
            </div>

            {coolingList.length === 0 ? (
              <p className="text-xs text-[#657365] py-4 text-center">
                Your cooling wishlist is empty. When you hesitate on an item, park it here!
              </p>
            ) : (
              <div className="space-y-2">
                {coolingList.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl bg-[#FAF7F0] border border-[#E9E1D1] flex items-center justify-between"
                  >
                    <div>
                      <span className="font-semibold text-xs text-[#2C382E] block">
                        {item.name}
                      </span>
                      <span className="text-[11px] text-[#657365]">
                        Added {item.createdAt}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-bold font-mono text-xs text-[#2C382E]">
                        {formatPaise(item.amountPaise)}
                      </span>
                      <button
                        onClick={() => {
                          contributeToDream(dreams[0]?.id || jars[0]?.id, item.amountPaise);
                          setCoolingList((prev) => prev.filter((i) => i.id !== item.id));
                          showToast(`Decided to skip! Saved ${formatPaise(item.amountPaise)} to dream 🎉`);
                        }}
                        className="px-3 py-1 rounded-xl bg-white hover:bg-[#B8CBB3]/40 border border-[#E9E1D1] text-[11px] font-semibold text-[#49664D]"
                      >
                        Skip & Save
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Jar Deposit / Withdraw Modal */}
      {selectedJar && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div
            onClick={() => setSelectedJar(null)}
            className="fixed inset-0 bg-[#2C382E]/30 backdrop-blur-xs"
          />
          <div className="relative w-full max-w-md bg-white rounded-3xl border border-[#E9E1D1] shadow-2xl p-6 z-10 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#E9E1D1]">
              <h3 className="font-editorial text-lg font-bold text-[#2C382E]">
                {jarActionType === 'deposit' ? 'Deposit into' : 'Withdraw from'}{' '}
                {selectedJar.name}
              </h3>
              <button
                onClick={() => setSelectedJar(null)}
                className="p-1 text-[#657365] hover:bg-[#FAF7F0] rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#657365] mb-2">
                Amount (₹)
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-2xl font-bold text-[#2C382E]">₹</span>
                <input
                  type="number"
                  inputMode="decimal"
                  autoFocus
                  value={jarAmountStr}
                  onChange={(e) => setJarAmountStr(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#FAF7F0] border border-[#E9E1D1] text-2xl font-bold font-mono text-[#2C382E] focus:outline-none focus:ring-2 focus:ring-[#49664D]"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSelectedJar(null)}
                className="flex-1 py-3 rounded-2xl bg-[#FAF7F0] text-xs font-semibold text-[#657365]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleJarTransaction}
                className="flex-2 py-3 rounded-2xl bg-[#49664D] hover:bg-[#3D5540] text-white text-xs font-semibold shadow-xs"
              >
                Confirm {jarActionType === 'deposit' ? 'Deposit' : 'Withdrawal'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Jar Modal */}
      {isAddJarOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div
            onClick={() => setIsAddJarOpen(false)}
            className="fixed inset-0 bg-[#2C382E]/30 backdrop-blur-xs"
          />
          <div className="relative w-full max-w-md bg-white rounded-3xl border border-[#E9E1D1] shadow-2xl p-6 z-10 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#E9E1D1]">
              <h3 className="font-editorial text-lg font-bold text-[#2C382E]">
                Create a Savings Bucket
              </h3>
              <button
                onClick={() => setIsAddJarOpen(false)}
                className="p-1 text-[#657365] hover:bg-[#FAF7F0] rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#657365] mb-1">
                  Jar Name
                </label>
                <input
                  type="text"
                  value={newJarName}
                  onChange={(e) => setNewJarName(e.target.value)}
                  placeholder="e.g. Travel to Goa, Gadgets, Course"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F0] border border-[#E9E1D1] text-xs font-medium text-[#2C382E] focus:outline-none focus:ring-2 focus:ring-[#49664D]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#657365] mb-1">
                  Target Amount (₹)
                </label>
                <input
                  type="number"
                  value={newJarTargetStr}
                  onChange={(e) => setNewJarTargetStr(e.target.value)}
                  placeholder="15000"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F0] border border-[#E9E1D1] text-xs font-bold font-mono text-[#2C382E] focus:outline-none focus:ring-2 focus:ring-[#49664D]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#657365] mb-1">
                  Category
                </label>
                <select
                  value={newJarCategory}
                  onChange={(e) => setNewJarCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F0] border border-[#E9E1D1] text-xs text-[#2C382E]"
                >
                  <option value="emergency">Emergency Fund</option>
                  <option value="gadgets">Gadgets & Tech</option>
                  <option value="travel">Travel & Trips</option>
                  <option value="education">Education & Career</option>
                  <option value="personal">Personal Purchases</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsAddJarOpen(false)}
                className="flex-1 py-3 rounded-2xl bg-[#FAF7F0] text-xs font-semibold text-[#657365]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const target = parseFloat(newJarTargetStr);
                  if (!newJarName.trim() || isNaN(target) || target <= 0) return;
                  addJar({
                    name: newJarName.trim(),
                    category: newJarCategory,
                    targetPaise: rupeesToPaise(target),
                    savedPaise: 0,
                    targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                    monthlyContributionTargetPaise: Math.round(rupeesToPaise(target) / 4),
                    priority: 'high',
                    color: '#49664D',
                    iconName: 'Target',
                  });
                  setIsAddJarOpen(false);
                  setNewJarName('');
                }}
                className="flex-2 py-3 rounded-2xl bg-[#49664D] hover:bg-[#3D5540] text-white text-xs font-semibold shadow-xs"
              >
                Create Bucket
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
