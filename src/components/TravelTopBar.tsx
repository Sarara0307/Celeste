/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import {
  Menu,
  ArrowLeft,
  Share2,
  Bell,
  X,
  Check,
  Compass,
  Calendar,
  MapPin,
  Sparkles,
  Wallet,
  Settings as SettingsIcon,
  HelpCircle,
} from 'lucide-react';

interface TravelTopBarProps {
  currentScreen: 'home' | 'itinerary' | 'plan_map' | string;
  onNavigate: (screen: string) => void;
  onOpenCoach?: () => void;
}

export const TravelTopBar: React.FC<TravelTopBarProps> = ({
  currentScreen,
  onNavigate,
  onOpenCoach,
}) => {
  const { settings, summary, activeTab, setActiveTab } = useFinance();
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [sharedToast, setSharedToast] = useState(false);
  const [readNotifications, setReadNotifications] = useState<number[]>([]);

  const notifications = [
    {
      id: 1,
      title: 'Daily Spendable Allowance',
      desc: 'You can safely spend $60/day without touching scheduled bills.',
      time: '10m ago',
      unread: true,
      tag: 'Budget Safe',
    },
    {
      id: 2,
      title: 'Lodge Deposit Reserved',
      desc: '$320 for Driftwood Cottage is ring-fenced from your liquid cash.',
      time: '2h ago',
      unread: true,
      tag: 'Upcoming Bill',
    },
    {
      id: 3,
      title: 'Pacific Travel Jar +15%',
      desc: 'Congratulations! You reached 74% of your expedition savings goal.',
      time: '1d ago',
      unread: false,
      tag: 'Milestone',
    },
  ];

  const handleShare = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
      }
    } catch {
      // ignore
    }
    setSharedToast(true);
    setTimeout(() => setSharedToast(false), 2400);
  };

  const hasUnread = notifications.some(
    (n) => n.unread && !readNotifications.includes(n.id)
  );

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#F4F7F4]/90 backdrop-blur-md px-4 sm:px-6 py-3 border-b border-[#DCE7DD]/80 transition-all">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          {/* Left Controls: Menu button and optional Back button */}
          <div className="flex items-center gap-2">
            {currentScreen !== 'home' ? (
              <button
                onClick={() => onNavigate('home')}
                className="w-10 h-10 rounded-2xl bg-white shadow-sm hover:shadow-md border border-white flex items-center justify-center text-[#233329] hover:text-[#1E3A2B] transition-all active:scale-95"
                title="Go back to Home"
                aria-label="Go back to Home"
              >
                <ArrowLeft className="w-5 h-5 text-[#233329]" />
              </button>
            ) : null}

            <button
              onClick={() => setMenuOpen(true)}
              className="w-10 h-10 rounded-2xl bg-white shadow-sm hover:shadow-md border border-white flex items-center justify-center text-[#233329] hover:text-[#1E3A2B] transition-all active:scale-95"
              title="Open Navigation Menu"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          {/* Center: Screen Switcher Chips */}
          <div className="flex items-center gap-1.5 p-1 bg-white/80 rounded-2xl border border-white shadow-xs overflow-x-auto max-w-[280px] sm:max-w-none">
            <button
              onClick={() => onNavigate('home')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${
                currentScreen === 'home'
                  ? 'bg-[#1E3A2B] text-white shadow-xs'
                  : 'text-[#627768] hover:text-[#233329] hover:bg-white/60'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => onNavigate('itinerary')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${
                currentScreen === 'itinerary'
                  ? 'bg-[#1E3A2B] text-white shadow-xs'
                  : 'text-[#627768] hover:text-[#233329] hover:bg-white/60'
              }`}
            >
              Itinerary
            </button>
            <button
              onClick={() => onNavigate('plan_map')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${
                currentScreen === 'plan_map'
                  ? 'bg-[#1E3A2B] text-white shadow-xs'
                  : 'text-[#627768] hover:text-[#233329] hover:bg-white/60'
              }`}
            >
              Island Plan
            </button>
          </div>

          {/* Right Controls: Share, Notification Bell, User Avatar */}
          <div className="flex items-center gap-2">
            {/* Share Button */}
            <button
              onClick={handleShare}
              className="w-10 h-10 rounded-2xl bg-white shadow-sm hover:shadow-md border border-white flex items-center justify-center text-[#233329] hover:text-[#1E3A2B] transition-all active:scale-95 relative"
              title="Share Expedition Plan"
              aria-label="Share Expedition Plan"
            >
              <Share2 className="w-4 h-4 text-[#233329]" />
            </button>

            {/* Notification Bell with red alert dot */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="w-10 h-10 rounded-2xl bg-white shadow-sm hover:shadow-md border border-white flex items-center justify-center text-[#233329] hover:text-[#1E3A2B] transition-all active:scale-95 relative"
                title="Notifications & Alerts"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4 text-[#233329]" />
                {hasUnread && (
                  <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#E05A2B] ring-2 ring-white" />
                )}
              </button>

              {/* Notification Popover */}
              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-3xl shadow-xl border border-[#DCE7DD] p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between pb-3 border-b border-[#F0F4F1] mb-2">
                    <span className="font-editorial text-base font-bold text-[#233329]">
                      Expedition Alerts
                    </span>
                    <button
                      onClick={() => setNotificationsOpen(false)}
                      className="p-1 rounded-lg text-[#627768] hover:bg-[#F4F7F4]"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-2.5 max-h-72 overflow-y-auto">
                    {notifications.map((item) => {
                      const isRead = readNotifications.includes(item.id);
                      return (
                        <div
                          key={item.id}
                          onClick={() => setReadNotifications([...readNotifications, item.id])}
                          className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                            isRead
                              ? 'bg-white border-[#E6EDE7] text-[#627768]'
                              : 'bg-[#F4F8F4] border-[#D4E3D3] text-[#233329]'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[11px] font-semibold text-[#1E3A2B] uppercase tracking-wider">
                              {item.tag}
                            </span>
                            <span className="text-[10px] text-[#7A8E7F]">{item.time}</span>
                          </div>
                          <p className="font-semibold text-xs text-[#233329]">{item.title}</p>
                          <p className="text-[11px] text-[#55695B] mt-0.5 leading-relaxed">{item.desc}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* User Avatar */}
            <button
              onClick={() => onNavigate('profile')}
              className="w-10 h-10 rounded-2xl p-0.5 bg-white shadow-sm hover:shadow-md border border-white overflow-hidden transition-all active:scale-95 focus:outline-none"
              title="View Profile & Settings"
            >
              <img
                src="/src/assets/images/traveler_user_avatar_1792993787575.jpg"
                alt="Alex Avatar"
                className="w-full h-full object-cover rounded-xl"
              />
            </button>
          </div>
        </div>
      </header>

      {/* Share Toast */}
      {sharedToast && (
        <div className="fixed top-18 left-1/2 -translate-x-1/2 z-50 bg-[#1E3A2B] text-white px-4 py-2 rounded-2xl shadow-lg flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-top-2">
          <Check className="w-4 h-4 text-[#B8E2C8]" />
          <span>Expedition plan link copied to clipboard!</span>
        </div>
      )}

      {/* Hamburger Drawer Modal */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            onClick={() => setMenuOpen(false)}
            className="fixed inset-0 bg-[#233329]/40 backdrop-blur-xs transition-opacity"
          />
          <div className="relative w-full max-w-xs bg-white h-full shadow-2xl p-6 flex flex-col justify-between z-10 border-r border-[#DCE7DD]">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#F0F4F1]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#1E3A2B] text-white flex items-center justify-center font-editorial font-bold text-lg">
                    S
                  </div>
                  <div>
                    <h3 className="font-editorial text-lg font-bold text-[#233329]">
                      SaveSense
                    </h3>
                    <p className="text-[11px] text-[#627768]">Wanderlust with Peace of Mind</p>
                  </div>
                </div>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="p-1 rounded-xl text-[#627768] hover:bg-[#F4F7F4]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="mt-6 space-y-1.5">
                <span className="text-[10px] font-bold text-[#7A8E7F] uppercase tracking-wider block px-2 mb-1">
                  Travel & Expedition Screens
                </span>
                <button
                  onClick={() => {
                    onNavigate('home');
                    setMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-left text-xs font-semibold transition-all ${
                    currentScreen === 'home'
                      ? 'bg-[#1E3A2B] text-white shadow-xs'
                      : 'text-[#233329] hover:bg-[#F4F7F4]'
                  }`}
                >
                  <Compass className="w-4 h-4" />
                  <span>Screen 1: Home Dashboard</span>
                </button>

                <button
                  onClick={() => {
                    onNavigate('itinerary');
                    setMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-left text-xs font-semibold transition-all ${
                    currentScreen === 'itinerary'
                      ? 'bg-[#1E3A2B] text-white shadow-xs'
                      : 'text-[#233329] hover:bg-[#F4F7F4]'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  <span>Screen 2: Detailed Itinerary</span>
                </button>

                <button
                  onClick={() => {
                    onNavigate('plan_map');
                    setMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-left text-xs font-semibold transition-all ${
                    currentScreen === 'plan_map'
                      ? 'bg-[#1E3A2B] text-white shadow-xs'
                      : 'text-[#233329] hover:bg-[#F4F7F4]'
                  }`}
                >
                  <MapPin className="w-4 h-4" />
                  <span>Screen 3: Island Plan & Map</span>
                </button>

                <div className="pt-4 border-t border-[#F0F4F1] my-3">
                  <span className="text-[10px] font-bold text-[#7A8E7F] uppercase tracking-wider block px-2 mb-1">
                    Financial Engine Tools
                  </span>
                  <button
                    onClick={() => {
                      onNavigate('goals');
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-left text-xs font-semibold text-[#233329] hover:bg-[#F4F7F4]"
                  >
                    <Sparkles className="w-4 h-4 text-[#C85A32]" />
                    <span>Savings Jars & Goals</span>
                  </button>

                  <button
                    onClick={() => {
                      onNavigate('money');
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-left text-xs font-semibold text-[#233329] hover:bg-[#F4F7F4]"
                  >
                    <Wallet className="w-4 h-4 text-[#1E3A2B]" />
                    <span>Safe-to-Spend & Ledger</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="pt-4 border-t border-[#F0F4F1] text-xs text-[#627768] flex items-center justify-between">
              <span className="font-medium">Traveler: {settings.userName}</span>
              <button
                onClick={() => {
                  onNavigate('profile');
                  setMenuOpen(false);
                }}
                className="p-1.5 rounded-lg hover:bg-[#F4F7F4] text-[#233329]"
              >
                <SettingsIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
