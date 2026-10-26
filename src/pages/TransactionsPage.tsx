/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Transaction, TransactionType } from '../types/finance';
import { formatDate, formatPaise } from '../utils/formatters';
import { StorageService } from '../services/storageService';
import {
  ArrowLeftRight,
  Search,
  Filter,
  Download,
  Upload,
  Plus,
  Trash2,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface TransactionsPageProps {
  onOpenAddModal: () => void;
}

export const TransactionsPage: React.FC<TransactionsPageProps> = ({ onOpenAddModal }) => {
  const { transactions, deleteTransaction, showToast } = useFinance();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [importStatus, setImportStatus] = useState<{
    show: boolean;
    success: boolean;
    message: string;
  }>({ show: false, success: false, message: '' });

  // Filtering
  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch =
      tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tx.notes && tx.notes.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesType =
      selectedType === 'all' || tx.type === selectedType;

    const matchesCategory =
      selectedCategory === 'all' || tx.category === selectedCategory;

    return matchesSearch && matchesType && matchesCategory;
  });

  // Extract unique categories
  const categories = Array.from(new Set(transactions.map((t) => t.category)));

  // CSV Export
  const handleExportCSV = () => {
    const csvData = StorageService.exportTransactionsCSV();
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `SaveSense_Transactions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported transactions CSV successfully');
  };

  // CSV Import
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (!content) return;

      const result = StorageService.importTransactionsCSV(content);
      if (result.success) {
        setImportStatus({
          show: true,
          success: true,
          message: `Successfully imported ${result.importedCount} transaction(s)!`,
        });
        showToast(`Imported ${result.importedCount} transactions`);
        // Refresh page context by triggering reload/state sync
        setTimeout(() => window.location.reload(), 1200);
      } else {
        setImportStatus({
          show: true,
          success: false,
          message: result.errors[0] || 'Import failed. Verify CSV headers.',
        });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-7 pb-14">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-emerald-400">
              General Ledger
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Income & Expense Manager
          </h1>
          <p className="text-xs text-slate-400">
            Log, classify, filter, and audit transactions with integer-paise precision.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* CSV Export */}
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors border border-white/[0.08]"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          {/* CSV Import */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".csv"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors border border-white/[0.08]"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Import CSV</span>
          </button>

          {/* Add */}
          <button
            onClick={onOpenAddModal}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-500/15 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Record Transaction</span>
          </button>
        </div>
      </div>

      {/* CSV Status Alert */}
      {importStatus.show && (
        <div
          className={`p-4 rounded-2xl border text-xs flex items-center justify-between ${
            importStatus.success
              ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-200'
              : 'bg-rose-950/40 border-rose-500/30 text-rose-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {importStatus.success ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400" />
            )}
            <span>{importStatus.message}</span>
          </div>
          <button
            onClick={() => setImportStatus({ show: false, success: false, message: '' })}
            className="text-slate-400 hover:text-white"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Search & Filters */}
      <div className="bg-[#0a0f1d] border border-white/[0.07] rounded-3xl p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-3 gap-3 shadow-xl">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#060913] border border-white/[0.08] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full bg-[#060913] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Classifications</option>
            <option value="income">Income</option>
            <option value="essential_expense">Essential Expense</option>
            <option value="discretionary_expense">Discretionary Expense</option>
            <option value="bill_payment">Bill Payment</option>
            <option value="savings_deposit">Jar Deposit</option>
            <option value="savings_withdrawal">Jar Withdrawal</option>
          </select>
        </div>

        <div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-[#060913] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-[#0a0f1d] border border-white/[0.07] rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-5 border-b border-white/[0.06] flex items-center justify-between bg-black/20">
          <span className="text-xs font-bold text-white tracking-tight">
            Showing {filteredTransactions.length} of {transactions.length} entries
          </span>
          <span className="text-[10px] text-slate-400 font-mono">
            All amounts recorded in integer paise
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] bg-slate-950/40">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((tx) => {
                  const isPositive =
                    tx.type === 'income' || tx.type === 'savings_withdrawal';

                  return (
                    <tr key={tx.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-mono text-slate-400 whitespace-nowrap">
                        {formatDate(tx.date)}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-white block">
                          {tx.description}
                        </span>
                        {tx.notes && (
                          <span className="text-[10px] text-slate-400">{tx.notes}</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-300 whitespace-nowrap">
                        {tx.category}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`text-[11px] font-mono capitalize ${
                            tx.type === 'income'
                              ? 'text-emerald-400'
                              : tx.type === 'essential_expense'
                              ? 'text-amber-400'
                              : tx.type === 'discretionary_expense'
                              ? 'text-purple-400'
                              : tx.type === 'savings_deposit'
                              ? 'text-indigo-400'
                              : 'text-cyan-400'
                          }`}
                        >
                          {tx.type.replace('_', ' ')}
                        </span>
                      </td>
                      <td
                        className={`py-3 px-4 text-right font-mono font-bold whitespace-nowrap ${
                          isPositive ? 'text-emerald-400' : 'text-slate-100'
                        }`}
                      >
                        {isPositive ? '+' : '-'}
                        {formatPaise(tx.amountPaise)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => deleteTransaction(tx.id)}
                          title="Delete transaction"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-xs text-slate-500">
                    No transactions matched your search or filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
