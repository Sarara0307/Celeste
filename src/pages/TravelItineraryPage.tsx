/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import {
  ArrowLeft,
  Share2,
  Calendar,
  Clock,
  MapPin,
  Coffee,
  Ship,
  TreePine,
  Utensils,
  Moon,
  Plus,
  Check,
  CheckCircle2,
  Circle,
  Tag,
  DollarSign,
  Sparkles,
  X,
  Compass,
} from 'lucide-react';

interface TravelItineraryPageProps {
  onNavigate: (screen: string) => void;
  onOpenAddModal: () => void;
}

interface ItineraryItem {
  id: string;
  time: string;
  title: string;
  description: string;
  category: string;
  cost: number;
  icon: string;
  isCompleted: boolean;
  location: string;
}

export const TravelItineraryPage: React.FC<TravelItineraryPageProps> = ({
  onNavigate,
  onOpenAddModal,
}) => {
  const { summary } = useFinance();

  const [activeDay, setActiveDay] = useState<'day1' | 'day2' | 'day3'>('day1');
  const [shareToast, setShareToast] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form state for adding an item
  const [newItemTime, setNewItemTime] = useState('02:00 p.m.');
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemCost, setNewItemCost] = useState('35');
  const [newItemCategory, setNewItemCategory] = useState('Activity');

  const [itemsByDay, setItemsByDay] = useState<Record<string, ItineraryItem[]>>({
    day1: [
      {
        id: 'item-1',
        time: '08:30 a.m.',
        title: 'Morning Camp Espresso & Trail Pastries',
        description: 'Warm brews and artisan cinnamon rolls by the trailhead cafe.',
        category: 'Food & Cafe',
        cost: 18.5,
        icon: 'coffee',
        isCompleted: true,
        location: 'Cascade Base Camp Coffeehouse',
      },
      {
        id: 'item-2',
        time: '10:15 a.m.',
        title: 'Canoe Rental & Dock Launch at Lake Mist',
        description: '2-hour handcrafted cedar canoe rental with life vests and paddles.',
        category: 'Activity',
        cost: 45.0,
        icon: 'canoe',
        isCompleted: true,
        location: 'Whispering Pines Marina Dock',
      },
      {
        id: 'item-3',
        time: '12:30 p.m.',
        title: 'Meadow Wildflower Picnic & Rest',
        description: 'Packed sourdough sandwiches, local apples, and alpine springs.',
        category: 'Food & Provisions',
        cost: 24.0,
        icon: 'utensils',
        isCompleted: false,
        location: 'Mirror Lake Shoreline',
      },
      {
        id: 'item-4',
        time: '03:45 p.m.',
        title: 'Whispering Pines Woodland Hike',
        description: 'Guided natural reserve hike observing bald eagles and moss forest.',
        category: 'Guided Excursion',
        cost: 35.0,
        icon: 'hiking',
        isCompleted: false,
        location: 'North Ridge Lookout Trail',
      },
      {
        id: 'item-5',
        time: '07:00 p.m.',
        title: 'Timberline Lodge Hearth Dinner & Stargazing',
        description: 'Cedar-smoked salmon, roasted harvest squash, and bonfire night.',
        category: 'Lodge Dining',
        cost: 62.0,
        icon: 'moon',
        isCompleted: false,
        location: 'Driftwood Main Lodge',
      },
    ],
    day2: [
      {
        id: 'item-6',
        time: '09:00 a.m.',
        title: 'Ferry Crossing to Emerald Cove',
        description: 'Morning coastal passenger ferry with panoramic archipelago views.',
        category: 'Transit',
        cost: 28.0,
        icon: 'canoe',
        isCompleted: false,
        location: 'Fisherman Cove Terminal',
      },
      {
        id: 'item-7',
        time: '12:30 p.m.',
        title: 'Island Organic Berry Farm & Lunch',
        description: 'Farm-to-table lunch bowl and basket of fresh blackberries.',
        category: 'Food & Cafe',
        cost: 32.0,
        icon: 'utensils',
        isCompleted: false,
        location: 'Sunny Slope Orchard',
      },
      {
        id: 'item-8',
        time: '04:15 p.m.',
        title: 'Ancient Stone Circle Meditation',
        description: 'Historic Neolithic stone monuments atop coastal cliff.',
        category: 'Sightseeing',
        cost: 0.0,
        icon: 'hiking',
        isCompleted: false,
        location: 'Cape Monoliths',
      },
    ],
    day3: [
      {
        id: 'item-9',
        time: '10:00 a.m.',
        title: 'Mystic Waterfall Swimming Pool',
        description: 'Refreshing dip under glacial waterfall natural pool.',
        category: 'Activity',
        cost: 15.0,
        icon: 'hiking',
        isCompleted: false,
        location: 'Emerald Basin Falls',
      },
      {
        id: 'item-10',
        time: '01:00 p.m.',
        title: 'Seaside Chowder Shack',
        description: 'Clam chowder in toasted sourdough bread bowl.',
        category: 'Food & Cafe',
        cost: 26.5,
        icon: 'utensils',
        isCompleted: false,
        location: 'Harbor Wharf',
      },
    ],
  });

  const toggleItemCompleted = (id: string) => {
    setItemsByDay((prev) => ({
      ...prev,
      [activeDay]: prev[activeDay].map((it) =>
        it.id === id ? { ...it, isCompleted: !it.isCompleted } : it
      ),
    }));
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemTitle.trim()) return;

    const newItem: ItineraryItem = {
      id: `custom-${Date.now()}`,
      time: newItemTime,
      title: newItemTitle,
      description: newItemDesc || 'Custom scheduled stop.',
      category: newItemCategory,
      cost: parseFloat(newItemCost) || 0,
      icon: 'sparkles',
      isCompleted: false,
      location: 'Cascade Route',
    };

    setItemsByDay((prev) => ({
      ...prev,
      [activeDay]: [...prev[activeDay], newItem],
    }));

    setNewItemTitle('');
    setNewItemDesc('');
    setIsAddModalOpen(false);
  };

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

  const currentItems = itemsByDay[activeDay] || [];
  const dayTotal = currentItems.reduce((acc, it) => acc + it.cost, 0);
  const daySpent = currentItems
    .filter((it) => it.isCompleted)
    .reduce((acc, it) => acc + it.cost, 0);

  const renderIcon = (type: string) => {
    switch (type) {
      case 'coffee':
        return <Coffee className="w-4 h-4 text-[#C85A32]" />;
      case 'canoe':
        return <Ship className="w-4 h-4 text-[#3E6553]" />;
      case 'utensils':
        return <Utensils className="w-4 h-4 text-[#C85A32]" />;
      case 'hiking':
        return <TreePine className="w-4 h-4 text-[#1E3A2B]" />;
      case 'moon':
        return <Moon className="w-4 h-4 text-[#43597D]" />;
      default:
        return <Sparkles className="w-4 h-4 text-[#1E3A2B]" />;
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Share Toast Notification */}
      {shareToast && (
        <div className="fixed top-18 left-1/2 -translate-x-1/2 z-50 bg-[#1E3A2B] text-white px-4 py-2 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-semibold animate-in fade-in">
          <Check className="w-4 h-4 text-[#B8E2C8]" />
          <span>Itinerary link copied to clipboard!</span>
        </div>
      )}

      {/* Screen 2 Top Navigation Header */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => onNavigate('home')}
          className="w-10 h-10 rounded-2xl bg-white shadow-sm hover:shadow-md border border-[#DCE7DD] flex items-center justify-center text-[#233329] hover:text-[#1E3A2B] transition-all active:scale-95"
          title="Back to Home Dashboard"
          aria-label="Back to Home"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Dynamic Title Bar */}
        <div className="text-center">
          <span className="text-[10px] font-bold text-[#627768] uppercase tracking-wider block">
            Detailed Itinerary
          </span>
          <h2 className="font-editorial text-lg sm:text-xl font-bold text-[#1E3A2B]">
            Pacific Cascade Journey
          </h2>
        </div>

        <button
          onClick={handleShare}
          className="w-10 h-10 rounded-2xl bg-white shadow-sm hover:shadow-md border border-[#DCE7DD] flex items-center justify-center text-[#233329] hover:text-[#1E3A2B] transition-all active:scale-95"
          title="Share Itinerary"
          aria-label="Share Itinerary"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      {/* Hero Visual Wrapped in White Frame (Polaroid-style container) */}
      <div className="polaroid-frame rounded-3xl overflow-hidden transition-all hover:shadow-xl">
        <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-[#E8EFE9]">
          <img
            src="/src/assets/images/itinerary_scenic_hero_1792993761367.jpg"
            alt="Alpine Lake and Valley"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1E3A2B]/85 via-black/20 to-transparent pointer-events-none" />

          {/* Badge overlays on Hero */}
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-xs font-bold text-[#1E3A2B] shadow-sm">
              ★ 4.92 · Alpine Excursion
            </span>
          </div>

          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-lg bg-white/20 backdrop-blur-xs">
                Pacific Northwest · 7 Days
              </span>
              <span className="text-xs text-[#E8EFE9]">Oct 24 – Oct 31, 2026</span>
            </div>
            <h1 className="font-editorial text-2xl sm:text-3xl lg:text-4xl font-bold drop-shadow-sm">
              Tranquil Alpine Lake & Valley Expedition
            </h1>
          </div>
        </div>

        {/* High-Contrast Serif Heading + Dates & Total Budget Badge in Warm Rust */}
        <div className="pt-4 px-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs text-[#627768] font-medium">Expedition Envelope</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-xs text-[#627768]">Total Budget:</span>
              {/* Total budget badge in warm rust font */}
              <span className="text-2xl sm:text-3xl font-extrabold text-[#C85A32] tracking-tight">
                $2,500
              </span>
              <span className="text-xs text-[#55695B] font-semibold">
                ($1,240 Spent · $1,260 Remaining)
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-[#1E3A2B] hover:bg-[#15291E] text-white text-xs font-bold transition-all shadow-sm active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Activity Stop</span>
          </button>
        </div>
      </div>

      {/* Day Selector Pills */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1">
        <div className="flex items-center gap-2">
          {[
            { id: 'day1', label: 'Day 1 · Fri, Oct 24', count: itemsByDay.day1.length },
            { id: 'day2', label: 'Day 2 · Sat, Oct 25', count: itemsByDay.day2.length },
            { id: 'day3', label: 'Day 3 · Sun, Oct 26', count: itemsByDay.day3.length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveDay(tab.id as any)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap shadow-xs ${
                activeDay === tab.id
                  ? 'bg-[#1E3A2B] text-white shadow-sm'
                  : 'bg-white text-[#55695B] border border-[#E2ECE1] hover:text-[#233329]'
              }`}
            >
              <span>{tab.label}</span>
              <span className="ml-1.5 opacity-70">({tab.count})</span>
            </button>
          ))}
        </div>

        {/* Day Total Badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#DCE7DD] text-xs font-semibold text-[#233329]">
          <span className="text-[#627768]">Day Est:</span>
          <span className="font-extrabold text-[#C85A32]">${dayTotal.toFixed(2)}</span>
        </div>
      </div>

      {/* Vertical Timeline with Bold Time Indicators & Rounded White Activity Pills */}
      <section className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#1E3A2B]" />
            <h3 className="font-editorial text-xl font-bold text-[#1E3A2B]">
              Timeline & Activity Schedule
            </h3>
          </div>
          <span className="text-xs text-[#627768] font-medium">
            {currentItems.filter((i) => i.isCompleted).length} of {currentItems.length} completed
          </span>
        </div>

        {/* Timeline List */}
        <div className="relative pl-6 sm:pl-8 space-y-5 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#D4E3D3]">
          {currentItems.map((item, idx) => (
            <div key={item.id} className="relative flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4 group">
              {/* Timeline Dot Indicator */}
              <button
                onClick={() => toggleItemCompleted(item.id)}
                className={`absolute -left-6 sm:-left-8 top-1.5 w-6 h-6 rounded-full flex items-center justify-center transition-all bg-white border-2 z-10 ${
                  item.isCompleted
                    ? 'border-[#1E3A2B] bg-[#1E3A2B] text-white'
                    : 'border-[#3E6553] text-[#3E6553] hover:border-[#1E3A2B]'
                }`}
                title={item.isCompleted ? 'Mark pending' : 'Mark completed'}
              >
                {item.isCompleted ? (
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-[#3E6553]" />
                )}
              </button>

              {/* Bold Time Indicator on Left */}
              <div className="sm:w-28 shrink-0">
                <span className="text-xs sm:text-sm font-extrabold text-[#1E3A2B] tracking-tight block">
                  {item.time}
                </span>
                <span className="text-[11px] text-[#627768]">{item.category}</span>
              </div>

              {/* White Pill-Shaped Event Detail Card on Right */}
              <div
                className={`flex-1 rounded-3xl p-4 sm:p-5 transition-all border shadow-xs hover:shadow-md ${
                  item.isCompleted
                    ? 'bg-[#F9FAF9] border-[#E2ECE1] opacity-90'
                    : 'bg-white border-[#DCE7DD]'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-2xl bg-[#F4F7F4] border border-[#E2ECE1] flex items-center justify-center shrink-0 mt-0.5">
                      {renderIcon(item.icon)}
                    </div>
                    <div>
                      <h4
                        className={`text-sm sm:text-base font-bold text-[#233329] ${
                          item.isCompleted ? 'line-through text-[#627768]' : ''
                        }`}
                      >
                        {item.title}
                      </h4>
                      <p className="text-xs text-[#55695B] mt-0.5 leading-relaxed">
                        {item.description}
                      </p>
                      <div className="flex items-center gap-1.5 text-[11px] text-[#7A8E7F] mt-2">
                        <MapPin className="w-3 h-3 text-[#C85A32]" />
                        <span>{item.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Price Tag Highlight */}
                  <div className="text-right shrink-0">
                    <span className="text-sm sm:text-base font-extrabold text-[#C85A32] block">
                      ${item.cost.toFixed(2)}
                    </span>
                    <span className="text-[10px] text-[#7A8E7F]">
                      {item.isCompleted ? 'Paid' : 'Estimated'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Navigation action to Map View */}
      <div className="pt-4 flex items-center justify-between p-4 rounded-3xl bg-white border border-[#DCE7DD] shadow-xs">
        <div>
          <span className="text-xs font-bold text-[#233329] block">
            Want to see pinned trail stops?
          </span>
          <span className="text-[11px] text-[#627768]">
            Switch to the island plan map view with dashed trails.
          </span>
        </div>
        <button
          onClick={() => onNavigate('plan_map')}
          className="px-4 py-2.5 rounded-2xl bg-[#1E3A2B] hover:bg-[#15291E] text-white text-xs font-bold transition-all shadow-xs"
        >
          View Island Map →
        </button>
      </div>

      {/* Add Timeline Item Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setIsAddModalOpen(false)}
            className="fixed inset-0 bg-[#233329]/40 backdrop-blur-xs"
          />
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 z-10 border border-[#DCE7DD] animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0F4F1] mb-4">
              <h3 className="font-editorial text-xl font-bold text-[#1E3A2B]">
                Add Timeline Activity
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-xl text-[#627768] hover:bg-[#F4F7F4]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddItem} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#233329] block mb-1">Time Indicator</label>
                <input
                  type="text"
                  value={newItemTime}
                  onChange={(e) => setNewItemTime(e.target.value)}
                  placeholder="e.g. 02:30 p.m."
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-[#DCE7DD] text-xs focus:outline-none focus:border-[#1E3A2B]"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#233329] block mb-1">Activity Title</label>
                <input
                  type="text"
                  value={newItemTitle}
                  onChange={(e) => setNewItemTitle(e.target.value)}
                  placeholder="e.g. Sunset Kayak or Bakery Stop"
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-[#DCE7DD] text-xs focus:outline-none focus:border-[#1E3A2B]"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#233329] block mb-1">Description / Notes</label>
                <input
                  type="text"
                  value={newItemDesc}
                  onChange={(e) => setNewItemDesc(e.target.value)}
                  placeholder="e.g. Bring camera and warm fleece"
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-[#DCE7DD] text-xs focus:outline-none focus:border-[#1E3A2B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#233329] block mb-1">Estimated Cost ($)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={newItemCost}
                    onChange={(e) => setNewItemCost(e.target.value)}
                    placeholder="25"
                    className="w-full px-3.5 py-2.5 rounded-2xl border border-[#DCE7DD] text-xs focus:outline-none focus:border-[#1E3A2B]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#233329] block mb-1">Category</label>
                  <select
                    value={newItemCategory}
                    onChange={(e) => setNewItemCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-2xl border border-[#DCE7DD] text-xs focus:outline-none focus:border-[#1E3A2B] bg-white"
                  >
                    <option value="Activity">Activity</option>
                    <option value="Food & Cafe">Food & Cafe</option>
                    <option value="Transit">Transit</option>
                    <option value="Lodge">Lodge</option>
                    <option value="Gear">Gear</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-2xl text-xs font-semibold text-[#627768] hover:bg-[#F4F7F4]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-2xl bg-[#1E3A2B] hover:bg-[#15291E] text-white text-xs font-bold shadow-xs"
                >
                  Add to Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
