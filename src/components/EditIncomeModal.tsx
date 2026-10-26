/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useFinance } from '../context/FinanceContext';
import { formatPaise, rupeesToPaise } from '../utils/formatters';
import { X, Check, ArrowDownLeft, ShieldCheck, Sparkles, Calendar } from 'lucide-react';

interface EditIncomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_AMOUNTS = [15000, 25000, 35000, 50000, 80000];

export const EditIncomeModal: React.FC<EditIncomeModalProps> = ({ isOpen, onClose }) => {
  const { settings, updateMonthlyIncome, updateSettings, summary } = useFinance();

  const [incomeRupees, setIncomeRupees] = useState(
    (settings.monthlyIncomePaise / 100).toString()
  );
  const [nextPayDate, setNextPayDate] = useState(settings.nextIncomeDate);
  const [syncLedger, setSyncLedger] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setIncomeRupees((settings.monthlyIncomePaise / 100).toString());
      setNextPayDate(settings.nextIncomeDate);
      setError('');
    }
  }, [isOpen, settings]);

  if (!isOpen) return null;

  const parsedRupees = parseFloat(incomeRupees);
  const newIncomePaise = !isNaN(parsedRupees) && parsedRupees > 0 ? rupeesToPaise(parsedRupees) : 0;

  // Live preview calculation
  const deltaIncomePaise = newIncomePaise - settings.monthlyIncomePaise;
  const previewSpendablePaise = summary.spendableBalancePaise + (syncLedger ? deltaIncomePaise : 0);
  const previewDailyPaise =
    previewSpendablePaise > 0
      ? Math.floor(previewSpendablePaise / Math.max(1, summary.daysRemainingUntilIncome))
      : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isNaN(parsedRupees) || parsedRupees <= 0) {
      setError('Please enter a valid monthly income greater than 0.');
      return;
    }

    updateMonthlyIncome(newIncomePaise, syncLedger);

    if (nextPayDate && nextPayDate !== settings.nextIncomeDate) {
      updateSettings({ nextIncomeDate: nextPayDate });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#2C382E]/30 backdrop-blur-xs transition-opacity"
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg bg-[#FFFFFF] rounded-3xl border border-[#E9E1D1] shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-5 bg-[#FAF7F0] border-b border-[#E9E1D1] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#B8CBB3]/40 text-[#49664D] flex items-center justify-center">
              <ArrowDownLeft className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-editorial text-lg font-bold text-[#2C382E]">
                Update Monthly Income
              </h3>
              <p className="text-xs text-[#657365]">
                Adjust your salary, pocket money, or freelance earnings anytime.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#657365] hover:bg-[#E9E1D1] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
              {error}
            </div>
          )}

          {/* Amount Input */}
          <div>
            <label className="block text-xs font-semibold text-[#657365] mb-2">
              Monthly Expected Income (₹)
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-2xl font-bold text-[#2C382E]">
                ₹
              </span>
              <input
                type="number"
                inputMode="decimal"
                autoFocus
                value={incomeRupees}
                onChange={(e) => {
                  setIncomeRupees(e.target.value);
                  setError('');
                }}
                placeholder="28000"
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#FAF7F0] border border-[#E9E1D1] text-2xl font-bold font-mono text-[#2C382E] focus:outline-none focus:ring-2 focus:ring-[#49664D] focus:bg-white placeholder-[#657365]/30 transition-all"
              />
            </div>

            {/* Presets */}
            <div className="flex items-center gap-2 mt-2.5 overflow-x-auto pb-1">
              <span className="text-[10px] font-semibold text-[#657365] uppercase">
                Presets:
              </span>
              {PRESET_AMOUNTS.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setIncomeRupees(amt.toString())}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium border transition-colors ${
                    incomeRupees === amt.toString()
                      ? 'bg-[#49664D] text-white border-[#49664D]'
                      : 'bg-[#FAF7F0] text-[#2C382E] border-[#E9E1D1] hover:bg-[#E9E1D1]'
                  }`}
                >
                  ₹{amt.toLocaleString('en-IN')}
                </button>
              ))}
            </div>
          </div>

          {/* Next Payday Date */}
          <div>
            <label className="block text-xs font-semibold text-[#657365] mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#49664D]" />
              <span>Next Expected Payday / Deposit Date</span>
            </label>
            <input
              type="date"
              value={nextPayDate}
              onChange={(e) => setNextPayDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7F0] border border-[#E9E1D1] text-xs font-medium text-[#2C382E] focus:outline-none focus:ring-2 focus:ring-[#49664D]"
            />
            <p className="text-[11px] text-[#657365] mt-1">
              Used to calculate your Payday Bridge and daily safe-to-spend allowance.
            </p>
          </div>

          {/* Ledger Sync Checkbox */}
          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#FAF7F0] border border-[#E9E1D1]">
            <input
              type="checkbox"
              id="syncLedger"
              checked={syncLedger}
              onChange={(e) => setSyncLedger(e.target.checked)}
              className="mt-0.5 rounded border-[#E9E1D1] text-[#49664D] focus:ring-[#49664D]"
            />
            <label htmlFor="syncLedger" className="text-xs text-[#2C382E] cursor-pointer">
              <span className="font-semibold block">Update active ledger deposit</span>
              <span className="text-[#657365] text-[11px] leading-tight block">
                Synchronizes the starting balance in your ledger so your live spendable calculations stay accurate.
              </span>
            </label>
          </div>

          {/* Live Impact Preview */}
          <div className="p-4 rounded-2xl bg-[#F7F5EC] border border-[#E9E1D1] space-y-2">
            <span className="text-[10px] font-bold text-[#657365] uppercase tracking-wider block">
              Budget Impact Preview
            </span>
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <span className="text-[10px] text-[#657365] block">Safe to Spend</span>
                <span className="text-sm font-bold font-mono text-[#2C382E]">
                  {formatPaise(Math.max(0, previewSpendablePaise))}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[#657365] block">Safe Daily Pace</span>
                <span className="text-sm font-bold font-mono text-[#49664D]">
                  {formatPaise(previewDailyPaise)} / day
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-2xl bg-[#FAF7F0] hover:bg-[#E9E1D1] text-[#657365] text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-2 py-3 rounded-2xl bg-[#49664D] hover:bg-[#3D5540] text-white text-xs font-semibold shadow-sm shadow-[#49664D]/20 transition-all flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Update Income</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
