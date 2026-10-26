/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { formatPaise, rupeesToPaise } from '../utils/formatters';
import { DreamCategory, DreamPriority, VisionDream } from '../types/finance';
import confetti from 'canvas-confetti';
import {
  Compass,
  Plus,
  Sparkles,
  Calendar,
  CheckCircle,
  ArrowRight,
  X,
  Edit2,
  Trash2,
  Archive,
  Heart,
  TrendingUp,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

const CURATED_IMAGES = [
  {
    label: 'MacBook & Desk',
    category: 'Gadgets & Technology',
    url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Cozy First Apartment',
    category: 'First Apartment',
    url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Misty Mountains',
    category: 'Travel & Experiences',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Rainy Day Peace',
    category: 'Emergency Savings',
    url: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Design Books & Study',
    category: 'Education & Career',
    url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Art & Photography',
    category: 'Personal Growth',
    url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
  },
];

const CATEGORIES: DreamCategory[] = [
  'Education & Career',
  'First Apartment',
  'Gadgets & Technology',
  'Travel & Experiences',
  'Emergency Savings',
  'Health & Wellbeing',
  'Family & Gifts',
  'Personal Growth',
  'Custom Dreams',
];

export const VisionBoardPage: React.FC = () => {
  const {
    dreams,
    addDream,
    updateDream,
    deleteDream,
    archiveDream,
    contributeToDream,
    celebrateMilestone,
    summary,
  } = useFinance();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [plannerDream, setPlannerDream] = useState<VisionDream | null>(null);
  const [depositDream, setDepositDream] = useState<VisionDream | null>(null);
  const [depositAmountRupees, setDepositAmountRupees] = useState('1000');
  const [isReflectionOpen, setIsReflectionOpen] = useState(false);

  // New dream form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<DreamCategory>('Gadgets & Technology');
  const [imageUrl, setImageUrl] = useState(CURATED_IMAGES[0].url);
  const [targetRupees, setTargetRupees] = useState('20000');
  const [savedRupees, setSavedRupees] = useState('0');
  const [targetDate, setTargetDate] = useState(
    new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [priority, setPriority] = useState<DreamPriority>('now');
  const [personalMotivation, setPersonalMotivation] = useState('');
  const [formError, setFormError] = useState('');

  // Filtered dreams
  const activeDreams = dreams.filter((d) => !d.isArchived);
  const displayDreams =
    selectedCategory === 'all'
      ? activeDreams
      : activeDreams.filter((d) => d.category === selectedCategory);

  const totalSavedAllDreams = dreams.reduce((acc, d) => acc + d.savedPaise, 0);

  const triggerCelebration = (dreamTitle: string, pct: number) => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#49664D', '#B8CBB3', '#E9E1D1'],
      });
    } catch {
      // safe fallback
    }
  };

  const handleCreateDream = (e: React.FormEvent) => {
    e.preventDefault();
    const tRupees = parseFloat(targetRupees);
    const sRupees = parseFloat(savedRupees) || 0;

    if (!title.trim()) {
      setFormError('Please give your financial dream a name.');
      return;
    }
    if (isNaN(tRupees) || tRupees <= 0) {
      setFormError('Please enter a valid target amount.');
      return;
    }

    addDream({
      title: title.trim(),
      description: description.trim() || 'A personal financial dream for this year.',
      category,
      imageUrl: imageUrl || CURATED_IMAGES[0].url,
      targetPaise: rupeesToPaise(tRupees),
      savedPaise: rupeesToPaise(sRupees),
      targetDate,
      priority,
      personalMotivation:
        personalMotivation.trim() || 'Keep moving forward at my own steady pace.',
      suggestedMonthlyPaise: Math.round(rupeesToPaise(tRupees) / 6),
    });

    // Reset & close
    setTitle('');
    setDescription('');
    setPersonalMotivation('');
    setIsAddModalOpen(false);
  };

  const handleDeposit = () => {
    if (!depositDream) return;
    const amt = parseFloat(depositAmountRupees);
    if (isNaN(amt) || amt <= 0) return;

    const amtPaise = rupeesToPaise(amt);
    const newTotal = depositDream.savedPaise + amtPaise;
    const pct = Math.floor((newTotal / depositDream.targetPaise) * 100);

    // Milestone thresholds: 10, 25, 50, 75, 100
    [10, 25, 50, 75, 100].forEach((threshold) => {
      if (pct >= threshold && !(depositDream.celebratedMilestones || []).includes(threshold)) {
        celebrateMilestone(depositDream.id, threshold);
        triggerCelebration(depositDream.title, threshold);
      }
    });

    contributeToDream(depositDream.id, amtPaise);
    setDepositDream(null);
    setDepositAmountRupees('1000');
  };

  const getPriorityBadge = (p: DreamPriority) => {
    switch (p) {
      case 'now':
        return (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#B8CBB3]/50 text-[#49664D]">
            Important now
          </span>
        );
      case 'working':
        return (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#E9E1D1] text-[#2C382E]">
            Working toward it
          </span>
        );
      case 'someday':
      default:
        return (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#FAF7F0] border border-[#E9E1D1] text-[#657365]">
            Someday
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Editorial Vision Header */}
      <div className="warm-card rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-white via-[#FAF7F0] to-[#F1F5F0]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E9E1D1] text-xs text-[#49664D] mb-3 font-medium">
              <Compass className="w-3.5 h-3.5" />
              <span>Signature Feature • Financial Vision Board</span>
            </div>
            <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[#2C382E] tracking-tight">
              Your Dreams for This Year
            </h1>
            <p className="text-sm text-[#657365] mt-1.5 leading-relaxed">
              Connect what you love to practical, stress-free savings. Every goal is checked against
              your real numbers so you never sacrifice essentials.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-col gap-2.5 shrink-0">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-5 py-3 rounded-2xl bg-[#49664D] hover:bg-[#3D5540] text-white text-xs font-semibold shadow-sm shadow-[#49664D]/20 transition-all flex items-center gap-2 active:scale-97"
            >
              <Plus className="w-4 h-4" />
              <span>Add a Dream</span>
            </button>
            <button
              onClick={() => setIsReflectionOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-white hover:bg-[#FAF7F0] border border-[#E9E1D1] text-xs font-semibold text-[#2C382E] transition-all flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#49664D]" />
              <span>Year-End Reflection</span>
            </button>
          </div>
        </div>

        {/* Board Metrics Summary */}
        <div className="mt-8 pt-6 border-t border-[#E9E1D1] grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-[10px] text-[#657365] block uppercase font-semibold">
              Active Dreams
            </span>
            <span className="font-editorial font-bold text-xl text-[#2C382E]">
              {activeDreams.length}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-[#657365] block uppercase font-semibold">
              Total Saved So Far
            </span>
            <span className="font-editorial font-bold text-xl text-[#49664D]">
              {formatPaise(totalSavedAllDreams)}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-[#657365] block uppercase font-semibold">
              Monthly Budget Reserved
            </span>
            <span className="font-editorial font-bold text-xl text-[#2C382E]">
              {formatPaise(summary.plannedSavingsMonthlyPaise)}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-[#657365] block uppercase font-semibold">
              Reality Check Status
            </span>
            <span className="inline-flex items-center gap-1 font-semibold text-xs text-[#49664D] mt-1">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Balanced & Protected</span>
            </span>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-2xl text-xs font-semibold transition-colors shrink-0 ${
            selectedCategory === 'all'
              ? 'bg-[#49664D] text-white shadow-xs'
              : 'bg-white hover:bg-[#FAF7F0] text-[#657365] border border-[#E9E1D1]'
          }`}
        >
          All Dreams ({activeDreams.length})
        </button>
        {CATEGORIES.map((cat) => {
          const count = activeDreams.filter((d) => d.category === cat).length;
          if (count === 0) return null;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-2xl text-xs font-semibold transition-colors shrink-0 ${
                selectedCategory === cat
                  ? 'bg-[#49664D] text-white shadow-xs'
                  : 'bg-white hover:bg-[#FAF7F0] text-[#657365] border border-[#E9E1D1]'
              }`}
            >
              {cat} ({count})
            </button>
          );
        })}
      </div>

      {/* Dreams Visual Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayDreams.map((dream) => {
          const pct = Math.min(100, Math.floor((dream.savedPaise / dream.targetPaise) * 100));
          const remainingPaise = Math.max(0, dream.targetPaise - dream.savedPaise);
          const isComplete = pct >= 100;

          return (
            <div
              key={dream.id}
              className="warm-card rounded-3xl overflow-hidden flex flex-col justify-between group hover:border-[#B8CBB3] transition-all hover:shadow-md"
            >
              <div>
                {/* Image Cover */}
                <div className="relative h-48 overflow-hidden bg-[#FAF7F0]">
                  <img
                    src={dream.imageUrl}
                    alt={dream.title}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-xs text-[#2C382E]">
                      {dream.category}
                    </span>
                    {getPriorityBadge(dream.priority)}
                  </div>

                  {/* Card Title on Image */}
                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <h3 className="font-editorial text-lg font-bold leading-tight drop-shadow-xs">
                      {dream.title}
                    </h3>
                    <p className="text-xs text-white/90 line-clamp-1 italic mt-0.5">
                      &ldquo;{dream.personalMotivation}&rdquo;
                    </p>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 space-y-4">
                  {/* Progress Bar */}
                  <div>
                    <div className="flex justify-between items-baseline text-xs mb-1.5">
                      <div>
                        <span className="font-bold font-mono text-[#2C382E] text-sm">
                          {formatPaise(dream.savedPaise)}
                        </span>
                        <span className="text-[#657365] text-xs">
                          {' '}
                          of {formatPaise(dream.targetPaise)}
                        </span>
                      </div>
                      <span className="font-bold text-[#49664D] text-sm">{pct}%</span>
                    </div>

                    <div className="w-full h-2.5 rounded-full bg-[#FAF7F0] border border-[#E9E1D1] overflow-hidden">
                      <div
                        className="h-full bg-[#49664D] rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  {/* Simple Next Step */}
                  <div className="p-3 rounded-2xl bg-[#FAF7F0] border border-[#E9E1D1] text-xs text-[#2C382E]">
                    <span className="text-[10px] uppercase font-bold text-[#657365] block mb-0.5">
                      Next Gentle Step
                    </span>
                    <p className="text-xs text-[#2C382E]">
                      {isComplete ? (
                        <span className="text-[#49664D] font-semibold">
                          🎉 Goal achieved! Congratulations on turning this dream into reality.
                        </span>
                      ) : (
                        <span>
                          {remainingPaise <= 500000
                            ? `Only ${formatPaise(remainingPaise)} left to achieve your dream!`
                            : `Saving ~${formatPaise(
                                dream.suggestedMonthlyPaise || Math.round(remainingPaise / 4)
                              )}/month keeps you on track.`}
                        </span>
                      )}
                    </p>
                  </div>

                  {/* Target Date Pill */}
                  <div className="flex items-center justify-between text-xs text-[#657365] pt-1">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#49664D]" />
                      <span>Target: {dream.targetDate}</span>
                    </span>
                    {dream.celebratedMilestones && dream.celebratedMilestones.length > 0 && (
                      <span className="text-[10px] text-[#49664D] font-semibold">
                        ★ {dream.celebratedMilestones[dream.celebratedMilestones.length - 1]}% reached
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-5 pt-0 flex items-center gap-2 border-t border-[#E9E1D1]/60 mt-2">
                <button
                  onClick={() => {
                    setDepositDream(dream);
                    setDepositAmountRupees('1000');
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-[#49664D] hover:bg-[#3D5540] text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Save Money</span>
                </button>
                <button
                  onClick={() => setPlannerDream(dream)}
                  className="px-3 py-2.5 rounded-xl bg-[#FAF7F0] hover:bg-[#E9E1D1] text-[#2C382E] text-xs font-semibold transition-colors flex items-center gap-1"
                  title="Make it happen planner"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#49664D]" />
                  <span>Plan</span>
                </button>
                <button
                  onClick={() => archiveDream(dream.id)}
                  className="p-2.5 rounded-xl text-[#657365] hover:bg-[#FAF7F0] border border-transparent hover:border-[#E9E1D1] transition-colors"
                  title="Archive dream"
                >
                  <Archive className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* "Make It Happen" Goal Planner Modal with Reality Check */}
      {plannerDream && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div
            onClick={() => setPlannerDream(null)}
            className="fixed inset-0 bg-[#2C382E]/30 backdrop-blur-xs"
          />
          <div className="relative w-full max-w-lg bg-white rounded-3xl border border-[#E9E1D1] shadow-2xl overflow-hidden z-10 p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#E9E1D1]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#B8CBB3]/40 text-[#49664D] flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-editorial text-lg font-bold text-[#2C382E]">
                    Make It Happen Planner
                  </h3>
                  <p className="text-xs text-[#657365]">{plannerDream.title}</p>
                </div>
              </div>
              <button
                onClick={() => setPlannerDream(null)}
                className="p-1.5 rounded-xl text-[#657365] hover:bg-[#FAF7F0]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Reality Check Feasibility Card */}
            <div className="p-4 rounded-2xl bg-[#F7F5EC] border border-[#E9E1D1] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#49664D] uppercase tracking-wider">
                  Reality Check Feasibility
                </span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Fully Realistic
                </span>
              </div>
              <p className="text-xs text-[#2C382E] leading-relaxed">
                Saving{' '}
                <strong>
                  {formatPaise(plannerDream.suggestedMonthlyPaise || 100000)}/month
                </strong>{' '}
                leaves you with{' '}
                <strong>
                  {formatPaise(Math.max(0, summary.spendableBalancePaise))}
                </strong>{' '}
                for guilt-free day-to-day spending. All upcoming bills remain 100% guarded.
              </p>
            </div>

            {/* Adjustments & Alternatives */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-[#2C382E] block">
                Pacing Alternatives (If circumstances change):
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 rounded-xl bg-[#FAF7F0] border border-[#E9E1D1]">
                  <span className="font-semibold block text-[#2C382E]">Gentle Pace</span>
                  <span className="text-[11px] text-[#657365] block mt-0.5">
                    Save {formatPaise(Math.round((plannerDream.suggestedMonthlyPaise || 100000) * 0.7))}/mo,
                    extend target date by 45 days.
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[#FAF7F0] border border-[#E9E1D1]">
                  <span className="font-semibold block text-[#2C382E]">Accelerated</span>
                  <span className="text-[11px] text-[#657365] block mt-0.5">
                    Save {formatPaise(Math.round((plannerDream.suggestedMonthlyPaise || 100000) * 1.3))}/mo,
                    reach your goal 30 days earlier.
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setPlannerDream(null);
                setDepositDream(plannerDream);
              }}
              className="w-full py-3 rounded-2xl bg-[#49664D] hover:bg-[#3D5540] text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Contribute to this Goal Now</span>
            </button>
          </div>
        </div>
      )}

      {/* Save Money / Deposit Modal */}
      {depositDream && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div
            onClick={() => setDepositDream(null)}
            className="fixed inset-0 bg-[#2C382E]/30 backdrop-blur-xs"
          />
          <div className="relative w-full max-w-md bg-white rounded-3xl border border-[#E9E1D1] shadow-2xl p-6 z-10 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#E9E1D1]">
              <h3 className="font-editorial text-lg font-bold text-[#2C382E]">
                Save for &ldquo;{depositDream.title}&rdquo;
              </h3>
              <button
                onClick={() => setDepositDream(null)}
                className="p-1 rounded-xl text-[#657365] hover:bg-[#FAF7F0]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#657365] mb-2">
                Contribution Amount (₹)
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-2xl font-bold text-[#2C382E]">₹</span>
                <input
                  type="number"
                  inputMode="decimal"
                  autoFocus
                  value={depositAmountRupees}
                  onChange={(e) => setDepositAmountRupees(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#FAF7F0] border border-[#E9E1D1] text-2xl font-bold font-mono text-[#2C382E] focus:outline-none focus:ring-2 focus:ring-[#49664D]"
                />
              </div>

              {/* Quick amount chips */}
              <div className="flex items-center gap-2 mt-2">
                {[500, 1000, 2000, 5000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setDepositAmountRupees(amt.toString())}
                    className="px-2.5 py-1 rounded-lg bg-[#FAF7F0] hover:bg-[#E9E1D1] border border-[#E9E1D1] text-xs font-mono text-[#2C382E]"
                  >
                    +₹{amt}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={() => setDepositDream(null)}
                className="flex-1 py-3 rounded-2xl bg-[#FAF7F0] text-xs font-semibold text-[#657365]"
              >
                Cancel
              </button>
              <button
                onClick={handleDeposit}
                className="flex-2 py-3 rounded-2xl bg-[#49664D] hover:bg-[#3D5540] text-white text-xs font-semibold shadow-xs flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Confirm Contribution</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Dream Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div
            onClick={() => setIsAddModalOpen(false)}
            className="fixed inset-0 bg-[#2C382E]/30 backdrop-blur-xs"
          />
          <div className="relative w-full max-w-xl bg-white rounded-3xl border border-[#E9E1D1] shadow-2xl p-6 z-10 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#E9E1D1]">
              <div>
                <h3 className="font-editorial text-xl font-bold text-[#2C382E]">
                  Add a Financial Dream
                </h3>
                <p className="text-xs text-[#657365]">
                  Give your savings an inspiring visual destination.
                </p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-xl text-[#657365] hover:bg-[#FAF7F0]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDream} className="space-y-4">
              {formError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                  {formError}
                </div>
              )}

              {/* Title & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#657365] mb-1">
                    Dream Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. M3 MacBook for Projects"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F0] border border-[#E9E1D1] text-xs font-medium text-[#2C382E] focus:outline-none focus:ring-2 focus:ring-[#49664D]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#657365] mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as DreamCategory)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F0] border border-[#E9E1D1] text-xs font-medium text-[#2C382E] focus:outline-none focus:ring-2 focus:ring-[#49664D]"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Photo Picker */}
              <div>
                <label className="block text-xs font-semibold text-[#657365] mb-1.5">
                  Select Visual Inspiration
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {CURATED_IMAGES.map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setImageUrl(img.url)}
                      className={`relative rounded-xl overflow-hidden h-16 border-2 transition-all ${
                        imageUrl === img.url
                          ? 'border-[#49664D] scale-102 shadow-xs'
                          : 'border-transparent opacity-75 hover:opacity-100'
                      }`}
                    >
                      <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                      {imageUrl === img.url && (
                        <div className="absolute inset-0 bg-[#49664D]/30 flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Amounts & Target Date */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#657365] mb-1">
                    Target Amount (₹)
                  </label>
                  <input
                    type="number"
                    value={targetRupees}
                    onChange={(e) => setTargetRupees(e.target.value)}
                    placeholder="20000"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F0] border border-[#E9E1D1] text-xs font-bold font-mono text-[#2C382E] focus:outline-none focus:ring-2 focus:ring-[#49664D]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#657365] mb-1">
                    Already Saved (₹)
                  </label>
                  <input
                    type="number"
                    value={savedRupees}
                    onChange={(e) => setSavedRupees(e.target.value)}
                    placeholder="0"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F0] border border-[#E9E1D1] text-xs font-mono text-[#2C382E] focus:outline-none focus:ring-2 focus:ring-[#49664D]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#657365] mb-1">
                    Target Date
                  </label>
                  <input
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F0] border border-[#E9E1D1] text-xs font-medium text-[#2C382E] focus:outline-none focus:ring-2 focus:ring-[#49664D]"
                  />
                </div>
              </div>

              {/* Personal Motivation & Priority */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#657365] mb-1">
                    Personal Motivation Note
                  </label>
                  <input
                    type="text"
                    value={personalMotivation}
                    onChange={(e) => setPersonalMotivation(e.target.value)}
                    placeholder="Why does this matter to you? e.g. Freelance independence"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F0] border border-[#E9E1D1] text-xs text-[#2C382E] focus:outline-none focus:ring-2 focus:ring-[#49664D]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#657365] mb-1">
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as DreamPriority)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F0] border border-[#E9E1D1] text-xs font-medium text-[#2C382E] focus:outline-none focus:ring-2 focus:ring-[#49664D]"
                  >
                    <option value="now">Important now</option>
                    <option value="working">Working toward it</option>
                    <option value="someday">Someday</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-3 rounded-2xl bg-[#FAF7F0] text-xs font-semibold text-[#657365]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-2 py-3 rounded-2xl bg-[#49664D] hover:bg-[#3D5540] text-white text-xs font-semibold shadow-xs flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Pin to Vision Board</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Year-End Reflection Modal */}
      {isReflectionOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div
            onClick={() => setIsReflectionOpen(false)}
            className="fixed inset-0 bg-[#2C382E]/30 backdrop-blur-xs"
          />
          <div className="relative w-full max-w-lg bg-white rounded-3xl border border-[#E9E1D1] shadow-2xl p-6 z-10 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#E9E1D1]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#B8CBB3]/40 text-[#49664D] flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-editorial text-lg font-bold text-[#2C382E]">
                    Your Financial Growth Journey
                  </h3>
                  <p className="text-xs text-[#657365]">Reflecting with gratitude and calm</p>
                </div>
              </div>
              <button
                onClick={() => setIsReflectionOpen(false)}
                className="p-1 rounded-xl text-[#657365] hover:bg-[#FAF7F0]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#FAF7F0] border border-[#E9E1D1] text-xs space-y-2">
                <span className="font-semibold text-sm text-[#2C382E] block">
                  You saved {formatPaise(totalSavedAllDreams)} toward your dreams!
                </span>
                <p className="text-[#657365] leading-relaxed">
                  Money isn&apos;t just about restriction. It&apos;s about creating freedom, stability,
                  and peace for the things you cherish.
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-semibold text-[#2C382E] block">
                  Celebrated Moments:
                </span>
                <div className="space-y-1.5">
                  {dreams.map((d) => (
                    <div
                      key={d.id}
                      className="p-2.5 rounded-xl bg-[#F7F5EC] border border-[#E9E1D1] flex items-center justify-between text-xs"
                    >
                      <span className="font-medium text-[#2C382E]">{d.title}</span>
                      <span className="font-mono text-[#49664D] font-bold">
                        {Math.floor((d.savedPaise / d.targetPaise) * 100)}% achieved
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsReflectionOpen(false)}
              className="w-full py-2.5 rounded-xl bg-[#49664D] text-white text-xs font-semibold"
            >
              Continue My Journey
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
