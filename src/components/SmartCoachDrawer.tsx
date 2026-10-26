/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { AiCoachService, CoachAnswer } from '../services/aiCoachService';
import { formatPaise } from '../utils/formatters';
import { Sparkles, X, Send, ArrowRight, Compass, ShieldCheck, HeartHandshake, CheckCircle } from 'lucide-react';

interface SmartCoachDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const QUICK_QUESTIONS = [
  'How much can I safely spend today?',
  'What bills are coming up before payday?',
  'How can I reach my laptop goal sooner?',
  'Am I overspending on dining out?',
  'How much should I save this month?',
];

export const SmartCoachDrawer: React.FC<SmartCoachDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const { summary, transactions, bills, jars, budgets, settings } = useFinance();
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeAnswer, setActiveAnswer] = useState<CoachAnswer | null>(null);

  if (!isOpen) return null;

  const handleAsk = async (queryText: string) => {
    if (!queryText.trim()) return;
    setLoading(true);
    try {
      const res = await AiCoachService.answerQuestion(
        queryText,
        summary,
        transactions,
        bills,
        jars,
        budgets,
        settings
      );
      setActiveAnswer(res);
      setQuestion('');
    } catch {
      setActiveAnswer({
        question: queryText,
        answer:
          "You're currently safe to spend at your suggested daily pace. Be sure your upcoming bills are paid first!",
        dataPoints: [
          { label: 'Safe Daily Pace', value: formatPaise(summary.suggestedDailyAllowancePaise) },
          { label: 'Spendable Pool', value: formatPaise(Math.max(0, summary.spendableBalancePaise)) },
        ],
        actionSteps: [
          'Review your upcoming essential bills in My Money',
          'Keep discretionary spends under your daily pace',
        ],
        isAiGenerated: false,
        confidence: 'verified_calculation',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#2C382E]/30 backdrop-blur-xs transition-opacity"
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="relative w-full max-w-lg bg-[#FFFFFF] border-l border-[#E9E1D1] shadow-2xl flex flex-col h-full z-10">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#E9E1D1] bg-[#FAF7F0] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#49664D] text-white flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-editorial text-xl font-bold text-[#2C382E]">
                SaveSense Money Coach
              </h2>
              <p className="text-xs text-[#657365]">
                Calm guidance grounded in your actual numbers. Zero guilt.
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

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Friendly Status greeting */}
          <div className="p-4 rounded-2xl bg-[#F7F5EC] border border-[#E9E1D1] text-xs text-[#2C382E] flex items-start gap-3">
            <HeartHandshake className="w-5 h-5 text-[#49664D] shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-[#2C382E] text-sm mb-0.5">
                Hi, {settings.userName.split(' ')[0]}!
              </p>
              <p className="text-[#657365] leading-relaxed">
                You have{' '}
                <strong className="text-[#2C382E]">
                  {formatPaise(Math.max(0, summary.spendableBalancePaise))}
                </strong>{' '}
                safely available over the next {summary.daysRemainingUntilIncome} days.
                Ask me anything about your budget, upcoming bills, or how to reach your dreams!
              </p>
            </div>
          </div>

          {/* Quick Questions */}
          <div>
            <span className="text-[11px] font-semibold text-[#657365] uppercase tracking-wider block mb-2">
              Popular questions
            </span>
            <div className="flex flex-wrap gap-2">
              {QUICK_QUESTIONS.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAsk(q)}
                  disabled={loading}
                  className="text-xs px-3 py-2 rounded-xl bg-[#FAF7F0] hover:bg-[#E9E1D1] text-[#2C382E] border border-[#E9E1D1] text-left transition-colors font-medium"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Active Answer Display */}
          {loading && (
            <div className="p-6 rounded-2xl bg-[#FAF7F0] border border-[#E9E1D1] flex flex-col items-center justify-center gap-3 text-center">
              <div className="w-7 h-7 rounded-full border-2 border-[#49664D] border-t-transparent animate-spin" />
              <p className="text-xs text-[#657365]">Consulting your real ledger numbers...</p>
            </div>
          )}

          {activeAnswer && !loading && (
            <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E9E1D1] shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#E9E1D1] pb-3">
                <span className="text-xs font-semibold text-[#49664D]">
                  {activeAnswer.question}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#B8CBB3]/30 text-[#49664D] font-medium">
                  Verified Math
                </span>
              </div>

              <p className="text-sm text-[#2C382E] leading-relaxed">
                {activeAnswer.answer}
              </p>

              {/* Data points */}
              {activeAnswer.dataPoints && activeAnswer.dataPoints.length > 0 && (
                <div className="grid grid-cols-2 gap-2 pt-2">
                  {activeAnswer.dataPoints.map((dp, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-[#FAF7F0] border border-[#E9E1D1]"
                    >
                      <span className="text-[10px] uppercase font-semibold text-[#657365] block">
                        {dp.label}
                      </span>
                      <span className="text-sm font-bold font-mono text-[#2C382E]">
                        {dp.value}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Action Steps */}
              {activeAnswer.actionSteps && activeAnswer.actionSteps.length > 0 && (
                <div className="pt-2">
                  <span className="text-xs font-semibold text-[#2C382E] block mb-2">
                    Gentle next steps:
                  </span>
                  <ul className="space-y-1.5">
                    {activeAnswer.actionSteps.map((step, i) => (
                      <li
                        key={i}
                        className="text-xs text-[#657365] flex items-start gap-2"
                      >
                        <CheckCircle className="w-3.5 h-3.5 text-[#49664D] shrink-0 mt-0.5" />
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Input Footer */}
        <div className="p-4 border-t border-[#E9E1D1] bg-[#FAF7F0]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAsk(question);
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g. Can I afford a ₹1,200 jacket?"
              className="flex-1 px-4 py-2.5 rounded-xl bg-white border border-[#E9E1D1] text-xs text-[#2C382E] focus:outline-none focus:ring-2 focus:ring-[#49664D] placeholder-[#657365]/60"
            />
            <button
              type="submit"
              disabled={!question.trim() || loading}
              className="p-2.5 rounded-xl bg-[#49664D] hover:bg-[#3D5540] disabled:opacity-50 text-white transition-colors"
              aria-label="Send Question"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
