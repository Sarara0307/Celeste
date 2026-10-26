/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { formatPaise, getTodayDateString, rupeesToPaise } from '../utils/formatters';
import { Bill, ExpenseCategory, Transaction } from '../types/finance';
import {
  Wallet,
  ShieldCheck,
  Calendar,
  Plus,
  Search,
  Filter,
  Download,
  CheckCircle,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  X,
  Trash2,
} from 'lucide-react';

interface MyMoneyPageProps {
  onOpenAddModal: () => void;
  onOpenEditIncome: () => void;
}

export const MyMoneyPage: React.FC<MyMoneyPageProps> = ({
  onOpenAddModal,
  onOpenEditIncome,
}) => {
  const {
    summary,
    settings,
    bills,
    addBill,
    toggleBillPaid,
    deleteBill,
    transactions,
    deleteTransaction,
    dreams,
    contributeToDream,
    paydayBridge,
  } = useFinance();

  const [billViewMode, setBillViewMode] = useState<'list' | 'timeline'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [isAddBillOpen, setIsAddBillOpen] = useState(false);
  const [leftoverAllocated, setLeftoverAllocated] = useState(false);

  // New bill state
  const [billName, setBillName] = useState('');
  const [billAmountRupees, setBillAmountRupees] = useState('');
  const [billDueDate, setBillDueDate] = useState(
    new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [billCategory, setBillCategory] = useState<ExpenseCategory>('Utilities');
  const [isEssential, setIsEssential] = useState(true);

  // Filtered transactions
  const filteredTxs = transactions.filter((t) => {
    const matchesSearch =
      t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = filterCategory === 'all' || t.category === filterCategory;
    return matchesSearch && matchesCat;
  });

  const handleAddBill = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(billAmountRupees);
    if (!billName.trim() || isNaN(amt) || amt <= 0) return;

    addBill({
      name: billName.trim(),
      amountPaise: rupeesToPaise(amt),
      dueDate: billDueDate,
      frequency: 'monthly',
      isPaid: false,
      category: billCategory,
      priority: isEssential ? 'essential' : 'discretionary',
      autoDeductFromSpendable: isEssential,
      notes: 'Added via Bill Shield',
    });

    setBillName('');
    setBillAmountRupees('');
    setIsAddBillOpen(false);
  };

  const handleAllocateLeftover = (dreamId: string) => {
    const leftoverPaise = Math.max(0, summary.spendableBalancePaise);
    if (leftoverPaise <= 0) return;
    const transferPaise = Math.min(leftoverPaise, 200000); // Allocate ₹2,000 surplus
    contributeToDream(dreamId, transferPaise, 'Allocated leftover surplus from Leftover Finder');
    setLeftoverAllocated(true);
  };

  const exportCSV = () => {
    const headers = ['Date', 'Description', 'Amount_INR', 'Category', 'Type'];
    const rows = transactions.map((t) => [
      t.date,
      `"${t.description.replace(/"/g, '""')}"`,
      (t.amountPaise / 100).toFixed(2),
      `"${t.category}"`,
      t.type,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SaveSense_Ledger_${getTodayDateString()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E9E1D1] text-xs text-[#49664D] mb-2 font-medium">
            <Wallet className="w-3.5 h-3.5" />
            <span>Operational Cashflow & Shield</span>
          </div>
          <h1 className="font-editorial text-3xl font-bold text-[#2C382E]">
            My Money & Bills
          </h1>
          <p className="text-xs text-[#657365] mt-1">
            Keep upcoming obligations protected and track where your day-to-day money flows.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenEditIncome}
            className="px-4 py-2.5 rounded-2xl bg-white hover:bg-[#FAF7F0] border border-[#E9E1D1] text-xs font-semibold text-[#2C382E] transition-colors"
          >
            Income: {formatPaise(settings.monthlyIncomePaise)}
          </button>
          <button
            onClick={onOpenAddModal}
            className="px-4 py-2.5 rounded-2xl bg-[#49664D] hover:bg-[#3D5540] text-white text-xs font-semibold transition-all shadow-xs flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Two-Tap Log</span>
          </button>
        </div>
      </div>

      {/* Payday Bridge Detail Card */}
      <div className="warm-card rounded-3xl p-6 sm:p-7 bg-gradient-to-br from-white to-[#FAF7F0]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#49664D] block mb-1">
              Payday Bridge Calculator
            </span>
            <h2 className="font-editorial text-2xl font-bold text-[#2C382E] leading-snug">
              {paydayBridge.friendlyMessage}
            </h2>
            <p className="text-xs text-[#657365] mt-2">
              Next expected deposit arrives on{' '}
              <strong className="text-[#2C382E]">{settings.nextIncomeDate}</strong>.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-[#E9E1D1] shrink-0 text-center sm:text-right">
            <span className="text-[10px] uppercase font-bold text-[#657365] block">
              Safe Daily Allowance
            </span>
            <span className="font-editorial text-2xl sm:text-3xl font-bold text-[#49664D] font-mono">
              {formatPaise(summary.suggestedDailyAllowancePaise)}
            </span>
            <span className="text-[11px] text-[#657365] block mt-0.5">per day for remainder</span>
          </div>
        </div>

        {/* Breakdown chips */}
        <div className="mt-6 pt-4 border-t border-[#E9E1D1] grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-[#F7F5EC] border border-[#E9E1D1]">
            <span className="text-[10px] text-[#657365] block uppercase font-semibold">Total Income</span>
            <span className="font-bold font-mono text-[#2C382E] text-sm">
              {formatPaise(summary.totalIncomePaise)}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-[#F7F5EC] border border-[#E9E1D1]">
            <span className="text-[10px] text-[#657365] block uppercase font-semibold">Expenses Logged</span>
            <span className="font-bold font-mono text-rose-700 text-sm">
              -{formatPaise(summary.totalExpensesPaise)}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-[#F7F5EC] border border-[#E9E1D1]">
            <span className="text-[10px] text-[#657365] block uppercase font-semibold">Unpaid Bills</span>
            <span className="font-bold font-mono text-[#657365] text-sm">
              -{formatPaise(summary.unpaidEssentialBillsPaise)}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-[#F7F5EC] border border-[#E9E1D1]">
            <span className="text-[10px] text-[#657365] block uppercase font-semibold">Dreams Saved</span>
            <span className="font-bold font-mono text-[#49664D] text-sm">
              +{formatPaise(summary.totalSavedInJarsPaise)}
            </span>
          </div>
        </div>
      </div>

      {/* Bill Shield (Ring-Fenced Unpaid Bills) */}
      <div className="warm-card rounded-3xl p-6 sm:p-7">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#B8CBB3]/40 text-[#49664D] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-editorial text-xl font-bold text-[#2C382E]">
                Bill Shield
              </h2>
              <p className="text-xs text-[#657365]">
                Upcoming bills ring-fenced from your spendable funds so you never overdraft.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="p-1 rounded-xl bg-[#FAF7F0] border border-[#E9E1D1] flex text-xs">
              <button
                onClick={() => setBillViewMode('list')}
                className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                  billViewMode === 'list'
                    ? 'bg-white text-[#2C382E] shadow-xs'
                    : 'text-[#657365]'
                }`}
              >
                List View
              </button>
              <button
                onClick={() => setBillViewMode('timeline')}
                className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                  billViewMode === 'timeline'
                    ? 'bg-white text-[#2C382E] shadow-xs'
                    : 'text-[#657365]'
                }`}
              >
                Timeline
              </button>
            </div>
            <button
              onClick={() => setIsAddBillOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-[#49664D] text-white text-xs font-semibold flex items-center gap-1 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Bill</span>
            </button>
          </div>
        </div>

        {/* Bill View */}
        {billViewMode === 'list' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {bills.map((bill) => (
              <div
                key={bill.id}
                className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
                  bill.isPaid
                    ? 'bg-[#FAF7F0]/60 border-[#E9E1D1] opacity-75'
                    : 'bg-[#FAF7F0] border-[#E9E1D1] hover:bg-[#F2ECE1]'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-[#2C382E]">
                      {bill.name}
                    </span>
                    {bill.priority === 'essential' && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">
                        Essential
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-[#657365] flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3 text-[#49664D]" />
                    <span>Due: {bill.dueDate}</span>
                    {bill.isPaid && <span className="text-emerald-700 font-semibold">• Paid</span>}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-bold font-mono text-xs text-[#2C382E]">
                    {formatPaise(bill.amountPaise)}
                  </span>
                  <button
                    onClick={() => toggleBillPaid(bill.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      bill.isPaid
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : 'bg-white hover:bg-[#B8CBB3]/40 text-[#49664D] border border-[#E9E1D1]'
                    }`}
                  >
                    {bill.isPaid ? '✓ Paid' : 'Mark Paid'}
                  </button>
                  <button
                    onClick={() => deleteBill(bill.id)}
                    className="p-1.5 text-[#657365] hover:text-rose-600 transition-colors"
                    title="Delete bill"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Timeline View */
          <div className="space-y-3 py-2">
            {bills
              .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
              .map((bill, idx) => (
                <div key={bill.id} className="flex items-start gap-4">
                  <div className="w-20 text-right shrink-0 pt-1">
                    <span className="text-xs font-semibold text-[#2C382E] block">
                      {bill.dueDate.split('-').slice(1).join('/')}
                    </span>
                    <span className="text-[10px] text-[#657365] uppercase">
                      {bill.isPaid ? 'Cleared' : 'Due'}
                    </span>
                  </div>
                  <div className="relative pt-1">
                    <div
                      className={`w-3.5 h-3.5 rounded-full border-2 border-white ${
                        bill.isPaid ? 'bg-emerald-500' : 'bg-[#49664D]'
                      }`}
                    />
                    {idx < bills.length - 1 && (
                      <div className="w-0.5 h-12 bg-[#E9E1D1] absolute left-1.5 top-5" />
                    )}
                  </div>
                  <div className="flex-1 p-3 rounded-xl bg-[#FAF7F0] border border-[#E9E1D1] flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-xs text-[#2C382E] block">
                        {bill.name}
                      </span>
                      <span className="text-[11px] text-[#657365]">{bill.category}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold font-mono text-xs text-[#2C382E]">
                        {formatPaise(bill.amountPaise)}
                      </span>
                      <button
                        onClick={() => toggleBillPaid(bill.id)}
                        className="text-xs text-[#49664D] font-semibold underline"
                      >
                        {bill.isPaid ? 'Undo' : 'Pay'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Leftover Finder Feature */}
      <div className="warm-card rounded-3xl p-6 bg-gradient-to-br from-[#FAF7F0] via-white to-[#F1F5F0]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#B8CBB3]/40 text-[#49664D] flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-editorial text-lg font-bold text-[#2C382E]">
                Leftover Finder
              </h3>
              <p className="text-xs text-[#657365] leading-relaxed">
                Found unspent funds in your spendable pool? Put them to work instead of letting them
                slip away on unconscious spends.
              </p>
            </div>
          </div>

          {dreams.length > 0 && !leftoverAllocated ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#657365] hidden sm:inline">Boost a dream:</span>
              <button
                onClick={() => handleAllocateLeftover(dreams[0].id)}
                className="px-4 py-2 rounded-xl bg-[#49664D] hover:bg-[#3D5540] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5"
              >
                <span>Save ₹2,000 to {dreams[0].title}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : leftoverAllocated ? (
            <span className="text-xs font-semibold text-[#49664D] bg-white px-3 py-1.5 rounded-xl border border-[#E9E1D1]">
              ✓ Leftover surplus allocated!
            </span>
          ) : null}
        </div>
      </div>

      {/* Transaction Ledger */}
      <div className="warm-card rounded-3xl p-6 sm:p-7">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="font-editorial text-xl font-bold text-[#2C382E]">
              Transaction Ledger
            </h2>
            <p className="text-xs text-[#657365]">
              Full, transparent audit of income, expenses, and savings deposits.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#657365] absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-xl bg-[#FAF7F0] border border-[#E9E1D1] text-xs text-[#2C382E] focus:outline-none focus:ring-2 focus:ring-[#49664D]"
              />
            </div>

            {/* Export CSV */}
            <button
              onClick={exportCSV}
              className="px-3 py-1.5 rounded-xl bg-[#FAF7F0] hover:bg-[#E9E1D1] border border-[#E9E1D1] text-xs font-semibold text-[#2C382E] flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Ledger Items */}
        <div className="divide-y divide-[#E9E1D1] overflow-hidden">
          {filteredTxs.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#657365]">
              No transactions match your search.
            </div>
          ) : (
            filteredTxs.map((tx) => {
              const isIncome = tx.type === 'income';
              const isDeposit = tx.type === 'savings_deposit';
              return (
                <div
                  key={tx.id}
                  className="py-3 flex items-center justify-between hover:bg-[#FAF7F0] px-2 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold ${
                        isIncome
                          ? 'bg-emerald-100 text-emerald-800'
                          : isDeposit
                          ? 'bg-[#B8CBB3]/40 text-[#49664D]'
                          : 'bg-[#FAF7F0] text-[#657365] border border-[#E9E1D1]'
                      }`}
                    >
                      {isIncome ? '+' : isDeposit ? '★' : '−'}
                    </div>
                    <div>
                      <span className="font-semibold text-xs text-[#2C382E] block">
                        {tx.description}
                      </span>
                      <span className="text-[11px] text-[#657365] flex items-center gap-1.5 mt-0.5">
                        <span>{tx.date}</span>
                        <span>•</span>
                        <span>{tx.category}</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`font-mono font-bold text-xs ${
                        isIncome
                          ? 'text-emerald-700'
                          : isDeposit
                          ? 'text-[#49664D]'
                          : 'text-[#2C382E]'
                      }`}
                    >
                      {isIncome ? '+' : isDeposit ? '★' : '−'}
                      {formatPaise(tx.amountPaise)}
                    </span>
                    <button
                      onClick={() => deleteTransaction(tx.id)}
                      className="text-[#657365] hover:text-rose-600 p-1"
                      title="Delete transaction"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Add Bill Modal */}
      {isAddBillOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div
            onClick={() => setIsAddBillOpen(false)}
            className="fixed inset-0 bg-[#2C382E]/30 backdrop-blur-xs"
          />
          <div className="relative w-full max-w-md bg-white rounded-3xl border border-[#E9E1D1] shadow-2xl p-6 z-10 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#E9E1D1]">
              <h3 className="font-editorial text-lg font-bold text-[#2C382E]">
                Add Upcoming Bill
              </h3>
              <button
                onClick={() => setIsAddBillOpen(false)}
                className="p-1 rounded-xl text-[#657365] hover:bg-[#FAF7F0]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddBill} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#657365] mb-1">
                  Bill Name
                </label>
                <input
                  type="text"
                  value={billName}
                  onChange={(e) => setBillName(e.target.value)}
                  placeholder="e.g. Wi-Fi Broadband or Rent"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F0] border border-[#E9E1D1] text-xs font-medium text-[#2C382E] focus:outline-none focus:ring-2 focus:ring-[#49664D]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#657365] mb-1">
                    Amount (₹)
                  </label>
                  <input
                    type="number"
                    value={billAmountRupees}
                    onChange={(e) => setBillAmountRupees(e.target.value)}
                    placeholder="799"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F0] border border-[#E9E1D1] text-xs font-bold font-mono text-[#2C382E] focus:outline-none focus:ring-2 focus:ring-[#49664D]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#657365] mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={billDueDate}
                    onChange={(e) => setBillDueDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F0] border border-[#E9E1D1] text-xs font-medium text-[#2C382E] focus:outline-none focus:ring-2 focus:ring-[#49664D]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isEssential"
                  checked={isEssential}
                  onChange={(e) => setIsEssential(e.target.checked)}
                  className="rounded border-[#E9E1D1] text-[#49664D] focus:ring-[#49664D]"
                />
                <label htmlFor="isEssential" className="text-xs text-[#2C382E] cursor-pointer">
                  Essential bill (automatically ring-fence from Safe-to-Spend)
                </label>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddBillOpen(false)}
                  className="flex-1 py-3 rounded-2xl bg-[#FAF7F0] text-xs font-semibold text-[#657365]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-2 py-3 rounded-2xl bg-[#49664D] hover:bg-[#3D5540] text-white text-xs font-semibold shadow-xs flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add to Bill Shield</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
