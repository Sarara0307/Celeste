/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { formatPaise } from '../utils/formatters';
import {
  Calendar,
  ChevronDown,
  Bookmark,
  Star,
  MapPin,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Compass,
  Tent,
  Coffee,
  Utensils,
  Car,
  Backpack,
  Plus,
  Coins,
  Check,
  Heart,
} from 'lucide-react';

interface TravelHomeDashboardProps {
  onNavigate: (screen: string) => void;
  onOpenAddModal: () => void;
  onOpenCoach: () => void;
}

export const TravelHomeDashboard: React.FC<TravelHomeDashboardProps> = ({
  onNavigate,
  onOpenAddModal,
  onOpenCoach,
}) => {
  const { settings, summary, jars } = useFinance();

  // State
  const [selectedDateRange, setSelectedDateRange] = useState('Oct 24 – Oct 31, 2026');
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkedCards, setBookmarkedCards] = useState<Record<string, boolean>>({
    main: true,
    card2: false,
    card3: false,
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const toggleBookmark = (cardId: string, title: string) => {
    const nextState = !bookmarkedCards[cardId];
    setBookmarkedCards((prev) => ({ ...prev, [cardId]: nextState }));
    showToast(nextState ? `Saved "${title}" to your bookmarks!` : `Removed "${title}" from bookmarks.`);
  };

  const dateOptions = [
    'Today · Single Day Pass',
    'This Weekend · 3 Days',
    'Oct 24 – Oct 31, 2026 · 7 Days (Active)',
    'Next 14 Days · Full Expedition',
    'Entire Autumn Season',
  ];

  const categoryChips = [
    { id: 'all', label: 'All Expeditions', icon: Compass, color: 'text-[#1E3A2B]' },
    { id: 'stays', label: 'Stays & Lodges', icon: Tent, color: 'text-[#C85A32]' },
    { id: 'cafes', label: 'Camp Dining & Cafes', icon: Coffee, color: 'text-[#8A6240]' },
    { id: 'transit', label: 'Local Ferries & Rail', icon: Car, color: 'text-[#3E6553]' },
    { id: 'gear', label: 'Gear & Trail Passes', icon: Backpack, color: 'text-[#627768]' },
  ];

  const featuredCards = [
    {
      id: 'main',
      title: 'Pacific Cascade Expedition & Cabin Stay',
      category: 'Cascade Range · Wilderness Retreat',
      dates: 'Oct 24 – 31 · 7 Days',
      budget: '$2.5k',
      spent: '$1,240',
      rating: '4.95',
      reviews: '128 travelers',
      image: '/src/assets/images/home_travel_hero_1792993749411.jpg',
      targetScreen: 'itinerary',
      tags: ['Wilderness Cabin', 'Canoe Passes', 'Budget Tracked'],
      type: 'stays',
    },
    {
      id: 'card2',
      title: 'Emerald Archipelago Island Plan',
      category: 'Pacific Northwest · Coastal Trail',
      dates: 'Nov 04 – 11 · 8 Days',
      budget: '$1.8k',
      spent: '$420',
      rating: '4.98',
      reviews: '94 travelers',
      image: '/src/assets/images/adventure_island_map_1792993773840.jpg',
      targetScreen: 'plan_map',
      tags: ['Ferry Route', 'Lighthouse Camping', 'Dashed Trail Map'],
      type: 'transit',
    },
    {
      id: 'card3',
      title: 'Tranquil Alpine Lake Haven & Canoe Dock',
      category: 'Glacial Basin · Pine Woodlands',
      dates: 'Oct 28 – Nov 02 · 5 Days',
      budget: '$950',
      spent: '$310',
      rating: '4.92',
      reviews: '67 travelers',
      image: '/src/assets/images/itinerary_scenic_hero_1792993761367.jpg',
      targetScreen: 'itinerary',
      tags: ['Canoe Rental', 'Wildflower Meadows', 'Campfires'],
      type: 'cafes',
    },
  ];

  const filteredCards =
    activeCategory === 'all'
      ? featuredCards
      : featuredCards.filter((c) => c.type === activeCategory || c.id === 'main');

  return (
    <div className="space-y-6 pb-20">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-18 left-1/2 -translate-x-1/2 z-50 bg-[#1E3A2B] text-white px-4 py-2 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-top-2">
          <Check className="w-4 h-4 text-[#B8E2C8]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Screen Title & Greeting Section */}
      <section className="flex items-center justify-between gap-4 pt-2">
        <div>
          <span className="text-xs font-semibold text-[#627768] tracking-wider uppercase">
            Personal Expedition Ledger
          </span>
          <h1 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1E3A2B] tracking-tight mt-0.5">
            Let&apos;s manage {settings.userName.split(' ')[0] || 'Alex'}
          </h1>
          <p className="text-xs sm:text-sm text-[#55695B] mt-1">
            Soft pacing, funded adventures, and zero guilt for your upcoming travels.
          </p>
        </div>

        {/* Custom Whimsical Illustration Avatar on the Right */}
        <div className="shrink-0 relative">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl p-1 bg-white shadow-md border-2 border-white overflow-hidden rotate-2 hover:rotate-0 transition-transform">
            <img
              src="/src/assets/images/traveler_user_avatar_1792993787575.jpg"
              alt="Alex Avatar"
              className="w-full h-full object-cover rounded-2xl"
            />
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#1E3A2B] text-white flex items-center justify-center text-[11px] shadow-sm">
            ✈
          </div>
        </div>
      </section>

      {/* Date Selector Pill Dropdown */}
      <div className="relative">
        <button
          onClick={() => setIsDateDropdownOpen(!isDateDropdownOpen)}
          className="inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-white border border-[#DCE7DD] shadow-xs text-xs font-semibold text-[#233329] hover:border-[#1E3A2B] transition-all"
        >
          <Calendar className="w-4 h-4 text-[#C85A32]" />
          <span>{selectedDateRange}</span>
          <ChevronDown
            className={`w-3.5 h-3.5 text-[#627768] transition-transform ${
              isDateDropdownOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {isDateDropdownOpen && (
          <div className="absolute top-12 left-0 w-72 bg-white rounded-3xl shadow-xl border border-[#DCE7DD] p-2 z-30 animate-in fade-in zoom-in-95">
            <span className="text-[10px] font-bold text-[#7A8E7F] uppercase tracking-wider block px-3 py-1.5">
              Select Expedition Window
            </span>
            {dateOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => {
                  setSelectedDateRange(opt);
                  setIsDateDropdownOpen(false);
                  showToast(`Updated view range to: ${opt}`);
                }}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  selectedDateRange === opt
                    ? 'bg-[#1E3A2B] text-white font-semibold'
                    : 'text-[#233329] hover:bg-[#F4F7F4]'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Horizontal Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categoryChips.map((chip) => {
          const Icon = chip.icon;
          const isActive = activeCategory === chip.id;
          return (
            <button
              key={chip.id}
              onClick={() => setActiveCategory(chip.id)}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold transition-all whitespace-nowrap shadow-xs ${
                isActive
                  ? 'bg-[#1E3A2B] text-white border border-[#1E3A2B] shadow-sm'
                  : 'bg-white text-[#55695B] border border-[#E2ECE1] hover:text-[#233329] hover:border-[#C5D7C4]'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : chip.color}`} />
              <span>{chip.label}</span>
            </button>
          );
        })}
      </div>

      {/* Screen 1 Hero Card: Large Framed Graphic (Polaroid-style frame) */}
      <div className="polaroid-frame rounded-3xl transition-all hover:shadow-2xl">
        <div className="relative rounded-2xl overflow-hidden aspect-[4/3] sm:aspect-[16/9] bg-[#E8EFE9]">
          <img
            src="/src/assets/images/home_travel_hero_1792993749411.jpg"
            alt="Pacific Cascade Expedition"
            className="w-full h-full object-cover"
          />

          {/* Scrim Gradient for Legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1E3A2B]/80 via-transparent to-black/30 pointer-events-none" />

          {/* Top-Left: Rating Pill */}
          <div className="absolute top-4 left-4 z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-xs font-bold text-[#233329] shadow-md border border-white">
              <Star className="w-3.5 h-3.5 fill-[#E05A2B] text-[#E05A2B]" />
              <span>4.95 · Top Plan</span>
            </span>
          </div>

          {/* Top-Right: Bookmark Icon Button */}
          <div className="absolute top-4 right-4 z-10">
            <button
              onClick={() => toggleBookmark('main', 'Pacific Cascade Expedition')}
              className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all shadow-md backdrop-blur-md border border-white active:scale-95 ${
                bookmarkedCards.main
                  ? 'bg-[#E05A2B] text-white'
                  : 'bg-white/95 text-[#233329] hover:bg-white'
              }`}
              title="Bookmark Expedition"
              aria-label="Bookmark Expedition"
            >
              <Bookmark className={`w-4 h-4 ${bookmarkedCards.main ? 'fill-white' : ''}`} />
            </button>
          </div>

          {/* Hero Bottom Overlay Content */}
          <div className="absolute bottom-4 left-4 right-4 z-10 text-white">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-lg bg-white/20 backdrop-blur-xs text-white">
                Cascade Range · Wilderness Retreat
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-lg bg-black/30 backdrop-blur-xs text-[#E8EFE9]">
                Oct 24 – 31 · 7 Days
              </span>
            </div>

            <h2 className="font-editorial text-2xl sm:text-3xl font-bold tracking-tight text-white drop-shadow-sm">
              Pacific Cascade Expedition & Cabin Stay
            </h2>
          </div>
        </div>

        {/* Polaroid Card Caption / Footer with Bold Highlight Price & Action */}
        <div className="pt-4 px-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#627768] font-medium">Allocated Budget</span>
              <span className="text-xs px-2 py-0.5 rounded-md bg-[#F4F7F4] text-[#1E3A2B] font-semibold">
                74% Funded in Jar
              </span>
            </div>
            <div className="flex items-baseline gap-2 mt-0.5">
              {/* Bold Rust Highlight Price */}
              <span className="text-3xl sm:text-4xl font-extrabold text-[#C85A32] tracking-tight">
                $2.5k
              </span>
              <span className="text-xs text-[#627768]">total planned ($1,240 spent to date)</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('itinerary')}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#1E3A2B] hover:bg-[#15291E] text-white text-xs font-bold transition-all shadow-md shadow-[#1E3A2B]/15 active:scale-95"
            >
              <span>View Detailed Itinerary</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('plan_map')}
              className="inline-flex items-center justify-center p-3 rounded-2xl bg-[#F4F7F4] hover:bg-[#E8EFE9] text-[#1E3A2B] text-xs font-bold transition-all border border-[#DCE7DD]"
              title="Open Island Trail Map"
            >
              <MapPin className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Floating White Rounded Cards Displaying Key Meta-Data */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-editorial text-xl font-bold text-[#1E3A2B]">
            Expedition Vitals & Safe Limits
          </h3>
          <span className="text-xs text-[#627768] font-medium">Live Ledger Sync</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {/* Info Card 1: Safe Daily Spend */}
          <div className="travel-card rounded-3xl p-5 relative overflow-hidden group hover:border-[#1E3A2B]/30 transition-all">
            <div className="flex items-center justify-between text-xs text-[#627768] mb-1">
              <span className="font-medium">Safe Daily Spending</span>
              <span className="w-2 h-2 rounded-full bg-[#3E6553]" />
            </div>
            {/* Bold Orange Callout */}
            <div className="text-2xl sm:text-3xl font-extrabold text-[#C85A32] tracking-tight mt-1">
              $60<span className="text-sm font-semibold text-[#627768]">/day</span>
            </div>
            <p className="text-[11px] text-[#55695B] mt-1 leading-snug">
              Protected allowance across 7 days without dipping into lodging deposits.
            </p>
            <div className="mt-3 pt-3 border-t border-[#F0F4F1] flex items-center justify-between text-[11px]">
              <span className="text-[#627768]">Pacing Status</span>
              <span className="font-semibold text-[#1E3A2B]">Calm & Green</span>
            </div>
          </div>

          {/* Info Card 2: Travel Jar Progress */}
          <div className="travel-card rounded-3xl p-5 relative overflow-hidden group hover:border-[#1E3A2B]/30 transition-all">
            <div className="flex items-center justify-between text-xs text-[#627768] mb-1">
              <span className="font-medium">Travel Jar Vault</span>
              <Sparkles className="w-4 h-4 text-[#C85A32]" />
            </div>
            {/* Bold Highlight Numbers */}
            <div className="text-2xl sm:text-3xl font-extrabold text-[#1E3A2B] tracking-tight mt-1">
              $1,850
            </div>
            <p className="text-[11px] text-[#55695B] mt-1 leading-snug">
              Of <span className="font-bold text-[#C85A32]">$2,500</span> expedition goal (74% locked).
            </p>
            {/* Mini Progress Bar */}
            <div className="mt-3.5 w-full bg-[#E8EFE9] h-2 rounded-full overflow-hidden">
              <div className="bg-[#1E3A2B] h-full rounded-full transition-all duration-500" style={{ width: '74%' }} />
            </div>
          </div>

          {/* Info Card 3: Scheduled Obligations */}
          <div className="travel-card rounded-3xl p-5 relative overflow-hidden group hover:border-[#1E3A2B]/30 transition-all">
            <div className="flex items-center justify-between text-xs text-[#627768] mb-1">
              <span className="font-medium">Reserved Bookings</span>
              <ShieldCheck className="w-4 h-4 text-[#3E6553]" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#C85A32] tracking-tight mt-1">
              $365
            </div>
            <p className="text-[11px] text-[#55695B] mt-1 leading-snug">
              Driftwood Lodge deposit & Ferry passes auto-shielded.
            </p>
            <div className="mt-3 pt-3 border-t border-[#F0F4F1] flex items-center justify-between text-[11px]">
              <span className="text-[#627768]">Due date</span>
              <span className="font-semibold text-[#1E3A2B]">Oct 25 (In 2 days)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Secondary Destination & Activity Cards */}
      <section className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="font-editorial text-xl font-bold text-[#1E3A2B]">
            Curated Expedition Trails
          </h3>
          <span className="text-xs text-[#627768]">Filter: {activeCategory}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCards.slice(1).map((card) => (
            <div
              key={card.id}
              className="travel-card rounded-3xl p-3.5 hover:shadow-lg transition-all border border-[#E2ECE1] flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-[#E8EFE9] mb-3">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2.5 left-2.5">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/95 text-[11px] font-bold text-[#233329] shadow-xs">
                      <Star className="w-3 h-3 fill-[#E05A2B] text-[#E05A2B]" />
                      <span>{card.rating}</span>
                    </span>
                  </div>
                  <div className="absolute top-2.5 right-2.5">
                    <button
                      onClick={() => toggleBookmark(card.id, card.title)}
                      className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all shadow-xs ${
                        bookmarkedCards[card.id]
                          ? 'bg-[#E05A2B] text-white'
                          : 'bg-white/90 text-[#233329]'
                      }`}
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${bookmarkedCards[card.id] ? 'fill-white' : ''}`} />
                    </button>
                  </div>
                </div>

                <div className="px-1">
                  <span className="text-[11px] text-[#627768] font-medium block">
                    {card.category}
                  </span>
                  <h4 className="font-editorial text-lg font-bold text-[#1E3A2B] mt-0.5 leading-snug">
                    {card.title}
                  </h4>
                </div>
              </div>

              <div className="pt-3 px-1 mt-2 border-t border-[#F0F4F1] flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#627768] block">Est. Budget</span>
                  <span className="text-xl font-bold text-[#C85A32]">{card.budget}</span>
                </div>
                <button
                  onClick={() => onNavigate(card.targetScreen)}
                  className="px-4 py-2 rounded-xl bg-[#1E3A2B] hover:bg-[#15291E] text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
                >
                  <span>Explore</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Action Footer Strip */}
      <section className="p-4 rounded-3xl bg-white border border-[#DCE7DD] shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#E8EFE9] text-[#1E3A2B] flex items-center justify-center">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#233329]">Need real-time budget advice?</h4>
            <p className="text-[11px] text-[#627768]">
              Ask our calm Money Coach before booking additional excursions.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenCoach}
            className="px-4 py-2.5 rounded-2xl bg-[#F4F7F4] hover:bg-[#E8EFE9] text-[#1E3A2B] text-xs font-bold transition-all border border-[#DCE7DD]"
          >
            Ask Coach
          </button>
          <button
            onClick={onOpenAddModal}
            className="px-4 py-2.5 rounded-2xl bg-[#1E3A2B] hover:bg-[#15291E] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Log Expense</span>
          </button>
        </div>
      </section>
    </div>
  );
};
