/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { Home, Wallet, Compass, Target, User, Plus } from 'lucide-react';

interface BottomNavProps {
  onOpenAddModal: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ onOpenAddModal }) => {
  const { activeTab, setActiveTab } = useFinance();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'money', label: 'My Money', icon: Wallet },
    { id: 'vision', label: 'Vision', icon: Compass },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#FFFFFF]/95 border-t border-[#E9E1D1] backdrop-blur-lg px-2 py-1.5 safe-area-bottom">
      <div className="flex items-center justify-around relative">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
                isActive
                  ? 'text-[#49664D] font-bold'
                  : 'text-[#657365] hover:text-[#2C382E]'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                  isActive ? 'bg-[#B8CBB3]/30 text-[#49664D]' : 'text-[#657365]'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
