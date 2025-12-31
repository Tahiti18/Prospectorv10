
import React, { useState, useEffect, useRef } from 'react';

const KeyManager: React.FC = () => {
  const [status, setStatus] = useState({ google: false });
  const [backupStatus, setBackupStatus] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // @ts-ignore
    const check = async () => { const k = window.aistudio && await window.aistudio.hasSelectedApiKey(); setStatus({ google: k }); };
    check();
  }, []);

  const auth = async () => {
    // @ts-ignore
    await window.aistudio.openSelectKey();
    setStatus({ google: true });
  };

  const handleBackup = () => {
    try {
      const data = {
        leads: localStorage.getItem('pomelli_leads'),
        assets: localStorage.getItem('pomelli_assets'),
        proposals: localStorage.getItem('pomelli_proposals'),
        profile: localStorage.getItem('pomelli_agency_profile'),
        ledger: localStorage.getItem('pomelli_ledger'),
        region: localStorage.getItem('pomelli_active_region'),
        timestamp: new Date().toISOString()
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pomelli_system_backup_${new Date().toISOString().slice(0,10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setBackupStatus('Backup Securely Downloaded');
      setTimeout(() => setBackupStatus(''), 3000);
    } catch (e) {
      setBackupStatus('Backup Failed');
    }
  };

  const handleRestore = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.leads) localStorage.setItem('pomelli_leads', data.leads);
        if (data.assets) localStorage.setItem('pomelli_assets', data.assets);
        if (data.proposals) localStorage.setItem('pomelli_proposals', data.proposals);
        if (data.profile) localStorage.setItem('pomelli_agency_profile', data.profile);
        if (data.ledger) localStorage.setItem('pomelli_ledger', data.ledger);
        if (data.region) localStorage.setItem('pomelli_active_region', data.region);
        
        setBackupStatus('System Restored. Rebooting...');
        setTimeout(() => window.location.reload(), 1500);
      } catch (err) {
        setBackupStatus('Corrupt Backup File');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in">
      <div className="text-center">
        <h2 className="text-3xl font-black italic uppercase text-white">Security <span className="text-indigo-500">Uplink</span></h2>
        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-2">Manage Credentials & Disaster Recovery</p>
      </div>
      
      {/* API Key Section */}
      <div className="p-8 glass-panel rounded-[2.5rem] flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${status.google ? 'bg-emerald-500/20 text-emerald-500' : 'bg-rose-500/20 text-rose-500'}`}>🔑</div>
          <div>
            <h3 className="text-white font-bold uppercase">Google Cloud Gemini</h3>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest">Logic & Vision Cluster</p>
          </div>
        </div>
        <button onClick={auth} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest ${status.google ? 'bg-slate-800 text-slate-400' : 'bg-indigo-600 text-white'}`}>
          {status.google ? 'Re-Authorize' : 'Connect'}
        </button>
      </div>

      {/* Disaster Recovery Section */}
      <div className="p-8 glass-panel rounded-[2.5rem] border border-red-500/20 bg-red-950/10 space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-red-500/20 text-red-500 flex items-center justify-center text-2xl">🛡️</div>
          <div>
            <h3 className="text-white font-bold uppercase">Disaster Recovery</h3>
            <p className="text-[10px] text-red-400 uppercase tracking-widest">System Snapshot & Restoration</p>
          </div>
        </div>
        
        <div className="flex gap-4">
          <button 
            onClick={handleBackup}
            className="flex-1 py-4 bg-slate-900 border border-slate-700 hover:border-emerald-500/50 hover:bg-emerald-950/20 rounded-xl text-[10px] font-black text-slate-300 uppercase tracking-widest transition-all"
          >
            Download System Backup
          </button>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 py-4 bg-slate-900 border border-slate-700 hover:border-indigo-500/50 hover:bg-indigo-950/20 rounded-xl text-[10px] font-black text-slate-300 uppercase tracking-widest transition-all"
          >
            Restore From File
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleRestore} 
            className="hidden" 
            accept=".json" 
          />
        </div>
        {backupStatus && <p className="text-center text-[10px] font-bold text-emerald-400 uppercase tracking-widest animate-pulse">{backupStatus}</p>}
      </div>
    </div>
  );
};
export default KeyManager;
