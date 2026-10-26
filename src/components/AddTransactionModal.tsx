/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { ExpenseCategory, TransactionType } from '../types/finance';
import { formatPaise, getTodayDateString, rupeesToPaise } from '../utils/formatters';
import { X, Check } from 'lucide-react';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES: ExpenseCategory[] = [
  'Food & Groceries',
  'Housing & Rent',
  'Utilities',
  'Transport',
  'Education & Books',
  'Shopping & Gadgets',
  'Entertainment',
  'Subscriptions',
  'Healthcare',
  'Personal Care',
  'Investments & Savings',
  'Other',
];

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { addTransaction, jars, bills } = useFinance();

  const [description, setDescription] = useState('');
  const [rupees, setRupees] = useState('');
  const [type, setType] = useState<TransactionType>('essential_expense');
  const [category, setCategory] = useState<ExpenseCategory>('Food & Groceries');
  const [date, setDate] = useState(getTodayDateString());
  const [jarId, setJarId] = useState('');
  const [billId, setBillId] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedRupees = parseFloat(rupees);
    if (isNaN(parsedRupees) || parsedRupees <= 0) {
      setError('Please enter a valid amount greater than 0.');
      return;
    }
    if (!description.trim()) {
      setError('Please enter a description for the transaction.');
      return;
    }

    const amountPaise = rupeesToPaise(parsedRupees);

    addTransaction({
      description: description.trim(),
      amountPaise,
      type,
      category,
      date,
      jarId: type === 'savings_deposit' || type === 'savings_withdrawal' ? jarId || undefined : undefined,
      billId: type === 'bill_payment' ? billId || undefined : undefined,
      notes: notes.trim() || undefined,
    });

    // Reset and close
    setDescription('');
    setRupees('');
    setNotes('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/60">
          <div>
            <h2 className="text-lg font-bold text-white">Record Transaction</h2>
            <p className="text-xs text-slate-400">Keep your Safe-to-Spend accurate and updated</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-rose-950/50 border border-rose-800/80 text-rose-300 text-xs">
              {error}
            </div>
          )}

          {/* Type selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Transaction Classification
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-xs">
              {[
                { id: 'essential_expense', label: 'Essential Expense', color: 'border-amber-500/50' },
                { id: 'discretionary_expense', label: 'Discretionary', color: 'border-purple-500/50' },
                { id: 'income', label: 'Income', color: 'border-emerald-500/50' },
                { id: 'bill_payment', label: 'Bill Payment', color: 'border-blue-500/50' },
                { id: 'savings_deposit', label: 'Jar Deposit', color: 'border-teal-500/50' },
                { id: 'savings_withdrawal', label: 'Jar Withdrawal', color: 'border-cyan-500/50' },
              ].map((t) => (
                <button
                  type="button"
                  key={t.id}
                  onClick={() => {
                    setType(t.id as TransactionType);
                    if (t.id === 'savings_deposit' || t.id === 'savings_withdrawal') {
                      setCategory('Investments & Savings');
                    } else if (t.id === 'income') {
                      setCategory('Other');
                    }
                  }}
                  className={`py-2 px-2.5 rounded-lg border text-center transition-all ${
                    type === t.id
                      ? 'bg-indigo-600 text-white font-semibold border-indigo-500 shadow-sm'
                      : 'bg-slate-800/60 text-slate-300 border-slate-700/60 hover:bg-slate-800'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Amount in Rupees & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Amount (₹ INR)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400 font-bold">₹</span>
                <input
                  type="number"
                  step="any"
                  min="0"
                  placeholder="0.00"
                  value={rupees}
                  onChange={(e) => setRupees(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-8 pr-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Description / Payee
            </label>
            <input
              type="text"
              placeholder="e.g. Grocery store, Metro recharge, Stipend"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Conditional Jar link */}
          {(type === 'savings_deposit' || type === 'savings_withdrawal') && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Target Savings Jar
              </label>
              <select
                value={jarId}
                onChange={(e) => setJarId(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="">Select a Jar...</option>
                {jars.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.name} (Saved: {formatPaise(j.savedPaise)} / {formatPaise(j.targetPaise)})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Conditional Bill link */}
          {type === 'bill_payment' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Linked Scheduled Bill (Optional)
              </label>
              <select
                value={billId}
                onChange={(e) => setBillId(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="">None / Standalone Bill</option>
                {bills.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({formatPaise(b.amountPaise)} - Due: {b.dueDate})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Notes (Optional)
            </label>
            <input
              type="text"
              placeholder="Additional tags or context..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Check className="w-4 h-4" />
              Save Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
