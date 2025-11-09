import React, { useEffect, useMemo, useState } from 'react';
import Header from './components/Header';
import EntryForm from './components/EntryForm';
import EntriesList from './components/EntriesList';
import Suggestions from './components/Suggestions';
import PreferencesModal from './components/PreferencesModal';

function groupByDate(entries) {
  return entries.reduce((acc, e) => {
    const d = new Date(e.date);
    const key = d.toISOString().slice(0, 10);
    acc[key] = acc[key] || [];
    acc[key].push(e);
    return acc;
  }, {});
}

export default function App() {
  const [entries, setEntries] = useState(() => {
    const saved = localStorage.getItem('carbon_entries');
    return saved ? JSON.parse(saved) : [];
  });
  const [prefs, setPrefs] = useState(() => {
    const saved = localStorage.getItem('carbon_prefs');
    return saved ? JSON.parse(saved) : { dailyTarget: 10, preferVeg: true, commuteMode: 'car', homeEnergy: 'average' };
  });
  const [openPrefs, setOpenPrefs] = useState(false);

  useEffect(() => {
    localStorage.setItem('carbon_entries', JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    localStorage.setItem('carbon_prefs', JSON.stringify(prefs));
  }, [prefs]);

  const todayKey = new Date().toISOString().slice(0, 10);
  const grouped = useMemo(() => groupByDate(entries), [entries]);
  const todayEntries = grouped[todayKey] || [];
  const todayTotal = todayEntries.reduce((s, e) => s + (e.emission || 0), 0);

  const weeklyTotal = useMemo(() => {
    const now = new Date();
    const past7 = new Date(now);
    past7.setDate(now.getDate() - 6);
    return entries
      .filter(e => new Date(e.date) >= past7)
      .reduce((s, e) => s + (e.emission || 0), 0);
  }, [entries]);

  const addEntry = (e) => setEntries([e, ...entries]);
  const deleteEntry = (idx) => {
    const todayIdx = entries.findIndex((e, i) => {
      const key = new Date(e.date).toISOString().slice(0, 10);
      return key === todayKey && i === idx;
    });
    if (todayIdx !== -1) {
      const newArr = [...entries];
      newArr.splice(todayIdx, 1);
      setEntries(newArr);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <Header
          todayTotal={todayTotal}
          weeklyTotal={weeklyTotal}
          onOpenSettings={() => setOpenPrefs(true)}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <EntryForm onAdd={addEntry} prefs={prefs} />
            <EntriesList entries={todayEntries} onDelete={deleteEntry} />
          </div>
          <div className="md:col-span-1">
            <Suggestions entries={todayEntries} prefs={prefs} />
            <div className="mt-6 bg-white rounded-2xl p-5 border border-gray-100">
              <h3 className="text-sm font-semibold text-gray-700">Daily target</h3>
              <div className="mt-2 w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-3 rounded-full ${todayTotal <= prefs.dailyTarget ? 'bg-emerald-500' : 'bg-red-500'}`}
                  style={{ width: `${Math.min(100, (todayTotal / (prefs.dailyTarget || 1)) * 100)}%` }}
                />
              </div>
              <p className="mt-2 text-sm text-gray-600">{todayTotal.toFixed(2)} / {prefs.dailyTarget} kg CO₂e</p>
            </div>
          </div>
        </div>
      </div>

      <PreferencesModal
        open={openPrefs}
        onClose={() => setOpenPrefs(false)}
        prefs={prefs}
        onSave={(p) => { setPrefs(p); setOpenPrefs(false); }}
      />
    </div>
  );
}
