/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { formatPaise, rupeesToPaise } from '../utils/formatters';
import { Sparkles, ArrowRight, Check, X, Shield, Laptop, HeartHandshake } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { settings, updateSettings, loadHackathonScenario, addJar } = useFinance();
  const [step, setStep] = useState(1);
  const [incomeRupees, setIncomeRupees] = useState(
    (settings.monthlyIncomePaise / 100).toString()
  );
  const [nextIncomeDate, setNextIncomeDate] = useState(settings.nextIncomeDate);
  const [reserveRupees, setReserveRupees] = useState(
    (settings.emergencyReservePaise / 100).toString()
  );
  const [goalName, setGoalName] = useState('New Laptop');
  const [goalAmountRupees, setGoalAmountRupees] = useState('12000');
  const [monthlyContributionRupees, setMonthlyContributionRupees] = useState('2000');

  if (!isOpen) return null;

  const handleFinish = () => {
    updateSettings({
      monthlyIncomePaise: rupeesToPaise(parseFloat(incomeRupees) || 15000),
      nextIncomeDate: nextIncomeDate,
      emergencyReservePaise: rupeesToPaise(parseFloat(reserveRupees) || 1000),
      onboardingCompleted: true,
    });

    if (goalName.trim() && parseFloat(goalAmountRupees) > 0) {
      addJar({
        name: goalName.trim(),
        category: 'gadgets',
        targetPaise: rupeesToPaise(parseFloat(goalAmountRupees)),
        savedPaise: 0,
        targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        monthlyContributionTargetPaise: rupeesToPaise(parseFloat(monthlyContributionRupees) || 2000),
        priority: 'high',
        color: '#6366f1',
        iconName: 'Laptop',
        notes: 'Created during onboarding',
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden">
        {/* Banner */}
        <div className="bg-gradient-to-r from-emerald-900/60 via-indigo-900/60 to-slate-900 p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Welcome to SaveSense AI</h2>
              <p className="text-xs text-slate-300">
                “Spend wisely. Save consistently. Live confidently.”
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>


        <div className="p-6">
          {/* Step indicators */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <div
              className={`h-1.5 rounded-full transition-all ${
                step === 1 ? 'w-10 bg-indigo-500' : 'w-4 bg-slate-700'
              }`}
            />
            <div
              className={`h-1.5 rounded-full transition-all ${
                step === 2 ? 'w-10 bg-indigo-500' : 'w-4 bg-slate-700'
              }`}
            />
          </div>

          {step === 1 ? (
            <div className="space-y-4">
              <div className="text-left">
                <h3 className="text-sm font-bold text-white">Step 1: Cashflow Baseline</h3>
                <p className="text-xs text-slate-400">
                  Tell us your predictable monthly income and when the next payment arrives.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Expected Monthly Income (₹ INR)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 font-bold">₹</span>
                  <input
                    type="number"
                    value={incomeRupees}
                    onChange={(e) => setIncomeRupees(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-8 pr-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Hackathon baseline: ₹15,000 (Student stipend or young earner).
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Next Income Date
                  </label>
                  <input
                    type="date"
                    value={nextIncomeDate}
                    onChange={(e) => setNextIncomeDate(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Safety Reserve Buffer (₹)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-400 font-bold">₹</span>
                    <input
                      type="number"
                      value={reserveRupees}
                      onChange={(e) => setReserveRupees(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-8 pr-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  Next: Savings Goal
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-left">
                <h3 className="text-sm font-bold text-white">Step 2: Define a Smart Savings Jar</h3>
                <p className="text-xs text-slate-400">
                  What are you saving for right now? We will protect your monthly allocation.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Goal Name
                </label>
                <input
                  type="text"
                  value={goalName}
                  onChange={(e) => setGoalName(e.target.value)}
                  placeholder="e.g. Engineering Laptop, Emergency Fund"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Target Amount (₹)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-400 font-bold">₹</span>
                    <input
                      type="number"
                      value={goalAmountRupees}
                      onChange={(e) => setGoalAmountRupees(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-8 pr-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 font-mono"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Monthly Planned (₹)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-400 font-bold">₹</span>
                    <input
                      type="number"
                      value={monthlyContributionRupees}
                      onChange={(e) => setMonthlyContributionRupees(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-8 pr-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-800/40 text-xs text-emerald-300 flex items-start gap-2">
                <Shield className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
                <span>
                  Our Safe-to-Spend formula automatically subtracts this planned savings from your
                  daily allowance, ensuring you never accidentally spend it.
                </span>
              </div>

              <div className="pt-4 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 rounded-lg text-slate-400 hover:text-white text-xs"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleFinish}
                  className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
                >
                  <Check className="w-4 h-4" />
                  Launch SaveSense AI
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
