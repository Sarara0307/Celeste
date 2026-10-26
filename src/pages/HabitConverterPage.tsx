/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { formatPaise } from '../utils/formatters';
import { HabitCard } from '../types/finance';
import {
  Coffee,
  UtensilsCrossed,
  Footprints,
  Droplet,
  Tv,
  Clock,
  Sparkles,
  Award,
  TrendingUp,
  Plus,
  Check,
  Copy,
  Gift,
  Coins,
  Smile,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

export const HabitConverterPage: React.FC = () => {
  const {
    habits,
    avatarPet,
    partnerRewards,
    logHabitSave,
    addCustomHabit,
    updatePetName,
    showToast,
  } = useFinance();

  const [flyingCoin, setFlyingCoin] = useState<{ id: string; x: number; y: number } | null>(null);
  const [lastSavedHabit, setLastSavedHabit] = useState<string | null>(null);
  const [petSpeech, setPetSpeech] = useState<string>(
    'Tap a daily habit below to feed my growth and build your investment stash!'
  );
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(avatarPet.name);
  const [isAddCustomOpen, setIsAddCustomOpen] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customAmountRupees, setCustomAmountRupees] = useState('100');
  const [customCategory, setCustomCategory] = useState('Dining & Drinks');

  // Handle single-tap check-off
  const handleHabitTap = (habit: HabitCard, e: React.MouseEvent<HTMLButtonElement>) => {
    // Get click coords for flying coin
    const rect = e.currentTarget.getBoundingClientRect();
    setFlyingCoin({
      id: habit.id,
      x: rect.left + rect.width / 2,
      y: rect.top,
    });
    setLastSavedHabit(habit.id);

    // Call engine logic
    const result = logHabitSave(habit.id);

    // Dynamic reaction dialogue
    const reactions = [
      `Yum! Saved ${formatPaise(habit.amountPaise)} and earned +${result.xpGained} XP! 🌿`,
      `Smart move skipping that! My armor grew stronger! 🛡️`,
      `Every coin adds up! Your stash is blossoming! 🌱✨`,
      `Awesome discipline! +${result.xpGained} XP toward our next evolution! 🚀`,
    ];
    setPetSpeech(reactions[Math.floor(Math.random() * reactions.length)]);

    // Reset flying coin animation after 700ms
    setTimeout(() => {
      setFlyingCoin(null);
    }, 700);

    setTimeout(() => {
      setLastSavedHabit(null);
    }, 1200);
  };

  // Copy coupon code
  const handleCopyCode = (code: string, brand: string) => {
    navigator.clipboard.writeText(code);
    showToast(`Copied code "${code}" for ${brand}! 🏷️`);
  };

  // Calculate XP threshold for current and next levels
  const getLevelThresholds = (level: number) => {
    switch (level) {
      case 1:
        return { min: 0, max: 100, stage: 'Golden Egg 🥚' };
      case 2:
        return { min: 100, max: 250, stage: 'Sprout Seedling 🌱' };
      case 3:
        return { min: 250, max: 500, stage: 'Blossom Flora 🌸' };
      case 4:
        return { min: 500, max: 1000, stage: 'Forest Guardian 🦊' };
      case 5:
      default:
        return { min: 1000, max: 2000, stage: 'Golden Celestial Guardian 🦁✨' };
    }
  };

  const currentThreshold = getLevelThresholds(avatarPet.level);
  const currentXpInLevel = Math.max(0, avatarPet.xp - currentThreshold.min);
  const levelXpNeeded = currentThreshold.max - currentThreshold.min;
  const progressPct = Math.min(100, Math.round((currentXpInLevel / levelXpNeeded) * 100));

  // 10-Year Compound Growth projection at 8% annual return
  // Formula: Future Value of monthly investments
  const monthlyHabitSavingsPaise = Math.round(avatarPet.totalSavedPaise * 0.7);
  const monthlySavingsRupees = Math.max(500, monthlyHabitSavingsPaise / 100);
  const annualRate = 0.08;
  const months = 120; // 10 years
  const projectedFutureRupees = Math.round(
    monthlySavingsRupees * (((Math.pow(1 + annualRate / 12, months) - 1) / (annualRate / 12)) * (1 + annualRate / 12))
  );

  const getHabitIcon = (iconName: string) => {
    switch (iconName) {
      case 'Coffee':
        return <Coffee className="w-5 h-5 text-amber-700" />;
      case 'UtensilsCrossed':
        return <UtensilsCrossed className="w-5 h-5 text-emerald-700" />;
      case 'Footprints':
        return <Footprints className="w-5 h-5 text-blue-700" />;
      case 'Droplet':
        return <Droplet className="w-5 h-5 text-sky-700" />;
      case 'Tv':
        return <Tv className="w-5 h-5 text-purple-700" />;
      case 'Clock':
      default:
        return <Clock className="w-5 h-5 text-rose-700" />;
    }
  };

  // Render SVG avatar based on stage
  const renderAvatarCharacter = () => {
    switch (avatarPet.stage) {
      case 'egg':
        return (
          <div className="relative w-32 h-32 flex items-center justify-center animate-bounce-slow">
            <svg viewBox="0 0 100 120" className="w-28 h-28 drop-shadow-md">
              <ellipse cx="50" cy="65" rx="36" ry="46" fill="#F4E8C1" stroke="#49664D" strokeWidth="3" />
              <ellipse cx="50" cy="65" rx="30" ry="40" fill="#FFF8E7" />
              {/* Cute little cracks & shine */}
              <path d="M42 45 L50 55 L45 65 L55 75" fill="none" stroke="#D4AF37" strokeWidth="2.5" strokeLinecap="round" />
              <ellipse cx="38" cy="40" rx="4" ry="7" fill="white" opacity="0.8" />
              {/* Shy blushing eyes */}
              <circle cx="42" cy="70" r="3" fill="#49664D" />
              <circle cx="58" cy="70" r="3" fill="#49664D" />
              <path d="M47 75 Q50 78 53 75" fill="none" stroke="#49664D" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        );
      case 'sprout':
        return (
          <div className="relative w-32 h-32 flex items-center justify-center animate-float">
            <svg viewBox="0 0 120 120" className="w-28 h-28 drop-shadow-md">
              {/* Pet Body */}
              <circle cx="60" cy="70" r="34" fill="#B8CBB3" stroke="#49664D" strokeWidth="3" />
              <circle cx="60" cy="70" r="30" fill="#EBF3E8" />
              {/* Little Sprout on Head */}
              <path d="M60 40 Q55 25 45 22 Q58 20 60 38" fill="#49664D" />
              <path d="M60 38 Q65 24 75 22 Q62 20 60 38" fill="#B8CBB3" />
              {/* Cute Face */}
              <circle cx="50" cy="66" r="3.5" fill="#2C382E" />
              <circle cx="70" cy="66" r="3.5" fill="#2C382E" />
              <circle cx="52" cy="64" r="1" fill="white" />
              <circle cx="72" cy="64" r="1" fill="white" />
              {/* Rosy Cheeks */}
              <circle cx="43" cy="72" r="3.5" fill="#E8B4B8" opacity="0.7" />
              <circle cx="77" cy="72" r="3.5" fill="#E8B4B8" opacity="0.7" />
              {/* Happy Smile */}
              <path d="M54 74 Q60 81 66 74" fill="none" stroke="#2C382E" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        );
      case 'blossom':
        return (
          <div className="relative w-32 h-32 flex items-center justify-center animate-float">
            <svg viewBox="0 0 120 120" className="w-28 h-28 drop-shadow-md">
              {/* Pet Body */}
              <circle cx="60" cy="70" r="34" fill="#E8B4B8" stroke="#8C4B59" strokeWidth="3" />
              <circle cx="60" cy="70" r="30" fill="#FFF2F4" />
              {/* Blossom petals around head */}
              <circle cx="60" cy="30" r="10" fill="#F4A6B8" stroke="#8C4B59" strokeWidth="1.5" />
              <circle cx="45" cy="38" r="9" fill="#F4A6B8" stroke="#8C4B59" strokeWidth="1.5" />
              <circle cx="75" cy="38" r="9" fill="#F4A6B8" stroke="#8C4B59" strokeWidth="1.5" />
              <circle cx="60" cy="36" r="6" fill="#FEE388" />
              {/* Sparkly Eyes */}
              <circle cx="50" cy="66" r="4" fill="#2C382E" />
              <circle cx="70" cy="66" r="4" fill="#2C382E" />
              <circle cx="48" cy="64" r="1.5" fill="white" />
              <circle cx="68" cy="64" r="1.5" fill="white" />
              {/* Rosy Cheeks */}
              <ellipse cx="42" cy="74" rx="4" ry="2.5" fill="#E88294" opacity="0.7" />
              <ellipse cx="78" cy="74" rx="4" ry="2.5" fill="#E88294" opacity="0.7" />
              <path d="M54 75 Q60 82 66 75" fill="none" stroke="#2C382E" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        );
      case 'guardian':
        return (
          <div className="relative w-32 h-32 flex items-center justify-center animate-float">
            <svg viewBox="0 0 120 120" className="w-30 h-30 drop-shadow-lg">
              {/* Fox / Guardian ears */}
              <polygon points="38,45 28,15 54,35" fill="#C26A3E" stroke="#8A411B" strokeWidth="2" />
              <polygon points="82,45 92,15 66,35" fill="#C26A3E" stroke="#8A411B" strokeWidth="2" />
              <polygon points="38,42 32,22 48,35" fill="#FFF2E8" />
              <polygon points="82,42 88,22 72,35" fill="#FFF2E8" />
              {/* Face */}
              <circle cx="60" cy="70" r="35" fill="#D97A48" stroke="#8A411B" strokeWidth="3" />
              <path d="M35 70 Q60 100 85 70 Q60 55 35 70 Z" fill="#FFF8F0" />
              {/* Confident Eyes */}
              <ellipse cx="48" cy="64" rx="3.5" ry="4.5" fill="#2C382E" />
              <ellipse cx="72" cy="64" rx="3.5" ry="4.5" fill="#2C382E" />
              <circle cx="47" cy="62" r="1.5" fill="white" />
              <circle cx="71" cy="62" r="1.5" fill="white" />
              {/* Cute Nose & Smile */}
              <polygon points="57,75 63,75 60,78" fill="#2C382E" />
              <path d="M55 80 Q60 84 65 80" fill="none" stroke="#2C382E" strokeWidth="2" strokeLinecap="round" />
              {/* Leaf crest */}
              <circle cx="60" cy="40" r="5" fill="#49664D" />
            </svg>
          </div>
        );
      case 'golden':
      default:
        return (
          <div className="relative w-32 h-32 flex items-center justify-center animate-float">
            <div className="absolute inset-0 bg-amber-400/20 rounded-full blur-xl animate-pulse" />
            <svg viewBox="0 0 120 120" className="w-30 h-30 drop-shadow-xl relative z-10">
              {/* Golden Crown / Mane */}
              <circle cx="60" cy="65" r="42" fill="#F8DE7E" stroke="#C59B27" strokeWidth="2.5" />
              <circle cx="60" cy="65" r="34" fill="#FFEDB3" />
              {/* Crown */}
              <polygon points="45,35 52,20 60,32 68,20 75,35" fill="#D4AF37" stroke="#997A15" strokeWidth="2" />
              <circle cx="60" cy="22" r="3" fill="#E8B4B8" />
              {/* Eyes */}
              <circle cx="48" cy="62" r="4" fill="#49664D" />
              <circle cx="72" cy="62" r="4" fill="#49664D" />
              <circle cx="46" cy="60" r="1.5" fill="white" />
              <circle cx="70" cy="60" r="1.5" fill="white" />
              {/* Smile */}
              <path d="M53 72 Q60 80 67 72" fill="none" stroke="#49664D" strokeWidth="3" strokeLinecap="round" />
              {/* Stars */}
              <polygon points="25,40 27,45 32,45 28,48 30,53 25,50 20,53 22,48 18,45 23,45" fill="#D4AF37" />
              <polygon points="95,40 97,45 102,45 98,48 100,53 95,50 90,53 92,48 88,45 93,45" fill="#D4AF37" />
            </svg>
          </div>
        );
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Flying Coin Animation Layer */}
      {flyingCoin && (
        <div
          className="fixed z-50 pointer-events-none transition-all duration-700 ease-out transform -translate-x-1/2"
          style={{
            left: `${flyingCoin.x}px`,
            top: `${flyingCoin.y}px`,
          }}
        >
          <div className="animate-coin-fly flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 text-amber-950 font-bold border-2 border-yellow-200 shadow-lg text-sm">
            💰
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-2">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF7F0] border border-[#E9E1D1] text-xs text-[#657365] mb-2 font-medium">
            <Coins className="w-3.5 h-3.5 text-[#49664D]" />
            <span>Gamified Micro-Investments</span>
          </div>
          <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[#2C382E] tracking-tight">
            Habit-to-Asset Converter
          </h1>
          <p className="text-sm text-[#657365] mt-1 max-w-xl">
            One tap converts daily mindful choices into real investment cash and visual XP for your evolving companion.
          </p>
        </div>

        {/* Action button */}
        <button
          onClick={() => setIsAddCustomOpen(true)}
          className="px-4 py-2.5 rounded-2xl bg-[#FAF7F0] hover:bg-[#F2ECE1] border border-[#E9E1D1] text-xs font-semibold text-[#49664D] flex items-center gap-2 transition-all self-start sm:self-auto shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Save</span>
        </button>
      </div>

      {/* Top Hero Section: Digital Avatar Companion & Micro-Investment Stash */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Interactive Evolving Avatar Pet (7 cols) */}
        <div className="lg:col-span-7 warm-card rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-white via-[#FAFDF8] to-[#F4F9F2] border border-[#B8CBB3]/50">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="px-3 py-1 rounded-full bg-[#49664D] text-white text-xs font-bold tracking-wide">
                Level {avatarPet.level}
              </span>
              <span className="text-xs font-semibold text-[#657365] bg-white/80 px-2.5 py-1 rounded-full border border-[#E9E1D1]">
                {currentThreshold.stage}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {isEditingName ? (
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    className="px-2.5 py-1 text-xs rounded-xl border border-[#49664D] bg-white focus:outline-none"
                    maxLength={16}
                  />
                  <button
                    onClick={() => {
                      updatePetName(tempName);
                      setIsEditingName(false);
                    }}
                    className="p-1 rounded-lg bg-[#49664D] text-white hover:bg-[#3D5540]"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditingName(true)}
                  className="text-xs text-[#657365] hover:text-[#49664D] hover:underline flex items-center gap-1 font-medium"
                  title="Rename Avatar"
                >
                  <span>{avatarPet.name}</span>
                  <span className="text-[10px] text-[#49664D]">✎</span>
                </button>
              )}
            </div>
          </div>

          {/* Central Pet Visual & Speech Bubble */}
          <div className="my-6 flex flex-col sm:flex-row items-center gap-6 justify-center">
            {renderAvatarCharacter()}

            {/* Speech Bubble */}
            <div className="relative max-w-xs bg-white p-4 rounded-2xl border border-[#E9E1D1] shadow-xs text-xs text-[#2C382E] leading-relaxed">
              <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-0 h-0 border-y-6 border-y-transparent border-r-8 border-r-white hidden sm:block" />
              <div className="flex items-center gap-1.5 font-bold text-[#49664D] mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{avatarPet.name} says:</span>
              </div>
              <p>{petSpeech}</p>
            </div>
          </div>

          {/* XP Progress Bar */}
          <div className="space-y-2 pt-2 border-t border-[#E9E1D1]/60">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-[#657365]">Evolution Growth</span>
              <span className="text-[#49664D]">
                {avatarPet.xp} XP ({progressPct}% to next stage)
              </span>
            </div>
            <div className="w-full h-3 bg-[#E9E1D1]/60 rounded-full overflow-hidden p-0.5">
              <div
                className="h-full bg-gradient-to-r from-[#B8CBB3] to-[#49664D] rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-[#657365]">
              <span>$1 saved = 10 XP points</span>
              <span>Next evolution at {currentThreshold.max} XP</span>
            </div>
          </div>
        </div>

        {/* Right: Micro-Investment Portfolio Stash (5 cols) */}
        <div className="lg:col-span-5 warm-card rounded-3xl p-6 sm:p-8 flex flex-col justify-between bg-gradient-to-br from-[#FAF7F0] via-white to-[#F2ECE1]">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-[#657365] uppercase tracking-wider">
                Invested Stash
              </span>
              <span className="px-2.5 py-1 rounded-full bg-[#B8CBB3]/30 text-[#49664D] text-xs font-semibold flex items-center gap-1">
                <Coins className="w-3.5 h-3.5" />
                <span>Micro-Portfolio</span>
              </span>
            </div>

            <div className="space-y-1 mb-6">
              <span className="text-3xl sm:text-4xl font-editorial font-bold text-[#2C382E]">
                {formatPaise(avatarPet.totalSavedPaise)}
              </span>
              <p className="text-xs text-[#657365]">
                Accumulated across {avatarPet.totalSavesCount} mindful micro-saves
              </p>
            </div>

            {/* 10-Year Compound Growth Projection */}
            <div className="p-4 rounded-2xl bg-white border border-[#E9E1D1] space-y-2 mb-4">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#2C382E]">
                <TrendingUp className="w-4 h-4 text-[#49664D]" />
                <span>10-Year Compound Projection</span>
              </div>
              <p className="text-xs text-[#657365] leading-relaxed">
                If you continue stacking micro-habits at this pace and invest in a low-cost index fund (at 8% annual return):
              </p>
              <div className="pt-1 flex items-baseline justify-between">
                <span className="text-xs font-medium text-[#657365]">Estimated Future Wealth:</span>
                <span className="text-base font-bold text-[#49664D]">
                  ₹{projectedFutureRupees.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#E9E1D1] flex items-center justify-between text-xs text-[#657365]">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#49664D]" />
              <span>Auto-transferred to ledger</span>
            </span>
            <span className="font-semibold text-[#49664D]">
              {avatarPet.streakDays}-Day Save Streak 🔥
            </span>
          </div>
        </div>
      </div>

      {/* Core Interaction Grid: Daily Saves Quick-Tap Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-editorial text-2xl font-bold text-[#2C382E]">
              Tap a Daily Save — Make It Asset
            </h2>
            <p className="text-xs text-[#657365]">
              One single tap check-off transfers micro-funds into your stash and grows {avatarPet.name}.
            </p>
          </div>
          <span className="text-xs font-semibold text-[#49664D] hidden sm:inline">
            1 Tap = Micro-Transfer
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {habits.map((habit) => {
            const isJustSaved = lastSavedHabit === habit.id;
            return (
              <button
                key={habit.id}
                onClick={(e) => handleHabitTap(habit, e)}
                className={`text-left p-5 rounded-3xl transition-all duration-200 border relative group active:scale-98 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#49664D] ${
                  isJustSaved
                    ? 'bg-[#EBF3E8] border-[#49664D] shadow-md scale-101'
                    : 'bg-white hover:bg-[#FAF7F0] border-[#E9E1D1] hover:border-[#B8CBB3] shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="w-11 h-11 rounded-2xl bg-[#FAF7F0] border border-[#E9E1D1] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    {getHabitIcon(habit.icon)}
                  </div>

                  <span className="px-3 py-1 rounded-full bg-[#B8CBB3]/25 text-[#49664D] font-bold text-xs">
                    +{formatPaise(habit.amountPaise)}
                  </span>
                </div>

                <h3 className="font-semibold text-sm text-[#2C382E] group-hover:text-[#49664D] transition-colors mb-1">
                  {habit.title}
                </h3>
                <p className="text-xs text-[#657365] line-clamp-2 leading-relaxed mb-4">
                  {habit.description}
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-[#E9E1D1]/60 text-[11px] text-[#657365]">
                  <span>Logged {habit.timesLogged} times</span>
                  <span className="font-semibold text-[#49664D] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    <span>Tap to Save</span>
                    <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Real-World Partner Rewards Section (Unlocked on Level-Up) */}
      <div className="warm-card rounded-3xl p-6 sm:p-8 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF7F0] border border-[#E9E1D1] text-xs text-[#49664D] font-semibold mb-1">
              <Gift className="w-3.5 h-3.5" />
              <span>Real-World Partner Perks</span>
            </div>
            <h2 className="font-editorial text-2xl font-bold text-[#2C382E]">
              Unlocked Reward Badges
            </h2>
            <p className="text-xs text-[#657365]">
              As your avatar pet levels up through micro-saves, unlock real-world partner discounts and perks.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {partnerRewards.map((reward) => (
            <div
              key={reward.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                reward.isUnlocked
                  ? 'bg-white border-[#B8CBB3] shadow-xs'
                  : 'bg-[#FAF7F0]/60 border-[#E9E1D1]/80 opacity-75'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold text-[#657365] uppercase">
                    {reward.brand}
                  </span>
                  {reward.isUnlocked ? (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      Unlocked
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-[10px] font-medium">
                      Unlocks at Lv. {reward.unlockedAtLevel}
                    </span>
                  )}
                </div>

                <h3 className="font-semibold text-sm text-[#2C382E] mb-1">
                  {reward.title}
                </h3>
                <p className="text-xs text-[#657365] leading-relaxed mb-4">
                  {reward.description}
                </p>
              </div>

              {reward.isUnlocked ? (
                <div className="pt-3 border-t border-[#E9E1D1] flex items-center justify-between">
                  <code className="text-xs font-mono font-bold text-[#49664D] bg-[#FAF7F0] px-2 py-1 rounded-lg border border-[#E9E1D1]">
                    {reward.discountCode}
                  </code>
                  <button
                    onClick={() => handleCopyCode(reward.discountCode, reward.brand)}
                    className="p-1.5 rounded-lg bg-[#49664D] text-white hover:bg-[#3D5540] transition-colors"
                    title="Copy Discount Code"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="pt-3 border-t border-[#E9E1D1] text-[11px] text-[#657365] flex items-center gap-1 font-medium">
                  <span>🔒 Reach Level {reward.unlockedAtLevel} to claim</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Add Custom Habit Modal */}
      {isAddCustomOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-[#E9E1D1] shadow-2xl space-y-5 animate-fadeIn">
            <div>
              <h3 className="font-editorial text-2xl font-bold text-[#2C382E]">
                Add Custom Micro-Save
              </h3>
              <p className="text-xs text-[#657365] mt-1">
                Create a personalized daily save button tailored to your own spending habits.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#2C382E] mb-1">
                  Habit Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Packed Lunch, Skipped Fast Fashion"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-[#E9E1D1] bg-[#FAF7F0] text-sm focus:outline-none focus:ring-2 focus:ring-[#49664D]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2C382E] mb-1">
                  Amount Saved Each Time (₹)
                </label>
                <input
                  type="number"
                  min="10"
                  step="10"
                  value={customAmountRupees}
                  onChange={(e) => setCustomAmountRupees(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-[#E9E1D1] bg-[#FAF7F0] text-sm font-bold text-[#2C382E] focus:outline-none focus:ring-2 focus:ring-[#49664D]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2C382E] mb-1">
                  Category
                </label>
                <select
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-[#E9E1D1] bg-[#FAF7F0] text-xs focus:outline-none focus:ring-2 focus:ring-[#49664D]"
                >
                  <option value="Dining & Drinks">Dining & Drinks</option>
                  <option value="Food & Groceries">Food & Groceries</option>
                  <option value="Transport">Transport</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Subscriptions">Subscriptions</option>
                  <option value="Everyday">Everyday</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E9E1D1]">
              <button
                onClick={() => setIsAddCustomOpen(false)}
                className="px-4 py-2.5 rounded-2xl border border-[#E9E1D1] text-xs font-semibold text-[#657365] hover:bg-[#FAF7F0]"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const amtRupees = parseFloat(customAmountRupees) || 50;
                  addCustomHabit(customTitle || 'Custom Save', Math.round(amtRupees * 100), customCategory, 'Sparkles');
                  setIsAddCustomOpen(false);
                  setCustomTitle('');
                }}
                className="px-5 py-2.5 rounded-2xl bg-[#49664D] hover:bg-[#3D5540] text-white text-xs font-semibold shadow-xs"
              >
                Save Habit Card
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
