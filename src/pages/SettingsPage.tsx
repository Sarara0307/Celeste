/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { formatPaise, rupeesToPaise } from '../utils/formatters';
import { StorageService } from '../services/storageService';
import {
  Sliders,
  Shield,
  Download,
  RotateCcw,
  Sparkles,
  Lock,
  AlertCircle,
  CheckCircle2,
  FileCode,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { settings, updateSettings, updateMonthlyIncome, resetToDemo, loadHackathonScenario, showToast } =
    useFinance();

  const [userName, setUserName] = useState(settings.userName);
  const [incomeRupees, setIncomeRupees] = useState(
    (settings.monthlyIncomePaise / 100).toString()
  );
  const [nextIncomeDate, setNextIncomeDate] = useState(settings.nextIncomeDate);
  const [reserveRupees, setReserveRupees] = useState(
    (settings.emergencyReservePaise / 100).toString()
  );

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedIncome = parseFloat(incomeRupees);
    if (!isNaN(parsedIncome) && parsedIncome > 0) {
      updateMonthlyIncome(rupeesToPaise(parsedIncome), true);
    }
    updateSettings({
      userName: userName.trim(),
      nextIncomeDate,
      emergencyReservePaise: rupeesToPaise(parseFloat(reserveRupees) || 1000),
    });
  };

  const handleDownloadBackup = () => {
    const backupJson = StorageService.exportFullBackup();
    const blob = new Blob([backupJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `SaveSense_Backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Downloaded complete JSON backup');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Settings & Privacy Control
          </h1>
          <p className="text-xs text-slate-400">
            Configure financial cycle variables, backup local data, or load test presets.
          </p>
        </div>
      </div>

      {/* User Preferences Form */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
        <h2 className="text-sm font-bold text-white">Budget Profile & Parameters</h2>

        <form onSubmit={handleSaveSettings} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Display Name
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Baseline Monthly Income (₹ INR)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-slate-400 text-xs font-bold">₹</span>
                <input
                  type="number"
                  value={incomeRupees}
                  onChange={(e) => setIncomeRupees(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-7 pr-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Next Expected Income Date
              </label>
              <input
                type="date"
                value={nextIncomeDate}
                onChange={(e) => setNextIncomeDate(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Emergency Reserve Buffer (₹ INR)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-slate-400 text-xs font-bold">₹</span>
                <input
                  type="number"
                  value={reserveRupees}
                  onChange={(e) => setReserveRupees(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-7 pr-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors shadow-sm"
            >
              Save Parameters
            </button>
          </div>
        </form>
      </div>

      {/* Data Management & Presets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <h2 className="text-sm font-bold text-white">Sample Data & Reset</h2>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Quickly switch between clean baseline states or load sample student budget data.
          </p>

          <div className="space-y-2.5 pt-1">
            <button
              onClick={loadHackathonScenario}
              className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Load Sample Student Data (₹15,000 Income)</span>
            </button>

            <button
              onClick={resetToDemo}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 text-xs font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset to Default Demo State</span>
            </button>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Download className="w-5 h-5 text-teal-400" />
            <h2 className="text-sm font-bold text-white">Data Export & Backup</h2>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Download your full ledger, smart jars, and configured budgets as portable JSON backup.
          </p>

          <div className="pt-1">
            <button
              onClick={handleDownloadBackup}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/60 text-xs font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <FileCode className="w-4 h-4" />
              <span>Export Full JSON Backup</span>
            </button>
          </div>
        </div>
      </div>

      {/* Privacy, Security & Disclaimers Accordion */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2.5">
          <Shield className="w-5 h-5 text-emerald-400" />
          <h2 className="text-base font-bold text-white">Privacy, Security & Ethical Boundaries</h2>
        </div>

        <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1.5">
            <span className="font-semibold text-white block">
              1. Pure Budgeting & Planning Tool
            </span>
            <p className="text-slate-400">
              SaveSense AI is an intelligent financial planning and decision-support application. It does not move real funds, execute transfers, or connect to banking institutions unless an authentic, certified bank API integration is configured.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1.5">
            <span className="font-semibold text-white block">
              2. Zero Bank Credentials Requested
            </span>
            <p className="text-slate-400">
              The application never asks for, records, or stores bank login passwords, UPI PINs, credit card CVVs, or account credentials. All transactions are simulated and maintained client-side in your private browser sandbox.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1.5">
            <span className="font-semibold text-white block">
              3. No Financial Guarantees
            </span>
            <p className="text-slate-400">
              All projections, Safe-to-Spend allowances, and goal completion estimates are mathematical approximations based on user-provided inputs and assumptions. They do not constitute certified financial or investment advice.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
