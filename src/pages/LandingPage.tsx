/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { formatPaise } from '../utils/formatters';
import {
  ShieldCheck,
  Calculator,
  PiggyBank,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Bot,
  Zap,
  TrendingUp,
  Layers,
  Lock,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setActiveTab, loadHackathonScenario, summary } = useFinance();

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-12 sm:pt-14 sm:pb-20 border-b border-slate-800">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/30 via-slate-950 to-slate-950" />
        
        <div className="max-w-4xl mx-auto text-center px-4 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Theme: MoneyMatters — Make Money Make Sense</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Spend wisely. <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400">
              Save consistently.
            </span>{' '}
            Live confidently.
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Traditional expense trackers only look backward at what you’ve already blown. 
            <strong className="text-white font-semibold"> SaveSense AI</strong> tells you 
            exactly what is <em>safe to spend today</em> while ring-fencing upcoming bills and guaranteeing goal progress.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 transition-all transform active:scale-95"
            >
              Open Live Financial Dashboard
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveTab('safe_spend')}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 font-semibold text-sm flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Explore Safe-to-Spend Engine</span>
            </button>
          </div>

          {/* Trust badges */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Zero Bank Credentials Needed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>100% Client-Side Private Storage</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Precise Rupee & Paise Math</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section className="max-w-6xl mx-auto px-4 space-y-10">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Engineered to Solve Real Financial Friction
          </h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Not complex stock trading or crypto charts — just daily, dependable financial clarity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Safe to spend */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 hover:border-slate-700 transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Signature Safe-to-Spend Engine</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Never be fooled by bank balance illusions. We calculate real spendable cash after ring-fencing upcoming essential bills and planned jar allocations.
            </p>
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80 font-mono text-[11px] text-emerald-300">
              Spendable = Available − Bills − Jar Savings − Reserves
            </div>
          </div>

          {/* Card 2: Before-You-Buy */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 hover:border-slate-700 transition-all">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Calculator className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Before-You-Buy Simulator</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Want to buy ₹2,000 headphones? Test the purchase before swiping. See exact changes to your daily allowance, laptop goal completion date, and bill safety.
            </p>
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80 font-mono text-[11px] text-indigo-300">
              Instant impact preview with non-judgmental alternatives
            </div>
          </div>

          {/* Card 3: Smart Jars */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 hover:border-slate-700 transition-all">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center">
              <PiggyBank className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Virtual Smart Savings Jars</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Separate your savings into goal buckets (Laptop, Emergency Fund, Travel) with milestone tracking, realistic feasibility alerts, and zero double-counting.
            </p>
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80 font-mono text-[11px] text-teal-300">
              Reconciled transfers that protect essential needs
            </div>
          </div>
        </div>

        {/* Second Row of Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>Bill Calendar & Protection</span>
            </div>
            <p className="text-xs text-slate-400">
              Schedule recurring or one-time utility and tuition bills. Never miss a deadline or suffer surprise bank overdrafts.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <Bot className="w-4 h-4 text-purple-400" />
              <span>Adaptive Savings Coach</span>
            </div>
            <p className="text-xs text-slate-400">
              Answers questions like “How much can I spend today?” or “Can I afford this?” with verifiable mathematical backing.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>End-of-Month Review & Challenges</span>
            </div>
            <p className="text-xs text-slate-400">
              Actionable retro with 50/30/20 budget breakdown, expense tracking streaks, and milestone badges.
            </p>
          </div>
        </div>
      </section>

      {/* Live Preview Card */}
      <section className="max-w-4xl mx-auto px-4">
        <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                Live Data Snapshot
              </span>
              <h3 className="text-xl font-bold text-white">Ready for your demo right now</h3>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveTab('safe_spend')}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors"
              >
                Inspect Safe-to-Spend
              </button>
              <button
                onClick={() => setActiveTab('simulator')}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors"
              >
                Test Simulator
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80">
              <span className="text-[11px] text-slate-400 block">Safe-to-Spend</span>
              <span className="text-lg font-bold font-mono text-emerald-400">
                {formatPaise(summary.spendableBalancePaise)}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80">
              <span className="text-[11px] text-slate-400 block">Daily Allowance</span>
              <span className="text-lg font-bold font-mono text-white">
                {formatPaise(summary.suggestedDailyAllowancePaise)}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80">
              <span className="text-[11px] text-slate-400 block">Upcoming Bills</span>
              <span className="text-lg font-bold font-mono text-amber-400">
                {formatPaise(summary.unpaidEssentialBillsPaise)}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80">
              <span className="text-[11px] text-slate-400 block">Planned Savings</span>
              <span className="text-lg font-bold font-mono text-indigo-400">
                {formatPaise(summary.plannedSavingsMonthlyPaise)}
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
