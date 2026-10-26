/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useFinance } from '../context/FinanceContext';
import {
  Trophy,
  Flame,
  CheckCircle2,
  Sparkles,
  Scissors,
  PiggyBank,
  Target,
  Award,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ChallengesPage: React.FC = () => {
  const { challenges, toggleChallengeStreak } = useFinance();

  const handleStep = (id: string) => {
    toggleChallengeStreak(id);
    const chal = challenges.find((c) => c.id === id);
    if (chal && chal.currentStreak + 1 >= chal.targetDays) {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
      });
    }
  };

  const completedCount = challenges.filter((c) => c.isCompleted).length;
  const totalXp = challenges
    .filter((c) => c.isCompleted)
    .reduce((sum, c) => sum + c.xpReward, 0);

  const getChallengeIcon = (iconName: string) => {
    switch (iconName) {
      case 'Flame':
        return Flame;
      case 'Scissors':
        return Scissors;
      case 'PiggyBank':
        return PiggyBank;
      case 'Target':
        return Target;
      default:
        return Trophy;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Savings Challenge Center
          </h1>
          <p className="text-xs text-slate-400">
            Build sustainable, shame-free money habits. Small weekly consistency compounds into lifelong confidence.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-mono font-bold flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>{totalXp} Habit XP</span>
          </div>
          <div className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-mono font-bold flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-emerald-400" />
            <span>{completedCount} / {challenges.length} Badges</span>
          </div>
        </div>
      </div>

      {/* Challenges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {challenges.map((chal) => {
          const Icon = getChallengeIcon(chal.icon);
          const percent = Math.min(
            100,
            Math.round((chal.currentStreak / chal.targetDays) * 100)
          );

          return (
            <div
              key={chal.id}
              className={`p-6 rounded-2xl border transition-all relative overflow-hidden flex flex-col justify-between space-y-4 shadow-lg ${
                chal.isCompleted
                  ? 'bg-slate-900/90 border-emerald-500/40'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        chal.isCompleted
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-white tracking-tight">
                        {chal.title}
                      </h2>
                      <span className="text-[10px] font-mono text-slate-400 block uppercase">
                        Badge: {chal.badgeName} • +{chal.xpReward} XP
                      </span>
                    </div>
                  </div>

                  {chal.isCompleted && (
                    <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      COMPLETED
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {chal.description}
                </p>

                {/* Progress */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">
                      Progress Streak: {chal.currentStreak} / {chal.targetDays} checkpoints
                    </span>
                    <span className="font-mono font-semibold text-white">{percent}%</span>
                  </div>

                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        chal.isCompleted
                          ? 'bg-emerald-500'
                          : 'bg-gradient-to-r from-indigo-500 to-teal-400'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 text-[11px] text-slate-400">
                  <span className="font-semibold text-slate-300 block mb-0.5">Rule:</span>
                  {chal.rules}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[10px] text-slate-500">
                  {chal.isCompleted
                    ? `Earned badge: ${chal.badgeName} 🏅`
                    : 'Log your progress to advance streak'}
                </span>

                <button
                  onClick={() => handleStep(chal.id)}
                  disabled={chal.isCompleted}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm ${
                    chal.isCompleted
                      ? 'bg-slate-800 text-slate-500 cursor-default'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white active:scale-95'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{chal.isCompleted ? 'Badge Earned' : 'Check-in Today'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
