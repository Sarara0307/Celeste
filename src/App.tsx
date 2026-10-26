/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { FinanceProvider, useFinance } from './context/FinanceContext';
import { TravelTopBar } from './components/TravelTopBar';
import { TravelGlassNav } from './components/TravelGlassNav';
import { Toast } from './components/Toast';
import { TwoTapExpenseModal } from './components/TwoTapExpenseModal';
import { EditIncomeModal } from './components/EditIncomeModal';
import { SmartCoachDrawer } from './components/SmartCoachDrawer';

// Travel-Inspired UI/UX Screens
import { TravelHomeDashboard } from './pages/TravelHomeDashboard';
import { TravelItineraryPage } from './pages/TravelItineraryPage';
import { TravelMapPlanPage } from './pages/TravelMapPlanPage';

// Financial Engine Tools
import { GoalsPage } from './pages/GoalsPage';
import { MyMoneyPage } from './pages/MyMoneyPage';
import { ProfilePage } from './pages/ProfilePage';
import { VisionBoardPage } from './pages/VisionBoardPage';
import { HabitConverterPage } from './pages/HabitConverterPage';
import { MoneyHarmonyPage } from './pages/MoneyHarmonyPage';

const AppContent: React.FC = () => {
  const { activeTab, setActiveTab } = useFinance();
  const [isTwoTapModalOpen, setIsTwoTapModalOpen] = useState(false);
  const [isEditIncomeOpen, setIsEditIncomeOpen] = useState(false);
  const [isCoachOpen, setIsCoachOpen] = useState(false);

  const renderActivePage = () => {
    switch (activeTab) {
      case 'itinerary':
        return (
          <TravelItineraryPage
            onNavigate={setActiveTab}
            onOpenAddModal={() => setIsTwoTapModalOpen(true)}
          />
        );
      case 'plan_map':
      case 'map':
        return (
          <TravelMapPlanPage
            onNavigate={setActiveTab}
            onOpenAddModal={() => setIsTwoTapModalOpen(true)}
          />
        );
      case 'goals':
      case 'jars':
        return <GoalsPage />;
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
      case 'habits':
        return <HabitConverterPage />;
      case 'harmony':
        return <MoneyHarmonyPage />;
      case 'profile':
      case 'settings':
        return <ProfilePage />;
      case 'home':
      case 'dashboard':
      default:
        return (
          <TravelHomeDashboard
            onNavigate={setActiveTab}
            onOpenAddModal={() => setIsTwoTapModalOpen(true)}
            onOpenCoach={() => setIsCoachOpen(true)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7F4] text-[#233329] flex flex-col font-sans selection:bg-[#B6C7B5]/40 selection:text-[#1E3A2B] relative">
      {/* Soothing Pastel Ambient Backdrop Accents */}
      <div className="fixed -top-32 -left-32 w-96 h-96 bg-[#DCE7DD]/35 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed top-1/3 -right-32 w-80 h-80 bg-[#DDE5ED]/30 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed -bottom-24 left-1/4 w-96 h-96 bg-[#FAF7F0]/40 rounded-full blur-3xl pointer-events-none" />

      {/* Top Navigation Bar with Minimalist Rounded Square Buttons */}
      <TravelTopBar
        currentScreen={activeTab}
        onNavigate={setActiveTab}
        onOpenCoach={() => setIsCoachOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-5 pb-28">
        <div className="max-w-4xl mx-auto">
          {renderActivePage()}
        </div>
      </main>

      {/* Floating Glassmorphic Bottom Navigation Bar */}
      <TravelGlassNav
        currentScreen={activeTab}
        onNavigate={setActiveTab}
        onOpenAddModal={() => setIsTwoTapModalOpen(true)}
      />

      {/* Interactive Modals & Drawers */}
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
