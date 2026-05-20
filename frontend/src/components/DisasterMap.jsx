import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const MARKER_COLORS = {
  Critical: '#f59e0b',
  Moderate: '#8b5cf6',
  Low: '#10b981',
  Depot: '#3b82f6',
};

export default function DisasterMap({ coordinates, markers }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current || !coordinates) return;

    // Destroy previous map instance
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const map = L.map(mapRef.current, {
      center: [coordinates.lat, coordinates.lon],
      zoom: 13,
      zoomControl: true,
      scrollWheelZoom: true,
    });

    // Dark map tiles (CartoDB dark_matter)
    L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19,
      }
    ).addTo(map);

    // Add markers
    if (markers && markers.length > 0) {
      const bounds = [];

      markers.forEach((m) => {
        const color = MARKER_COLORS[m.severity] || '#3b82f6';
        const isDepot = m.marker_type === 'depot';
        const radius = isDepot ? 10 : 14;

        const circleMarker = L.circleMarker([m.lat, m.lon], {
          radius,
          fillColor: color,
          color: color,
          weight: 2,
          opacity: 0.9,
          fillOpacity: 0.35,
        }).addTo(map);

        // Popup content
        const popupHtml = isDepot
          ? `
            <div style="font-family:Inter,sans-serif;">
              <div style="font-weight:700;font-size:14px;color:${color};margin-bottom:6px;">
                📦 Supply Depot
              </div>
              <div style="font-size:12px;color:#9ca3af;">Central distribution hub</div>
            </div>
          `
          : `
            <div style="font-family:Inter,sans-serif;min-width:200px;">
              <div style="font-weight:700;font-size:14px;color:${color};margin-bottom:8px;">
                ${m.zone_name}
              </div>
              <div style="display:flex;flex-direction:column;gap:4px;font-size:12px;">
                <div style="display:flex;justify-content:space-between;">
                  <span style="color:#9ca3af;">Population</span>
                  <span style="color:#f9fafb;font-weight:600;">${(m.population || 0).toLocaleString()}</span>
                </div>
                <div style="display:flex;justify-content:space-between;">
                  <span style="color:#9ca3af;">Food Packets</span>
                  <span style="color:#f9fafb;font-weight:600;">${(m.food_packets || 0).toLocaleString()}</span>
                </div>
                <div style="display:flex;justify-content:space-between;">
                  <span style="color:#9ca3af;">Water (L)</span>
                  <span style="color:#f9fafb;font-weight:600;">${(m.water_litres || 0).toLocaleString()}</span>
                </div>
                <div style="display:flex;justify-content:space-between;">
                  <span style="color:#9ca3af;">Medical Kits</span>
                  <span style="color:#f9fafb;font-weight:600;">${(m.medical_kits || 0).toLocaleString()}</span>
                </div>
                <div style="display:flex;justify-content:space-between;">
                  <span style="color:#9ca3af;">Rescue Personnel</span>
                  <span style="color:#f9fafb;font-weight:600;">${(m.rescue_personnel || 0).toLocaleString()}</span>
                </div>
                <div style="display:flex;justify-content:space-between;">
                  <span style="color:#9ca3af;">Shelter Tents</span>
                  <span style="color:#f9fafb;font-weight:600;">${(m.shelter_tents || 0).toLocaleString()}</span>
                </div>
                <hr style="border-color:#1f2937;margin:4px 0;" />
                <div style="display:flex;justify-content:space-between;">
                  <span style="color:#9ca3af;">Priority</span>
                  <span style="color:${color};font-weight:700;">${m.priority_timeline}</span>
                </div>
                <div style="display:flex;justify-content:space-between;">
                  <span style="color:#9ca3af;">Access</span>
                  <span style="color:#f9fafb;font-weight:600;">${m.access_type}</span>
                </div>
              </div>
            </div>
          `;

        circleMarker.bindPopup(popupHtml, {
          maxWidth: 280,
          className: 'dark-popup',
        });

        bounds.push([m.lat, m.lon]);
      });

      if (bounds.length > 1) {
        map.fitBounds(bounds, { padding: [40, 40] });
      }
    }

    mapInstanceRef.current = map;

    // Fix tile rendering after container resize
    setTimeout(() => map.invalidateSize(), 200);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [coordinates, markers]);

  if (!coordinates) return null;

  return (
    <div className="mt-12 animate-fade-in-up">
      <h3 className="text-2xl font-bold text-white mb-6 text-center">
        <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
          Interactive Disaster Map
        </span>
      </h3>

      <div className="glass-card overflow-hidden">
        <div
          id="disaster-map"
          ref={mapRef}
          className="w-full rounded-2xl"
          style={{ height: '500px' }}
        />
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-6 mt-4">
        {Object.entries(MARKER_COLORS).map(([label, color]) => (
          <div key={label} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: color }}
            />
            <span className="text-xs text-gray-400">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
