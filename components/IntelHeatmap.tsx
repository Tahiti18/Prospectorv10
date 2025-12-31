
import React from 'react';
import { Lead } from '../types';

interface IntelHeatmapProps {
  leads: Lead[];
  isDarkMode: boolean;
}

const IntelHeatmap: React.FC<IntelHeatmapProps> = ({ leads, isDarkMode }) => {
  // Aggregate stats per region
  const regions = [
    { id: 'nicosia', name: 'Nicosia', count: leads.filter(l => l.city === 'Nicosia').length, color: 'indigo' },
    { id: 'limassol', name: 'Limassol', count: leads.filter(l => l.city.includes('Limassol')).length, color: 'indigo' },
    { id: 'larnaca', name: 'Larnaca', count: leads.filter(l => l.city === 'Larnaca').length, color: 'indigo' },
    { id: 'paphos', name: 'Paphos', count: leads.filter(l => l.city === 'Paphos').length, color: 'indigo' },
    { id: 'famagusta', name: 'Ayia Napa', count: leads.filter(l => l.city === 'Ayia Napa').length, color: 'indigo' },
  ];

  const maxLeads = Math.max(...regions.map(r => r.count));

  return (
    <div className={`p-8 rounded-[3rem] border transition-all ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200 shadow-xl'}`}>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-sm font-black uppercase tracking-widest italic leading-none">Regional Target Density</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Satellite Opportunity Visualization</p>
        </div>
        <div className="flex items-center gap-2">
           <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
           <span className="text-[9px] font-black uppercase text-indigo-500">Live Intel Flux</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-12">
        {/* Custom Stylized Cyprus Map */}
        <div className="flex-1 w-full max-w-[500px]">
          <svg viewBox="0 0 1000 600" className="w-full h-auto drop-shadow-2xl overflow-visible">
            {/* Base Shape (Approximate Cyprus) */}
            <path 
              d="M150,450 L350,550 L750,450 L950,250 L850,200 L650,250 L450,200 L250,250 Z" 
              fill={isDarkMode ? '#0f172a' : '#f8fafc'} 
              stroke={isDarkMode ? '#334155' : '#e2e8f0'} 
              strokeWidth="4"
            />
            {/* Regions as hotspots */}
            {regions.map((r, i) => {
              const opacity = r.count > 0 ? (r.count / maxLeads) * 0.8 : 0.1;
              const coords = [
                { x: 550, y: 320 }, // Nicosia
                { x: 480, y: 480 }, // Limassol
                { x: 650, y: 460 }, // Larnaca
                { x: 250, y: 450 }, // Paphos
                { x: 800, y: 380 }, // Ayia Napa
              ][i];

              return (
                <g key={r.id} className="group cursor-help">
                  <circle 
                    cx={coords.x} 
                    cy={coords.y} 
                    r={20 + (r.count * 15)} 
                    fill={`rgba(99, 102, 241, ${opacity})`} 
                    className="transition-all duration-1000 animate-pulse"
                  />
                  <circle 
                    cx={coords.x} 
                    cy={coords.y} 
                    r="8" 
                    fill="#6366f1" 
                    className="shadow-lg"
                  />
                  <text 
                    x={coords.x} 
                    y={coords.y - 40} 
                    textAnchor="middle" 
                    className={`text-[20px] font-black uppercase tracking-tighter transition-opacity duration-300 ${isDarkMode ? 'fill-white' : 'fill-slate-900'}`}
                  >
                    {r.name}
                  </text>
                  <text 
                    x={coords.x} 
                    y={coords.y - 15} 
                    textAnchor="middle" 
                    className="text-[14px] font-bold fill-indigo-400 uppercase tracking-widest"
                  >
                    {r.count} Targets
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Legend / Stats */}
        <div className="w-full lg:w-64 space-y-4">
           {regions.sort((a, b) => b.count - a.count).map(r => (
             <div key={r.id} className={`p-4 rounded-2xl border transition-all ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
                <div className="flex justify-between items-center mb-1">
                   <span className="text-[10px] font-black uppercase tracking-widest">{r.name}</span>
                   <span className="text-xs font-black text-indigo-500">{r.count}</span>
                </div>
                <div className={`h-1 w-full rounded-full ${isDarkMode ? 'bg-slate-800' : 'bg-white shadow-inner'}`}>
                   <div 
                    className="h-full bg-indigo-500 rounded-full transition-all duration-1000" 
                    style={{ width: `${(r.count / maxLeads) * 100}%` }}
                   ></div>
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default IntelHeatmap;
