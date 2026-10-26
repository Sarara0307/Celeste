/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { formatPaise } from '../utils/formatters';
import {
  Sparkles,
  Plus,
  Compass,
  Wallet,
  Target,
  User,
  Home,
  MessageCircleQuestion,
  Menu,
  X,
  Calendar,
} from 'lucide-react';

interface NavbarProps {
  onOpenAddModal: () => void;
  onOpenEditIncome: () => void;
  onOpenCoach: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAddModal,
  onOpenEditIncome,
  onOpenCoach,
}) => {
  const { summary, settings, activeTab, setActiveTab } = useFinance();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'money', label: 'My Money', icon: Wallet },
    { id: 'vision', label: 'Vision Board', icon: Compass, badge: '✨' },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const getPersonaLabel = () => {
    switch (settings.persona) {
      case 'student':
        return '🎒 Student';
      case 'freelancer':
        return '💻 Freelancer';
      case 'young_professional':
        return '💼 Young Pro';
      case 'explorer':
        return '🌱 Explorer';
      case 'first_job':
      default:
        return '🌱 First Job';
    }
  };

  return (
    <header className="bg-[#FFFFFF]/90 border-b border-[#E9E1D1] backdrop-blur-md sticky top-0 z-30 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand & Tagline */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#49664D] rounded-xl"
            aria-label="SaveSense Home"
          >
            <div className="w-10 h-10 rounded-2xl bg-[#49664D] flex items-center justify-center text-white shadow-sm shadow-[#49664D]/15 group-hover:bg-[#3D5540] transition-colors">
              <span className="font-editorial text-xl italic font-serif">S</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-editorial text-xl font-bold text-[#2C382E] tracking-tight group-hover:text-[#49664D] transition-colors">
                  SaveSense
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#FAF7F0] border border-[#E9E1D1] text-[#657365] font-medium hidden sm:inline">
                  {getPersonaLabel()}
                </span>
              </div>
              <p className="text-[11px] text-[#657365] -mt-0.5 hidden sm:block">
                Your money, your dreams, your pace.
              </p>
            </div>
          </button>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-1.5 ml-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all relative ${
                    isActive
                      ? 'bg-[#49664D] text-white shadow-sm'
                      : 'text-[#657365] hover:text-[#2C382E] hover:bg-[#FAF7F0]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[10px] ml-0.5">{item.badge}</span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Section: Income quick button, Smart Coach & Log Expense */}
        <div className="flex items-center gap-2.5">
          {/* Monthly Income Quick Button with click-to-edit */}
          <button
            onClick={onOpenEditIncome}
            title="Click to update monthly income & payday"
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#FAF7F0] hover:bg-[#F2ECE1] border border-[#E9E1D1] text-[#2C382E] text-xs transition-all active:scale-97 group shadow-xs"
          >
            <div className="w-5 h-5 rounded-md bg-[#B8CBB3]/40 text-[#49664D] flex items-center justify-center shrink-0">
              <span className="text-[11px] font-bold">₹</span>
            </div>
            <div className="text-left text-xs pr-1">
              <span className="block text-[9px] text-[#657365] uppercase tracking-wider font-semibold leading-none">
                Monthly Income
              </span>
              <span className="font-semibold font-mono text-xs text-[#2C382E] leading-tight">
                {formatPaise(settings.monthlyIncomePaise)}
              </span>
            </div>
            <span className="text-[11px] text-[#657365] group-hover:text-[#49664D] transition-colors">
              ✎
            </span>
          </button>

          {/* Smart Coach CTA */}
          <button
            onClick={onOpenCoach}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#FAF7F0] hover:bg-[#F2ECE1] border border-[#E9E1D1] text-[#49664D] text-xs font-semibold transition-all active:scale-97"
            title="Open friendly Money Coach"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#49664D]" />
            <span>Money Coach</span>
          </button>

          {/* Quick Expense Log Button */}
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#49664D] hover:bg-[#3D5540] text-white text-xs font-semibold transition-all shadow-sm shadow-[#49664D]/15 active:scale-97"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden xs:inline">Log Expense</span>
            <span className="xs:hidden">Log</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-[#657365] hover:bg-[#FAF7F0] border border-transparent hover:border-[#E9E1D1] transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E9E1D1] bg-[#FFFFFF] px-4 py-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  isActive
                    ? 'bg-[#49664D] text-white'
                    : 'text-[#2C382E] hover:bg-[#FAF7F0]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge && <span className="text-xs">{item.badge}</span>}
              </button>
            );
          })}
          <div className="pt-2 border-t border-[#E9E1D1] flex gap-2">
            <button
              onClick={() => {
                onOpenCoach();
                setMobileMenuOpen(false);
              }}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#FAF7F0] border border-[#E9E1D1] text-[#49664D] text-xs font-semibold"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask Money Coach</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
