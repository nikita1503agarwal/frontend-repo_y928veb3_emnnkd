import React, { useState } from 'react';
import { Car, Flame, Utensils, Zap } from 'lucide-react';

const CATEGORIES = [
  { key: 'transport', label: 'Transport', icon: Car },
  { key: 'food', label: 'Food', icon: Utensils },
  { key: 'energy', label: 'Home Energy', icon: Zap },
  { key: 'other', label: 'Other', icon: Flame },
];

export default function EntryForm({ onAdd, prefs }) {
  const [category, setCategory] = useState('transport');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');

  const factors = {
    transport: prefs?.transportFactor ?? 0.18, // kg CO2e per km (average small car)
    food: prefs?.foodFactor ?? 2.5, // per meal (mixed diet)
    energy: prefs?.energyFactor ?? 0.35, // per kWh
    other: prefs?.otherFactor ?? 1.0,
  };

  const units = {
    transport: 'km',
    food: 'meal(s)',
    energy: 'kWh',
    other: 'unit',
  };

  const iconFor = (key) => CATEGORIES.find(c => c.key === key)?.icon || Flame;

  const computeEmission = () => {
    const amt = parseFloat(amount || '0');
    return amt * (factors[category] || 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const emission = computeEmission();
    if (!amount || isNaN(parseFloat(amount))) return;
    onAdd({ category, amount: parseFloat(amount), emission, note, date: new Date().toISOString() });
    setAmount('');
    setNote('');
  };

  const SelectedIcon = iconFor(category);

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <SelectedIcon className="w-5 h-5 text-emerald-600" />
        Add activity
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
        {CATEGORIES.map(({ key, label, icon: Icon }) => (
          <button
            type="button"
            key={key}
            onClick={() => setCategory(key)}
            className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm transition-colors ${
              category === key ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'hover:bg-gray-50'
            }`}
          >
            <Icon className="w-4 h-4" /> {label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="text-sm text-gray-600">Amount</label>
          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder={`Enter ${units[category]}`}
            className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <p className="text-xs text-gray-500 mt-1">{units[category]}</p>
        </div>
        <div className="sm:col-span-2">
          <label className="text-sm text-gray-600">Note (optional)</label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g., Drove to office, vegetarian lunch, laundry day"
            className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Estimated: <span className="font-semibold text-gray-900">{computeEmission().toFixed(2)} kg CO₂e</span>
        </div>
        <button
          type="submit"
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          Add entry
        </button>
      </div>
    </form>
  );
}
