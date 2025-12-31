
import React from 'react';

interface QRGeneratorProps {
  url: string;
  businessName: string;
}

const QRGenerator: React.FC<QRGeneratorProps> = ({ url, businessName }) => {
  // Simple SVG mockup of a stylized QR code for high-ticket agency vibe
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl flex flex-col items-center space-y-4">
      <div className="w-40 h-40 bg-slate-950 rounded-2xl p-4 relative overflow-hidden group">
         <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#6366f1 1px, transparent 0)', backgroundSize: '10px 10px' }}></div>
         <div className="relative z-10 w-full h-full border-2 border-indigo-600/30 rounded-lg flex items-center justify-center">
            <div className="grid grid-cols-4 gap-1">
               {[...Array(16)].map((_, i) => (
                 <div key={i} className={`w-4 h-4 rounded-sm ${Math.random() > 0.4 ? 'bg-indigo-500' : 'bg-slate-800'}`}></div>
               ))}
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
               <div className="bg-white p-1 rounded-md shadow-lg font-black text-[8px] uppercase tracking-tighter">AI</div>
            </div>
         </div>
      </div>
      <div className="text-center">
         <p className="text-[8px] font-black text-indigo-500 uppercase tracking-widest mb-1 italic">Secure Magic Link</p>
         <h4 className="text-[10px] font-bold text-slate-400 uppercase truncate max-w-[120px]">{businessName}</h4>
      </div>
      <button 
        onClick={() => alert(`In a production environment, this would download a high-res PNG vector for the proposal: ${url}`)}
        className="w-full py-2 bg-slate-50 text-slate-400 rounded-xl text-[9px] font-black uppercase tracking-widest hover:text-indigo-600 transition-colors"
      >
        Export Vector
      </button>
    </div>
  );
};

export default QRGenerator;
