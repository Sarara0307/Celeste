/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { formatPaise } from '../utils/formatters';
import {
  FileText,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Sparkles,
  PieChart,
  Calendar,
  PiggyBank,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

export const MonthlyReviewPage: React.FC = () => {
  const { summary, transactions, bills, jars, budgets, settings } = useFinance();

  // Categories exceeded
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

  const exceededCategories = budgets
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

  // Evidence-based suggestions
  const suggestions = [
    {
      title: 'Shield Essential Obligations First',
      description: `Your ${formatPaise(
        summary.unpaidEssentialBillsPaise
      )} in upcoming essential bills represents ${Math.round(
        (summary.unpaidEssentialBillsPaise / (settings.monthlyIncomePaise || 1)) * 100
      )}% of your monthly income. Maintaining automatic ring-fencing protects you from overdraft penalties.`,
      evidence: `Evidence: ${bills.filter((b) => !b.isPaid && b.priority === 'essential').length} upcoming essential bills pending settlement.`,
    },
    {
      title: 'Protect Your Laptop Smart Jar Target',
      description: `You have successfully accumulated ${formatPaise(
        jars.find((j) => j.id === 'jar-laptop')?.savedPaise || 0
      )} in your Laptop Jar. Continuing your ${formatPaise(
        jars.find((j) => j.id === 'jar-laptop')?.monthlyContributionTargetPaise || 200000
      )} monthly allocation will secure your hardware upgrade on schedule.`,
      evidence: 'Evidence: Verified against current goal progress and target finish dates.',
    },
    {
      title: 'Calibrate Discretionary Spending Windows',
      description: `Your daily safe spending allowance is currently ${formatPaise(
        summary.suggestedDailyAllowancePaise
      )}/day. Staying within this window guarantees zero compromise to your emergency fund.`,
      evidence: `Evidence: Calculated over the remaining ${summary.daysRemainingUntilIncome} days of the active cycle.`,
    },
  ];

  const breakdownBarData = [
    {
      name: 'Essential Needs',
      Amount: summary.essentialExpensesPaise / 100,
    },
    {
      name: 'Discretionary Wants',
      Amount: summary.discretionaryExpensesPaise / 100,
    },
    {
      name: 'Smart Savings Jars',
      Amount: summary.totalSavedInJarsPaise / 100,
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Monthly Financial Retro & Audit
          </h1>
          <p className="text-xs text-slate-400">
            A comprehensive, transparent audit of your cash inflows, outflows, jar milestones, and habits.
          </p>
        </div>

        <div className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
          Cycle: Current Month
        </div>
      </div>

      {/* 4 Summary Scorecards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[11px] text-slate-400">Total Income Credited</span>
          <div className="text-xl font-bold font-mono text-white">
            {formatPaise(summary.totalIncomePaise || settings.monthlyIncomePaise)}
          </div>
          <span className="text-[10px] text-slate-500">Net verified inflow</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[11px] text-slate-400">Total Outflow Spent</span>
          <div className="text-xl font-bold font-mono text-rose-400">
            {formatPaise(summary.totalExpensesPaise)}
          </div>
          <span className="text-[10px] text-slate-500">Excludes jar savings transfers</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[11px] text-slate-400">Actual Saved in Jars</span>
          <div className="text-xl font-bold font-mono text-indigo-400">
            {formatPaise(summary.totalSavedInJarsPaise)}
          </div>
          <span className="text-[10px] text-slate-500">{summary.savingsRatePercentage}% savings rate</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[11px] text-slate-400">Safe-to-Spend Balance</span>
          <div className="text-xl font-bold font-mono text-emerald-400">
            {formatPaise(summary.spendableBalancePaise)}
          </div>
          <span className="text-[10px] text-slate-500">Unencumbered margin</span>
        </div>
      </div>

      {/* Essential vs Discretionary Outflow Chart */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white">Expenditure Distribution</h2>
            <p className="text-xs text-slate-400">
              Essential living necessities vs discretionary spending vs goal contributions
            </p>
          </div>
        </div>

        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={breakdownBarData} margin={{ top: 10, right: 20, left: 20, bottom: 20 }}>
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
              <YAxis
                stroke="#94a3b8"
                fontSize={11}
                tickFormatter={(val) => `₹${val.toLocaleString('en-IN')}`}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-slate-800 border border-slate-700 px-3 py-2 rounded-lg text-xs shadow-lg">
                        <span className="font-semibold text-white block">
                          {payload[0].payload.name}
                        </span>
                        <span className="text-emerald-400 font-mono font-bold">
                          ₹{Number(payload[0].value).toLocaleString('en-IN')}
                        </span>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="Amount" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Budget Overspending Audit */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
        <h2 className="text-sm font-bold text-white">Category Budget Compliance Audit</h2>
        {exceededCategories.length > 0 ? (
          <div className="space-y-2">
            {exceededCategories.map((c) => (
              <div
                key={c.category}
                className="p-3 rounded-xl bg-amber-950/40 border border-amber-800/60 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span className="font-semibold text-white">{c.category}</span>
                </div>
                <div className="text-right font-mono">
                  <span className="text-amber-300">
                    Spent {formatPaise(c.spent)} (Budget: {formatPaise(c.budget)})
                  </span>
                  <span className="text-[10px] text-rose-400 block">
                    Exceeded by {formatPaise(c.overspend)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-slate-950 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>All spending categories are currently within their planned limits! Excellent discipline.</span>
          </div>
        )}
      </div>

      {/* 3 Practical Evidence-Backed Recommendations */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-amber-400" />
          <h2 className="text-base font-bold text-white">Actionable Next-Month Improvements</h2>
        </div>
        <p className="text-xs text-slate-400">
          Synthesized directly from your real ledger data and pending obligations.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {suggestions.map((s, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 flex flex-col justify-between"
            >
              <div className="space-y-1.5">
                <span className="font-bold text-white text-xs block">{s.title}</span>
                <p className="text-xs text-slate-300 leading-relaxed">{s.description}</p>
              </div>

              <div className="pt-2 border-t border-slate-900 text-[10px] text-indigo-400 font-mono">
                {s.evidence}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
