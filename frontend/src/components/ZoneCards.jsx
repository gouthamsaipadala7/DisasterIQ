import React from 'react';

const RESOURCE_ROWS = [
  { key: 'population', label: 'Population', icon: '👥' },
  { key: 'food_packets', label: 'Food Packets', icon: '🍱' },
  { key: 'water_litres', label: 'Water (Litres)', icon: '💧' },
  { key: 'medical_kits', label: 'Medical Kits', icon: '🏥' },
  { key: 'rescue_personnel', label: 'Rescue Personnel', icon: '🚑' },
  { key: 'shelter_tents', label: 'Shelter Tents', icon: '⛺' },
];

const ZONE_CONFIG = {
  critical: {
    badge: 'CRITICAL',
    glassClass: 'glass-card-glow-amber',
    badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    timelineLabel: '0 – 6 Hours',
  },
  moderate: {
    badge: 'MODERATE',
    glassClass: 'glass-card-glow-purple',
    badgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    timelineLabel: '6 – 24 Hours',
  },
  low: {
    badge: 'LOW',
    glassClass: 'glass-card-glow-green',
    badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    timelineLabel: '24 – 48 Hours',
  },
};

function ZoneCard({ zoneKey, zoneData, delay }) {
  const cfg = ZONE_CONFIG[zoneKey];
  if (!cfg || !zoneData) return null;

  return (
    <div
      className={`${cfg.glassClass} p-6 animate-fade-in-up`}
      style={{ animationDelay: `${delay}s` }}
    >
      {/* Badge */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-white font-bold text-lg">{zoneData.name}</h3>
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold border ${cfg.badgeColor}`}
        >
          {cfg.badge}
        </span>
      </div>

      {/* Resources */}
      <div className="space-y-3">
        {RESOURCE_ROWS.map((row) => (
          <div
            key={row.key}
            className="flex items-center justify-between py-2 border-b border-[#1f2937]/50 last:border-0"
          >
            <div className="flex items-center gap-3">
              <span className="text-base">{row.icon}</span>
              <span className="text-sm text-gray-400">{row.label}</span>
            </div>
            <span className="text-white font-bold text-sm">
              {(zoneData[row.key] ?? 0).toLocaleString()}
            </span>
          </div>
        ))}
      </div>

      {/* Timeline & Access */}
      <div className="mt-5 pt-4 border-t border-[#1f2937]/50 space-y-2">
        <div className="flex justify-between">
          <span className="text-xs text-gray-500">Priority Timeline</span>
          <span className="text-xs font-semibold text-white">
            {zoneData.priority_timeline}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-xs text-gray-500">Access Type</span>
          <span className="text-xs font-semibold text-white">
            {zoneData.access_type}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function ZoneCards({ zones }) {
  if (!zones) return null;

  return (
    <div className="mt-12">
      <h3 className="text-2xl font-bold text-white mb-6 text-center animate-fade-in-up">
        <span className="bg-gradient-to-r from-amber-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
          Zone-wise Resource Allocation
        </span>
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ZoneCard zoneKey="critical" zoneData={zones.critical} delay={0.1} />
        <ZoneCard zoneKey="moderate" zoneData={zones.moderate} delay={0.2} />
        <ZoneCard zoneKey="low" zoneData={zones.low} delay={0.3} />
      </div>
    </div>
  );
}
