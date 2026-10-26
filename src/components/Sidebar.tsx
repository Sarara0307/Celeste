/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useFinance } from '../context/FinanceContext';
import {
  Home,
  Wallet,
  Compass,
  Target,
  User,
  Sparkles,
  Coins,
  Scale,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab } = useFinance();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home, desc: 'Overview & Weather ☀️' },
    { id: 'habits', label: 'Habit Stash', icon: Coins, badge: '🎮', desc: 'Micro-Investments' },
    { id: 'harmony', label: 'Money Harmony', icon: Scale, badge: '⚡', desc: 'Fair-Split & Nudges' },
    { id: 'money', label: 'My Money', icon: Wallet, desc: 'Payday & Safe-to-Spend' },
    { id: 'vision', label: 'Vision Board', icon: Compass, badge: '✨', desc: 'Financial Dreams' },
    { id: 'profile', label: 'Profile', icon: User, desc: 'Settings & Fresh Start' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-[#E9E1D1] h-[calc(100vh-4.5rem)] sticky top-18 hidden lg:flex flex-col justify-between p-4">
      <div className="space-y-1">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#657365] px-3 mb-2 block">
          Navigation
        </span>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-left transition-all ${
                isActive
                  ? 'bg-[#49664D] text-white shadow-xs'
                  : 'text-[#2C382E] hover:bg-[#FAF7F0] hover:text-[#49664D]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 shrink-0" />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold">{item.label}</span>
                    {item.badge && <span className="text-[10px]">{item.badge}</span>}
                  </div>
                  <span
                    className={`text-[10px] block leading-tight ${
                      isActive ? 'text-white/80' : 'text-[#657365]'
                    }`}
                  >
                    {item.desc}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Gentle Quote Card at bottom */}
      <div className="p-4 rounded-2xl bg-[#FAF7F0] border border-[#E9E1D1] text-xs text-[#657365]">
        <div className="flex items-center gap-1.5 text-[#49664D] font-bold text-[11px] mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>SaveSense Spirit</span>
        </div>
        <p className="italic text-[11px] leading-relaxed text-[#2C382E]">
          &ldquo;Spend wisely. Save consistently. Live confidently.&rdquo;
        </p>
      </div>
    </aside>
  );
};
