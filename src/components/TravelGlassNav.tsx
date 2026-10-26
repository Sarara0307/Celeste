/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Compass,
  CalendarDays,
  MapPin,
  Sparkles,
  Wallet,
  Plus,
} from 'lucide-react';

interface TravelGlassNavProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
  onOpenAddModal: () => void;
}

export const TravelGlassNav: React.FC<TravelGlassNavProps> = ({
  currentScreen,
  onNavigate,
  onOpenAddModal,
}) => {
  const tabs = [
    { id: 'home', label: 'Explore', icon: Compass },
    { id: 'itinerary', label: 'Itinerary', icon: CalendarDays },
    { id: 'plan_map', label: 'Plan Map', icon: MapPin },
    { id: 'goals', label: 'Jars', icon: Sparkles },
    { id: 'money', label: 'Budget', icon: Wallet },
  ];

  return (
    <nav className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-md">
      <div className="glass-nav rounded-3xl p-1.5 flex items-center justify-between shadow-2xl border border-white/80">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentScreen === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-2xl transition-all relative ${
                isActive
                  ? 'text-[#1E3A2B] font-bold'
                  : 'text-[#627768] hover:text-[#233329]'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-2xl flex items-center justify-center transition-all ${
                  isActive
                    ? 'bg-[#1E3A2B] text-white shadow-sm shadow-[#1E3A2B]/20 scale-105'
                    : 'hover:bg-white/60 text-[#55695B]'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span className={`text-[10px] mt-1 tracking-tight ${isActive ? 'font-bold text-[#1E3A2B]' : 'font-medium'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}

        {/* Quick Add floating pill button inside bar */}
        <button
          onClick={onOpenAddModal}
          className="w-10 h-10 rounded-2xl bg-[#E05A2B] text-white flex items-center justify-center shadow-md shadow-[#E05A2B]/25 hover:bg-[#C85A32] active:scale-95 transition-all ml-1 shrink-0"
          title="Quick Add Expense or Stop"
          aria-label="Add expense or activity"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
        </button>
      </div>
    </nav>
  );
};
