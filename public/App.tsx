
import React, { useState, useEffect } from 'react';
import { Lead, RegionConfig, VaultAsset, Proposal } from './types';

// GLOBAL OVERLAYS
import KeyManager from './components/KeyManager';
import RegionSelector from './components/RegionSelector';
import ResourceMonitor from './components/ResourceMonitor';
import OnboardingWizard from './components/OnboardingWizard';
import CommandPalette from './components/CommandPalette';
import MissionOracle from './components/MissionOracle';
import ChatBot from './components/ChatBot';
import ContactModal from './components/ContactModal';
import LeadDetailModal from './components/LeadDetailModal';

// PANEL A: OPERATE
import Dashboard from './components/Dashboard';
import LeadDiscoveryEngine from './components/LeadDiscoveryEngine'; // The Radar
import DominanceCrawler from './components/DominanceCrawler';
import LeadTable from './components/LeadTable';
import MissionBoard from './components/MissionBoard';
import WarRoom from './components/WarRoom';
import DeepReasoningLab from './components/DeepReasoningLab';
import IntelligenceWorkspace from './components/IntelligenceWorkspace';
import TrendIntelligenceAgent from './components/TrendIntelligenceAgent';
import VisionIntelligence from './components/VisionIntelligence';
import CinemaIntelHub from './components/CinemaIntelHub';
import ArticleSummarizer from './components/ArticleSummarizer';
import BenchmarkHub from './components/BenchmarkHub';
import AgencyAnalytics from './components/AgencyAnalytics';
import IntelHeatmap from './components/IntelHeatmap';

// PANEL B: CREATE
import VideoPitchGenerator from './components/VideoPitchGenerator';
import AIImageStudio from './components/AIImageStudio';
import WebMockupGenerator from './components/WebMockupGenerator';
import SonicStudio from './components/SonicStudio';
import ProductStudio from './components/ProductStudio';
import CreativeVideoLab from './components/CreativeVideoLab';
import FlashSpark from './components/FlashSpark';
import MediaVault from './components/MediaVault';

// PANEL C: SELL
import ProposalStudio from './components/ProposalStudio';
import ROICalculator from './components/ROICalculator';
import AttackSequencer from './components/AttackSequencer';
import DeckArchitect from './components/DeckArchitect';
import DemoSandbox from './components/DemoSandbox';
import DraftingTerminal from './components/DraftingTerminal';
import VoiceIntelligenceAgent from './components/VoiceIntelligenceAgent';
import LiveTranscriber from './components/LiveTranscriber';
import AIConcierge from './components/AIConcierge';
import AIPitchGenerator from './components/AIPitchGenerator';
import FunnelArchitect from './components/FunnelArchitect';

// PANEL D: CONTROL
import SystemPlaybook from './components/SystemPlaybook';
import BillingNode from './components/BillingNode';
import AffiliateHub from './components/AffiliateHub';
import AgencyIdentityHub from './components/AgencyIdentityHub';
import OSForge from './components/OSForge';
import LeadExportView from './components/LeadExportView';
import MissionCalendar from './components/MissionCalendar';
import ProductionHub from './components/ProductionHub';
import KeyManagerComponent from './components/KeyManager'; // Renamed to avoid conflict if needed, used as Settings

type Panel = 'OPERATE' | 'CREATE' | 'SELL' | 'CONTROL';

