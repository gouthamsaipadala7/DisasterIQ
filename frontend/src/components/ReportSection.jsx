import React, { useState } from 'react';

export default function ReportSection({ results, apiBase }) {
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState(null);

  if (!results) return null;

  const handleDownload = async () => {
    setDownloading(true);
    setError(null);

    try {
      const response = await fetch(`${apiBase}/api/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(results),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'DisasterIQ_Field_Report.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('PDF download failed:', err);
      setError('Failed to generate PDF. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  const now = new Date().toLocaleString('en-IN', {
    dateStyle: 'long',
    timeStyle: 'short',
  });

  return (
    <section className="mt-16 animate-fade-in-up">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-white mb-2">
          <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Field Report
          </span>
        </h3>
        <p className="text-gray-400">
          Professional PDF report ready for field teams
        </p>
      </div>

      <div className="glass-card max-w-3xl mx-auto overflow-hidden">
        {/* Report Preview */}
        <div className="p-8 border-b border-[#1f2937]">
          <div className="bg-[#0a0f1e] rounded-xl p-6 border border-[#1f2937]">
            {/* Fake report header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/>
                  <path d="M2 12h20"/>
                </svg>
              </div>
              <span className="text-blue-400 font-bold">DisasterIQ Field Report</span>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex gap-4">
                <span className="text-gray-500 w-28">Location</span>
                <span className="text-gray-300">{results.location || 'N/A'}</span>
              </div>
              <div className="flex gap-4">
                <span className="text-gray-500 w-28">Disaster Type</span>
                <span className="text-gray-300">{results.disaster_type || 'N/A'}</span>
              </div>
              <div className="flex gap-4">
                <span className="text-gray-500 w-28">Date & Time</span>
                <span className="text-gray-300">{now}</span>
              </div>
              <div className="flex gap-4">
                <span className="text-gray-500 w-28">Damage Score</span>
                <span className="text-gray-300 font-semibold">
                  {(results.damage_score ?? 0).toFixed(2)}
                </span>
              </div>
              <div className="flex gap-4">
                <span className="text-gray-500 w-28">Severity</span>
                <span
                  className={`font-semibold ${
                    results.severity_level === 'Critical'
                      ? 'text-amber-400'
                      : results.severity_level === 'Moderate'
                      ? 'text-purple-400'
                      : 'text-emerald-400'
                  }`}
                >
                  {results.severity_level}
                </span>
              </div>
            </div>

            {/* Mini resource table */}
            <div className="mt-4 pt-4 border-t border-[#1f2937]">
              <p className="text-xs text-gray-500 mb-2">Resource Summary</p>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {Object.entries(results.totals || {}).map(([key, val]) => (
                  <div key={key} className="flex justify-between bg-[#111827] rounded-lg px-3 py-1.5">
                    <span className="text-gray-400 capitalize">
                      {key.replace(/_/g, ' ')}
                    </span>
                    <span className="text-white font-semibold">
                      {Number(val).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Access routes */}
            <div className="mt-4 pt-4 border-t border-[#1f2937]">
              <p className="text-xs text-gray-500 mb-2">Access Routes</p>
              <div className="space-y-1">
                {Object.entries(results.zones || {}).map(([key, zone]) => (
                  <div key={key} className="flex justify-between text-xs">
                    <span className="text-gray-400">{zone.name}</span>
                    <span className="text-gray-300">{zone.access_type}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Download Button */}
        <div className="p-6 flex flex-col items-center gap-3">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2 text-red-400 text-sm mb-2">
              {error}
            </div>
          )}
          <button
            id="download-report-btn"
            className="btn-primary text-lg px-10 py-4"
            onClick={handleDownload}
            disabled={downloading}
          >
            {downloading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Generating PDF...
              </>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Download PDF Field Report
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
