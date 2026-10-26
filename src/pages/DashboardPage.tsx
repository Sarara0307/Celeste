/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { formatPaise, formatDate } from '../utils/formatters';
import {
  ShieldCheck,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  PiggyBank,
  CheckCircle2,
  TrendingUp,
  Clock,
  Sparkles,
  ChevronRight,
  Plus,
  Wallet,
  Compass,
  ArrowRight,
  Zap,
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts';

interface DashboardPageProps {
  onOpenAddModal: () => void;
  onOpenEditIncome: () => void;
}

const CATEGORY_COLORS = [
  '#10b981', // Emerald
  '#6366f1', // Indigo
  '#06b6d4', // Cyan
  '#f59e0b', // Amber
  '#ec4899', // Pink
  '#8b5cf6', // Violet
  '#64748b', // Slate
];

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onOpenAddModal,
  onOpenEditIncome,
}) => {
  const {
    summary,
    transactions,
    bills,
    jars,
    budgets,
    settings,
    setActiveTab,
    toggleBillPaid,
  } = useFinance();

  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('monthly');

  // Compute category breakdown for chart
  const categorySpendingMap = new Map<string, number>();
  transactions
    .filter(
      (t) =>
        t.type === 'essential_expense' ||
        t.type === 'discretionary_expense' ||
        t.type === 'bill_payment'
    )
    .forEach((t) => {
      const current = categorySpendingMap.get(t.category) || 0;
      categorySpendingMap.set(t.category, current + t.amountPaise);
    });

  const categoryChartData = Array.from(categorySpendingMap.entries()).map(
    ([name, valuePaise]) => ({
      name,
      value: valuePaise / 100,
      formatted: formatPaise(valuePaise),
    })
  );

  const recentTransactions = transactions.slice(0, 5);
  const upcomingBills = bills.filter((b) => !b.isPaid).slice(0, 4);

  // Check overspending alerts
  const overspentCategories = budgets
    .map((b) => {
      const spent = categorySpendingMap.get(b.category) || 0;
      return {
        category: b.category,
        budget: b.budgetPaise,
        spent,
        overspend: spent - b.budgetPaise,
      };
    })
    .filter((b) => b.budget > 0 && b.overspend > 0);

  return (
    <div className="space-y-7 pb-14">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-emerald-400">
              Personal Wealth Console
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Financial Command Center
          </h1>
          <p className="text-xs text-slate-400">
            {settings.userName} • Cycle resets in {summary.daysRemainingUntilIncome} days ({formatDate(settings.nextIncomeDate)})
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Timeframe pill */}
          <div className="bg-[#090d1a] border border-white/[0.08] p-1 rounded-xl flex items-center text-xs shadow-inner">
            {(['daily', 'weekly', 'monthly'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setTimeframe(period)}
                className={`px-3 py-1.5 rounded-lg capitalize font-semibold transition-all ${
                  timeframe === period
                    ? 'bg-white/[0.09] text-white shadow-sm border border-white/[0.08]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {period}
              </button>
            ))}
          </div>

          <button
            onClick={onOpenEditIncome}
            className="px-3.5 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-white/[0.08] font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95 shadow-sm"
          >
            <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-400" />
            <span>Update Income</span>
          </button>

          <button
            onClick={onOpenAddModal}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Log Entry</span>
          </button>
        </div>
      </div>

      {/* Critical Status Alert if Deficit */}
      {summary.isSpendableDeficit && (
        <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-rose-200 flex items-start justify-between gap-4 backdrop-blur-md">
          <div className="flex items-start gap-3">
            <div className="p-1 rounded-lg bg-rose-500/20 text-rose-400 mt-0.5">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Spendable Deficit Alert
              </h3>
              <p className="text-xs text-rose-200/90 mt-0.5 leading-relaxed">
                Upcoming obligations & planned savings exceed current liquid funds by{' '}
                <strong className="text-white font-mono">{formatPaise(Math.abs(summary.spendableBalancePaise))}</strong>.
                Discretionary purchases should be paused until next payday.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('safe_spend')}
            className="px-3 py-1.5 rounded-xl bg-rose-500 text-white font-bold text-xs shrink-0 hover:bg-rose-400 transition-colors shadow-sm"
          >
            Review Deficit
          </button>
        </div>
      )}

      {/* Hero Safe-to-Spend Showcase Terminal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 relative rounded-3xl p-7 sm:p-9 overflow-hidden bg-gradient-to-br from-[#0c1222] via-[#090d1a] to-[#060913] border border-white/[0.09] shadow-2xl before:absolute before:inset-x-0 before:top-0 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-emerald-400/30 before:to-transparent">
          {/* Ambient Glows */}
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-6">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center text-emerald-400">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                    Signature Safe-to-Spend™
                  </span>
                </div>

                <div className="mt-3 flex items-baseline gap-3">
                  <span
                    className={`text-4xl sm:text-5xl font-black font-mono tracking-tight ${
                      summary.isSpendableDeficit ? 'text-rose-400' : 'text-white'
                    }`}
                  >
                    {formatPaise(summary.spendableBalancePaise)}
                  </span>
                  <span className="text-xs font-medium text-slate-400">
                    {summary.isSpendableDeficit ? 'Spendable Deficit' : 'Safe discretionary cushion'}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('safe_spend')}
                className="self-start sm:self-center px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.09] text-slate-200 text-xs font-semibold flex items-center gap-2 transition-all border border-white/[0.08] active:scale-95"
              >
                <span>Inspect Formula</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>

            {/* Sub-breakdowns with luxury typography */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                  Daily Allowance
                </span>
                <span className="text-xl font-black font-mono text-emerald-400 block">
                  {formatPaise(summary.suggestedDailyAllowancePaise)}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">
                  for {summary.daysRemainingUntilIncome} days runway
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                  7-Day Safe Cap
                </span>
                <span className="text-xl font-black font-mono text-white block">
                  {formatPaise(summary.remainingWeeklyAllowancePaise)}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">Rolling weekly cap</span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                  Protected Bills
                </span>
                <span className="text-xl font-black font-mono text-amber-400 block">
                  {formatPaise(summary.unpaidEssentialBillsPaise)}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">Ring-fenced & safe</span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                  Planned Jar Savings
                </span>
                <span className="text-xl font-black font-mono text-indigo-400 block">
                  {formatPaise(summary.plannedSavingsMonthlyPaise)}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">Reserved for goals</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Simulator Highlight Terminal */}
        <div className="rounded-3xl p-7 bg-gradient-to-b from-[#0c1222] to-[#070b16] border border-white/[0.08] shadow-xl flex flex-col justify-between relative overflow-hidden">
          <div className="space-y-3 relative z-10">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/15 border border-indigo-500/25 text-indigo-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h2 className="text-base font-extrabold text-white tracking-tight">
              Before-You-Buy Simulator
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Test planned purchases before swiping. See the exact impact on your daily allowance and laptop goal completion date.
            </p>
          </div>

          <div className="pt-5 relative z-10">
            <button
              onClick={() => setActiveTab('simulator')}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 active:scale-95"
            >
              <span>Simulate a Purchase</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 4 Core Financial KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Monthly Income Card - Click to Edit */}
        <div
          onClick={onOpenEditIncome}
          title="Click to update monthly income"
          className="group relative rounded-2xl p-5 bg-[#0a0f1d] border border-white/[0.07] hover:border-emerald-500/40 transition-all cursor-pointer shadow-lg hover:shadow-emerald-500/5"
        >
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-slate-400 font-semibold group-hover:text-emerald-300 transition-colors">
              Monthly Income
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-emerald-400 font-mono font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                Edit ✎
              </span>
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <ArrowDownLeft className="w-4 h-4" />
              </div>
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-white group-hover:text-emerald-300 transition-colors tracking-tight">
            {formatPaise(settings.monthlyIncomePaise)}
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
            <span>Stipend & earnings</span>
            <span className="underline group-hover:text-emerald-400 transition-colors font-medium">
              Change
            </span>
          </div>
        </div>

        {/* Expenses Card */}
        <div
          onClick={() => setActiveTab('transactions')}
          className="group relative rounded-2xl p-5 bg-[#0a0f1d] border border-white/[0.07] hover:border-white/[0.15] transition-all cursor-pointer shadow-lg"
        >
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-slate-400 font-semibold">Total Expenses Spent</span>
            <div className="w-7 h-7 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-400">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-white tracking-tight">
            {formatPaise(summary.totalExpensesPaise)}
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-medium">
            {formatPaise(summary.essentialExpensesPaise)} essential needs
          </p>
        </div>

        {/* Liquid Operating Cash */}
        <div
          onClick={() => setActiveTab('safe_spend')}
          className="group relative rounded-2xl p-5 bg-[#0a0f1d] border border-white/[0.07] hover:border-white/[0.15] transition-all cursor-pointer shadow-lg"
        >
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-slate-400 font-semibold">Liquid Operating Cash</span>
            <div className="w-7 h-7 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-400">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-white tracking-tight">
            {formatPaise(summary.currentAvailableBalancePaise)}
          </div>
          <p className="text-[11px] text-teal-400 mt-1 font-medium">
            Operating account pool
          </p>
        </div>

        {/* Saved in Jars */}
        <div
          onClick={() => setActiveTab('jars')}
          className="group relative rounded-2xl p-5 bg-[#0a0f1d] border border-white/[0.07] hover:border-indigo-500/40 transition-all cursor-pointer shadow-lg hover:shadow-indigo-500/5"
        >
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-slate-400 font-semibold group-hover:text-indigo-300 transition-colors">
              Saved in Smart Jars
            </span>
            <div className="w-7 h-7 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
              <PiggyBank className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-indigo-400 tracking-tight">
            {formatPaise(summary.totalSavedInJarsPaise)}
          </div>
          <p className="text-[11px] text-indigo-300/80 mt-1 font-medium">
            {summary.savingsRatePercentage}% active savings velocity
          </p>
        </div>
      </div>

      {/* Middle Row: Category Breakdown Donut & Upcoming Obligations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Breakdown Donut */}
        <div className="rounded-3xl p-6 bg-[#0a0f1d] border border-white/[0.07] shadow-xl flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight">Category Breakdown</h2>
              <span className="text-[11px] text-slate-400 font-mono">
                Total spent: {formatPaise(summary.totalExpensesPaise)}
              </span>
            </div>
            <button
              onClick={() => setActiveTab('budget')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
            >
              Budgets
            </button>
          </div>

          {categoryChartData.length > 0 ? (
            <div className="h-56 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryChartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={4}
                    strokeWidth={0}
                  >
                    {categoryChartData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-[#0b1020] border border-white/[0.1] px-3 py-2 rounded-xl text-xs shadow-2xl backdrop-blur-md">
                            <span className="font-bold text-white block">{data.name}</span>
                            <span className="text-emerald-400 font-mono font-bold">
                              {data.formatted}
                            </span>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute text-center pointer-events-none">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Expenses</span>
                <span className="text-xs font-mono font-bold text-white">
                  {formatPaise(summary.totalExpensesPaise)}
                </span>
              </div>
            </div>
          ) : (
            <div className="h-56 flex items-center justify-center text-xs text-slate-500">
              No expenses recorded yet.
            </div>
          )}

          <div className="space-y-1.5 pt-2 border-t border-white/[0.05]">
            {categoryChartData.slice(0, 4).map((c, i) => (
              <div key={c.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{
                      backgroundColor: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
                    }}
                  />
                  <span className="text-slate-300 truncate max-w-[140px] font-medium">{c.name}</span>
                </div>
                <span className="font-mono text-slate-200 font-semibold">{c.formatted}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Obligations & Bills */}
        <div className="rounded-3xl p-6 bg-[#0a0f1d] border border-white/[0.07] shadow-xl flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-400" />
                <h2 className="text-sm font-bold text-white tracking-tight">Upcoming Obligations</h2>
              </div>
              <button
                onClick={() => setActiveTab('bills')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
              >
                Calendar
              </button>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Essential bills are ring-fenced to safeguard your spendable cushion.
            </p>

            <div className="space-y-2 pt-1">
              {upcomingBills.length > 0 ? (
                upcomingBills.map((bill) => (
                  <div
                    key={bill.id}
                    className="p-3 rounded-2xl bg-black/30 border border-white/[0.05] flex items-center justify-between gap-3 hover:border-white/[0.1] transition-all"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-white">{bill.name}</span>
                        {bill.priority === 'essential' && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/25">
                            ESSENTIAL
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        Due {formatDate(bill.dueDate)}
                      </span>
                    </div>

                    <div className="text-right flex items-center gap-2.5">
                      <span className="text-xs font-mono font-bold text-white">
                        {formatPaise(bill.amountPaise)}
                      </span>
                      <button
                        onClick={() => toggleBillPaid(bill.id)}
                        title="Mark as Paid"
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-300 transition-colors"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 rounded-xl bg-black/20 text-center text-xs text-slate-500">
                  All scheduled bills are settled! 🎉
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => setActiveTab('bills')}
            className="w-full py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 text-xs font-semibold transition-colors border border-white/[0.06]"
          >
            Manage Bill Obligations
          </button>
        </div>

        {/* Savings Jars Quick Progress */}
        <div className="rounded-3xl p-6 bg-[#0a0f1d] border border-white/[0.07] shadow-xl flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PiggyBank className="w-4 h-4 text-emerald-400" />
                <h2 className="text-sm font-bold text-white tracking-tight">Smart Jars Milestones</h2>
              </div>
              <button
                onClick={() => setActiveTab('jars')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
              >
                All Jars
              </button>
            </div>

            <div className="space-y-3.5 pt-1">
              {jars.slice(0, 3).map((jar) => {
                const percent = Math.min(
                  100,
                  Math.round((jar.savedPaise / (jar.targetPaise || 1)) * 100)
                );
                return (
                  <div key={jar.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-white">{jar.name}</span>
                      <span className="font-mono text-slate-300 font-medium">
                        {formatPaise(jar.savedPaise)} / {formatPaise(jar.targetPaise)}
                      </span>
                    </div>

                    <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-white/[0.05]">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-indigo-500 rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span className="font-semibold text-emerald-400">{percent}% funded</span>
                      <span>Target: {formatDate(jar.targetDate)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => setActiveTab('jars')}
            className="w-full py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 text-xs font-semibold transition-colors border border-white/[0.06]"
          >
            Deposit or Adjust Goals
          </button>
        </div>
      </div>

      {/* Bottom Ledger Summary */}
      <div className="rounded-3xl p-6 bg-[#0a0f1d] border border-white/[0.07] shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight">Recent Ledger Entries</h2>
            <p className="text-xs text-slate-400">
              Transactions directly adjust liquid funds and Safe-to-Spend runway
            </p>
          </div>
          <button
            onClick={() => setActiveTab('transactions')}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
          >
            View Full Ledger & CSV
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/[0.06] text-slate-400 uppercase text-[9px] tracking-wider font-bold">
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Description</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Classification</th>
                <th className="py-3 px-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] text-slate-300">
              {recentTransactions.map((tx) => {
                const isPositive =
                  tx.type === 'income' || tx.type === 'savings_withdrawal';
                return (
                  <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-3 text-slate-400 font-mono text-[11px]">
                      {formatDate(tx.date)}
                    </td>
                    <td className="py-3 px-3 font-semibold text-white">
                      {tx.description}
                    </td>
                    <td className="py-3 px-3 text-slate-400">{tx.category}</td>
                    <td className="py-3 px-3">
                      <span className="capitalize text-[11px] text-slate-400 font-mono">
                        {tx.type.replace('_', ' ')}
                      </span>
                    </td>
                    <td
                      className={`py-3 px-3 text-right font-mono font-bold ${
                        isPositive ? 'text-emerald-400' : 'text-slate-100'
                      }`}
                    >
                      {isPositive ? '+' : '-'}
                      {formatPaise(tx.amountPaise)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