const App: React.FC = () => {
  // --- GLOBAL STATE ---
  const [panel, setPanel] = useState<Panel>('OPERATE');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [region, setRegion] = useState<RegionConfig>({ country: 'Cyprus', currency: 'EUR', tone: 'Sophisticated' });
  
  // --- DATA STATE ---
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [assets, setAssets] = useState<VaultAsset[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  
  // --- MODAL STATE ---
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // --- PERSISTENCE LAYER (AUTO-SAVE) ---
  useEffect(() => {
    // Load state from local storage on mount
    try {
      const savedLeads = localStorage.getItem('pomelli_leads');
      const savedAssets = localStorage.getItem('pomelli_assets');
      const savedProposals = localStorage.getItem('pomelli_proposals');
      
      if (savedLeads) setLeads(JSON.parse(savedLeads));
      if (savedAssets) setAssets(JSON.parse(savedAssets));
      if (savedProposals) setProposals(JSON.parse(savedProposals));
    } catch (e) {
      console.error("Auto-Load Failed:", e);
    }
  }, []);

  // Save state whenever it changes
  useEffect(() => { localStorage.setItem('pomelli_leads', JSON.stringify(leads)); }, [leads]);
  useEffect(() => { localStorage.setItem('pomelli_assets', JSON.stringify(assets)); }, [assets]);
  useEffect(() => { localStorage.setItem('pomelli_proposals', JSON.stringify(proposals)); }, [proposals]);

  // --- KEYBOARD SHORTCUTS ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowCommandPalette(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // --- NAVIGATION MAP ---
  const NAV_STRUCTURE: Record<Panel, { id: string; label: string; icon: string }[]> = {
    OPERATE: [
      { id: 'dashboard', label: 'Command', icon: '📊' },
      { id: 'recon', label: 'Radar Recon', icon: '📡' },
      { id: 'crawler', label: 'Auto-Crawl', icon: '🕷️' },
      { id: 'targets', label: 'Target List', icon: '🎯' },
      { id: 'mission_board', label: 'Pipeline', icon: '📋' },
      { id: 'war_room', label: 'War Room', icon: '⚔️' },
      { id: 'deep_intel', label: 'Deep Logic', icon: '🧠' },
      { id: 'workspace', label: 'Workspace', icon: '🔬' },
      { id: 'trends', label: 'Viral Pulse', icon: '📈' },
      { id: 'vision', label: 'Vision Lab', icon: '👁️' },
      { id: 'cinema', label: 'Cinema Intel', icon: '🎞️' },
      { id: 'articles', label: 'Article Intel', icon: '📰' },
      { id: 'benchmark', label: 'Benchmark', icon: '🆚' },
      { id: 'analytics', label: 'Analytics', icon: '📉' },
      { id: 'heatmap', label: 'Heatmap', icon: '🗺️' },
    ],
    CREATE: [
      { id: 'video_pitch', label: 'Video Pitch', icon: '🎬' },
      { id: 'visual_studio', label: 'Visual Studio', icon: '🎨' },
      { id: 'mockups', label: '4K Mockups', icon: '🖥️' },
      { id: 'sonic', label: 'Sonic Studio', icon: '🎵' },
      { id: 'product', label: 'Product Synth', icon: '📦' },
      { id: 'motion', label: 'Motion Lab', icon: '🎥' },
      { id: 'flash_spark', label: 'Flash Spark', icon: '⚡' },
      { id: 'vault', label: 'Media Vault', icon: '🔐' },
    ],
    SELL: [
      { id: 'proposals', label: 'Proposals', icon: '📝' },
      { id: 'roi', label: 'ROI Calc', icon: '💰' },
      { id: 'sequencer', label: 'Sequencer', icon: '🔁' },
      { id: 'deck', label: 'Deck Arch', icon: '📑' },
      { id: 'sandbox', label: 'Demo Sandbox', icon: '🧪' },
      { id: 'drafting', label: 'Drafting', icon: '✍️' },
      { id: 'voice', label: 'Voice Strat', icon: '🎙️' },
      { id: 'scribe', label: 'Live Scribe', icon: '📝' },
      { id: 'concierge', label: 'AI Concierge', icon: '🛎️' },
      { id: 'pitch_gen', label: 'Pitch Gen', icon: '🗣️' },
      { id: 'funnel', label: 'Funnel Map', icon: '🌪️' },
    ],
    CONTROL: [
      { id: 'playbook', label: 'Playbook', icon: '📖' },
      { id: 'billing', label: 'Billing', icon: '💳' },
      { id: 'affiliate', label: 'Affiliate', icon: '🤝' },
      { id: 'identity', label: 'Identity', icon: '🆔' },
      { id: 'forge', label: 'OS Forge', icon: '🛠️' },
      { id: 'export', label: 'Export Data', icon: '📤' },
      { id: 'calendar', label: 'Calendar', icon: '📅' },
      { id: 'production', label: 'Prod. Log', icon: '📦' },
      { id: 'settings', label: 'Settings', icon: '⚙️' },
    ]
  };

  // --- HANDLERS ---
  const handleLeadFound = (newLeads: Lead[]) => setLeads(prev => [...newLeads, ...prev]);
  const handleArchiveAsset = (asset: any) => setAssets(prev => [...prev, { ...asset, id: Math.random().toString(), timestamp: Date.now() }]);
  
  const navigateToTab = (tabId: string) => {
    // Find which panel holds this tab
    for (const [p, tabs] of Object.entries(NAV_STRUCTURE)) {
      if (tabs.find(t => t.id === tabId)) {
        setPanel(p as Panel);
        setActiveTab(tabId);
        return;
      }
    }
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans pb-20 transition-colors duration-500 ${isDarkMode ? 'bg-[#020617] text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-[#0f172a]/90 backdrop-blur-xl border-b border-white/5 shadow-lg">
        <div className="max-w-[1800px] mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0">
          <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              </div>
              <div>
                <h1 className="text-lg font-black uppercase italic tracking-tighter leading-none">Global Prospector <span className="text-indigo-500">OS</span></h1>
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.3em]">Apex Build v10.0</p>
              </div>
            </div>
            {/* Mobile Menu Trigger would go here */}
          </div>

          <div className="flex bg-slate-900 p-1.5 rounded-xl border border-white/10 shadow-inner overflow-x-auto max-w-full">
            {Object.keys(NAV_STRUCTURE).map(p => (
              <button 
                key={p} 
                onClick={() => { setPanel(p as Panel); setActiveTab(NAV_STRUCTURE[p as Panel][0].id); }}
                className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${panel === p ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
              >
                {p}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
             {/* COMMAND INTERFACE SEARCH BAR */}
             <button 
                onClick={() => setShowCommandPalette(true)}
                className="hidden xl:flex items-center gap-3 bg-slate-900 border border-white/10 px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:border-indigo-500/50 transition-all group min-w-[200px]"
             >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                <span className="text-[10px] font-black uppercase tracking-widest flex-1 text-left">Search Modules...</span>
                <span className="bg-white/10 px-1.5 py-0.5 rounded text-[8px] font-mono group-hover:bg-indigo-500 group-hover:text-white transition-colors">⌘K</span>
             </button>

             <div className="hidden md:block w-px h-8 bg-white/10"></div>
             
             <RegionSelector currentRegion={region} onRegionChange={setRegion} />
             
             {selectedLead && (
                <div onClick={() => setShowDetailModal(true)} className="hidden md:flex items-center gap-3 bg-indigo-600/20 border border-indigo-500/30 px-4 py-2 rounded-xl cursor-pointer hover:bg-indigo-600/30 transition-all">
                   <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                   <div>
                      <p className="text-[8px] font-black uppercase text-indigo-300">Active Target</p>
                      <p className="text-[10px] font-bold text-white uppercase truncate max-w-[100px]">{selectedLead.businessName}</p>
                   </div>
                </div>
             )}
          </div>
        </div>

        {/* SUB-NAV SCROLLER */}
        <div className="border-t border-white/5 bg-[#020617]/80 backdrop-blur-md overflow-x-auto no-scrollbar">
          <div className="max-w-[1800px] mx-auto px-6 h-14 flex items-center gap-2">
            {NAV_STRUCTURE[panel].map(t => (
              <button 
                key={t.id} 
                onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-[10px] font-black uppercase tracking-widest whitespace-nowrap ${activeTab === t.id ? 'bg-white/10 text-white border border-white/10' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5 border border-transparent'}`}
              >
                <span className="text-sm opacity-70">{t.icon}</span> {t.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-8 max-w-[1800px] mx-auto w-full relative z-10">
        
        {/* OPERATE */}
        {activeTab === 'dashboard' && <Dashboard leads={leads} health={{}} currentRegion={region} onNavigate={(t) => { setPanel('OPERATE'); setActiveTab(t); }} />}
        {activeTab === 'recon' && <LeadDiscoveryEngine currentRegion={region} onLeadsFound={(newLeads) => handleLeadFound(newLeads)} />}
        {activeTab === 'crawler' && <DominanceCrawler onLeadsFound={handleLeadFound} isDarkMode={isDarkMode} currentRegion={region} />}
        {activeTab === 'targets' && <LeadTable leads={leads} archivedIds={[]} isDarkMode={isDarkMode} onSelectLead={(l) => { setSelectedLead(l); setShowDetailModal(true); }} />}
        {activeTab === 'mission_board' && <MissionBoard leads={leads} onSelectLead={(l) => { setSelectedLead(l); setShowDetailModal(true); }} isDarkMode={isDarkMode} onReorderLeads={setLeads} />}
        {activeTab === 'war_room' && <WarRoom selectedLead={selectedLead} isDarkMode={isDarkMode} />}
        {activeTab === 'deep_intel' && <DeepReasoningLab selectedLead={selectedLead} onProduced={handleArchiveAsset} isDarkMode={isDarkMode} />}
        {activeTab === 'workspace' && <IntelligenceWorkspace leads={leads} />}
        {activeTab === 'trends' && <TrendIntelligenceAgent />}
        {activeTab === 'vision' && <VisionIntelligence onProduced={handleArchiveAsset} isDarkMode={isDarkMode} />}
        {activeTab === 'cinema' && <CinemaIntelHub />}
        {activeTab === 'articles' && <ArticleSummarizer isDarkMode={isDarkMode} />}
        {activeTab === 'benchmark' && <BenchmarkHub isDarkMode={isDarkMode} />}
        {activeTab === 'analytics' && <AgencyAnalytics leads={leads} isDarkMode={isDarkMode} />}
        {activeTab === 'heatmap' && <IntelHeatmap leads={leads} isDarkMode={isDarkMode} />}

        {/* CREATE */}
        {activeTab === 'video_pitch' && <VideoPitchGenerator leads={leads} onArchive={handleArchiveAsset} />}
        {activeTab === 'visual_studio' && <AIImageStudio onProduced={handleArchiveAsset} />}
        {activeTab === 'mockups' && <WebMockupGenerator selectedLead={selectedLead} onProduced={handleArchiveAsset} />}
        {activeTab === 'sonic' && <SonicStudio selectedLead={selectedLead} isDarkMode={isDarkMode} onProduced={handleArchiveAsset} />}
        {activeTab === 'product' && <ProductStudio onProduced={handleArchiveAsset} isDarkMode={isDarkMode} />}
        {activeTab === 'motion' && <CreativeVideoLab onArchive={handleArchiveAsset} />}
        {activeTab === 'flash_spark' && <FlashSpark selectedLead={selectedLead} />}
        {activeTab === 'vault' && <MediaVault assets={assets} onAddExternal={handleArchiveAsset} />}

        {/* SELL */}
        {activeTab === 'proposals' && <ProposalStudio proposals={proposals} setProposals={setProposals} assets={assets} selectedLead={selectedLead} />}
        {activeTab === 'roi' && <ROICalculator selectedLead={selectedLead} isDarkMode={isDarkMode} />}
        {activeTab === 'sequencer' && <AttackSequencer lead={selectedLead} isDarkMode={isDarkMode} />}
        {activeTab === 'deck' && <DeckArchitect selectedLead={selectedLead} isDarkMode={isDarkMode} />}
        {activeTab === 'sandbox' && <DemoSandbox selectedLead={selectedLead} isDarkMode={isDarkMode} />}
        {activeTab === 'drafting' && <DraftingTerminal selectedLead={selectedLead} isDarkMode={isDarkMode} />}
        {activeTab === 'voice' && <VoiceIntelligenceAgent isDarkMode={isDarkMode} />}
        {activeTab === 'scribe' && <LiveTranscriber isDarkMode={isDarkMode} />}
        {activeTab === 'concierge' && <AIConcierge selectedLead={selectedLead} />}
        {activeTab === 'pitch_gen' && <AIPitchGenerator lead={selectedLead} isDarkMode={isDarkMode} />}
        {activeTab === 'funnel' && <FunnelArchitect selectedLead={selectedLead} isDarkMode={isDarkMode} />}

        {/* CONTROL */}
        {activeTab === 'playbook' && <SystemPlaybook onNavigate={setActiveTab} isDarkMode={isDarkMode} onRestartTour={() => setShowOnboarding(true)} />}
        {activeTab === 'billing' && <BillingNode isDarkMode={isDarkMode} />}
        {activeTab === 'affiliate' && <AffiliateHub isDarkMode={isDarkMode} />}
        {activeTab === 'identity' && <AgencyIdentityHub isDarkMode={isDarkMode} />}
        {activeTab === 'forge' && <OSForge isDarkMode={isDarkMode} />}
        {activeTab === 'export' && <LeadExportView leads={leads} isDarkMode={isDarkMode} />}
        {activeTab === 'calendar' && <MissionCalendar leads={leads} isDarkMode={isDarkMode} />}
        {activeTab === 'production' && <ProductionHub assets={assets} setAssets={setAssets} />}
        {activeTab === 'settings' && <KeyManagerComponent />}

      </main>

      {/* GLOBAL OVERLAYS */}
      <ResourceMonitor isDarkMode={isDarkMode} />
      <MissionOracle onNavigate={navigateToTab} isDarkMode={isDarkMode} />
      <ChatBot selectedLead={selectedLead} currentRegion={region} />
      
      {showOnboarding && <OnboardingWizard onClose={() => setShowOnboarding(false)} onNavigate={navigateToTab} isDarkMode={isDarkMode} />}
      {showCommandPalette && (
        <CommandPalette 
          isOpen={showCommandPalette} 
          onClose={() => setShowCommandPalette(false)} 
          onNavigate={navigateToTab} 
          isDarkMode={isDarkMode} 
          navStructure={NAV_STRUCTURE} 
        />
      )}
      {showContactModal && <ContactModal lead={selectedLead} onClose={() => setShowContactModal(false)} isDarkMode={isDarkMode} />}
      
      {showDetailModal && selectedLead && (
        <LeadDetailModal 
          lead={selectedLead} 
          isArchived={false} 
          isDarkMode={isDarkMode} 
          onClose={() => setShowDetailModal(false)}
          onUpdateLead={(updated) => {
             setLeads(prev => prev.map(l => l.rank === updated.rank ? updated : l));
             setSelectedLead(updated);
          }}
          onToggleArchive={() => {}}
        />
      )}

    </div>
  );
};

export default App;
