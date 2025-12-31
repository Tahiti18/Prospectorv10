
import React from 'react';

interface SWOTRadarChartProps {
  scores: {
    visual: number; // 0-40
    social: number; // 0-30
    ticket: number; // 0-20
    reach: number;  // 0-10
    market: number; // 0-100 (normalized)
  };
  isDarkMode?: boolean;
}

const SWOTRadarChart: React.FC<SWOTRadarChartProps> = ({ scores, isDarkMode }) => {
  // Normalize all scores to 100 for radar rendering
  const data = [
    { label: 'VISUALS', val: (scores.visual / 40) * 100 },
    { label: 'SOCIAL', val: (scores.social / 30) * 100 },
    { label: 'TICKET', val: (scores.ticket / 20) * 100 },
    { label: 'REACH', val: (scores.reach / 10) * 100 },
    { label: 'MARKET', val: scores.market },
  ];

  const size = 300;
  const center = size / 2;
  const radius = center * 0.7;
  const angleStep = (Math.PI * 2) / data.length;

  const points = data.map((d, i) => {
    const angle = i * angleStep - Math.PI / 2;
    const r = (d.val / 100) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
      labelX: center + (radius + 25) * Math.cos(angle),
      labelY: center + (radius + 25) * Math.sin(angle),
    };
  });

  const polygonPath = points.map(p => `${p.x},${p.y}`).join(' ');
  
  // Grid circles
  const gridLevels = [25, 50, 75, 100];

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <svg width={size} height={size} className="overflow-visible">
        {/* Grid Circles */}
        {gridLevels.map(level => (
          <circle
            key={level}
            cx={center}
            cy={center}
            r={(level / 100) * radius}
            fill="none"
            stroke={isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}
            strokeWidth="1"
          />
        ))}

        {/* Axis Lines */}
        {points.map((p, i) => {
          const angle = i * angleStep - Math.PI / 2;
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={center + radius * Math.cos(angle)}
              y2={center + radius * Math.sin(angle)}
              stroke={isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}
              strokeWidth="1"
              strokeDasharray="4 4"
            />
          );
        })}

        {/* Data Area */}
        <polygon
          points={polygonPath}
          fill="rgba(79, 70, 229, 0.2)"
          stroke="#6366f1"
          strokeWidth="2"
          className="animate-in fade-in zoom-in duration-1000"
        />

        {/* Data Points */}
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="3" fill="#6366f1" />
        ))}

        {/* Labels */}
        {points.map((p, i) => (
          <text
            key={i}
            x={p.labelX}
            y={p.labelY}
            textAnchor="middle"
            alignmentBaseline="middle"
            className={`text-[8px] font-black uppercase tracking-tighter ${isDarkMode ? 'fill-slate-500' : 'fill-slate-400'}`}
          >
            {data[i].label}
          </text>
        ))}
      </svg>
      <div className="mt-2 text-[10px] font-black uppercase tracking-widest text-indigo-500 animate-pulse">
        Vulnerability Radar v2
      </div>
    </div>
  );
};

export default SWOTRadarChart;
