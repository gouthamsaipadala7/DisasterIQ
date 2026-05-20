import React from 'react';

const STEPS = [
  {
    number: '01',
    title: 'Upload',
    description:
      'Upload satellite or drone image of the disaster affected area',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
      </svg>
    ),
  },
  {
    number: '02',
    title: 'Analyze',
    description:
      'AI detects damage zones using YOLOv8 and OpenCV image processing',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Respond',
    description:
      'Get exact resource allocation and field-ready PDF report',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24">
      <div className="section-container">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              How It Works
            </span>
          </h2>
          <p className="text-gray-400 max-w-lg mx-auto">
            Three simple steps to intelligent disaster response
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch relative">
          {STEPS.map((step, idx) => (
            <React.Fragment key={step.number}>
              {/* Card */}
              <div
                className="glass-card p-8 text-center relative group hover:border-blue-500/30 transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${idx * 0.15}s` }}
              >
                {/* Step number */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-blue-500/30">
                  {step.number}
                </div>

                {/* Icon */}
                <div className="w-16 h-16 rounded-2xl bg-[#0a0f1e] border border-[#1f2937] flex items-center justify-center mx-auto mt-4 mb-5 group-hover:border-blue-500/30 group-hover:shadow-lg group-hover:shadow-blue-500/10 transition-all duration-300">
                  {step.icon}
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-white mb-3">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-gray-400 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Arrow between cards (desktop only) */}
              {idx < STEPS.length - 1 && (
                <div className="hidden md:flex absolute items-center justify-center"
                  style={{
                    left: `${((idx + 1) / 3) * 100}%`,
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 10,
                  }}
                >
                  <div className="w-10 h-10 rounded-full bg-[#111827] border border-[#1f2937] flex items-center justify-center">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
