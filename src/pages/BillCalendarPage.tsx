/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Bill, BillFrequency, ExpenseCategory } from '../types/finance';
import { formatDate, formatPaise, getTodayDateString, rupeesToPaise } from '../utils/formatters';
import {
  CalendarCheck2,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  Shield,
  Clock,
  X,
} from 'lucide-react';

export const BillCalendarPage: React.FC = () => {
  const { bills, addBill, deleteBill, toggleBillPaid, summary } = useFinance();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [name, setName] = useState('');
  const [amountRupees, setAmountRupees] = useState('');
  const [dueDate, setDueDate] = useState(getTodayDateString());
  const [frequency, setFrequency] = useState<BillFrequency>('monthly');
  const [category, setCategory] = useState<ExpenseCategory>('Utilities');
  const [priority, setPriority] = useState<'essential' | 'discretionary'>('essential');
  const [autoDeduct, setAutoDeduct] = useState(true);

  const unpaidBills = bills.filter((b) => !b.isPaid);
  const paidBills = bills.filter((b) => b.isPaid);

  const handleAddBill = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(amountRupees);
    if (!name.trim() || isNaN(parsed) || parsed <= 0) return;

    addBill({
      name: name.trim(),
      amountPaise: rupeesToPaise(parsed),
      dueDate,
      frequency,
      isPaid: false,
      category,
      priority,
      autoDeductFromSpendable: autoDeduct,
    });

    setIsAddOpen(false);
    setName('');
    setAmountRupees('');
  };

  return (
    <div className="space-y-7 pb-14">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-amber-400">
              Obligation Registry
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Bill Calendar & Protection
          </h1>
          <p className="text-xs text-slate-400">
            Schedule recurring and one-time obligations. Unpaid essential bills are ring-fenced inside Safe-to-Spend.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/15 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Schedule Bill</span>
        </button>
      </div>

      {/* Bill Threat Warning if unpaid bills > available balance */}
      {summary.unpaidEssentialBillsPaise > summary.currentAvailableBalancePaise && (
        <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-rose-200 flex items-center gap-3 backdrop-blur-md">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
          <p className="text-xs leading-relaxed">
            <strong className="text-white">Cashflow Warning:</strong> Your upcoming essential bills ({formatPaise(summary.unpaidEssentialBillsPaise)}) exceed your current available liquid funds ({formatPaise(summary.currentAvailableBalancePaise)}). Safe-to-Spend is showing a deficit.
          </p>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-6 rounded-3xl bg-[#0a0f1d] border border-white/[0.07] space-y-1 shadow-lg">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Total Unpaid Obligations</span>
          <div className="text-2xl font-black font-mono text-amber-400">
            {formatPaise(summary.unpaidTotalBillsPaise)}
          </div>
          <span className="text-[10px] text-slate-400 font-medium">
            {unpaidBills.length} scheduled bills pending
          </span>
        </div>

        <div className="p-6 rounded-3xl bg-[#0a0f1d] border border-white/[0.07] space-y-1 shadow-lg">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Ring-Fenced Essential Bills</span>
          <div className="text-2xl font-black font-mono text-rose-400">
            {formatPaise(summary.unpaidEssentialBillsPaise)}
          </div>
          <span className="text-[10px] text-slate-400 font-medium">
            Deducted from spendable balance
          </span>
        </div>

        <div className="p-6 rounded-3xl bg-[#0a0f1d] border border-white/[0.07] space-y-1 shadow-lg">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Bills Paid This Period</span>
          <div className="text-2xl font-black font-mono text-emerald-400">
            {paidBills.length} Settled
          </div>
          <span className="text-[10px] text-teal-400 font-medium">
            No double counting in ledger
          </span>
        </div>
      </div>

      {/* Upcoming Unpaid Bills */}
      <div className="bg-[#0a0f1d] border border-white/[0.07] rounded-3xl p-6 sm:p-7 space-y-4 shadow-xl">
        <h2 className="text-sm font-bold text-white tracking-tight">Upcoming Pending Obligations</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {unpaidBills.map((bill) => (
            <div
              key={bill.id}
              className="p-4 rounded-2xl bg-black/30 border border-white/[0.05] flex items-center justify-between gap-4 hover:border-white/[0.12] transition-all"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white text-xs">{bill.name}</span>
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                      bill.priority === 'essential'
                        ? 'bg-rose-500/20 text-rose-300'
                        : 'bg-purple-500/20 text-purple-300'
                    }`}
                  >
                    {bill.priority.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-slate-400">
                  <span>Due {formatDate(bill.dueDate)}</span>
                  <span>•</span>
                  <span className="capitalize">{bill.frequency}</span>
                  <span>•</span>
                  <span>{bill.category}</span>
                </div>
              </div>

              <div className="text-right flex items-center gap-3">
                <span className="text-sm font-bold font-mono text-amber-400">
                  {formatPaise(bill.amountPaise)}
                </span>
                <button
                  onClick={() => toggleBillPaid(bill.id)}
                  title="Mark as Paid"
                  className="px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 text-xs font-semibold flex items-center gap-1 transition-all"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Mark Paid</span>
                </button>
                <button
                  onClick={() => deleteBill(bill.id)}
                  className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}

          {unpaidBills.length === 0 && (
            <div className="col-span-2 py-8 text-center text-xs text-slate-500">
              No upcoming pending bills! All clear.
            </div>
          )}
        </div>
      </div>

      {/* Paid Bills History */}
      {paidBills.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-bold text-white">Paid Obligations History</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paidBills.map((bill) => (
              <div
                key={bill.id}
                className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/60 flex items-center justify-between opacity-80"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="font-medium text-slate-300 text-xs line-through">
                      {bill.name}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 block">
                    Paid • {bill.category}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-400">
                    {formatPaise(bill.amountPaise)}
                  </span>
                  <button
                    onClick={() => toggleBillPaid(bill.id)}
                    className="text-[11px] text-slate-500 hover:text-slate-300 underline"
                  >
                    Undo
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Schedule Bill Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Schedule Upcoming Bill</h3>
              <button
                onClick={() => setIsAddOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddBill} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Bill Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Wi-Fi Broadband, Electricity, Rent"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Amount (₹ INR)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-slate-400 text-xs font-bold">₹</span>
                    <input
                      type="number"
                      step="any"
                      placeholder="0.00"
                      value={amountRupees}
                      onChange={(e) => setAmountRupees(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-7 pr-3 py-1.5 text-xs text-white font-mono"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Frequency</label>
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value as BillFrequency)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="weekly">Weekly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="annual">Annual</option>
                    <option value="one_time">One-time</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="essential">Essential (Ring-fenced)</option>
                    <option value="discretionary">Discretionary</option>
                  </select>
                </div>
              </div>

              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={autoDeduct}
                  onChange={(e) => setAutoDeduct(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-800 text-indigo-600"
                />
                <span>Automatically ring-fence amount from Safe-to-Spend</span>
              </label>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-sm transition-colors"
                >
                  Save Bill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
