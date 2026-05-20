import React from 'react';
import ZoneCards from './ZoneCards';
import DisasterMap from './DisasterMap';
import ResourceTable from './ResourceTable';
import ReportSection from './ReportSection';

const STAT_CARDS = [
  {
    key: 'damage_score',
    label: 'Overall Damage Score',
    format: (v) => (v ?? 0).toFixed(2),
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
  },
  {
    key: 'population',
    label: 'Population Affected',
    format: (v) => (v ?? 0).toLocaleString(),
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    key: 'severity_level',
    label: 'Severity Level',
    format: (v) => v || 'N/A',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
  },
  {
    key: 'detection_method',
    label: 'Detection Method',
    format: (v) => v || 'N/A',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
  },
];

function SummaryCards({ results }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
      {STAT_CARDS.map((card, idx) => {
        let value;
        if (card.key === 'population') {
          value = results?.totals?.population;
        } else {
          value = results?.[card.key];
        }

        return (
          <div
            key={card.key}
            className="glass-card-glow-blue p-5 animate-fade-in-up"
            style={{ animationDelay: `${idx * 0.1}s` }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                {card.icon}
              </div>
            </div>
            <p className="text-2xl font-bold text-white mb-1">
              {card.format(value)}
            </p>
            <p className="text-xs text-gray-400">{card.label}</p>
          </div>
        );
      })}
    </div>
  );
}

function ImageComparison({ originalB64, annotatedB64 }) {
  if (!originalB64 || !annotatedB64) return null;

  return (
    <div className="mb-12 animate-fade-in-up">
      <h3 className="text-2xl font-bold text-white mb-6 text-center">
        <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
          Image Analysis
        </span>
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Original */}
        <div className="glass-card overflow-hidden">
          <div className="p-1.5">
            <img
              src={`data:image/jpeg;base64,${originalB64}`}
              alt="Original uploaded image"
              className="w-full rounded-xl object-cover"
              style={{ maxHeight: '400px' }}
            />
          </div>
          <div className="px-4 py-3 border-t border-[#1f2937] text-center">
            <span className="text-sm font-medium text-gray-400">Original Image</span>
          </div>
        </div>

        {/* Annotated */}
        <div className="glass-card overflow-hidden">
          <div className="p-1.5">
            <img
              src={`data:image/jpeg;base64,${annotatedB64}`}
              alt="AI annotated detection result"
              className="w-full rounded-xl object-cover"
              style={{ maxHeight: '400px' }}
            />
          </div>
          <div className="px-4 py-3 border-t border-[#1f2937] text-center">
            <span className="text-sm font-medium text-gray-400">AI Detection Result</span>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-5 mt-4">
        {[
          { label: 'Damaged Buildings', color: '#f59e0b' },
          { label: 'Flooded Zones', color: '#3b82f6' },
          { label: 'Blocked Roads', color: '#8b5cf6' },
          { label: 'Open Grounds', color: '#10b981' },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-xs text-gray-400">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ResultsDashboard({ results, apiBase }) {
  if (!results) return null;

  return (
    <section id="results" className="py-16 animate-fade-in">
      <div className="section-container">
        {/* Section Title */}
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Analysis Results
            </span>
          </h2>
          <p className="text-gray-400">
            AI-powered damage assessment and resource allocation
          </p>
        </div>

        {/* 5A — Summary Cards */}
        <SummaryCards results={results} />

        {/* 5B — Image Comparison */}
        <ImageComparison
          originalB64={results.original_image_base64}
          annotatedB64={results.annotated_image_base64}
        />

        {/* 5C — Zone Cards */}
        <ZoneCards zones={results.zones} />

        {/* 5D — Interactive Map */}
        <DisasterMap
          coordinates={results.coordinates}
          markers={results.markers}
        />

        {/* 5E — Resource Table */}
        <ResourceTable
          zones={results.zones}
          totals={results.totals}
        />

        {/* 6 — Report Section */}
        <ReportSection results={results} apiBase={apiBase} />
      </div>
    </section>
  );
}
