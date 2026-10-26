/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { formatPaise, rupeesToPaise } from '../utils/formatters';
import { FinancialEngine } from '../services/financialEngine';
import {
  PieChart,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  TrendingUp,
  Shield,
  Save,
  Plus,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts';

export const BudgetPlannerPage: React.FC = () => {
  const { budgets, updateBudget, settings, updateMonthlyIncome, jars, summary } = useFinance();

  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [budgetRupees, setBudgetRupees] = useState<string>('');
  const [isEssential, setIsEssential] = useState<boolean>(true);
  const [newCatName, setNewCatName] = useState('');
  const [isEditingIncome, setIsEditingIncome] = useState(false);
  const [incomeInput, setIncomeInput] = useState((settings.monthlyIncomePaise / 100).toString());

  const handleSaveIncome = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(incomeInput);
    if (!isNaN(val) && val > 0) {
      updateMonthlyIncome(rupeesToPaise(val), true);
    }
    setIsEditingIncome(false);
  };

  // Feasibility analysis from FinancialEngine
  const feasibility = FinancialEngine.analyzeSavingsFeasibility(
    settings.monthlyIncomePaise,
    budgets,
    jars
  );

  // 50/30/20 benchmark calculations
  const income = settings.monthlyIncomePaise;
  const targetNeedsPaise = Math.round(income * 0.5);
  const targetWantsPaise = Math.round(income * 0.3);
  const targetSavingsPaise = Math.round(income * 0.2);

  const actualEssentialBudgetsPaise = budgets
    .filter((b) => b.isEssential)
    .reduce((sum, b) => sum + b.budgetPaise, 0);

  const actualDiscretionaryBudgetsPaise = budgets
    .filter((b) => !b.isEssential)
    .reduce((sum, b) => sum + b.budgetPaise, 0);

  const actualPlannedSavingsPaise = jars.reduce(
    (sum, j) => sum + j.monthlyContributionTargetPaise,
    0
  );

  const comparisonChartData = [
    {
      name: 'Essential Needs (50%)',
      Allocated: actualEssentialBudgetsPaise / 100,
      Ideal: targetNeedsPaise / 100,
    },
    {
      name: 'Discretionary Wants (30%)',
      Allocated: actualDiscretionaryBudgetsPaise / 100,
      Ideal: targetWantsPaise / 100,
    },
    {
      name: 'Smart Savings (20%)',
      Allocated: actualPlannedSavingsPaise / 100,
      Ideal: targetSavingsPaise / 100,
    },
  ];

  const handleSaveBudget = (cat: string) => {
    const parsed = parseFloat(budgetRupees);
    if (!isNaN(parsed) && parsed >= 0) {
      updateBudget(cat, rupeesToPaise(parsed), isEssential);
    }
    setEditingCategory(null);
  };

  const handleAddNewCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    updateBudget(newCatName.trim(), 100000, false);
    setNewCatName('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Intelligent Budget Planner
          </h1>
          <p className="text-xs text-slate-400">
            Allocate monthly funds across essential needs, discretionary wants, and smart savings jars.
          </p>
        </div>

        <div className="text-right">
          <span className="text-[11px] text-slate-400 block">Active Monthly Income</span>
          {isEditingIncome ? (
            <form onSubmit={handleSaveIncome} className="flex items-center gap-1.5 mt-1">
              <div className="relative">
                <span className="absolute left-2 top-1 text-slate-400 text-xs font-bold">₹</span>
                <input
                  type="number"
                  value={incomeInput}
                  onChange={(e) => setIncomeInput(e.target.value)}
                  className="bg-slate-800 border border-slate-700 rounded-lg pl-5 pr-2 py-1 text-xs text-white font-mono w-28 focus:outline-none focus:border-emerald-500"
                  autoFocus
                />
              </div>
              <button
                type="submit"
                className="px-2 py-1 rounded bg-emerald-600 text-white text-xs font-medium hover:bg-emerald-500"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setIsEditingIncome(false)}
                className="px-2 py-1 rounded bg-slate-800 text-slate-400 text-xs hover:text-white"
              >
                ✕
              </button>
            </form>
          ) : (
            <div className="flex items-center justify-end gap-2">
              <span className="text-lg font-bold font-mono text-emerald-400">
                {formatPaise(settings.monthlyIncomePaise)}
              </span>
              <button
                onClick={() => {
                  setIncomeInput((settings.monthlyIncomePaise / 100).toString());
                  setIsEditingIncome(true);
                }}
                className="text-[11px] text-slate-400 hover:text-emerald-400 underline font-medium"
              >
                Edit
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Feasibility Alert */}
      <div
        className={`p-5 rounded-2xl border text-xs space-y-2 ${
          feasibility.isRealistic
            ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-200'
            : 'bg-amber-950/50 border-amber-800/70 text-amber-200'
        }`}
      >
        <div className="flex items-center gap-2">
          {feasibility.isRealistic ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-amber-400" />
          )}
          <h2 className="text-sm font-bold text-white">
            Savings Target Feasibility:{' '}
            {feasibility.isRealistic ? 'Realistic & Achievable' : 'Budget Strain Detected'}
          </h2>
        </div>

        <div className="space-y-1 pl-7">
          {feasibility.suggestions.map((s, idx) => (
            <p key={idx} className="leading-relaxed">
              • {s}
            </p>
          ))}
        </div>
      </div>

      {/* 50/30/20 Visual Benchmark Bar Chart */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white">50 / 30 / 20 Budget Health Benchmark</h2>
            <p className="text-xs text-slate-400">
              Comparing your configured category budgets and planned jar savings against standard financial guidelines
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Needs (50%) • Wants (30%) • Savings (20%)
          </span>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparisonChartData} margin={{ top: 10, right: 20, left: 20, bottom: 20 }}>
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
              <YAxis
                stroke="#94a3b8"
                fontSize={11}
                tickFormatter={(val) => `₹${(val).toLocaleString('en-IN')}`}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-slate-800 border border-slate-700 p-3 rounded-lg text-xs shadow-lg space-y-1">
                        <span className="font-bold text-white block">
                          {payload[0].payload.name}
                        </span>
                        <div className="text-emerald-400 font-mono">
                          Configured: ₹{Number(payload[0].value).toLocaleString('en-IN')}
                        </div>
                        <div className="text-slate-400 font-mono">
                          Target Guideline: ₹{Number(payload[1].value).toLocaleString('en-IN')}
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="Allocated" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Ideal" fill="#475569" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Budget Manager */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-bold text-white">Category Spending Allocations</h2>
            <p className="text-xs text-slate-400">
              Set monthly spending caps for each category to prevent lifestyle inflation
            </p>
          </div>

          <form onSubmit={handleAddNewCategory} className="flex items-center gap-2">
            <input
              type="text"
              placeholder="New category..."
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1 shadow-sm transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {budgets.map((b) => {
            const isEditing = editingCategory === b.category;
            return (
              <div
                key={b.category}
                className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white text-xs">{b.category}</span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                      b.isEssential
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-purple-500/20 text-purple-300'
                    }`}
                  >
                    {b.isEssential ? 'ESSENTIAL' : 'DISCRETIONARY'}
                  </span>
                </div>

                {isEditing ? (
                  <div className="space-y-2 pt-1">
                    <div className="relative">
                      <span className="absolute left-2.5 top-2 text-slate-400 text-xs font-bold">₹</span>
                      <input
                        type="number"
                        value={budgetRupees}
                        onChange={(e) => setBudgetRupees(e.target.value)}
                        placeholder="Amount"
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-6 pr-2 py-1 text-xs text-white font-mono"
                      />
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isEssential}
                          onChange={(e) => setIsEssential(e.target.checked)}
                          className="rounded border-slate-700 bg-slate-800 text-indigo-600"
                        />
                        <span>Essential Need</span>
                      </label>
                      <button
                        onClick={() => handleSaveBudget(b.category)}
                        className="px-2.5 py-1 rounded bg-emerald-600 text-white text-xs font-medium"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-base font-bold font-mono text-white">
                      {formatPaise(b.budgetPaise)}
                    </span>
                    <button
                      onClick={() => {
                        setEditingCategory(b.category);
                        setBudgetRupees((b.budgetPaise / 100).toString());
                        setIsEssential(b.isEssential);
                      }}
                      className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
                    >
                      Edit Budget
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
