
import React, { useState, useEffect } from 'react';
import { Lead } from '../types';

interface ContactModalProps {
  lead: Lead | null;
  onClose: () => void;
  isDarkMode: boolean;
}

const ContactModal: React.FC<ContactModalProps> = ({ lead, onClose, isDarkMode }) => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (lead) {
      setSubject(`Strategic AI Transformation for ${lead.businessName}`);
      setMessage(`Hi Team ${lead.businessName},\n\nI was analyzing elite brands in ${lead.city} and your digital assets really stood out. However, I noticed a significant gap: ${lead.socialGap}.\n\nThis gap is likely costing you direct bookings from high-ticket clients. I've architected a blueprint to fix this with AI.\n\nWould you be open to seeing the mockup next week?`);
      setStatus('idle');
    }
  }, [lead]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    // Simulate API call to Resend or SMTP
    setTimeout(() => {
      setIsSending(false);
      setStatus('success');
      setTimeout(onClose, 2000);
    }, 1500);
  };

  if (!lead) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-300">
      <div className={`w-full max-w-2xl rounded-[2.5rem] border shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 ${isDarkMode ? 'bg-[#0f172a] border-slate-800 shadow-indigo-500/10' : 'bg-white border-slate-200'}`}>
        
        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-indigo-600">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-white">
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <div>
                 <h3 className="text-xl font-black text-white italic uppercase tracking-tight leading-none">Contact Target</h3>
                 <p className="text-[10px] text-white/60 font-black uppercase tracking-widest mt-1">Uplink: {lead.businessName}</p>
              </div>
           </div>
           <button onClick={onClose} className="p-3 bg-black/20 hover:bg-black/30 rounded-xl transition-all text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
           </button>
        </div>

        <form onSubmit={handleSend} className="p-8 space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 block mb-2">Recipient</label>
                <div className="px-5 py-3 bg-slate-900/50 border border-slate-800 rounded-xl text-xs font-bold text-slate-300 truncate">
                  {lead.email !== 'Not found' ? lead.email : 'contact@' + lead.websiteUrl.replace(/^https?:\/\//, '')}
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 block mb-2">Theater</label>
                <div className="px-5 py-3 bg-slate-900/50 border border-slate-800 rounded-xl text-xs font-bold text-indigo-400">
                  {lead.city}, Cyprus
                </div>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 block mb-2">Transmission Subject</label>
              <input 
                type="text" 
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className={`w-full px-5 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm font-bold text-white outline-none focus:border-indigo-500/50 transition-all`}
              />
            </div>

            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 block mb-2">Bespoke Payload (Message)</label>
              <textarea 
                rows={8}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className={`w-full px-5 py-4 bg-slate-950 border border-slate-800 rounded-xl text-sm leading-relaxed text-slate-300 outline-none focus:border-indigo-500/50 transition-all resize-none italic`}
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-white/5">
             <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Secure Channel 01-A Active</span>
             </div>
             
             {status === 'success' ? (
               <div className="flex items-center gap-2 text-emerald-500 font-black text-[10px] uppercase tracking-widest animate-in slide-in-from-right-4">
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                 Transmission Successful
               </div>
             ) : (
               <button 
                type="submit" 
                disabled={isSending}
                className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-indigo-500 transition-all disabled:opacity-50 active:scale-95 flex items-center gap-3"
               >
                 {isSending ? (
                   <>
                     <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                     Transmitting...
                   </>
                 ) : (
                   <>
                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9-2-9-18-9 18 9-2zm0 0v-8" /></svg>
                     Engage Signal
                   </>
                 )}
               </button>
             )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactModal;
