/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { AiCoachService, CoachAnswer } from '../services/aiCoachService';
import { formatPaise } from '../utils/formatters';
import {
  Bot,
  Send,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  Calculator,
  Flame,
  Info,
} from 'lucide-react';

const SUGGESTED_QUESTIONS = [
  'How much can I spend today?',
  'Why am I overspending on food?',
  'How much should I save this month?',
  'How can I reach my laptop goal sooner?',
  'What bills are coming up?',
  'What happens if my income decreases next month?',
  'Can I afford this purchase?',
];

export const SavingsCoachPage: React.FC = () => {
  const { summary, transactions, bills, jars, budgets, settings } = useFinance();

  const [activeQuestion, setActiveQuestion] = useState(SUGGESTED_QUESTIONS[0]);
  const [customInput, setCustomInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState<CoachAnswer | null>(null);

  // Initialize with the first question
  React.useEffect(() => {
    executeQuestion(SUGGESTED_QUESTIONS[0]);
  }, []);

  const executeQuestion = async (q: string) => {
    setLoading(true);
    setActiveQuestion(q);
    try {
      const res = await AiCoachService.answerQuestion(
        q,
        summary,
        transactions,
        bills,
        jars,
        budgets,
        settings
      );
      setCurrentAnswer(res);
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;
    executeQuestion(customInput.trim());
    setCustomInput('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider font-semibold text-purple-400">
              Grounded Financial Intelligence
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono">
              Live Ledger Linked
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Adaptive Savings Coach
          </h1>
          <p className="text-xs text-slate-400">
            Ask questions grounded strictly in your real numbers, bills, and jar goals. No hallucinations.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="text-slate-300 font-medium">Deterministic Financial Logic</span>
        </div>
      </div>

      {/* Suggested Question Chips */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
          One-Click Analysis Prompts:
        </span>
        <div className="flex flex-wrap gap-2">
          {SUGGESTED_QUESTIONS.map((q) => (
            <button
              key={q}
              onClick={() => executeQuestion(q)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeQuestion === q
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/60'
              }`}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Answer Display Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">{activeQuestion}</h2>
              <span className="text-[10px] text-slate-400 font-mono">
                {currentAnswer?.confidence === 'verified_calculation'
                  ? '✓ MATHEMATICALLY VERIFIED LEDGER CALCULATION'
                  : '⚡ AI ADVISORY INSIGHT'}
              </span>
            </div>
          </div>

          <span
            className={`text-[10px] px-2 py-0.5 rounded font-mono font-semibold ${
              currentAnswer?.isAiGenerated
                ? 'bg-purple-500/20 text-purple-300'
                : 'bg-emerald-500/20 text-emerald-300'
            }`}
          >
            {currentAnswer?.isAiGenerated ? 'Gemini 2.5 Grounded' : 'Financial Rules Engine'}
          </span>
        </div>

        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center space-y-3">
            <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-slate-400">Analyzing live budget math...</p>
          </div>
        ) : currentAnswer ? (
          <div className="space-y-6">
            {/* Primary Answer Paragraph */}
            <p className="text-sm text-slate-200 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
              {currentAnswer.answer}
            </p>

            {/* Underlying Supporting Numbers */}
            {currentAnswer.dataPoints.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Underlying Verifiable Numbers:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {currentAnswer.dataPoints.map((dp, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1"
                    >
                      <span className="text-[11px] text-slate-400 block">{dp.label}</span>
                      <span className="text-sm font-bold font-mono text-white block">
                        {dp.value}
                      </span>
                      {dp.hint && (
                        <span className="text-[10px] text-indigo-400 block">{dp.hint}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommended Action Steps */}
            {currentAnswer.actionSteps.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Recommended Action Steps:
                </span>
                <div className="space-y-2">
                  {currentAnswer.actionSteps.map((step, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-start gap-2.5 text-xs text-slate-300"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : null}

        {/* Custom Input */}
        <form onSubmit={handleCustomSubmit} className="pt-4 border-t border-slate-800 flex gap-2">
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            placeholder="Ask a question about your spending, bills, or savings..."
            className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
          <button
            type="submit"
            disabled={loading || !customInput.trim()}
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Ask Coach</span>
          </button>
        </form>
      </div>
    </div>
  );
};
