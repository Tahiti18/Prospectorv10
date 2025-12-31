
import React from 'react';
import { RegionConfig } from '../types';

interface RegionSelectorProps {
  currentRegion: RegionConfig;
  onRegionChange: (r: RegionConfig) => void;
}

const REGIONS: (RegionConfig & { flag: string })[] = [
  { country: 'Cyprus', tone: 'Sophisticated Mediterranean', currency: 'EUR', flag: '🇨🇾', nicheFocus: ['Luxury Real Estate', 'Yacht Charter', 'Forex'], industryMeta: 'Expat & Leisure Economy' },
  { country: 'USA', subRegion: 'California', tone: 'Tech-Forward Innovation', currency: 'USD', flag: '🇺🇸', nicheFocus: ['VC Tech', 'Estate Mgmt', 'Ent. Law'], industryMeta: 'High-Valuation Tech & Media' },
  { country: 'UAE', subRegion: 'Dubai', tone: 'Hyper-Luxury Globalist', currency: 'AED', flag: '🇦🇪', nicheFocus: ['Supercar Logistics', 'Sovereign Wealth'], industryMeta: 'Prestige Economy' },
  { country: 'UK', subRegion: 'London', tone: 'Refined Heritage', currency: 'GBP', flag: '🇬🇧', nicheFocus: ['Wealth Mgmt', 'Prime Property'], industryMeta: 'Legacy Capital' },
];

const RegionSelector: React.FC<RegionSelectorProps> = ({ currentRegion, onRegionChange }) => {
  return (
    <div className="flex items-center gap-2 bg-slate-900/50 p-1.5 rounded-xl border border-white/5 backdrop-blur-md">
      <span className="text-lg pl-2">
        {REGIONS.find(r => r.country === currentRegion.country)?.flag || '🌍'}
      </span>
      <select 
        className="bg-transparent text-[10px] font-black uppercase tracking-widest text-slate-300 outline-none cursor-pointer"
        value={currentRegion.country}
        onChange={(e) => {
          const r = REGIONS.find(x => x.country === e.target.value);
          if (r) onRegionChange(r);
        }}
      >
        {REGIONS.map(r => <option key={r.country} value={r.country}>{r.country} {r.subRegion ? `/ ${r.subRegion}` : ''}</option>)}
      </select>
    </div>
  );
};
export default RegionSelector;
