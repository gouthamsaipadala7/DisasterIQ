import React, { useState, useRef, useCallback } from 'react';

export default function UploadPanel({ onAnalyze, onSample, isAnalyzing }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [disasterType, setDisasterType] = useState('Flood');
  const [location, setLocation] = useState('');
  const [population, setPopulation] = useState('');
  const [depth, setDepth] = useState('Standard');
  const fileInputRef = useRef(null);

  const handleFile = useCallback((f) => {
    if (!f) return;
    setFile(f);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(f);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragActive(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile && (droppedFile.type === 'image/jpeg' || droppedFile.type === 'image/png')) {
      handleFile(droppedFile);
    }
  }, [handleFile]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setDragActive(false);
  }, []);

  const handleSubmit = () => {
    if (!file) return;
    onAnalyze({
      file,
      disasterType,
      location: location || 'India',
      population: parseInt(population) || 10000,
      depth,
    });
  };

  const handleSample = () => {
    onSample();
  };

  return (
    <section id="upload" className="py-20">
      <div className="section-container">
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Upload &amp; Analyze
            </span>
          </h2>
          <p className="text-gray-400 max-w-lg mx-auto">
            Provide a satellite or drone image of the disaster-affected area
          </p>
        </div>

        <div className="glass-card p-8 sm:p-10 max-w-5xl mx-auto animate-fade-in-up stagger-1">
          {/* Drag & Drop Zone */}
          <div
            id="dropzone"
            className={`relative border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-300 mb-8 ${
              dragActive
                ? 'border-blue-400 bg-blue-500/10'
                : preview
                ? 'border-[#1f2937] bg-[#0a0f1e]/50'
                : 'border-[#1f2937] hover:border-blue-500/40 hover:bg-blue-500/5'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />

            {preview ? (
              <div className="relative">
                <img
                  src={preview}
                  alt="Preview"
                  className="max-h-72 mx-auto rounded-xl object-contain shadow-lg"
                />
                <button
                  className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center transition-colors text-sm font-bold"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                    setPreview(null);
                  }}
                >
                  ✕
                </button>
                <p className="text-gray-400 text-sm mt-4">{file?.name}</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-semibold text-lg mb-1">
                    Drag &amp; drop your image here
                  </p>
                  <p className="text-gray-500 text-sm">
                    or click to browse • JPG, PNG supported
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Input Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Disaster Type */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Disaster Type
              </label>
              <select
                id="disaster-type"
                value={disasterType}
                onChange={(e) => setDisasterType(e.target.value)}
                className="input-field"
              >
                <option value="Flood">🌊 Flood</option>
                <option value="Earthquake">🏚️ Earthquake</option>
                <option value="Fire">🔥 Fire</option>
                <option value="Cyclone">🌪️ Cyclone</option>
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Location
              </label>
              <input
                id="location-input"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Example: Kerala, India"
                className="input-field"
              />
            </div>

            {/* Population */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Population
              </label>
              <input
                id="population-input"
                type="number"
                value={population}
                onChange={(e) => setPopulation(e.target.value)}
                placeholder="Approximate affected"
                className="input-field"
              />
            </div>

            {/* Depth */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Analysis Depth
              </label>
              <select
                id="analysis-depth"
                value={depth}
                onChange={(e) => setDepth(e.target.value)}
                className="input-field"
              >
                <option value="Standard">Standard</option>
                <option value="Detailed">Detailed</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              id="analyze-btn"
              className="btn-primary text-lg px-12 py-4 w-full sm:w-auto"
              onClick={handleSubmit}
              disabled={!file || isAnalyzing}
            >
              {isAnalyzing ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Analyzing...
                </>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  Analyze Disaster
                </>
              )}
            </button>

            <button
              id="sample-btn"
              className="btn-outline w-full sm:w-auto"
              onClick={handleSample}
              disabled={isAnalyzing}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              Try Sample Image
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
