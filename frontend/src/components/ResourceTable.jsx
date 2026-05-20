import React from 'react';

const RESOURCE_ROWS = [
  { key: 'population', label: 'Population' },
  { key: 'food_packets', label: 'Food Packets' },
  { key: 'water_litres', label: 'Water (Litres)' },
  { key: 'medical_kits', label: 'Medical Kits' },
  { key: 'rescue_personnel', label: 'Rescue Personnel' },
  { key: 'shelter_tents', label: 'Shelter Tents' },
];

export default function ResourceTable({ zones, totals }) {
  if (!zones || !totals) return null;

  return (
    <div className="mt-12 animate-fade-in-up">
      <h3 className="text-2xl font-bold text-white mb-6 text-center">
        <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
          Total Resources Summary
        </span>
      </h3>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1f2937]">
                <th className="text-left py-4 px-6 text-gray-400 font-semibold">
                  Resource
                </th>
                <th className="text-center py-4 px-4 font-semibold">
                  <span className="text-amber-400">Critical</span>
                </th>
                <th className="text-center py-4 px-4 font-semibold">
                  <span className="text-purple-400">Moderate</span>
                </th>
                <th className="text-center py-4 px-4 font-semibold">
                  <span className="text-emerald-400">Low</span>
                </th>
                <th className="text-center py-4 px-6 font-bold">
                  <span className="text-blue-400">Total</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {RESOURCE_ROWS.map((row, idx) => (
                <tr
                  key={row.key}
                  className={`border-b border-[#1f2937]/50 transition-colors hover:bg-blue-500/5 ${
                    idx % 2 === 0 ? 'bg-[#0d1320]' : 'bg-transparent'
                  }`}
                >
                  <td className="py-3.5 px-6 text-gray-300 font-medium">
                    {row.label}
                  </td>
                  <td className="py-3.5 px-4 text-center text-gray-200">
                    {(zones.critical?.[row.key] ?? 0).toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-center text-gray-200">
                    {(zones.moderate?.[row.key] ?? 0).toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-center text-gray-200">
                    {(zones.low?.[row.key] ?? 0).toLocaleString()}
                  </td>
                  <td className="py-3.5 px-6 text-center text-white font-bold">
                    {(totals[row.key] ?? 0).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
