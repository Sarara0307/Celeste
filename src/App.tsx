/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { FinanceProvider, useFinance } from './context/FinanceContext';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { Sidebar } from './components/Sidebar';
import { Toast } from './components/Toast';
import { TwoTapExpenseModal } from './components/TwoTapExpenseModal';
import { EditIncomeModal } from './components/EditIncomeModal';
import { SmartCoachDrawer } from './components/SmartCoachDrawer';

// Core Pages
import { HomePage } from './pages/HomePage';
import { MyMoneyPage } from './pages/MyMoneyPage';
import { VisionBoardPage } from './pages/VisionBoardPage';
import { GoalsPage } from './pages/GoalsPage';
import { ProfilePage } from './pages/ProfilePage';
import { HabitConverterPage } from './pages/HabitConverterPage';
import { MoneyHarmonyPage } from './pages/MoneyHarmonyPage';

const AppContent: React.FC = () => {
  const { activeTab, setActiveTab } = useFinance();
  const [isTwoTapModalOpen, setIsTwoTapModalOpen] = useState(false);
  const [isEditIncomeOpen, setIsEditIncomeOpen] = useState(false);
  const [isCoachOpen, setIsCoachOpen] = useState(false);

  const renderActivePage = () => {
    switch (activeTab) {
      case 'habits':
      case 'converter':
        return <HabitConverterPage />;
      case 'harmony':
      case 'split':
        return <MoneyHarmonyPage />;
      case 'money':
      case 'safe_spend':
      case 'transactions':
      case 'bills':
      case 'budget':
        return (
          <MyMoneyPage
            onOpenAddModal={() => setIsTwoTapModalOpen(true)}
            onOpenEditIncome={() => setIsEditIncomeOpen(true)}
          />
        );
      case 'vision':
        return <VisionBoardPage />;
      case 'goals':
      case 'jars':
      case 'simulator':
        return <GoalsPage />;
      case 'profile':
      case 'settings':
      case 'review':
        return <ProfilePage />;
      case 'home':
      case 'dashboard':
      default:
        return (
          <HomePage
            onOpenAddModal={() => setIsTwoTapModalOpen(true)}
            onOpenEditIncome={() => setIsEditIncomeOpen(true)}
            onOpenCoach={() => setIsCoachOpen(true)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F5EC] text-[#2C382E] flex flex-col font-sans selection:bg-[#B8CBB3]/40 selection:text-[#49664D] relative">
      {/* Warm Ambient Accents in background */}
      <div className="fixed -top-32 -left-32 w-80 h-80 bg-[#B8CBB3]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed top-1/2 -right-32 w-80 h-80 bg-[#E9E1D1]/30 rounded-full blur-3xl pointer-events-none" />

      {/* Top Navbar */}
      <Navbar
        onOpenAddModal={() => setIsTwoTapModalOpen(true)}
        onOpenEditIncome={() => setIsEditIncomeOpen(true)}
        onOpenCoach={() => setIsCoachOpen(true)}
      />

      {/* Main Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Optional Desktop Sidebar */}
        <div className="hidden lg:block shrink-0">
          <Sidebar />
        </div>

        {/* Scrollable View Area */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-12">
          <div className="max-w-6xl mx-auto">
            {renderActivePage()}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav onOpenAddModal={() => setIsTwoTapModalOpen(true)} />

      {/* Modals & Drawers */}
      <TwoTapExpenseModal
        isOpen={isTwoTapModalOpen}
        onClose={() => setIsTwoTapModalOpen(false)}
      />

      <EditIncomeModal
        isOpen={isEditIncomeOpen}
        onClose={() => setIsEditIncomeOpen(false)}
      />

      <SmartCoachDrawer
        isOpen={isCoachOpen}
        onClose={() => setIsCoachOpen(false)}
      />

      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <FinanceProvider>
      <AppContent />
    </FinanceProvider>
  );
}
