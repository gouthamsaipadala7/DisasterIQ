import React, { useEffect, useRef } from 'react';

export default function Hero() {
  const particlesRef = useRef(null);

  useEffect(() => {
    const container = particlesRef.current;
    if (!container) return;

    // Generate floating particles
    const count = 35;
    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.width = `${2 + Math.random() * 4}px`;
      particle.style.height = particle.style.width;
      particle.style.animationDuration = `${8 + Math.random() * 15}s`;
      particle.style.animationDelay = `${Math.random() * 10}s`;
      particle.style.opacity = `${0.2 + Math.random() * 0.4}`;
      container.appendChild(particle);
    }

    return () => {
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
    };
  }, []);

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Animated gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 30% 20%, rgba(59,130,246,0.08) 0%, transparent 50%),' +
            'radial-gradient(ellipse at 70% 80%, rgba(6,182,212,0.06) 0%, transparent 50%),' +
            'radial-gradient(ellipse at 50% 50%, rgba(139,92,246,0.04) 0%, transparent 70%)',
        }}
      />

      {/* Particles */}
      <div ref={particlesRef} className="absolute inset-0 overflow-hidden pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-5 py-2 mb-8 animate-fade-in">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
          <span className="text-sm font-medium text-blue-300">
            AI-Powered Disaster Intelligence
          </span>
        </div>

        {/* Title */}
        <h1 className="text-6xl sm:text-7xl md:text-8xl font-extrabold tracking-tight mb-6 animate-fade-in-up">
          <span className="bg-gradient-to-r from-white via-blue-100 to-blue-300 bg-clip-text text-transparent">
            Disaster
          </span>
          <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            IQ
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-xl sm:text-2xl font-semibold text-gray-300 mb-4 animate-fade-in-up stagger-1">
          AI-Powered Disaster Response &amp; Resource Allocation System
        </p>

        {/* Description */}
        <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto mb-10 animate-fade-in-up stagger-2 leading-relaxed">
          Upload satellite or drone imagery and let our AI analyze damage zones,
          compute optimal resource allocation, and generate field-ready reports
          — all in seconds.
        </p>

        {/* CTA Button */}
        <div className="animate-fade-in-up stagger-3">
          <a
            href="#upload"
            className="btn-primary text-lg px-10 py-4"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            Start Analysis
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-fade-in stagger-4">
        <span className="text-xs text-gray-500 font-medium tracking-widest uppercase">Scroll</span>
        <div className="w-5 h-9 border-2 border-gray-600 rounded-full flex justify-center pt-1.5">
          <div
            className="w-1.5 h-1.5 bg-blue-400 rounded-full"
            style={{ animation: 'scroll-bounce 2s ease-in-out infinite' }}
          />
        </div>
      </div>
    </section>
  );
}
