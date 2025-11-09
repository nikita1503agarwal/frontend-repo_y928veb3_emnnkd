import React from 'react';
import { Trash2, Tag } from 'lucide-react';

export default function EntriesList({ entries, onDelete }) {
  if (!entries.length) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 p-8 text-center text-gray-500">
        No entries yet. Add your first activity above.
      </div>
    );
  }

  const total = entries.reduce((sum, e) => sum + (e.emission || 0), 0);

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Today</h2>
        <div className="text-sm text-gray-600">Total: <span className="font-semibold text-gray-900">{total.toFixed(2)} kg CO₂e</span></div>
      </div>
      <ul className="divide-y">
        {entries.map((e, idx) => (
          <li key={idx} className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-emerald-50 text-emerald-700">
                <Tag className="w-3 h-3" /> {e.category}
              </span>
              <div>
                <p className="text-sm font-medium">{e.note || 'No note'}</p>
                <p className="text-xs text-gray-500">{new Date(e.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold">{e.emission.toFixed(2)} kg</span>
              <button onClick={() => onDelete(idx)} className="text-red-500 hover:text-red-600">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
