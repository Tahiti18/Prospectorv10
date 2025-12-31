
import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { Lead, RegionConfig } from '../types';
import InfoButton from './InfoButton';

interface ROICalculatorProps {
  selectedLead: Lead | null;
  isDarkMode: boolean;
}

const ROICalculator: React.FC<ROICalculatorProps> = ({ selectedLead, isDarkMode }) => {
  const [isCalculating, setIsCalculating] = useState(false);
  const [report, setReport] = useState<any>(null);
  const [currency, setCurrency] = useState('EUR');

  useEffect(() => {
    const regionStr = localStorage.getItem('pomelli_active_region');
    if (regionStr) {
      const region: RegionConfig = JSON.parse(regionStr);
      setCurrency(region.currency || 'USD');
    }
  }, [selectedLead]);

  const calculateROI = async () => {
    if (!selectedLead) return;
    setIsCalculating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Perform a financial ROI analysis for an AI Transformation for "${selectedLead.businessName}". 
        Context: ${selectedLead.niche} in ${selectedLead.city}, ${selectedLead.region || 'International'}.
        Currency: ${currency}. Assume typical local high-ticket service values for this region.
        
        Provide:
        1. Estimated Annual Revenue Leakage (due to social gaps/manual booking).
        2. Estimated Efficiency Gain % (AI automation).
        3. 12-Month Projected Growth Value.
        4. Strategy for justification.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              leakage: { type: Type.NUMBER, description: "Estimated annual lost revenue" },
              efficiency: { type: Type.NUMBER, description: "Gain percentage" },
              growth: { type: Type.NUMBER, description: "Projected growth" },
              justification: { type: Type.STRING, description: "Short strategic justification" }
            }
          }
        }
      });

      setReport(JSON.parse(response.text || "{}"));
    } catch (e) {
      console.error(e);
    } finally {
      setIsCalculating(false);
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency, maximumFractionDigits: 0 }).format(val);
  };

  if (!selectedLead) {
    return <div className="p-20 text-center opacity-30 italic font-black uppercase tracking-tighter">Select a lead to engage ROI Node</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h2 className={`text-2xl font-black italic uppercase tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Financial Logic Node ({currency})</h2>
        <button 
          onClick={calculateROI}
          disabled={isCalculating}
          className="bg-indigo-600 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-indigo-500 active:scale-95 transition-all"
        >
          {isCalculating ? 'Calculating...' : 'Compute ROI Forecast'}
        </button>
      </div>

      {report ? (
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-bottom-4 duration-500`}>
          <div className={`p-8 rounded-3xl border ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'} shadow-xl`}>
             <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-1">Revenue Leakage (Est.)</p>
             <p className={`text-3xl font-black italic tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{formatCurrency(report.leakage || 0)}</p>
             <p className="text-[9px] text-slate-500 font-bold mt-2 uppercase">Annual Opportunity Cost</p>
          </div>
          <div className={`p-8 rounded-3xl border ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'} shadow-xl`}>
             <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">Efficiency Uplift</p>
             <p className={`text-3xl font-black italic tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>+{report.efficiency}%</p>
             <p className="text-[9px] text-slate-500 font-bold mt-2 uppercase">AI Logic Integration</p>
          </div>
          <div className={`p-8 rounded-3xl border ${isDarkMode ? 'bg-indigo-600 border-indigo-400' : 'bg-indigo-600 border-indigo-400'} shadow-xl text-white`}>
             <p className="text-[10px] font-black text-indigo-200 uppercase tracking-widest mb-1">Projected Growth</p>
             <p className="text-3xl font-black italic tracking-tighter">{formatCurrency(report.growth || 0)}</p>
             <p className="text-[9px] text-indigo-300 font-bold mt-2 uppercase">12-Month Net Value</p>
          </div>
          <div className={`md:col-span-3 p-6 rounded-2xl border italic text-sm ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-100 text-slate-600'}`}>
            "{report.justification}"
          </div>
        </div>
      ) : (
        <div className={`p-16 border-2 border-dashed rounded-[3rem] text-center opacity-20 ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
          <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
          <p className="text-xs font-black uppercase tracking-widest">Awaiting Financial Synthesis</p>
        </div>
      )}
    </div>
  );
};

export default ROICalculator;
