import React, { useEffect, useState } from 'react';
import { X, Save } from 'lucide-react';

export default function PreferencesModal({ open, onClose, prefs, onSave }) {
  const [local, setLocal] = useState(prefs || {});

  useEffect(() => {
    setLocal(prefs || {});
  }, [prefs, open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white w-full max-w-lg rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Preferences</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Daily target (kg CO₂e)">
            <input
              type="number"
              step="0.1"
              value={local.dailyTarget ?? 10}
              onChange={(e) => setLocal({ ...local, dailyTarget: parseFloat(e.target.value) })}
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </Field>

          <Field label="Commute mode">
            <select
              value={local.commuteMode ?? 'car'}
              onChange={(e) => setLocal({ ...local, commuteMode: e.target.value })}
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="car">Car</option>
              <option value="public">Public transport</option>
              <option value="bike">Bike</option>
              <option value="walk">Walk</option>
            </select>
          </Field>

          <Field label="Prefer vegetarian meals">
            <select
              value={String(local.preferVeg ?? true)}
              onChange={(e) => setLocal({ ...local, preferVeg: e.target.value === 'true' })}
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </Field>

          <Field label="Home energy profile">
            <select
              value={local.homeEnergy ?? 'average'}
              onChange={(e) => setLocal({ ...local, homeEnergy: e.target.value })}
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="efficient">Efficient</option>
              <option value="average">Average</option>
              <option value="inefficient">Inefficient</option>
            </select>
          </Field>

          <Field label="Emission factors: Transport (kg/km)">
            <NumberField valueKey="transportFactor" value={local.transportFactor ?? 0.18} setLocal={setLocal} local={local} />
          </Field>
          <Field label="Emission factors: Food (kg/meal)">
            <NumberField valueKey="foodFactor" value={local.foodFactor ?? 2.5} setLocal={setLocal} local={local} />
          </Field>
          <Field label="Emission factors: Energy (kg/kWh)">
            <NumberField valueKey="energyFactor" value={local.energyFactor ?? 0.35} setLocal={setLocal} local={local} />
          </Field>
          <Field label="Emission factors: Other (kg/unit)">
            <NumberField valueKey="otherFactor" value={local.otherFactor ?? 1.0} setLocal={setLocal} local={local} />
          </Field>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border">Cancel</button>
          <button
            onClick={() => onSave(local)}
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg"
          >
            <Save className="w-4 h-4" /> Save
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="text-sm text-gray-700">
      {label}
      {children}
    </label>
  );
}

function NumberField({ valueKey, value, setLocal, local }) {
  return (
    <input
      type="number"
      step="0.01"
      value={value}
      onChange={(e) => setLocal({ ...local, [valueKey]: parseFloat(e.target.value) })}
      className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
    />
  );
}
