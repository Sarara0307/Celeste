/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { JarCategory, SavingsJar } from '../types/finance';
import { formatDate, formatPaise, rupeesToPaise } from '../utils/formatters';
import confetti from 'canvas-confetti';
import {
  PiggyBank,
  Plus,
  ShieldCheck,
  Laptop,
  GraduationCap,
  Plane,
  Heart,
  Sparkles,
  ArrowUpRight,
  ArrowDownLeft,
  Trash2,
  CheckCircle2,
  X,
  Sliders,
} from 'lucide-react';

export const SavingsJarsPage: React.FC = () => {
  const { jars, addJar, deleteJar, depositToJar, withdrawFromJar, summary } = useFinance();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedJarForAction, setSelectedJarForAction] = useState<SavingsJar | null>(null);
  const [actionType, setActionType] = useState<'deposit' | 'withdraw'>('deposit');
  const [actionAmountRupees, setActionAmountRupees] = useState('');
  const [actionNote, setActionNote] = useState('');

  // Create jar form state
  const [name, setName] = useState('');
  const [category, setCategory] = useState<JarCategory>('gadgets');
  const [targetRupees, setTargetRupees] = useState('12000');
  const [monthlyRupees, setMonthlyRupees] = useState('2000');
  const [targetDate, setTargetDate] = useState(
    new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('high');

  const handleCreateJar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addJar({
      name: name.trim(),
      category,
      targetPaise: rupeesToPaise(parseFloat(targetRupees) || 10000),
      savedPaise: 0,
      monthlyContributionTargetPaise: rupeesToPaise(parseFloat(monthlyRupees) || 1500),
      targetDate,
      priority,
      color: category === 'emergency' ? '#10b981' : category === 'gadgets' ? '#6366f1' : '#06b6d4',
      iconName: category === 'emergency' ? 'ShieldCheck' : category === 'gadgets' ? 'Laptop' : 'Plane',
    });

    setIsCreateOpen(false);
    setName('');
  };

  const handleExecuteAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJarForAction) return;
    const rupees = parseFloat(actionAmountRupees);
    if (isNaN(rupees) || rupees <= 0) return;

    const amountPaise = rupeesToPaise(rupees);
    if (actionType === 'deposit') {
      depositToJar(selectedJarForAction.id, amountPaise, actionNote);
      // Trigger confetti if this deposit crosses or reaches the target!
      if (selectedJarForAction.savedPaise + amountPaise >= selectedJarForAction.targetPaise) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    } else {
      withdrawFromJar(selectedJarForAction.id, amountPaise, actionNote);
    }

    setSelectedJarForAction(null);
    setActionAmountRupees('');
    setActionNote('');
  };

  const getJarIcon = (cat: JarCategory) => {
    switch (cat) {
      case 'emergency':
        return ShieldCheck;
      case 'gadgets':
        return Laptop;
      case 'education':
        return GraduationCap;
      case 'travel':
        return Plane;
      case 'personal':
        return Heart;
      default:
        return PiggyBank;
    }
  };

  return (
    <div className="space-y-7 pb-14">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-emerald-400">
              Virtual Goal Allocation
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Smart Savings Jars
          </h1>
          <p className="text-xs text-slate-400">
            Dedicated virtual planning buckets. Ring-fenced from everyday spending to ensure your goals are reached on time.
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/15 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Create Smart Jar</span>
        </button>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-6 rounded-3xl bg-[#0a0f1d] border border-white/[0.07] space-y-1 shadow-lg">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
            Total Saved Across Jars
          </span>
          <div className="text-2xl font-black font-mono text-emerald-400">
            {formatPaise(summary.totalSavedInJarsPaise)}
          </div>
          <span className="text-[10px] text-slate-400 font-medium">
            Protected from impulsive spending
          </span>
        </div>

        <div className="p-6 rounded-3xl bg-[#0a0f1d] border border-white/[0.07] space-y-1 shadow-lg">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
            Monthly Planned Contribution
          </span>
          <div className="text-2xl font-black font-mono text-indigo-400">
            {formatPaise(summary.plannedSavingsMonthlyPaise)}
          </div>
          <span className="text-[10px] text-slate-400 font-medium">
            Deducted in Safe-to-Spend formula
          </span>
        </div>

        <div className="p-6 rounded-3xl bg-[#0a0f1d] border border-white/[0.07] space-y-1 shadow-lg">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
            Available Operating Funds
          </span>
          <div className="text-2xl font-black font-mono text-white">
            {formatPaise(summary.currentAvailableBalancePaise)}
          </div>
          <span className="text-[10px] text-teal-400 font-medium">
            Ready for deposit
          </span>
        </div>
      </div>

      {/* Jars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jars.map((jar) => {
          const Icon = getJarIcon(jar.category);
          const percent = Math.min(
            100,
            Math.round((jar.savedPaise / (jar.targetPaise || 1)) * 100)
          );
          const remainingPaise = Math.max(0, jar.targetPaise - jar.savedPaise);
          const monthsLeft =
            jar.monthlyContributionTargetPaise > 0
              ? Math.ceil(remainingPaise / jar.monthlyContributionTargetPaise)
              : 0;

          const isComplete = percent >= 100;

          return (
            <div
              key={jar.id}
              className="bg-[#0a0f1d] border border-white/[0.07] hover:border-white/[0.15] rounded-3xl p-6 sm:p-7 flex flex-col justify-between space-y-5 transition-all shadow-xl hover:shadow-2xl relative overflow-hidden"
            >
              {/* Top Bar */}
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-md"
                      style={{ backgroundColor: jar.color }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-white tracking-tight">{jar.name}</h2>
                      <span className="text-[10px] uppercase font-mono text-slate-400 block">
                        {jar.category} • {jar.priority.toUpperCase()} PRIORITY
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteJar(jar.id)}
                    className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex items-baseline justify-between">
                    <span className="text-lg font-bold font-mono text-white">
                      {formatPaise(jar.savedPaise)}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      Target: {formatPaise(jar.targetPaise)}
                    </span>
                  </div>

                  <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${percent}%`,
                        backgroundColor: jar.color,
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
                    <span className="font-semibold text-emerald-400">
                      {percent}% Completed
                    </span>
                    <span>
                      {isComplete ? 'Goal achieved! 🎉' : `Remaining: ${formatPaise(remainingPaise)}`}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Monthly Target:</span>
                    <span className="font-mono text-slate-200">
                      {formatPaise(jar.monthlyContributionTargetPaise)}/mo
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Target Date:</span>
                    <span className="font-mono text-slate-200">
                      {formatDate(jar.targetDate)}
                    </span>
                  </div>
                  {!isComplete && (
                    <div className="flex justify-between text-slate-400">
                      <span>Est. Timeline:</span>
                      <span className="font-mono text-indigo-400 font-semibold">
                        ~{monthsLeft} month{monthsLeft !== 1 ? 's' : ''} left
                      </span>
                    </div>
                  )}
                  {jar.notes && (
                    <p className="text-[10px] text-slate-500 pt-1 border-t border-slate-900">
                      {jar.notes}
                    </p>
                  )}
                </div>
              </div>

              {/* Deposit / Withdraw Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80">
                <button
                  onClick={() => {
                    setSelectedJarForAction(jar);
                    setActionType('deposit');
                    setActionAmountRupees((jar.monthlyContributionTargetPaise / 100).toString());
                  }}
                  className="py-2 px-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                >
                  <ArrowDownLeft className="w-3.5 h-3.5" />
                  <span>Deposit</span>
                </button>

                <button
                  onClick={() => {
                    setSelectedJarForAction(jar);
                    setActionType('withdraw');
                    setActionAmountRupees('500');
                  }}
                  className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                >
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>Withdraw</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Deposit / Withdraw Modal */}
      {selectedJarForAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white capitalize">
                  {actionType} Funds: {selectedJarForAction.name}
                </h3>
                <p className="text-xs text-slate-400">
                  {actionType === 'deposit'
                    ? 'Transfer money from general balance to this jar'
                    : 'Withdraw money from this jar back to available balance'}
                </p>
              </div>
              <button
                onClick={() => setSelectedJarForAction(null)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleExecuteAction} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Amount (₹ INR)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 font-bold">₹</span>
                  <input
                    type="number"
                    step="any"
                    value={actionAmountRupees}
                    onChange={(e) => setActionAmountRupees(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-8 pr-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Note (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Month-end savings transfer"
                  value={actionNote}
                  onChange={(e) => setActionNote(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80 text-[11px] text-slate-400">
                <span className="font-semibold text-slate-300 block mb-0.5">
                  Accounting Guarantee:
                </span>
                Savings deposits move money between your operating balance and your goals. They are never double-counted as general living expenses.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedJarForAction(null)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 rounded-lg text-white font-semibold text-xs shadow-sm transition-colors ${
                    actionType === 'deposit'
                      ? 'bg-emerald-600 hover:bg-emerald-500'
                      : 'bg-indigo-600 hover:bg-indigo-500'
                  }`}
                >
                  Confirm {actionType}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create New Jar Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">Create Smart Savings Jar</h3>
                <p className="text-xs text-slate-400">Set a target and monthly savings plan</p>
              </div>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateJar} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Jar / Goal Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Coding Laptop, Emergency Buffer, Master's Prep"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as JarCategory)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="emergency">Emergency Fund</option>
                    <option value="education">Education & Books</option>
                    <option value="gadgets">Gadgets & Tech</option>
                    <option value="travel">Travel & Trips</option>
                    <option value="personal">Personal Purchases</option>
                    <option value="custom">Custom Goal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Low Priority</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Target Amount (₹)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-slate-400 text-xs font-bold">₹</span>
                    <input
                      type="number"
                      value={targetRupees}
                      onChange={(e) => setTargetRupees(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-7 pr-3 py-1.5 text-xs text-white font-mono"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Monthly Contribution (₹)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-slate-400 text-xs font-bold">₹</span>
                    <input
                      type="number"
                      value={monthlyRupees}
                      onChange={(e) => setMonthlyRupees(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-7 pr-3 py-1.5 text-xs text-white font-mono"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Target Finish Date
                </label>
                <input
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-sm transition-colors"
                >
                  Create Jar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
