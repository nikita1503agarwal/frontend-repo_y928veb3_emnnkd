import React from 'react';
import { Leaf, TrendingDown, Settings } from 'lucide-react';

export default function Header({ todayTotal, weeklyTotal, onOpenSettings }) {
  return (
    <header className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl p-6 shadow-lg">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-white/15 p-2 rounded-xl">
            <Leaf className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Carbon Tracker</h1>
            <p className="text-white/80 text-sm">Log your day and get tailored ways to lower your footprint</p>
          </div>
        </div>
        <button
          onClick={onOpenSettings}
          className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-colors px-3 py-2 rounded-lg text-sm"
        >
          <Settings className="w-4 h-4" /> Preferences
        </button>
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Today's total" value={`${todayTotal.toFixed(2)} kg CO₂e`} />
        <StatCard label="Last 7 days" value={`${weeklyTotal.toFixed(2)} kg CO₂e`} />
        <div className="bg-white/10 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-white/80">Goal hint</p>
            <p className="text-base font-medium">Stay under your daily target</p>
          </div>
          <div className="bg-white text-emerald-700 rounded-lg px-3 py-2 flex items-center gap-2">
            <TrendingDown className="w-4 h-4" />
            <span className="text-sm font-semibold">You got this</span>
          </div>
        </div>
      </div>
    </header>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="bg-white/10 rounded-xl p-4">
      <p className="text-white/80 text-sm">{label}</p>
      <p className="text-white text-xl font-semibold mt-1">{value}</p>
    </div>
  );
}
