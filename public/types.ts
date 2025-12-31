
export enum AssetGrade { A = 'A', B = 'B', C = 'C' }
export type MissionPhase = 'SCAN' | 'SCORE' | 'STRATEGIZE' | 'SEND' | 'CLOSE';
export type MissionStatus = 'idle' | 'in-progress' | 'stalled' | 'won' | 'lost';
export type PlayerMode = 'TACTICAL' | 'STRATEGIC' | 'RECON' | 'RECOVERY';

export interface RegionConfig {
  country: string;
  subRegion?: string;
  tone: string;
  currency: string;
  nicheFocus?: string[];
  industryMeta?: string;
  modifiers?: { visual: number; social: number; ticket: number; risk: number; };
}

// --- LAYER 1: IDENTITY ---
export interface LeadIdentity {
  rank: number;
  businessName: string;
  websiteUrl: string;
  niche: string;
  city: string;
  region: string;
  phone: string;
  email: string;
  contactUrl: string;
  linkedinUrl: string;
  whatsappNumber: string;
  instagram: string;
  tiktok: string;
  youtube: string;
  decisionMaker?: string;
  campaignName?: string;
  campaignTags?: string[];
}

// --- LAYER 2: DIAGNOSTICS ---
export interface LeadDiagnostics {
  visualScore: number;
  socialScore: number;
  ticketScore: number;
  reachabilityScore: number;
  totalScore: number;
  leadScore: number;
  scoreConfidence: number;
  visualProof: string;
  socialGap: string;
  assetGrade: AssetGrade;
  scoreReasoning?: string;
}

// --- LAYER 3: STRATEGICS ---
export interface ForgeSnapshot { version: string; timestamp: number; payload: PayloadForge; }
export interface PayloadForge {
  headline: string;
  offers: string[];
  objectionTargets: string[];
  deliveryMechanism: string;
  expectedROI: string;
  confirmed: boolean;
}
export interface LeadStrategics {
  bestAngle: string;
  personalizedHook: string;
  firstDeliverable: string;
  riskFlags: string[];
  payload?: PayloadForge;
  forgeHistory?: ForgeSnapshot[];
  recoveryScript?: string;
}

// --- LAYER 4: MISSION ---
export interface LeadMission {
  currentPhase: MissionPhase;
  status: MissionStatus;
  firstSeenAt: number;
  lastTouchAt: number;
  phaseChangedAt: number;
  conversionProbability: number;
  phaseHoldReason?: "awaiting assets" | "negotiation" | "follow-up" | "recon";
}

export interface BrandKit {
  primaryColor: string;
  secondaryColor: string;
  fontStyle: string;
  vibe: string;
}

export type Lead = LeadIdentity & LeadDiagnostics & LeadStrategics & LeadMission & { 
  notes: string; 
  dealValue?: number;
  lostReason?: string;
  brandKit?: BrandKit;
  scoreBreakdown?: { visual: number; social: number; highTicket: number; reachability: number };
  outreachCount?: number;
  conversionAttempts?: number;
  outreachChannels?: string[];
};

export interface VaultAsset {
  id: string;
  url: string;
  title: string;
  type: 'pitch' | 'lab' | 'external' | 'image' | 'report' | 'mockup' | 'sonic' | 'product';
  timestamp: number;
  content?: string;
}

export interface Proposal {
  id: string;
  leadName: string;
  niche: string;
  pitchText: string;
  mockupUrl?: string;
  videoUrl?: string;
  timestamp: number;
  status?: 'pending' | 'viewed' | 'accepted';
}

export type SubscriptionTier = 'Free' | 'Pro' | 'Enterprise';

export interface WhiteLabelConfig {
  isEnabled: boolean;
  hidePoweredBy?: boolean;
}

export interface AgencyProfile {
  name: string;
  ceoName: string;
  primaryService?: string;
  tagline?: string;
  contactEmail?: string;
  contactPhone?: string;
  brandColor?: string;
  tier: SubscriptionTier;
  whiteLabel: WhiteLabelConfig;
}

export interface LeadTask {
  id: string;
  text: string;
  completed: boolean;
}

export interface SalesSlide {
  title: string;
  content: string;
  bulletPoints: string[];
  visualPrompt: string;
}

export interface DemoConfig {
  welcomeMessage: string;
  persona: string;
  knowledgeBase: string[];
}

export interface Invoice {
  id: string;
  clientName: string;
  total: number;
  status: 'Paid' | 'Pending';
  date: number;
  items: any[];
  currency: string;
  paymentMethod: string;
}

export interface AgencyLedger {
  totalRevenue: number;
  subscriptionMRR: number;
  computeExpense: number;
  profitMargin: number;
  recentInvoices: Invoice[];
}

export interface MissionStep {
  task: string;
  tabId: string;
  isComplete: boolean;
}

export interface ActiveMission {
  goal: string;
  progress: number;
  steps: MissionStep[];
}
