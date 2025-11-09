import React, { useMemo } from 'react';
import { Lightbulb, Bike, Salad, Plug } from 'lucide-react';

export default function Suggestions({ entries, prefs }) {
  const todayTotal = entries.reduce((s, e) => s + (e.emission || 0), 0);

  const tips = useMemo(() => {
    const list = [];
    // Personalized suggestions based on preferences and today's log
    const { dailyTarget = 10, preferVeg = true, commuteMode = 'car', homeEnergy = 'average' } = prefs || {};

    if (todayTotal > dailyTarget) {
      list.push({
        icon: Lightbulb,
        title: 'Over target today',
        desc: `You are ${Math.max(0, (todayTotal - dailyTarget)).toFixed(2)} kg over your daily goal. Try one of these swaps tomorrow.`,
      });
    }

    const transport = entries.filter(e => e.category === 'transport').reduce((s, e) => s + e.emission, 0);
    if (transport > 0) {
      if (commuteMode === 'car') {
        list.push({ icon: Bike, title: 'Swap 5 km drive for cycling', desc: 'Could save ~0.9 kg CO₂e (based on 0.18 kg/km).' });
      } else {
        list.push({ icon: Bike, title: 'Great job commuting low-carbon', desc: 'Keep up the habit and plan errands to combine trips.' });
      }
    }

    const food = entries.filter(e => e.category === 'food').reduce((s, e) => s + e.emission, 0);
    if (food > 0) {
      if (preferVeg) {
        list.push({ icon: Salad, title: 'Lean into plant-forward meals', desc: 'Batch-cook beans and grains to make it easy.' });
      } else {
        list.push({ icon: Salad, title: 'Try one meat-free meal', desc: 'Swapping one meal can save 1–2 kg CO₂e.' });
      }
    }

    if (homeEnergy === 'average') {
      list.push({ icon: Plug, title: 'Run laundry cold and full', desc: 'Cuts energy use and emissions without extra effort.' });
    }

    if (list.length === 0) {
      list.push({ icon: Lightbulb, title: 'Log activities to get tips', desc: 'Add transport, food, and home energy to receive tailored suggestions.' });
    }

    return list;
  }, [entries, prefs, todayTotal]);

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <h2 className="text-lg font-semibold mb-4">Suggestions</h2>
      <ul className="space-y-3">
        {tips.map((t, i) => (
          <li key={i} className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
              <t.icon className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-medium">{t.title}</p>
              <p className="text-sm text-gray-600">{t.desc}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
