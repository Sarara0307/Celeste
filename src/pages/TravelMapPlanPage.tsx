/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import {
  ArrowLeft,
  Share2,
  Star,
  ChevronDown,
  ChevronUp,
  MapPin,
  Sun,
  DollarSign,
  Compass,
  Calendar,
  X,
  Check,
  ShieldCheck,
  TreePine,
  Coffee,
  Ship,
  Sparkles,
  ArrowRight,
  Info,
} from 'lucide-react';

interface TravelMapPlanPageProps {
  onNavigate: (screen: string) => void;
  onOpenAddModal: () => void;
}

interface MapMarker {
  id: string;
  name: string;
  category: string;
  xPercent: number; // 0 - 100%
  yPercent: number; // 0 - 100%
  status: string;
  cost: string;
  highlight: string;
  icon: string;
}

export const TravelMapPlanPage: React.FC<TravelMapPlanPageProps> = ({
  onNavigate,
  onOpenAddModal,
}) => {
  const { summary, settings } = useFinance();

  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [shareToast, setShareToast] = useState(false);

  const markers: MapMarker[] = [
    {
      id: 'lookout',
      name: 'Oceanview Lookout',
      category: 'Scenic Vista',
      xPercent: 28,
      yPercent: 28,
      status: 'Open Trail',
      cost: 'Free',
      highlight: 'Panoramic view over the Pacific coastline.',
      icon: 'compass',
    },
    {
      id: 'pinecroft',
      name: 'Pinecroft Lodge',
      category: 'Base Cabin',
      xPercent: 44,
      yPercent: 32,
      status: 'Booked & Reserved',
      cost: '$180 / night',
      highlight: 'Warm wood-burning stove and pine meadow views.',
      icon: 'cabin',
    },
    {
      id: 'woods',
      name: 'Whispering Pines Woods',
      category: 'Old Growth Forest',
      xPercent: 36,
      yPercent: 44,
      status: 'Day 1 Excursion',
      cost: '$15 entry',
      highlight: 'Canopy walk with bald eagle nesting towers.',
      icon: 'forest',
    },
    {
      id: 'waterfall',
      name: 'Mystic Waterfall & Mirror Lake',
      category: 'Alpine Lagoon',
      xPercent: 50,
      yPercent: 57,
      status: 'Midday Swim Stop',
      cost: 'Free',
      highlight: 'Glacial runoff cascading into tranquil blue pool.',
      icon: 'waterfall',
    },
    {
      id: 'cottage',
      name: 'Driftwood Cottage',
      category: 'Historic Stay',
      xPercent: 64,
      yPercent: 35,
      status: 'Deposit Shielded',
      cost: '$140 / night',
      highlight: 'Oceanfront deck overlooking coastal seals.',
      icon: 'cabin',
    },
    {
      id: 'cove',
      name: "Fisherman's Cove & Dock",
      category: 'Seaside Harbor',
      xPercent: 72,
      yPercent: 49,
      status: 'Ferry Departure',
      cost: '$28 ferry pass',
      highlight: 'Local clam chowder and wooden dory rentals.',
      icon: 'ferry',
    },
    {
      id: 'lighthouse',
      name: 'Lighthouse Cape',
      category: 'Maritime Monument',
      xPercent: 82,
      yPercent: 30,
      status: 'Sunset Point',
      cost: 'Free access',
      highlight: 'Historic 1890 red-and-white beacon on sea cliff.',
      icon: 'compass',
    },
    {
      id: 'stones',
      name: 'Ancient Stone Circle',
      category: 'Archaeological Site',
      xPercent: 76,
      yPercent: 72,
      status: 'Day 2 Highlight',
      cost: 'Free access',
      highlight: 'Prehistoric stone megaliths positioned along solstices.',
      icon: 'forest',
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
    setShareToast(true);
    setTimeout(() => setShareToast(false), 2400);
  };

  return (
    <div className="space-y-6 pb-28 relative">
      {/* Toast Alert */}
      {shareToast && (
        <div className="fixed top-18 left-1/2 -translate-x-1/2 z-50 bg-[#1E3A2B] text-white px-4 py-2 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-semibold animate-in fade-in">
          <Check className="w-4 h-4 text-[#B8E2C8]" />
          <span>Island Plan link copied to clipboard!</span>
        </div>
      )}

      {/* Screen 3 Top Title Bar: "Your Personal Plan" */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => onNavigate('home')}
          className="w-10 h-10 rounded-2xl bg-white shadow-sm hover:shadow-md border border-[#DCE7DD] flex items-center justify-center text-[#233329] hover:text-[#1E3A2B] transition-all active:scale-95"
          title="Back to Home Dashboard"
          aria-label="Back to Home"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="text-center">
          <span className="text-[10px] font-bold text-[#627768] uppercase tracking-wider block">
            Territory Overview
          </span>
          <h1 className="font-editorial text-lg sm:text-xl font-bold text-[#1E3A2B]">
            Your Personal Plan
          </h1>
        </div>

        <button
          onClick={handleShare}
          className="w-10 h-10 rounded-2xl bg-white shadow-sm hover:shadow-md border border-[#DCE7DD] flex items-center justify-center text-[#233329] hover:text-[#1E3A2B] transition-all active:scale-95"
          title="Share Plan"
          aria-label="Share Plan"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      {/* Custom Vector Island Map Layout with Pinned Icons & Connecting Dashed Lines */}
      <div className="polaroid-frame rounded-3xl overflow-hidden relative group">
        <div className="relative aspect-[4/3] sm:aspect-[16/10] rounded-2xl overflow-hidden bg-[#E2ECE1] select-none">
          {/* Map Image Base */}
          <img
            src="/src/assets/images/adventure_island_map_1792993773840.jpg"
            alt="The Emerald Archipelago Map"
            className="w-full h-full object-cover"
          />

          {/* SVG Overlay for Dashed Connecting Path Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            {/* Dashed trail from Lookout to Pinecroft to Waterfall to Cove to Stones */}
            <path
              d="M 28% 28% Q 36% 30% 44% 32% T 50% 57% T 72% 49% T 76% 72%"
              fill="none"
              stroke="#C85A32"
              strokeWidth="2.5"
              strokeDasharray="6 6"
              strokeLinecap="round"
              className="opacity-75"
            />
            {/* Secondary trail to Lighthouse and Driftwood */}
            <path
              d="M 44% 32% Q 54% 33% 64% 35% T 82% 30%"
              fill="none"
              stroke="#C85A32"
              strokeWidth="2.5"
              strokeDasharray="6 6"
              strokeLinecap="round"
              className="opacity-75"
            />
          </svg>

          {/* Interactive Pinned Icons */}
          {markers.map((marker) => {
            const isSelected = selectedMarker?.id === marker.id;
            return (
              <button
                key={marker.id}
                onClick={() => setSelectedMarker(isSelected ? null : marker)}
                style={{ left: `${marker.xPercent}%`, top: `${marker.yPercent}%` }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 group z-20 focus:outline-none transition-all active:scale-95 ${
                  isSelected ? 'scale-125 z-30' : 'hover:scale-115'
                }`}
                title={marker.name}
              >
                {/* Pin Badge Bubble */}
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shadow-lg border-2 transition-all ${
                    isSelected
                      ? 'bg-[#E05A2B] border-white text-white ring-4 ring-[#E05A2B]/30'
                      : 'bg-white border-[#1E3A2B] text-[#1E3A2B] hover:bg-[#1E3A2B] hover:text-white'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5 fill-current" />
                </div>

                {/* Subtle pulse ring for active/selected */}
                <span className="absolute -inset-1 rounded-full bg-[#E05A2B]/20 animate-ping pointer-events-none" />
              </button>
            );
          })}

          {/* Active Marker Detail Card Popup Overlay on Map */}
          {selectedMarker && (
            <div className="absolute bottom-3 left-3 right-3 sm:left-auto sm:right-3 sm:w-80 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-white z-30 animate-in slide-in-from-bottom-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold text-[#C85A32] uppercase tracking-wider">
                    {selectedMarker.category}
                  </span>
                  <h4 className="font-editorial text-base font-bold text-[#1E3A2B]">
                    {selectedMarker.name}
                  </h4>
                </div>
                <button
                  onClick={() => setSelectedMarker(null)}
                  className="p-1 rounded-lg text-[#627768] hover:bg-[#F4F7F4]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-[#55695B] mt-1 leading-snug">
                {selectedMarker.highlight}
              </p>

              <div className="mt-3 pt-2.5 border-t border-[#F0F4F1] flex items-center justify-between text-xs">
                <span className="font-bold text-[#C85A32]">{selectedMarker.cost}</span>
                <span className="px-2 py-0.5 rounded-md bg-[#F4F7F4] text-[#1E3A2B] font-semibold text-[11px]">
                  {selectedMarker.status}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Map Legend / Caption */}
        <div className="pt-3 px-2 flex items-center justify-between text-xs text-[#627768]">
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E05A2B]" />
            Tap any pin to view trail vitals & costs
          </span>
          <span className="text-[11px] font-semibold text-[#1E3A2B]">8 Pinned Points of Interest</span>
        </div>
      </div>

      {/* Plan Header: Rating Badge & Bold Serif Title */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          {/* Rating Badge */}
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white text-xs font-bold text-[#1E3A2B] shadow-xs border border-[#DCE7DD]">
            <Star className="w-3.5 h-3.5 fill-[#E05A2B] text-[#E05A2B]" />
            <span>4.95 Rating · Eco Expedition</span>
          </span>
          <span className="text-xs text-[#627768]">Emerald Archipelago Plan</span>
        </div>

        {/* Bold Serif Title */}
        <h2 className="font-editorial text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1E3A2B] tracking-tight">
          The Emerald Archipelago Plan
        </h2>
        <p className="text-xs sm:text-sm text-[#55695B] leading-relaxed">
          A balanced route harmonizing secluded cabin stays, wildflower coastal trails, and local ferry routes—engineered to preserve your peace of mind and protect your wallet.
        </p>

        {/* 2x2 Grid of Micro-Data Pills */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          {/* Pill 1: Temperature / Weather Status */}
          <div className="rounded-2xl bg-white border border-[#DCE7DD] p-3.5 shadow-xs flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#F4F7F4] text-[#C85A32] flex items-center justify-center shrink-0">
              <Sun className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-[#627768] font-medium block">Climate / Weather</span>
              <span className="text-xs sm:text-sm font-bold text-[#233329]">
                72°F · Crisp & Sunny
              </span>
            </div>
          </div>

          {/* Pill 2: Daily Budget in Warm Burnt Orange / Rust Font */}
          <div className="rounded-2xl bg-white border border-[#DCE7DD] p-3.5 shadow-xs flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#FDF2EC] text-[#C85A32] flex items-center justify-center shrink-0">
              <DollarSign className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-[#627768] font-medium block">Daily Allowance</span>
              {/* Bold Rust font */}
              <span className="text-sm sm:text-base font-extrabold text-[#C85A32]">
                $60 / day
              </span>
            </div>
          </div>

          {/* Pill 3: Additional Metrics (Duration & Items) */}
          <div className="rounded-2xl bg-white border border-[#DCE7DD] p-3.5 shadow-xs flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#F4F7F4] text-[#1E3A2B] flex items-center justify-center shrink-0">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-[#627768] font-medium block">Duration & Stops</span>
              <span className="text-xs sm:text-sm font-bold text-[#233329]">
                7 Days · 14 Stops
              </span>
            </div>
          </div>

          {/* Pill 4: Country / Category Tag */}
          <div className="rounded-2xl bg-white border border-[#DCE7DD] p-3.5 shadow-xs flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#F4F7F4] text-[#3E6553] flex items-center justify-center shrink-0">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-[#627768] font-medium block">Region & Tag</span>
              <span className="text-xs sm:text-sm font-bold text-[#233329]">
                Pacific NW · Reserve
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Bottom Action Button in Deep Forest Green ("Show more v") */}
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-sm">
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="w-full py-3.5 px-6 rounded-full bg-[#1E3A2B] hover:bg-[#15291E] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-[#1E3A2B]/25 active:scale-98 transition-all"
        >
          <span>Show more</span>
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {/* Expanded Bottom Sheet Drawer ("Show more") */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end flex-col">
          {/* Backdrop */}
          <div
            onClick={() => setIsDrawerOpen(false)}
            className="fixed inset-0 bg-[#233329]/40 backdrop-blur-xs transition-opacity"
          />

          {/* Sheet Container */}
          <div className="relative w-full max-w-xl mx-auto bg-white rounded-t-3xl shadow-2xl p-6 z-10 border-t border-[#DCE7DD] max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-200">
            {/* Grab Handle */}
            <div className="w-12 h-1 bg-[#DCE7DD] rounded-full mx-auto mb-4" />

            <div className="flex items-center justify-between pb-3 border-b border-[#F0F4F1]">
              <div>
                <span className="text-[10px] font-bold text-[#627768] uppercase tracking-wider">
                  Full Breakdown
                </span>
                <h3 className="font-editorial text-2xl font-bold text-[#1E3A2B]">
                  Archipelago Plan Financial Deep-Dive
                </h3>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-1.5 rounded-xl text-[#627768] hover:bg-[#F4F7F4]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content in Drawer */}
            <div className="py-4 space-y-4">
              {/* Category Allocation */}
              <div>
                <h4 className="text-xs font-bold text-[#233329] uppercase tracking-wider mb-2">
                  Budget Allocation Breakdown
                </h4>
                <div className="space-y-2">
                  {[
                    { label: 'Lodging & Stays (Driftwood & Pinecroft)', amount: '$980', percent: '39%' },
                    { label: 'Camp Dining, Fish Chowder & Cafes', amount: '$540', percent: '22%' },
                    { label: 'Ferries & Trail Transit', amount: '$280', percent: '11%' },
                    { label: 'Guided Excursions & Canoe Dock', amount: '$360', percent: '14%' },
                    { label: 'Emergency Cushion & Reserve Buffer', amount: '$340', percent: '14%' },
                  ].map((row, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-[#F9FAF9] border border-[#E2ECE1] text-xs">
                      <div>
                        <span className="font-medium text-[#233329] block">{row.label}</span>
                        <span className="text-[10px] text-[#627768]">{row.percent} of overall plan</span>
                      </div>
                      <span className="font-extrabold text-[#C85A32]">{row.amount}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Peace-of-Mind Checklist */}
              <div className="p-4 rounded-2xl bg-[#F4F8F4] border border-[#D4E3D3]">
                <div className="flex items-center gap-2 mb-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#1E3A2B]" />
                  <span className="text-xs font-bold text-[#1E3A2B]">Zero-Debt Guarantee</span>
                </div>
                <p className="text-xs text-[#55695B] leading-relaxed">
                  Your regular home bills (rent, wifi, electricity) are 100% ring-fenced inside SaveSense. Every single dollar in this plan comes from discretionary surplus and your dedicated Travel Jar!
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                <button
                  onClick={() => {
                    setIsDrawerOpen(false);
                    onNavigate('itinerary');
                  }}
                  className="flex-1 py-3 px-4 rounded-2xl bg-[#1E3A2B] text-white text-xs font-bold text-center hover:bg-[#15291E] transition-all shadow-sm"
                >
                  View Day-by-Day Itinerary →
                </button>
                <button
                  onClick={() => {
                    setIsDrawerOpen(false);
                    onOpenAddModal();
                  }}
                  className="py-3 px-4 rounded-2xl bg-[#F4F7F4] border border-[#DCE7DD] text-[#1E3A2B] text-xs font-bold text-center hover:bg-[#E8EFE9] transition-all"
                >
                  Log Travel Expense
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
