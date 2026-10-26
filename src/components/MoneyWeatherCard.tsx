/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { formatPaise } from '../utils/formatters';
import {
  Sun,
  Cloud,
  CloudRain,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  Info,
  Calendar,
  ChevronRight,
  Calculator,
  RotateCcw,
} from 'lucide-react';

interface MoneyWeatherCardProps {
  onOpenEditIncome?: () => void;
  onExploreHarmony?: () => void;
  onExploreHabits?: () => void;
}

export const MoneyWeatherCard: React.FC<MoneyWeatherCardProps> = ({
  onOpenEditIncome,
  onExploreHarmony,
  onExploreHabits,
}) => {
  const {
    moneyWeather,
    weatherSimulationMode,
    setWeatherSimulationMode,
    settings,
    summary,
  } = useFinance();

  const [showFormulaDetails, setShowFormulaDetails] = useState(false);

  // Styling and colors for the 3 dynamic states
  const getStateConfig = () => {
    switch (moneyWeather.status) {
      case 'rainy':
        return {
          bannerBg: 'bg-gradient-to-br from-[#FFF5F5] via-[#FFF8F7] to-[#FFEBEA] border-rose-200/80',
          badgeBg: 'bg-rose-100/80 text-rose-800 border-rose-300',
          badgeDot: 'bg-rose-500',
          badgeText: '🌧️ Rainy • Shelter Alert',
          iconContainer: 'bg-rose-100 text-rose-600 border-rose-200',
          highlightBox: 'bg-rose-50/70 border-rose-200 text-rose-900',
          headlineColor: 'text-[#2C1D1E]',
          statusIcon: <CloudRain className="w-8 h-8 text-rose-600 animate-bounce" />,
          accentGlow: 'bg-rose-400/10',
          statusLabel: 'Action Recommended',
        };
      case 'amber':
        return {
          bannerBg: 'bg-gradient-to-br from-[#FFFDF2] via-[#FFF9E6] to-[#FDF3D0] border-amber-200/80',
          badgeBg: 'bg-amber-100/90 text-amber-900 border-amber-300',
          badgeDot: 'bg-amber-500',
          badgeText: '⛅ Amber • Mindful Pacing',
          iconContainer: 'bg-amber-100 text-amber-700 border-amber-200',
          highlightBox: 'bg-amber-50/80 border-amber-200 text-amber-950',
          headlineColor: 'text-[#2C2417]',
          statusIcon: <Cloud className="w-8 h-8 text-amber-600 animate-pulse" />,
          accentGlow: 'bg-amber-400/15',
          statusLabel: 'Mindful Pacing',
        };
      case 'sunny':
      default:
        return {
          bannerBg: 'bg-gradient-to-br from-[#F4F9F2] via-[#FAFDF8] to-[#EBF3E8] border-[#B8CBB3]/70',
          badgeBg: 'bg-[#B8CBB3]/30 text-[#49664D] border-[#B8CBB3]',
          badgeDot: 'bg-[#49664D]',
          badgeText: '☀️ Sunny • All Clear',
          iconContainer: 'bg-[#B8CBB3]/25 text-[#49664D] border-[#B8CBB3]/40',
          highlightBox: 'bg-[#FAF7F0] border-[#E9E1D1] text-[#2C382E]',
          headlineColor: 'text-[#2C382E]',
          statusIcon: <Sun className="w-8 h-8 text-[#49664D] animate-spin-slow" />,
          accentGlow: 'bg-[#B8CBB3]/20',
          statusLabel: 'Comfortably On Track',
        };
    }
  };

  const config = getStateConfig();

  return (
    <div
      className={`rounded-3xl border p-6 md:p-8 transition-all duration-300 relative overflow-hidden shadow-xs ${config.bannerBg}`}
      role="region"
      aria-label="Money Weather Status"
    >
      {/* Radiant Background Aura */}
      <div
        className={`absolute -top-16 -right-16 w-56 h-56 rounded-full blur-2xl pointer-events-none transition-all ${config.accentGlow}`}
      />

      <div className="relative z-10 flex flex-col gap-5">
        {/* Top Header Row */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${config.badgeBg}`}
            >
              <span className={`w-2 h-2 rounded-full ${config.badgeDot} animate-ping`} />
              <span>{config.badgeText}</span>
            </span>

            {weatherSimulationMode !== 'live' && (
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/80 border border-[#E9E1D1] text-[#657365] font-medium flex items-center gap-1">
                <span>Demo Preview</span>
                <button
                  onClick={() => setWeatherSimulationMode('live')}
                  className="text-[#49664D] hover:underline flex items-center gap-0.5 ml-1 font-bold"
                  title="Switch to Real Live Data"
                >
                  <RotateCcw className="w-2.5 h-2.5" />
                  <span>Reset</span>
                </button>
              </span>
            )}
          </div>

          {/* Hackathon State Switcher / What-if Preview */}
          <div className="flex items-center gap-1 bg-white/70 backdrop-blur-xs p-1 rounded-2xl border border-[#E9E1D1]/60 text-[11px]">
            <span className="text-[10px] text-[#657365] font-semibold px-2 hidden sm:inline">
              Judge Preview:
            </span>
            <button
              onClick={() => setWeatherSimulationMode('sunny')}
              className={`px-2.5 py-1 rounded-xl font-medium transition-all ${
                moneyWeather.status === 'sunny' && weatherSimulationMode === 'sunny'
                  ? 'bg-[#49664D] text-white shadow-xs'
                  : 'text-[#657365] hover:text-[#2C382E]'
              }`}
              title="Preview Sunny State"
            >
              ☀️ Sunny
            </button>
            <button
              onClick={() => setWeatherSimulationMode('amber')}
              className={`px-2.5 py-1 rounded-xl font-medium transition-all ${
                moneyWeather.status === 'amber' && weatherSimulationMode === 'amber'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-[#657365] hover:text-[#2C382E]'
              }`}
              title="Preview Amber State"
            >
              ⛅ Amber
            </button>
            <button
              onClick={() => setWeatherSimulationMode('rainy')}
              className={`px-2.5 py-1 rounded-xl font-medium transition-all ${
                moneyWeather.status === 'rainy' && weatherSimulationMode === 'rainy'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-[#657365] hover:text-[#2C382E]'
              }`}
              title="Preview Rainy State"
            >
              🌧️ Rainy
            </button>
            <button
              onClick={() => setWeatherSimulationMode('live')}
              className={`px-2.5 py-1 rounded-xl font-medium transition-all ${
                weatherSimulationMode === 'live'
                  ? 'bg-[#2C382E] text-white shadow-xs'
                  : 'text-[#657365] hover:text-[#2C382E]'
              }`}
              title="Switch to Live Auto-Calculation"
            >
              🔄 Live
            </button>
          </div>
        </div>

        {/* Hero Headline & Weather Icon */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1.5 flex-1">
            <h2 className={`font-editorial text-2xl sm:text-3xl font-bold tracking-tight ${config.headlineColor}`}>
              {moneyWeather.headline}
            </h2>
            {/* Strict Hackathon Requirement: 1-sentence plain-English summary */}
            <p className="text-sm sm:text-base font-medium text-[#2C382E] leading-relaxed">
              “{moneyWeather.oneSentenceSummary}”
            </p>
          </div>

          <div
            className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl border flex items-center justify-center shrink-0 shadow-xs ${config.iconContainer}`}
          >
            {config.statusIcon}
          </div>
        </div>

        {/* Calm Context Pill / Formula Breakdown */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-black/5">
          <div className="flex flex-wrap items-center gap-4 text-xs text-[#657365]">
            <span className="flex items-center gap-1.5 font-medium">
              <Calendar className="w-3.5 h-3.5 text-[#49664D]" />
              <span>Next Payday: {settings.nextIncomeDate}</span>
              {onOpenEditIncome && (
                <button
                  onClick={onOpenEditIncome}
                  className="text-[#49664D] hover:underline font-semibold ml-0.5"
                >
                  Edit
                </button>
              )}
            </span>

            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#49664D]" />
              <span>
                Mandatory Bills: {formatPaise(moneyWeather.upcomingMandatoryBillsPaise)}
              </span>
            </span>

            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#49664D]" />
              <span>
                Daily Pace: {formatPaise(summary.suggestedDailyAllowancePaise)}/day
              </span>
            </span>
          </div>

          <button
            onClick={() => setShowFormulaDetails(!showFormulaDetails)}
            className="text-xs font-semibold text-[#49664D] hover:text-[#3D5540] flex items-center gap-1 transition-colors"
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>{showFormulaDetails ? 'Hide Calculation' : 'How it works'}</span>
          </button>
        </div>

        {/* Expandable Explanation & Formula Transparency */}
        {showFormulaDetails && (
          <div className="mt-2 p-4 rounded-2xl bg-white/90 border border-[#E9E1D1] text-xs space-y-2 animate-fadeIn">
            <div className="flex items-center gap-1.5 font-bold text-[#2C382E]">
              <Info className="w-4 h-4 text-[#49664D]" />
              <span>Money Weather Logic & Net Cushion Formula</span>
            </div>
            <p className="text-[#657365] leading-relaxed">
              Calculated real-time without complex charts using the formula:{' '}
              <code className="bg-[#FAF7F0] px-1.5 py-0.5 rounded font-mono text-[#49664D] font-bold">
                (Available Cash + Expected Income) - (Mandatory Bills + Daily Budget)
              </code>
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-[11px]">
              <div className="p-2 rounded-xl bg-[#FAF7F0] border border-[#E9E1D1]">
                <span className="text-[#657365] block">Available Liquid</span>
                <span className="font-bold text-[#2C382E]">
                  {formatPaise(moneyWeather.currentAvailableBalancePaise)}
                </span>
              </div>
              <div className="p-2 rounded-xl bg-[#FAF7F0] border border-[#E9E1D1]">
                <span className="text-[#657365] block">Expected Income</span>
                <span className="font-bold text-[#2C382E]">
                  {formatPaise(moneyWeather.expectedIncomePaise)}
                </span>
              </div>
              <div className="p-2 rounded-xl bg-[#FAF7F0] border border-[#E9E1D1]">
                <span className="text-[#657365] block">Upcoming Bills</span>
                <span className="font-bold text-[#2C382E]">
                  {formatPaise(moneyWeather.upcomingMandatoryBillsPaise)}
                </span>
              </div>
              <div className="p-2 rounded-xl bg-[#FAF7F0] border border-[#E9E1D1]">
                <span className="text-[#657365] block">Net Safe Cushion</span>
                <span className={`font-bold ${moneyWeather.netCushionPaise >= 0 ? 'text-[#49664D]' : 'text-rose-600'}`}>
                  {formatPaise(moneyWeather.netCushionPaise)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
