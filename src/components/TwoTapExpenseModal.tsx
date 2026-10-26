/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { rupeesToPaise } from '../utils/formatters';
import { ExpenseCategory } from '../types/finance';
import {
  X,
  Utensils,
  Home,
  Zap,
  Bus,
  BookOpen,
  ShoppingBag,
  Film,
  Sparkles,
  HelpCircle,
  Tag,
  Check,
} from 'lucide-react';

interface TwoTapExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES: Array<{
  name: ExpenseCategory;
  icon: any;
  isEssential: boolean;
}> = [
  { name: 'Food & Groceries', icon: Utensils, isEssential: true },
  { name: 'Transport', icon: Bus, isEssential: true },
  { name: 'Education & Books', icon: BookOpen, isEssential: true },
  { name: 'Housing & Rent', icon: Home, isEssential: true },
  { name: 'Utilities', icon: Zap, isEssential: true },
  { name: 'Shopping & Gadgets', icon: ShoppingBag, isEssential: false },
  { name: 'Entertainment', icon: Film, isEssential: false },
  { name: 'Subscriptions', icon: Sparkles, isEssential: false },
  { name: 'Personal Care', icon: Sparkles, isEssential: false },
  { name: 'Other', icon: HelpCircle, isEssential: false },
];

const PRESETS = [50, 120, 250, 500, 1000];

const POPULAR_TAGS = ['Chai & Snacks', 'Campus Mess', 'Metro / Auto', 'Books', 'Groceries', 'Coffee'];

export const TwoTapExpenseModal: React.FC<TwoTapExpenseModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { addTransaction } = useFinance();
  const [amountStr, setAmountStr] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ExpenseCategory>('Food & Groceries');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    const parsedAmount = parseFloat(amountStr);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Please enter a valid expense amount.');
      return;
    }

    const catObj = CATEGORIES.find((c) => c.name === selectedCategory);
    const isEssential = catObj ? catObj.isEssential : false;

    addTransaction({
      date: new Date().toISOString().split('T')[0],
      description: description.trim() || `${selectedCategory} expense`,
      amountPaise: rupeesToPaise(parsedAmount),
      type: isEssential ? 'essential_expense' : 'discretionary_expense',
      category: selectedCategory,
      notes: 'Logged via two-tap quick logger',
    });

    setAmountStr('');
    setDescription('');
    setError('');
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

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-[#FFFFFF] rounded-3xl border border-[#E9E1D1] shadow-xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4.5 bg-[#FAF7F0] border-b border-[#E9E1D1] flex items-center justify-between">
          <div>
            <h3 className="font-editorial text-lg font-bold text-[#2C382E]">
              Quick Expense Log
            </h3>
            <p className="text-xs text-[#657365]">
              Two taps to keep your safe-to-spend balance accurate.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#657365] hover:bg-[#E9E1D1] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
              {error}
            </div>
          )}

          {/* Amount Input */}
          <div>
            <label className="block text-xs font-semibold text-[#657365] mb-1.5">
              How much did you spend?
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-2xl font-bold text-[#2C382E]">
                ₹
              </span>
              <input
                type="number"
                inputMode="decimal"
                autoFocus
                value={amountStr}
                onChange={(e) => {
                  setAmountStr(e.target.value);
                  setError('');
                }}
                placeholder="0"
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#FAF7F0] border border-[#E9E1D1] text-2xl font-bold font-mono text-[#2C382E] focus:outline-none focus:ring-2 focus:ring-[#49664D] focus:bg-white placeholder-[#657365]/30 transition-all"
              />
            </div>

            {/* Amount Presets */}
            <div className="flex items-center gap-1.5 mt-2 overflow-x-auto pb-1">
              {PRESETS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setAmountStr(p.toString())}
                  className="px-2.5 py-1 rounded-lg bg-[#FAF7F0] hover:bg-[#E9E1D1] border border-[#E9E1D1] text-xs font-mono font-medium text-[#2C382E] transition-colors"
                >
                  +₹{p}
                </button>
              ))}
            </div>
          </div>

          {/* Category Tap Selector (Tap 2) */}
          <div>
            <label className="block text-xs font-semibold text-[#657365] mb-2">
              Select Category
            </label>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isSelected = selectedCategory === cat.name;
                return (
                  <button
                    key={cat.name}
                    type="button"
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-left text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-[#49664D] text-white border-[#49664D] shadow-xs'
                        : 'bg-[#FAF7F0] hover:bg-[#F2ECE1] text-[#2C382E] border-[#E9E1D1]'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Optional Quick Tags */}
          <div>
            <label className="block text-[11px] font-semibold text-[#657365] mb-1.5">
              Quick description (optional)
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {POPULAR_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setDescription(tag)}
                  className={`text-[11px] px-2.5 py-1 rounded-full border transition-colors ${
                    description === tag
                      ? 'bg-[#B8CBB3] text-[#2C382E] border-[#49664D]'
                      : 'bg-[#FAF7F0] text-[#657365] border-[#E9E1D1] hover:text-[#2C382E]'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Or type a note: e.g. Friday team lunch"
              className="w-full px-3.5 py-2 rounded-xl bg-[#FAF7F0] border border-[#E9E1D1] text-xs text-[#2C382E] focus:outline-none focus:ring-2 focus:ring-[#49664D] placeholder-[#657365]/50"
            />
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
              type="button"
              onClick={handleSave}
              className="flex-2 py-3 rounded-2xl bg-[#49664D] hover:bg-[#3D5540] text-white text-xs font-semibold shadow-sm shadow-[#49664D]/20 transition-all flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Record Expense</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
