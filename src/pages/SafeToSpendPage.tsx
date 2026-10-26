/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { formatPaise, formatDate, rupeesToPaise } from '../utils/formatters';
import {
  ShieldCheck,
  AlertTriangle,
  Info,
  Calendar,
  PiggyBank,
  Sparkles,
  Sliders,
  CheckCircle2,
  TrendingDown,
  ArrowRight,
  HelpCircle,
  Lock,
  ArrowDownLeft,
} from 'lucide-react';

export const SafeToSpendPage: React.FC = () => {
  const {
    summary,
    settings,
    bills,
    jars,
    updateSettings,
    updateMonthlyIncome,
    setActiveTab,
  } = useFinance();

  const [customIncomeRupees, setCustomIncomeRupees] = useState(
    (settings.monthlyIncomePaise / 100).toString()
  );
  const [customReserveRupees, setCustomReserveRupees] = useState(
    (settings.emergencyReservePaise / 100).toString()
  );
  const [customNextDate, setCustomNextDate] = useState(settings.nextIncomeDate);
  const [showFormulaDetails, setShowFormulaDetails] = useState(true);

  const handleSaveParameters = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedIncome = parseFloat(customIncomeRupees);
    if (!isNaN(parsedIncome) && parsedIncome > 0) {
      updateMonthlyIncome(rupeesToPaise(parsedIncome), true);
    }
    updateSettings({
      emergencyReservePaise: rupeesToPaise(parseFloat(customReserveRupees) || 0),
      nextIncomeDate: customNextDate,
    });
  };

  const unpaidEssentialBills = bills.filter(
    (b) => !b.isPaid && (b.priority === 'essential' || b.autoDeductFromSpendable)
  );

  return (
    <div className="space-y-7 pb-14">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-emerald-400">
              Deterministic Math Engine
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Safe-to-Spend™ Engine
          </h1>
          <p className="text-xs text-slate-400">
            Never be misled by your bank account balance. True financial security is knowing what you can safely spend without risking upcoming bills or savings goals.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('simulator')}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
        >
          <Sparkles className="w-4 h-4" />
          <span>Before-You-Buy Simulator</span>
        </button>
      </div>

      {/* Main Spendable Result Card */}
      <div
        className={`p-7 sm:p-9 rounded-3xl border shadow-2xl relative overflow-hidden transition-all before:absolute before:inset-x-0 before:top-0 before:h-[1px] ${
          summary.isSpendableDeficit
            ? 'bg-gradient-to-br from-rose-950/70 via-[#0a0f1d] to-[#060913] border-rose-500/30 text-rose-100 before:bg-rose-400/30'
            : 'bg-gradient-to-br from-[#0c1222] via-[#090d1a] to-[#060913] border-white/[0.09] before:bg-emerald-400/30'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/[0.06] pb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <ShieldCheck
                className={`w-5 h-5 ${
                  summary.isSpendableDeficit ? 'text-rose-400' : 'text-emerald-400'
                }`}
              />
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Calculated Spendable Pool
              </span>
            </div>

            <div className="flex items-baseline gap-3">
              <span
                className={`text-4xl sm:text-5xl font-black font-mono tracking-tight ${
                  summary.isSpendableDeficit ? 'text-rose-400' : 'text-white'
                }`}
              >
                {formatPaise(summary.spendableBalancePaise)}
              </span>
              <span className="text-xs font-semibold text-slate-400">
                {summary.isSpendableDeficit ? 'Spendable Deficit' : 'Safe discretionary limit'}
              </span>
            </div>

            <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
              {summary.healthMessage}
            </p>
          </div>

          {/* Daily Allowance Highlight */}
          <div className="p-5 rounded-2xl bg-[#060913]/90 border border-white/[0.08] text-right min-w-[220px] shadow-lg">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
              Suggested Daily Allowance
            </span>
            <span className="text-2xl font-black font-mono text-emerald-400 block mt-0.5">
              {formatPaise(summary.suggestedDailyAllowancePaise)}
              <span className="text-xs font-normal text-slate-400"> / day</span>
            </span>
            <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-end gap-1">
              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
              <span>
                {summary.daysRemainingUntilIncome} days until {formatDate(settings.nextIncomeDate)}
              </span>
            </div>
          </div>
        </div>

        {/* 4 Summary Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
              Remaining Weekly Cap
            </span>
            <span className="text-lg font-black font-mono text-white block">
              {formatPaise(summary.remainingWeeklyAllowancePaise)}
            </span>
            <span className="text-[10px] text-slate-500">Next 7 days safe cushion</span>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
              Days Until Payday
            </span>
            <span className="text-lg font-black font-mono text-indigo-400 block">
              {summary.daysRemainingUntilIncome} Days
            </span>
            <span className="text-[10px] text-slate-500">Arrives {formatDate(settings.nextIncomeDate)}</span>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
              Projected Month-End
            </span>
            <span className="text-lg font-black font-mono text-emerald-400 block">
              {formatPaise(summary.endOfMonthProjectedBalancePaise)}
            </span>
            <span className="text-[10px] text-slate-500">After all obligations</span>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
              Financial Status
            </span>
            <span
              className={`text-lg font-black uppercase block ${
                summary.budgetHealthStatus === 'healthy'
                  ? 'text-emerald-400'
                  : summary.budgetHealthStatus === 'caution'
                  ? 'text-amber-400'
                  : 'text-rose-400'
              }`}
            >
              {summary.budgetHealthStatus}
            </span>
            <span className="text-[10px] text-slate-500">Safe burn rate</span>
          </div>
        </div>
      </div>

      {/* Visual Formula Waterfall Breakdown */}
      <div className="rounded-3xl p-7 bg-[#0a0f1d] border border-white/[0.07] shadow-xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">Mathematical Waterfall Breakdown</h2>
            <p className="text-xs text-slate-400">
              Reconciled ledger flow: expenses and savings are never double-subtracted
            </p>
          </div>
          <button
            onClick={() => setShowFormulaDetails(!showFormulaDetails)}
            className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold"
          >
            <Info className="w-4 h-4" />
            <span>{showFormulaDetails ? 'Compact View' : 'Detailed View'}</span>
          </button>
        </div>

        {/* Step cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-black/30 border border-white/[0.06] space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
              <span>1. Liquid Available Cash</span>
              <span className="text-emerald-400 font-black">+</span>
            </div>
            <div className="text-xl font-black font-mono text-white">
              {formatPaise(summary.currentAvailableBalancePaise)}
            </div>
            <p className="text-[11px] text-slate-400 leading-tight">
              (Total income received) minus (settled expenses).
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-black/30 border border-white/[0.06] space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
              <span>2. Unpaid Essential Bills</span>
              <span className="text-amber-400 font-black">−</span>
            </div>
            <div className="text-xl font-black font-mono text-amber-400">
              {formatPaise(summary.unpaidEssentialBillsPaise)}
            </div>
            <p className="text-[11px] text-slate-400 leading-tight">
              Ring-fenced for Wi-Fi, electricity, utilities due before payday.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-black/30 border border-white/[0.06] space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
              <span>3. Planned Jar Savings</span>
              <span className="text-indigo-400 font-black">−</span>
            </div>
            <div className="text-xl font-black font-mono text-indigo-400">
              {formatPaise(summary.plannedSavingsMonthlyPaise)}
            </div>
            <p className="text-[11px] text-slate-400 leading-tight">
              Protected monthly deposits for Laptop and Emergency jars.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-black/30 border border-white/[0.06] space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
              <span>4. Emergency Reserve</span>
              <span className="text-purple-400 font-black">−</span>
            </div>
            <div className="text-xl font-black font-mono text-purple-400">
              {formatPaise(summary.emergencyReservePaise)}
            </div>
            <p className="text-[11px] text-slate-400 leading-tight">
              Custom untouchable cushion to protect against cash shocks.
            </p>
          </div>
        </div>

        {/* Dynamic Formula summary bar */}
        <div className="p-4 rounded-2xl bg-black/40 border border-white/[0.06] font-mono text-xs text-center text-slate-300 flex flex-wrap items-center justify-center gap-2">
          <span className="text-emerald-400 font-bold">{formatPaise(summary.currentAvailableBalancePaise)}</span>
          <span className="text-slate-500">−</span>
          <span className="text-amber-400 font-bold">{formatPaise(summary.unpaidEssentialBillsPaise)}</span>
          <span className="text-slate-500">−</span>
          <span className="text-indigo-400 font-bold">{formatPaise(summary.plannedSavingsMonthlyPaise)}</span>
          <span className="text-slate-500">−</span>
          <span className="text-purple-400 font-bold">{formatPaise(summary.emergencyReservePaise)}</span>
          <span className="text-slate-500">=</span>
          <span
            className={`font-black text-sm ${
              summary.isSpendableDeficit ? 'text-rose-400' : 'text-emerald-400'
            }`}
          >
            {formatPaise(summary.spendableBalancePaise)}
          </span>
        </div>

        {/* Ring-Fenced Essential Bills */}
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-bold text-white uppercase tracking-widest">
            Protected Essential Obligations ({unpaidEssentialBills.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {unpaidEssentialBills.map((bill) => (
              <div
                key={bill.id}
                className="p-3.5 rounded-2xl bg-black/30 border border-white/[0.05] text-xs flex items-center justify-between"
              >
                <div>
                  <span className="font-semibold text-white block">{bill.name}</span>
                  <span className="text-[10px] text-slate-400">Due {formatDate(bill.dueDate)}</span>
                </div>
                <span className="font-mono font-bold text-amber-400">
                  {formatPaise(bill.amountPaise)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Adjust Parameters Console */}
      <div className="rounded-3xl p-7 bg-[#0a0f1d] border border-white/[0.07] shadow-xl space-y-4">
        <div className="flex items-center gap-2">
          <Sliders className="w-5 h-5 text-indigo-400" />
          <h2 className="text-base font-bold text-white tracking-tight">Adjust Parameters & Income</h2>
        </div>
        <p className="text-xs text-slate-400">
          Modify your expected monthly income, emergency safety buffer, or next payday to see real-time recalculations.
        </p>

        <form
          onSubmit={handleSaveParameters}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2"
        >
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Monthly Income (₹ INR)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-slate-400 text-xs font-bold">₹</span>
              <input
                type="number"
                value={customIncomeRupees}
                onChange={(e) => setCustomIncomeRupees(e.target.value)}
                className="w-full bg-slate-900 border border-white/[0.08] rounded-xl pl-7 pr-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Next Income Date
            </label>
            <input
              type="date"
              value={customNextDate}
              onChange={(e) => setCustomNextDate(e.target.value)}
              className="w-full bg-slate-900 border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Safety Buffer Reserve (₹ INR)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-slate-400 text-xs font-bold">₹</span>
              <input
                type="number"
                value={customReserveRupees}
                onChange={(e) => setCustomReserveRupees(e.target.value)}
                className="w-full bg-slate-900 border border-white/[0.08] rounded-xl pl-7 pr-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-emerald-500/15 active:scale-95"
            >
              Recalculate Runway
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
