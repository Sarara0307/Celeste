/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { formatPaise, rupeesToPaise } from '../utils/formatters';
import { StorageService } from '../services/storageService';
import { YoungAdultPersona } from '../types/finance';
import {
  User,
  ShieldCheck,
  RefreshCw,
  Download,
  Calendar,
  Sparkles,
  Heart,
  CheckCircle,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';

const PERSONAS: Array<{
  id: YoungAdultPersona;
  title: string;
  emoji: string;
  description: string;
}> = [
  {
    id: 'student',
    title: 'Student',
    emoji: '🎒',
    description: 'Managing pocket money, mess fees, campus life, and saving for first gear.',
  },
  {
    id: 'first_job',
    title: 'First Job',
    emoji: '🌱',
    description: 'First salary, learning to pay utility bills, building a safety cushion.',
  },
  {
    id: 'freelancer',
    title: 'Freelancer',
    emoji: '💻',
    description: 'Variable income, irregular payment dates, tech upgrades, tax buffer.',
  },
  {
    id: 'young_professional',
    title: 'Young Professional',
    emoji: '💼',
    description: 'Career growth, lifestyle balance, saving for apartment deposit and travel.',
  },
  {
    id: 'explorer',
    title: 'Explorer',
    emoji: '✈️',
    description: 'Mindful minimalism, prioritizing adventures, remote work, low fixed costs.',
  },
];

export const ProfilePage: React.FC = () => {
  const {
    settings,
    updateSettings,
    updateMonthlyIncome,
    startFreshMonth,
    resetToDemo,
    showToast,
  } = useFinance();

  const [name, setName] = useState(settings.userName);
  const [incomeRupees, setIncomeRupees] = useState(
    (settings.monthlyIncomePaise / 100).toString()
  );
  const [nextPayDate, setNextPayDate] = useState(settings.nextIncomeDate);
  const [reserveRupees, setReserveRupees] = useState(
    (settings.emergencyReservePaise / 100).toString()
  );
  const [selectedPersona, setSelectedPersona] = useState<YoungAdultPersona>(
    settings.persona || 'first_job'
  );

  const [isFreshStartOpen, setIsFreshStartOpen] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedIncome = parseFloat(incomeRupees);
    const parsedReserve = parseFloat(reserveRupees);

    if (parsedIncome > 0) {
      updateMonthlyIncome(rupeesToPaise(parsedIncome), true);
    }

    updateSettings({
      userName: name.trim() || 'Young Saver',
      nextIncomeDate: nextPayDate,
      emergencyReservePaise:
        !isNaN(parsedReserve) && parsedReserve >= 0 ? rupeesToPaise(parsedReserve) : 200000,
      persona: selectedPersona,
    });

    showToast('Profile & Budget preferences saved!');
  };

  const handleExportBackup = () => {
    const backupJson = StorageService.exportFullBackup();
    const blob = new Blob([backupJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SaveSense_Backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Exported backup successfully!');
  };

  const handleExecuteFreshStart = () => {
    startFreshMonth({ clearExpenses: true });
    setIsFreshStartOpen(false);
  };

  return (
    <div className="space-y-8 pb-16 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E9E1D1] text-xs text-[#49664D] mb-2 font-medium">
          <User className="w-3.5 h-3.5" />
          <span>Personalization & Settings</span>
        </div>
        <h1 className="font-editorial text-3xl font-bold text-[#2C382E]">
          Profile & Preferences
        </h1>
        <p className="text-xs text-[#657365] mt-1">
          SaveSense adapts to your lifestyle stage and pacing.
        </p>
      </div>

      {/* Persona Selection */}
      <div className="warm-card rounded-3xl p-6 sm:p-7 space-y-4">
        <div>
          <h2 className="font-editorial text-xl font-bold text-[#2C382E]">
            Your Life Stage & Persona
          </h2>
          <p className="text-xs text-[#657365]">
            Tailors coaching suggestions and dashboard milestones.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {PERSONAS.map((p) => {
            const isSelected = selectedPersona === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelectedPersona(p.id)}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? 'bg-[#F1F5F0] border-[#49664D] shadow-xs'
                    : 'bg-[#FAF7F0] hover:bg-[#F2ECE1] border-[#E9E1D1]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{p.emoji}</span>
                  {isSelected && <CheckCircle className="w-4 h-4 text-[#49664D]" />}
                </div>
                <h3 className="font-bold text-xs text-[#2C382E]">{p.title}</h3>
                <p className="text-[11px] text-[#657365] mt-1 line-clamp-2 leading-tight">
                  {p.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Income & Core Preferences Form */}
      <form onSubmit={handleSaveSettings} className="warm-card rounded-3xl p-6 sm:p-7 space-y-5">
        <div>
          <h2 className="font-editorial text-xl font-bold text-[#2C382E]">
            Financial Cadence & Income
          </h2>
          <p className="text-xs text-[#657365]">
            Update your salary, deposit schedule, and safety cushion anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#657365] mb-1">
              Your Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F0] border border-[#E9E1D1] text-xs font-medium text-[#2C382E] focus:outline-none focus:ring-2 focus:ring-[#49664D]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#657365] mb-1">
              Monthly Expected Income (₹)
            </label>
            <input
              type="number"
              value={incomeRupees}
              onChange={(e) => setIncomeRupees(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F0] border border-[#E9E1D1] text-xs font-bold font-mono text-[#2C382E] focus:outline-none focus:ring-2 focus:ring-[#49664D]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#657365] mb-1">
              Next Payday / Deposit Date
            </label>
            <input
              type="date"
              value={nextPayDate}
              onChange={(e) => setNextPayDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F0] border border-[#E9E1D1] text-xs font-medium text-[#2C382E] focus:outline-none focus:ring-2 focus:ring-[#49664D]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#657365] mb-1">
              Emergency Cushion Reserved (₹)
            </label>
            <input
              type="number"
              value={reserveRupees}
              onChange={(e) => setReserveRupees(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F0] border border-[#E9E1D1] text-xs font-mono text-[#2C382E] focus:outline-none focus:ring-2 focus:ring-[#49664D]"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-2xl bg-[#49664D] hover:bg-[#3D5540] text-white text-xs font-semibold shadow-xs transition-colors"
          >
            Save Preferences
          </button>
        </div>
      </form>

      {/* Fresh Start Monthly Wizard */}
      <div className="warm-card rounded-3xl p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-br from-[#FAF7F0] to-white">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#B8CBB3]/40 text-[#49664D] flex items-center justify-center shrink-0">
            <RefreshCw className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-editorial text-lg font-bold text-[#2C382E]">
              Monthly Fresh Start
            </h3>
            <p className="text-xs text-[#657365] leading-relaxed">
              New month starting? Reset your monthly expense ledger and recalibrate your safe-to-spend
              pace while keeping all your vision dreams and milestones intact.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsFreshStartOpen(true)}
          className="px-4 py-2.5 rounded-2xl bg-white hover:bg-[#F2ECE1] border border-[#E9E1D1] text-xs font-semibold text-[#49664D] shrink-0 transition-colors"
        >
          Begin Fresh Start
        </button>
      </div>

      {/* Data Management & Backup */}
      <div className="warm-card rounded-3xl p-6 sm:p-7 space-y-4">
        <div>
          <h2 className="font-editorial text-xl font-bold text-[#2C382E]">
            Data Ownership & Privacy
          </h2>
          <p className="text-xs text-[#657365]">
            SaveSense stores all data locally in your browser. No external tracking, no bank account
            scraping.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={handleExportBackup}
            className="px-4 py-2.5 rounded-2xl bg-[#FAF7F0] hover:bg-[#E9E1D1] border border-[#E9E1D1] text-xs font-semibold text-[#2C382E] flex items-center gap-2 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Full JSON Backup</span>
          </button>

          <button
            onClick={resetToDemo}
            className="px-4 py-2.5 rounded-2xl bg-white hover:bg-rose-50 border border-[#E9E1D1] text-xs font-semibold text-rose-700 transition-colors"
          >
            Reset to Sample Demo Data
          </button>
        </div>
      </div>

      {/* Fresh Start Confirmation Dialog */}
      {isFreshStartOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div
            onClick={() => setIsFreshStartOpen(false)}
            className="fixed inset-0 bg-[#2C382E]/30 backdrop-blur-xs"
          />
          <div className="relative w-full max-w-md bg-white rounded-3xl border border-[#E9E1D1] shadow-2xl p-6 z-10 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="font-editorial text-xl font-bold text-[#2C382E]">
              Confirm Monthly Fresh Start?
            </h3>
            <p className="text-xs text-[#657365] leading-relaxed">
              This will start a clean cycle for the new month with your deposit of{' '}
              <strong>{formatPaise(settings.monthlyIncomePaise)}</strong>.
              All your Vision Board dreams and milestone history will be safely preserved!
            </p>

            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsFreshStartOpen(false)}
                className="flex-1 py-3 rounded-2xl bg-[#FAF7F0] text-xs font-semibold text-[#657365]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteFreshStart}
                className="flex-2 py-3 rounded-2xl bg-[#49664D] hover:bg-[#3D5540] text-white text-xs font-semibold shadow-xs"
              >
                Yes, Start Fresh Month
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
