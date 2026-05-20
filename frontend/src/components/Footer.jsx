import React from 'react';

export default function Footer() {
  return (
    <footer id="footer" className="py-16 border-t border-[#1f2937]">
      <div className="section-container text-center">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/>
              <path d="M2 12h20"/>
            </svg>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            DisasterIQ
          </span>
        </div>

        {/* Department */}
        <p className="text-gray-400 text-sm mb-1">
          Department of Electronics and Communication Engineering
        </p>
        <p className="text-gray-500 text-sm mb-6">
          MLR Institute of Technology, Hyderabad
        </p>

        {/* Team */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
          {['Goutham Sai', 'Vishnu', 'Nikshith', 'Gokul'].map((name) => (
            <span
              key={name}
              className="px-4 py-1.5 rounded-full bg-[#111827] border border-[#1f2937] text-sm text-gray-300 hover:border-blue-500/30 hover:text-white transition-all duration-200"
            >
              {name}
            </span>
          ))}
        </div>

        {/* Year */}
        <p className="text-gray-600 text-xs">
          © 2025 DisasterIQ. Built for a better tomorrow.
        </p>
      </div>
    </footer>
  );
}
