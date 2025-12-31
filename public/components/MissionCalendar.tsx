
import React from 'react';
import { Lead } from '../types';

interface MissionCalendarProps {
  leads: Lead[];
  isDarkMode: boolean;
}

const MissionCalendar: React.FC<MissionCalendarProps> = ({ leads, isDarkMode }) => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  // Logic: Map leads to "Relative Days" in their sequence
  // For demo, we distribute them based on Rank
  const getTasksForDay = (dayIndex: number) => {
    return leads.filter(l => (l.rank % 7) === dayIndex).map(l => ({
      name: l.businessName,
      task: l.rank % 2 === 0 ? 'Email Blast' : 'Follow-up Call',
      color: l.assetGrade === 'A' ? 'indigo' : 'slate'
    }));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-center">
        <div>
           <h2 className={`text-2xl font-black italic uppercase tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Tactical Schedule</h2>
           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Touchpoint Aggregation Flow</p>
        </div>
        <div className="flex gap-2">
           <button className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>Weekly View</button>
           <button className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest bg-indigo-600 text-white">Today</button>
        </div>
      </div>

      <div className={`grid grid-cols-7 gap-4 p-8 rounded-[3rem] border ${isDarkMode ? 'bg-slate-900 border-slate-800 shadow-2xl shadow-indigo-500/5' : 'bg-white border-slate-200 shadow-xl'}`}>
        {days.map((day, i) => (
          <div key={day} className="space-y-6">
            <div className={`text-center pb-4 border-b ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{day}</span>
            </div>
            <div className="space-y-3 min-h-[300px]">
               {getTasksForDay(i).map((task, idx) => (
                 <div 
                  key={idx} 
                  className={`p-3 rounded-2xl border transition-all hover:scale-[1.05] cursor-help ${
                    task.color === 'indigo' 
                      ? (isDarkMode ? 'bg-indigo-600/10 border-indigo-500/30' : 'bg-indigo-50 border-indigo-100') 
                      : (isDarkMode ? 'bg-slate-800/50 border-slate-800' : 'bg-slate-50 border-slate-100')
                  }`}
                 >
                    <p className={`text-[8px] font-black uppercase tracking-widest mb-1 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>{task.task}</p>
                    <p className={`text-[9px] font-bold truncate leading-tight ${isDarkMode ? 'text-white' : 'text-slate-700'}`}>{task.name}</p>
                 </div>
               ))}
               {getTasksForDay(i).length === 0 && (
                 <div className="h-20 flex items-center justify-center opacity-10">
                    <span className="text-[8px] font-black uppercase tracking-widest">Clear</span>
                 </div>
               )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MissionCalendar;
