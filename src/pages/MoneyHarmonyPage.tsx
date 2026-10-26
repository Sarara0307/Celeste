/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { formatPaise } from '../utils/formatters';
import { MoneyHarmonyEngine } from '../services/moneyHarmonyEngine';
import {
  Users,
  Scale,
  Sparkles,
  Copy,
  Check,
  Send,
  Plus,
  Trash2,
  DollarSign,
  ArrowRight,
  ShieldCheck,
  MessageSquare,
  Zap,
  Info,
  Share2,
} from 'lucide-react';

export const MoneyHarmonyPage: React.FC = () => {
  const {
    harmonyMembers,
    harmonyTotalBillPaise,
    setHarmonyTotalBillPaise,
    harmonySplitMode,
    setHarmonySplitMode,
    harmonySplitResult,
    addHarmonyMember,
    updateHarmonyMember,
    deleteHarmonyMember,
    resetHarmonyExpense,
    showToast,
  } = useFinance();

  const [billTitle, setBillTitle] = useState('WiFi Broadband & Utilities');
  const [billAmountInput, setBillAmountInput] = useState(
    (harmonyTotalBillPaise / 100).toString()
  );
  const [payerId, setPayerId] = useState(
    harmonyMembers[0]?.id || 'member-me'
  );
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberIncomeRupees, setNewMemberIncomeRupees] = useState('30000');
  const [selectedNudge, setSelectedNudge] = useState<string | null>(null);

  // Sync bill amount input
  const handleBillAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setBillAmountInput(val);
    const num = parseFloat(val) || 0;
    setHarmonyTotalBillPaise(Math.max(0, Math.round(num * 100)));
  };

  // Set who paid upfront
  const handlePayerChange = (memberId: string) => {
    setPayerId(memberId);
    // Update paid amounts: selected payer paid total, others 0
    harmonyMembers.forEach((m) => {
      updateHarmonyMember(m.id, {
        paidPaise: m.id === memberId ? harmonyTotalBillPaise : 0,
      });
    });
    showToast(`Updated payer to ${harmonyMembers.find((m) => m.id === memberId)?.name}`);
  };

  // Generate AI Frictionless Nudges
  const currentPayer = harmonyMembers.find((m) => m.id === payerId) || harmonyMembers[0];
  const primaryDebtorSettlement = harmonySplitResult.settlements[0];
  const debtorName = primaryDebtorSettlement?.fromName || 'Roomie';
  const settleAmountPaise = primaryDebtorSettlement?.amountPaise || 50000;

  const nudgeTemplates = MoneyHarmonyEngine.generateNudges(
    currentPayer?.name || 'Aarav',
    debtorName,
    settleAmountPaise,
    billTitle,
    'upi://pay?pa=aarav@okaxis'
  );

  const handleCopyNudge = (text: string, templateId: string) => {
    navigator.clipboard.writeText(text);
    setSelectedNudge(templateId);
    showToast('Copied polite reminder to clipboard! 📋✨');
    setTimeout(() => {
      setSelectedNudge(null);
    }, 2000);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-2">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF7F0] border border-[#E9E1D1] text-xs text-[#657365] mb-2 font-medium">
            <Scale className="w-3.5 h-3.5 text-[#49664D]" />
            <span>Fair-Split & Frictionless Expenses</span>
          </div>
          <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[#2C382E] tracking-tight">
            Money Harmony
          </h1>
          <p className="text-sm text-[#657365] mt-1 max-w-xl">
            Split rent, utilities, and groceries by relative income or equally. Zero awkwardness, minimal transactions, and polite AI nudge templates.
          </p>
        </div>

        <button
          onClick={() => setIsAddMemberOpen(true)}
          className="px-4 py-2.5 rounded-2xl bg-[#FAF7F0] hover:bg-[#F2ECE1] border border-[#E9E1D1] text-xs font-semibold text-[#49664D] flex items-center gap-2 transition-all self-start sm:self-auto shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add Member</span>
        </button>
      </div>

      {/* Single Interaction Hero: Enter Total Bill & Select Split Mode */}
      <div className="warm-card rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-white via-[#FAFDF8] to-[#F4F9F2] border border-[#B8CBB3]/60 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-[#657365] uppercase tracking-wider block mb-1">
              Step 1: Single Interaction
            </span>
            <h2 className="font-editorial text-2xl font-bold text-[#2C382E]">
              What are we splitting today?
            </h2>
          </div>

          {/* Split Mode Selector (Proportional vs Equal) */}
          <div className="inline-flex p-1 rounded-2xl bg-[#FAF7F0] border border-[#E9E1D1] text-xs font-semibold self-start sm:self-auto">
            <button
              onClick={() => setHarmonySplitMode('proportional')}
              className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                harmonySplitMode === 'proportional'
                  ? 'bg-[#49664D] text-white shadow-xs'
                  : 'text-[#657365] hover:text-[#2C382E]'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Proportional Income Split</span>
            </button>
            <button
              onClick={() => setHarmonySplitMode('equal')}
              className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                harmonySplitMode === 'equal'
                  ? 'bg-[#49664D] text-white shadow-xs'
                  : 'text-[#657365] hover:text-[#2C382E]'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Equal 50/50 Split</span>
            </button>
          </div>
        </div>

        {/* Form Inputs: Bill Title, Amount, and Who Paid Upfront */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-5">
            <label className="block text-xs font-semibold text-[#2C382E] mb-1.5">
              Expense Name / Tag
            </label>
            <input
              type="text"
              value={billTitle}
              onChange={(e) => setBillTitle(e.target.value)}
              placeholder="e.g. WiFi, Groceries, Dinner"
              className="w-full px-4 py-3 rounded-2xl border border-[#E9E1D1] bg-white text-sm font-medium text-[#2C382E] focus:outline-none focus:ring-2 focus:ring-[#49664D]"
            />
          </div>

          <div className="md:col-span-4">
            <label className="block text-xs font-semibold text-[#2C382E] mb-1.5">
              Total Amount (₹)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-[#657365]">
                ₹
              </span>
              <input
                type="number"
                min="0"
                step="50"
                value={billAmountInput}
                onChange={handleBillAmountChange}
                className="w-full pl-8 pr-4 py-3 rounded-2xl border border-[#E9E1D1] bg-white text-base font-bold text-[#2C382E] focus:outline-none focus:ring-2 focus:ring-[#49664D]"
              />
            </div>
          </div>

          <div className="md:col-span-3">
            <label className="block text-xs font-semibold text-[#2C382E] mb-1.5">
              Paid Upfront By
            </label>
            <select
              value={payerId}
              onChange={(e) => handlePayerChange(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-[#E9E1D1] bg-white text-xs font-semibold text-[#2C382E] focus:outline-none focus:ring-2 focus:ring-[#49664D]"
            >
              {harmonyMembers.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Proportional Split Formula Banner */}
        <div className="p-4 rounded-2xl bg-[#FAF7F0] border border-[#E9E1D1] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-[#49664D]/10 text-[#49664D] flex items-center justify-center shrink-0">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-[#2C382E] block">
                {harmonySplitMode === 'proportional'
                  ? 'Fairness Algorithm Active'
                  : 'Equal Division Active'}
              </span>
              <p className="text-[#657365]">
                {harmonySplitMode === 'proportional' ? (
                  <>
                    Formula: <code className="font-mono text-[#49664D] font-bold">Contribution = Total Bill × (User Income / Total Income)</code>
                  </>
                ) : (
                  'Formula: Total Bill ÷ Total Group Members'
                )}
              </p>
            </div>
          </div>

          <div className="text-right text-[11px] text-[#657365] shrink-0 font-medium">
            Total Combined Income:{' '}
            <span className="font-bold text-[#2C382E]">
              {formatPaise(
                harmonyMembers.reduce((sum, m) => sum + m.monthlyIncomePaise, 0)
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Clear Result 1: Dynamic Fair Shares Breakdown */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-editorial text-2xl font-bold text-[#2C382E]">
            Dynamic Contribution Breakdown
          </h2>
          <span className="text-xs text-[#657365]">
            {harmonyMembers.length} members in split
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {harmonySplitResult.memberShares.map((share) => {
            const memberObj = harmonyMembers.find((m) => m.id === share.memberId);
            const isPayer = (share.paidPaise || 0) > 0;
            const netOwed = share.netPaise;

            return (
              <div
                key={share.memberId}
                className="warm-card rounded-3xl p-5 flex flex-col justify-between border border-[#E9E1D1] bg-white relative overflow-hidden"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-bold text-sm shadow-xs"
                        style={{ backgroundColor: memberObj?.color || '#49664D' }}
                      >
                        {memberObj?.avatarInitial || 'M'}
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-[#2C382E]">
                          {share.name}
                        </h3>
                        <span className="text-[11px] text-[#657365]">
                          Income: {formatPaise(share.incomePaise)}/mo
                        </span>
                      </div>
                    </div>

                    <span className="px-2.5 py-1 rounded-full bg-[#FAF7F0] border border-[#E9E1D1] text-xs font-bold text-[#49664D]">
                      {share.incomePercentage}% share
                    </span>
                  </div>

                  <div className="my-4 p-3 rounded-2xl bg-[#FAF7F0] border border-[#E9E1D1] space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#657365]">Fair Share:</span>
                      <span className="font-bold text-[#2C382E]">
                        {formatPaise(share.sharePaise)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#657365]">Paid Upfront:</span>
                      <span className="font-medium text-[#2C382E]">
                        {formatPaise(share.paidPaise)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E9E1D1] flex items-center justify-between text-xs">
                  <span className="text-[#657365]">Net Status:</span>
                  {netOwed > 50 ? (
                    <span className="font-bold text-emerald-700">
                      Receives {formatPaise(netOwed)}
                    </span>
                  ) : netOwed < -50 ? (
                    <span className="font-bold text-rose-700">
                      Owes {formatPaise(Math.abs(netOwed))}
                    </span>
                  ) : (
                    <span className="font-semibold text-[#657365]">Settled Up ✨</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Clear Result 2: Minimal Transaction Settlement Algorithm */}
      <div className="warm-card rounded-3xl p-6 sm:p-8 space-y-5 bg-gradient-to-br from-white to-[#FAF7F0]">
        <div className="flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B8CBB3]/25 text-[#49664D] text-xs font-bold mb-1">
              <Zap className="w-3.5 h-3.5" />
              <span>Minimal Transaction Settlement</span>
            </div>
            <h2 className="font-editorial text-2xl font-bold text-[#2C382E]">
              Resolved Debt Settlements
            </h2>
            <p className="text-xs text-[#657365]">
              Greedy matching resolves all multi-party debts with the absolute minimum number of peer transfers.
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-[#49664D] text-white text-xs font-bold">
            {harmonySplitResult.settlements.length} Transfers Total
          </span>
        </div>

        {harmonySplitResult.settlements.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-[#FAF7F0] border border-[#E9E1D1] text-xs text-[#657365]">
            ✨ All members are balanced or no expense is logged yet.
          </div>
        ) : (
          <div className="space-y-3">
            {harmonySplitResult.settlements.map((settle) => (
              <div
                key={settle.id}
                className="p-4 rounded-2xl bg-white border border-[#E9E1D1] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-800 font-bold text-xs border border-rose-200">
                    {settle.fromName}
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#657365]" />
                  <div className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 font-bold text-xs border border-emerald-200">
                    {settle.toName}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="font-editorial text-xl font-bold text-[#49664D]">
                    {formatPaise(settle.amountPaise)}
                  </span>
                  <button
                    onClick={() => {
                      const shareText = `Hey ${settle.fromName}! For our ${billTitle}, your balanced share to ${settle.toName} is ${formatPaise(settle.amountPaise)}. Quick settle link: upi://pay?pa=aarav@okaxis`;
                      navigator.clipboard.writeText(shareText);
                      showToast(`Copied payment instruction for ${settle.fromName}! 🚀`);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-[#49664D] hover:bg-[#3D5540] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <Send className="w-3 h-3" />
                    <span>Quick Settle Link</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Clear Result 3: AI Frictionless Nudges (Single-Click Polite Remind) */}
      <div className="warm-card rounded-3xl p-6 sm:p-8 space-y-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF7F0] border border-[#E9E1D1] text-xs text-[#49664D] font-semibold mb-1">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Zero-Awkwardness Communication</span>
          </div>
          <h2 className="font-editorial text-2xl font-bold text-[#2C382E]">
            AI Frictionless Nudges
          </h2>
          <p className="text-xs text-[#657365]">
            One tap generates lighthearted, non-awkward prompt templates ready to send to roommates or friends.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {nudgeTemplates.map((template) => {
            const isCopied = selectedNudge === template.id;
            return (
              <div
                key={template.id}
                className="p-5 rounded-2xl bg-white border border-[#E9E1D1] shadow-xs hover:border-[#B8CBB3] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-[#49664D]">
                      {template.label}
                    </span>
                    <span className="text-[10px] text-[#657365] bg-[#FAF7F0] px-2 py-0.5 rounded-full border border-[#E9E1D1]">
                      1-Click Copy
                    </span>
                  </div>
                  <p className="text-xs text-[#2C382E] leading-relaxed italic bg-[#FAF7F0] p-3 rounded-xl border border-[#E9E1D1]/60 mb-4">
                    “{template.text}”
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-end">
                  <button
                    onClick={() => handleCopyNudge(template.text, template.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs ${
                      isCopied
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#49664D] hover:bg-[#3D5540] text-white'
                    }`}
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Send Gentle Remind</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Member Modal */}
      {isAddMemberOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-[#E9E1D1] shadow-2xl space-y-5 animate-fadeIn">
            <div>
              <h3 className="font-editorial text-2xl font-bold text-[#2C382E]">
                Add Group Member
              </h3>
              <p className="text-xs text-[#657365] mt-1">
                Enter name and monthly income to include in proportional calculations.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#2C382E] mb-1">
                  Name / Nickname
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sam, Alex"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-[#E9E1D1] bg-[#FAF7F0] text-sm focus:outline-none focus:ring-2 focus:ring-[#49664D]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2C382E] mb-1">
                  Monthly Income (₹)
                </label>
                <input
                  type="number"
                  min="1000"
                  step="1000"
                  value={newMemberIncomeRupees}
                  onChange={(e) => setNewMemberIncomeRupees(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-[#E9E1D1] bg-[#FAF7F0] text-sm font-bold text-[#2C382E] focus:outline-none focus:ring-2 focus:ring-[#49664D]"
                />
                <span className="text-[11px] text-[#657365] mt-1 block">
                  Used exclusively to calculate relative fair contribution ratio.
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E9E1D1]">
              <button
                onClick={() => setIsAddMemberOpen(false)}
                className="px-4 py-2.5 rounded-2xl border border-[#E9E1D1] text-xs font-semibold text-[#657365] hover:bg-[#FAF7F0]"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const incomePaise = Math.round((parseFloat(newMemberIncomeRupees) || 30000) * 100);
                  addHarmonyMember(newMemberName || 'Roommate', incomePaise, 0);
                  setIsAddMemberOpen(false);
                  setNewMemberName('');
                }}
                className="px-5 py-2.5 rounded-2xl bg-[#49664D] hover:bg-[#3D5540] text-white text-xs font-semibold shadow-xs"
              >
                Add Member
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
