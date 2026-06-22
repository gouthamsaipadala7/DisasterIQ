import React, { useState, useCallback, useRef } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import UploadPanel from './components/UploadPanel';
import ProgressBar from './components/ProgressBar';
import ResultsDashboard from './components/ResultsDashboard';
import HowItWorks from './components/HowItWorks';
import Footer from './components/Footer';

// ─── API base URL ──────────────────────────────────────────────
// In production (HF Spaces), the backend serves both API and static files.
// In dev mode (Vite), we proxy or use a separate port.
const API_BASE = 'https://disasteriq-2.onrender.com.com';

const STEP_DELAYS = [400, 800, 600, 500, 700, 400]; // ms durations per progress step

export default function App() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showProgress, setShowProgress] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const resultsRef = useRef(null);

  const scrollToResults = () => {
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 300);
  };

  const simulateProgress = useCallback(() => {
    return new Promise((resolve) => {
      setShowProgress(true);
      let step = 0;
      setCurrentStep(step);

      const advance = () => {
        step++;
        if (step < STEP_DELAYS.length) {
          setCurrentStep(step);
          setTimeout(advance, STEP_DELAYS[step]);
        } else {
          resolve();
        }
      };

      setTimeout(advance, STEP_DELAYS[0]);
    });
  }, []);

  const handleAnalyze = useCallback(
    async ({ file, disasterType, location, population }) => {
      setIsAnalyzing(true);
      setResults(null);
      setError(null);

      try {
        // Start progress animation
        const progressPromise = simulateProgress();

        // Build form data
        const formData = new FormData();
        formData.append('image', file);
        formData.append('disaster_type', disasterType);
        formData.append('location', location);
        formData.append('population', population.toString());

        // API call
        const response = await fetch(`${API_BASE}/api/analyze`, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.detail || `Server error: ${response.status}`);
        }

        const data = await response.json();

        // Wait for progress animation to finish
        await progressPromise;

        setResults(data);
        setShowProgress(false);
        scrollToResults();
      } catch (err) {
        console.error('Analysis failed:', err);
        setError(err.message || 'Analysis failed. Please try again.');
        setShowProgress(false);
      } finally {
        setIsAnalyzing(false);
      }
    },
    [simulateProgress]
  );

  const handleSample = useCallback(async () => {
    setIsAnalyzing(true);
    setResults(null);
    setError(null);

    try {
      const progressPromise = simulateProgress();

      const response = await fetch(`${API_BASE}/api/sample`);
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      await progressPromise;

      setResults(data);
      setShowProgress(false);
      scrollToResults();
    } catch (err) {
      console.error('Sample analysis failed:', err);
      setError(err.message || 'Failed to load sample. Please try again.');
      setShowProgress(false);
    } finally {
      setIsAnalyzing(false);
    }
  }, [simulateProgress]);

  return (
    <div className="min-h-screen bg-[#0a0f1e]">
      {/* Section 1 — Navigation */}
      <Navbar />

      {/* Section 2 — Hero */}
      <Hero />

      {/* Section 3 — Upload Panel */}
      <UploadPanel
        onAnalyze={handleAnalyze}
        onSample={handleSample}
        isAnalyzing={isAnalyzing}
      />

      {/* Error display */}
      {error && (
        <div className="section-container mb-8 animate-fade-in">
          <div className="glass-card max-w-3xl mx-auto p-6 border-red-500/30 bg-red-500/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
              </div>
              <div>
                <p className="text-red-400 font-semibold text-sm">Analysis Error</p>
                <p className="text-gray-400 text-sm">{error}</p>
              </div>
              <button
                className="ml-auto text-gray-500 hover:text-white transition-colors"
                onClick={() => setError(null)}
                aria-label="Dismiss error"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Section 4 — Progress */}
      <ProgressBar currentStep={currentStep} visible={showProgress} />

      {/* Sections 5 & 6 — Results Dashboard (includes map, zones, table, report) */}
      <div ref={resultsRef}>
        <ResultsDashboard results={results} apiBase={API_BASE} />
      </div>

      {/* Section 7 — How It Works */}
      <HowItWorks />

      {/* Section 8 — Footer */}
      <Footer />
    </div>
  );
}
