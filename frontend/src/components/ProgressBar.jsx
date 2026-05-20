import React from 'react';

const STEPS = [
  { label: 'Preprocessing Image', icon: '🖼️' },
  { label: 'Running AI Detection', icon: '🤖' },
  { label: 'Classifying Damage Zones', icon: '🗺️' },
  { label: 'Computing Resources', icon: '📦' },
  { label: 'Generating Map', icon: '📍' },
  { label: 'Building Report', icon: '📄' },
];

export default function ProgressBar({ currentStep, visible }) {
  if (!visible) return null;

  const progress = ((currentStep + 1) / STEPS.length) * 100;

  return (
    <section id="progress-section" className="py-12 animate-fade-in">
      <div className="section-container max-w-5xl mx-auto">
        <div className="glass-card p-8">
          {/* Title */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse" />
            <h3 className="text-lg font-semibold text-white">
              Analysis in Progress
            </h3>
          </div>

          {/* Progress Bar */}
          <div className="progress-track mb-8">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Steps */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {STEPS.map((step, idx) => {
              const isCompleted = idx < currentStep;
              const isCurrent = idx === currentStep;
              const isPending = idx > currentStep;

              return (
                <div
                  key={step.label}
                  className={`flex flex-col items-center text-center p-3 rounded-xl transition-all duration-500 ${
                    isCurrent
                      ? 'bg-blue-500/10 border border-blue-500/30'
                      : isCompleted
                      ? 'bg-emerald-500/5'
                      : 'opacity-40'
                  }`}
                >
                  {/* Step Icon */}
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 text-lg transition-all duration-300 ${
                      isCompleted
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : isCurrent
                        ? 'bg-blue-500/20 animate-pulse'
                        : 'bg-[#1f2937]'
                    }`}
                  >
                    {isCompleted ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : (
                      <span>{step.icon}</span>
                    )}
                  </div>

                  {/* Step Label */}
                  <span
                    className={`text-xs font-medium leading-tight ${
                      isCurrent
                        ? 'text-blue-300'
                        : isCompleted
                        ? 'text-emerald-400'
                        : 'text-gray-500'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
