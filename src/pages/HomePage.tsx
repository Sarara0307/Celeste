/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { formatPaise } from '../utils/formatters';
import { MoneyWeatherCard } from '../components/MoneyWeatherCard';
import {
  Sun,
  Cloud,
  CloudRain,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Calendar,
  CheckCircle2,
  Plus,
  Compass,
  Info,
  Clock,
  TrendingUp,
  Coins,
  Scale,
  Gift,
  Zap,
} from 'lucide-react';

interface HomePageProps {
  onOpenAddModal: () => void;
  onOpenEditIncome: () => void;
  onOpenCoach: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onOpenAddModal,
  onOpenEditIncome,
  onOpenCoach,
}) => {
  const {
    summary,
    settings,
    bills,
    dreams,
    moneyWeather,
    paydayBridge,
    avatarPet,
    habits,
    logHabitSave,
    setActiveTab,
    toggleBillPaid,
    contributeToDream,
  } = useFinance();

  const [showSafeSpendModal, setShowSafeSpendModal] = useState(false);

  // Filter next 3 unpaid bills
  const upcomingBills = bills.filter((b) => !b.isPaid).slice(0, 3);

  // Active dreams
  const activeDreams = dreams.filter((d) => !d.isArchived).slice(0, 3);

  // Nearest dream milestone
  const nearestDream = activeDreams.find((d) => d.savedPaise < d.targetPaise);

  const getWeatherIcon = () => {
    switch (moneyWeather.icon) {
      case 'rain':
        return <CloudRain className="w-8 h-8 text-[#657365]" />;
      case 'cloud':
        return <Cloud className="w-8 h-8 text-[#B8CBB3]" />;
      case 'sun':
      default:
        return <Sun className="w-8 h-8 text-[#49664D]" />;
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Editorial Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-2">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF7F0] border border-[#E9E1D1] text-xs text-[#657365] mb-2 font-medium">
            <span className="w-2 h-2 rounded-full bg-[#B8CBB3]" />
            <span>Financial Calm & Clarity</span>
          </div>
          <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[#2C382E] tracking-tight">
            Here&apos;s where you stand, {settings.userName.split(' ')[0]}.
          </h1>
          <p className="text-sm text-[#657365] mt-1">
            No shame, no complex charts. Just your money working at your own pace.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenCoach}
            className="px-4 py-2.5 rounded-2xl bg-[#FAF7F0] hover:bg-[#F2ECE1] border border-[#E9E1D1] text-xs font-semibold text-[#49664D] flex items-center gap-2 transition-all shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ask Coach</span>
          </button>
          <button
            onClick={onOpenAddModal}
            className="px-4 py-2.5 rounded-2xl bg-[#49664D] hover:bg-[#3D5540] text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-sm shadow-[#49664D]/20 active:scale-97"
          >
            <Plus className="w-4 h-4" />
            <span>Log an Expense</span>
          </button>
        </div>
      </div>

      {/* FEATURE 1: Money Weather ☀️ Hero Banner */}
      <MoneyWeatherCard onOpenEditIncome={onOpenEditIncome} />

      {/* Signature Payday Bridge & Safe-to-Spend Hero */}
      <div className="warm-card rounded-3xl p-6 sm:p-7 flex flex-col justify-between bg-gradient-to-br from-white via-white to-[#FAF7F0] border border-[#E9E1D1]">
        <div>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#49664D]" />
              <span className="text-xs font-bold text-[#49664D] uppercase tracking-wider">
                The Payday Bridge • Signature Engine
              </span>
            </div>
            <span className="text-xs font-medium text-[#657365] px-3 py-1 rounded-full bg-[#FAF7F0] border border-[#E9E1D1]">
              {summary.daysRemainingUntilIncome} days until payday ({settings.nextIncomeDate})
            </span>
          </div>

          {/* Plain-Language Daily Allowance Headline */}
          <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#2C382E] leading-snug">
            You have{' '}
            <span className="text-[#49664D] underline decoration-[#B8CBB3] decoration-2 underline-offset-4">
              {formatPaise(Math.max(0, summary.spendableBalancePaise))}
            </span>{' '}
            available for the next {summary.daysRemainingUntilIncome} days. That&apos;s an
            average of{' '}
            <span className="text-[#2C382E] font-mono">
              {formatPaise(summary.suggestedDailyAllowancePaise)}
            </span>{' '}
            per day.
          </h2>

          {/* Visual Ring-Fenced Deductions Breakdown */}
          <div className="mt-6 p-4 rounded-2xl bg-[#F7F5EC] border border-[#E9E1D1] grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-[10px] text-[#657365] block uppercase font-semibold">
                Operating Cash
              </span>
              <span className="font-bold font-mono text-[#2C382E] text-sm">
                {formatPaise(summary.currentAvailableBalancePaise)}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-[#657365] block uppercase font-semibold">
                Bills Ring-fenced
              </span>
              <span className="font-bold font-mono text-[#657365] text-sm">
                -{formatPaise(summary.unpaidEssentialBillsPaise)}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-[#657365] block uppercase font-semibold">
                Dreams Protected
              </span>
              <span className="font-bold font-mono text-[#49664D] text-sm">
                -{formatPaise(summary.plannedSavingsMonthlyPaise)}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-[#657365] block uppercase font-semibold">
                Safe Daily Pace
              </span>
              <span className="font-bold font-mono text-[#49664D] text-sm">
                {formatPaise(summary.suggestedDailyAllowancePaise)}/d
              </span>
            </div>
          </div>
        </div>

        {/* Action Row */}
        <div className="mt-6 pt-4 border-t border-[#E9E1D1] flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-[#657365]">
            Everything essential is already guarded. Spend up to your daily pace without guilt.
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSafeSpendModal(true)}
              className="px-4 py-2 rounded-xl bg-[#FAF7F0] hover:bg-[#E9E1D1] text-[#2C382E] text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <Info className="w-3.5 h-3.5 text-[#49664D]" />
              <span>How is this calculated?</span>
            </button>
            <button
              onClick={() => setActiveTab('money')}
              className="px-4 py-2 rounded-xl bg-[#49664D] hover:bg-[#3D5540] text-white text-xs font-semibold transition-all shadow-xs flex items-center gap-1.5"
            >
              <span>Check My Money</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* CORE INNOVATIONS: Habit-to-Asset Converter & Money Harmony */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Feature 2: Habit-to-Asset Converter Card */}
        <div className="warm-card rounded-3xl p-6 sm:p-7 flex flex-col justify-between bg-gradient-to-br from-white via-[#FAFDF8] to-[#F4F9F2] border border-[#B8CBB3]/60 relative overflow-hidden">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B8CBB3]/30 text-[#49664D] text-xs font-bold">
                <Coins className="w-3.5 h-3.5" />
                <span>Feature 2 • Gamified Saves</span>
              </span>
              <span className="text-xs font-bold text-[#49664D] bg-white px-2.5 py-1 rounded-full border border-[#E9E1D1]">
                Level {avatarPet.level} • {avatarPet.name}
              </span>
            </div>

            <h3 className="font-editorial text-xl font-bold text-[#2C382E] mb-1">
              Habit-to-Asset Converter
            </h3>
            <p className="text-xs text-[#657365] leading-relaxed mb-4">
              Turn skipped coffees and mindful daily habits into an auto-invested stash (+10 XP per $1).
            </p>

            <div className="p-4 rounded-2xl bg-white border border-[#E9E1D1] space-y-2 mb-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#657365]">Invested Habit Stash:</span>
                <span className="font-bold text-base text-[#2C382E]">
                  {formatPaise(avatarPet.totalSavedPaise)}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-[#657365]">
                <span>XP Growth: {avatarPet.xp} XP</span>
                <span className="text-[#49664D] font-semibold">Stage: {avatarPet.stage.toUpperCase()}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('habits')}
            className="w-full py-2.5 rounded-2xl bg-[#49664D] hover:bg-[#3D5540] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-xs"
          >
            <span>Open Habit Converter</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Feature 3: Money Harmony Card */}
        <div className="warm-card rounded-3xl p-6 sm:p-7 flex flex-col justify-between bg-gradient-to-br from-white via-[#FAF7F0] to-[#F2ECE1] border border-[#E9E1D1] relative overflow-hidden">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E9E1D1] text-[#2C382E] text-xs font-bold">
                <Scale className="w-3.5 h-3.5 text-[#49664D]" />
                <span>Feature 3 • Frictionless Splitting</span>
              </span>
              <span className="text-xs font-bold text-[#49664D] bg-white px-2.5 py-1 rounded-full border border-[#E9E1D1]">
                Zero Awkwardness
              </span>
            </div>

            <h3 className="font-editorial text-xl font-bold text-[#2C382E] mb-1">
              Money Harmony
            </h3>
            <p className="text-xs text-[#657365] leading-relaxed mb-4">
              Proportional income bill-splitting, minimal transaction settlements, and 1-click polite AI nudges.
            </p>

            <div className="p-4 rounded-2xl bg-white border border-[#E9E1D1] space-y-2 mb-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#657365]">Algorithm:</span>
                <span className="font-bold text-xs text-[#49664D]">
                  Relative Income Ratio
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-[#657365]">
                <span>AI Nudges: 4 polite styles</span>
                <span className="text-[#49664D] font-semibold">Min-Transaction Resolver</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('harmony')}
            className="w-full py-2.5 rounded-2xl bg-[#49664D] hover:bg-[#3D5540] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-xs"
          >
            <span>Open Money Harmony</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Row 2: "Coming up soon" (Bill Shield) & "Your next little win" */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bill Shield Preview */}
        <div className="warm-card rounded-3xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#FAF7F0] border border-[#E9E1D1] text-[#49664D] flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-editorial text-lg font-bold text-[#2C382E]">
                    Coming Up Soon
                  </h3>
                  <p className="text-xs text-[#657365]">Protected by your Bill Shield</p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('money')}
                className="text-xs font-semibold text-[#49664D] hover:underline flex items-center gap-1"
              >
                <span>View all bills</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {upcomingBills.length === 0 ? (
              <div className="py-8 text-center bg-[#FAF7F0] rounded-2xl border border-[#E9E1D1]">
                <CheckCircle2 className="w-8 h-8 text-[#49664D] mx-auto mb-2" />
                <p className="text-xs font-semibold text-[#2C382E]">All upcoming bills are paid!</p>
                <p className="text-[11px] text-[#657365]">You are completely clear for this cycle.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {upcomingBills.map((bill) => (
                  <div
                    key={bill.id}
                    className="p-3.5 rounded-2xl bg-[#FAF7F0] border border-[#E9E1D1] flex items-center justify-between transition-colors hover:bg-[#F2ECE1]"
                  >
                    <div>
                      <span className="font-semibold text-xs text-[#2C382E] block">
                        {bill.name}
                      </span>
                      <span className="text-[11px] text-[#657365] flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3 text-[#49664D]" />
                        <span>Due: {bill.dueDate}</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-bold font-mono text-xs text-[#2C382E]">
                        {formatPaise(bill.amountPaise)}
                      </span>
                      <button
                        onClick={() => toggleBillPaid(bill.id)}
                        className="px-2.5 py-1 rounded-lg bg-white hover:bg-[#B8CBB3]/40 border border-[#E9E1D1] text-[11px] font-semibold text-[#49664D] transition-colors"
                        title="Mark paid"
                      >
                        Mark Paid
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 mt-4 border-t border-[#E9E1D1] flex items-center justify-between text-xs text-[#657365]">
            <span>
              Total unpaid this month:{' '}
              <strong className="text-[#2C382E]">
                {formatPaise(summary.unpaidEssentialBillsPaise)}
              </strong>
            </span>
            <span className="text-[11px] text-[#49664D] bg-[#FAF7F0] px-2 py-0.5 rounded-full border border-[#E9E1D1]">
              Safe to spend is protected
            </span>
          </div>
        </div>

        {/* Your Next Little Win */}
        <div className="warm-card rounded-3xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#FAF7F0] border border-[#E9E1D1] text-[#49664D] flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-editorial text-lg font-bold text-[#2C382E]">
                    Your Next Little Win
                  </h3>
                  <p className="text-xs text-[#657365]">Small steps build big momentum</p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('vision')}
                className="text-xs font-semibold text-[#49664D] hover:underline flex items-center gap-1"
              >
                <span>Vision Board</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {nearestDream ? (
              <div className="p-4 rounded-2xl bg-[#FAF7F0] border border-[#E9E1D1] space-y-3">
                <div className="flex items-start gap-3.5">
                  <img
                    src={nearestDream.imageUrl}
                    alt={nearestDream.title}
                    className="w-14 h-14 rounded-xl object-cover border border-[#E9E1D1] shrink-0"
                  />
                  <div className="flex-1">
                    <span className="text-[10px] font-bold uppercase text-[#657365]">
                      {nearestDream.category}
                    </span>
                    <h4 className="font-editorial font-bold text-sm text-[#2C382E]">
                      {nearestDream.title}
                    </h4>
                    <p className="text-[11px] text-[#657365] italic mt-0.5 line-clamp-1">
                      &ldquo;{nearestDream.personalMotivation}&rdquo;
                    </p>
                  </div>
                </div>

                {/* Progress bar */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-mono text-[#657365]">
                      {formatPaise(nearestDream.savedPaise)} / {formatPaise(nearestDream.targetPaise)}
                    </span>
                    <span className="font-bold text-[#49664D]">
                      {Math.floor((nearestDream.savedPaise / nearestDream.targetPaise) * 100)}%
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#E9E1D1] overflow-hidden">
                    <div
                      className="h-full bg-[#49664D] rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(
                          100,
                          Math.floor((nearestDream.savedPaise / nearestDream.targetPaise) * 100)
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Quick Add ₹500 action */}
                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[11px] text-[#657365]">
                    Save just ₹500 today to move closer:
                  </span>
                  <button
                    onClick={() => contributeToDream(nearestDream.id, 50000)}
                    className="px-3 py-1.5 rounded-xl bg-[#49664D] hover:bg-[#3D5540] text-white text-xs font-semibold transition-colors flex items-center gap-1 shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Save ₹500</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center bg-[#FAF7F0] rounded-2xl border border-[#E9E1D1]">
                <Compass className="w-8 h-8 text-[#49664D] mx-auto mb-2" />
                <p className="text-xs font-semibold text-[#2C382E]">Ready for a new dream?</p>
                <p className="text-[11px] text-[#657365] mb-3">Add your first financial dream to the Vision Board.</p>
                <button
                  onClick={() => setActiveTab('vision')}
                  className="px-3.5 py-1.5 rounded-xl bg-[#49664D] text-white text-xs font-semibold"
                >
                  Create a Dream
                </button>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-[#E9E1D1] text-xs text-[#657365]">
            <span>
              Total saved toward your dreams:{' '}
              <strong className="text-[#49664D]">
                {formatPaise(
                  dreams.reduce((sum, d) => sum + d.savedPaise, 0)
                )}
              </strong>
            </span>
          </div>
        </div>
      </div>

      {/* Row 3: "Your dreams in progress" — Vision Board preview */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-editorial text-xl font-bold text-[#2C382E]">
              Your Dreams in Progress
            </h3>
            <p className="text-xs text-[#657365]">
              Real dreams mapped to achievable steps for this year.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('vision')}
            className="text-xs font-semibold text-[#49664D] hover:underline flex items-center gap-1"
          >
            <span>Open Vision Board</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {activeDreams.map((dream) => {
            const pct = Math.min(100, Math.floor((dream.savedPaise / dream.targetPaise) * 100));
            return (
              <div
                key={dream.id}
                onClick={() => setActiveTab('vision')}
                className="warm-card rounded-3xl overflow-hidden cursor-pointer group hover:border-[#B8CBB3] transition-all hover:shadow-md"
              >
                <div className="relative h-44 overflow-hidden bg-[#FAF7F0]">
                  <img
                    src={dream.imageUrl}
                    alt={dream.title}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-xs text-[#2C382E]">
                      {dream.category}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h4 className="font-editorial text-base font-bold drop-shadow-xs">
                      {dream.title}
                    </h4>
                    <p className="text-[11px] text-white/80 line-clamp-1 italic">
                      &ldquo;{dream.personalMotivation}&rdquo;
                    </p>
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-bold text-[#2C382E]">
                        {formatPaise(dream.savedPaise)}
                      </span>
                      <span className="text-[#657365]">Target: {formatPaise(dream.targetPaise)}</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#FAF7F0] border border-[#E9E1D1] overflow-hidden">
                      <div
                        className="h-full bg-[#B8CBB3] rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1 border-t border-[#E9E1D1]">
                    <span className="text-[11px] text-[#657365]">
                      {pct >= 50 ? 'Over halfway there! 🌱' : 'Every contribution counts'}
                    </span>
                    <span className="text-xs font-bold text-[#49664D]">{pct}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Safe-to-Spend Detailed Explanation Modal */}
      {showSafeSpendModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div
            onClick={() => setShowSafeSpendModal(false)}
            className="fixed inset-0 bg-[#2C382E]/30 backdrop-blur-xs"
          />
          <div className="relative w-full max-w-lg bg-white rounded-3xl border border-[#E9E1D1] shadow-xl p-6 z-10 space-y-4">
            <h3 className="font-editorial text-xl font-bold text-[#2C382E]">
              How SaveSense Calculates Your Spendable Pool
            </h3>
            <p className="text-xs text-[#657365] leading-relaxed">
              We never let you feel the shock of paying a bill only to realize you overspent.
              Here is the exact formula, designed with zero double-counting:
            </p>

            <div className="p-4 rounded-2xl bg-[#FAF7F0] border border-[#E9E1D1] space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span>Total Available Operating Cash:</span>
                <span className="font-bold text-[#2C382E]">
                  +{formatPaise(summary.currentAvailableBalancePaise)}
                </span>
              </div>
              <div className="flex justify-between text-rose-700">
                <span>Less: Unpaid Essential Bills:</span>
                <span>-{formatPaise(summary.unpaidEssentialBillsPaise)}</span>
              </div>
              <div className="flex justify-between text-[#49664D]">
                <span>Less: Planned Monthly Savings / Dreams:</span>
                <span>-{formatPaise(summary.plannedSavingsMonthlyPaise)}</span>
              </div>
              <div className="flex justify-between text-[#657365]">
                <span>Less: Emergency Cushion Reserved:</span>
                <span>-{formatPaise(summary.emergencyReservePaise)}</span>
              </div>
              <div className="pt-2 border-t border-[#E9E1D1] flex justify-between font-bold text-sm text-[#49664D]">
                <span>Safe to Spend:</span>
                <span>{formatPaise(Math.max(0, summary.spendableBalancePaise))}</span>
              </div>
            </div>

            <p className="text-xs text-[#657365]">
              Dividing this by {summary.daysRemainingUntilIncome} days until your next payday
              gives your suggested daily pace of{' '}
              <strong className="text-[#2C382E]">
                {formatPaise(summary.suggestedDailyAllowancePaise)}/day
              </strong>
              .
            </p>

            <button
              onClick={() => setShowSafeSpendModal(false)}
              className="w-full py-2.5 rounded-xl bg-[#49664D] text-white text-xs font-semibold"
            >
              Got it, thanks!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
