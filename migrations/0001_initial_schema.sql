-- Prospector OS Database Schema
-- Migration 0001: Initial Schema

-- Leads table - stores all lead information
CREATE TABLE IF NOT EXISTS leads (
  rank INTEGER PRIMARY KEY,
  
  -- Identity
  businessName TEXT NOT NULL,
  websiteUrl TEXT,
  niche TEXT,
  city TEXT,
  region TEXT,
  phone TEXT,
  email TEXT,
  contactUrl TEXT,
  linkedinUrl TEXT,
  whatsappNumber TEXT,
  instagram TEXT,
  tiktok TEXT,
  youtube TEXT,
  decisionMaker TEXT,
  campaignName TEXT,
  
  -- Diagnostics
  visualScore REAL DEFAULT 0,
  socialScore REAL DEFAULT 0,
  ticketScore REAL DEFAULT 0,
  reachabilityScore REAL DEFAULT 0,
  totalScore REAL DEFAULT 0,
  leadScore REAL DEFAULT 0,
  scoreConfidence REAL DEFAULT 0,
  visualProof TEXT,
  socialGap TEXT,
  assetGrade TEXT DEFAULT 'C',
  scoreReasoning TEXT,
  
  -- Strategics
  bestAngle TEXT,
  personalizedHook TEXT,
  firstDeliverable TEXT,
  riskFlags TEXT, -- JSON array
  payload TEXT, -- JSON object
  forgeHistory TEXT, -- JSON array
  recoveryScript TEXT,
  
  -- Mission
  currentPhase TEXT DEFAULT 'SCAN',
  status TEXT DEFAULT 'idle',
  firstSeenAt INTEGER,
  lastTouchAt INTEGER,
  phaseChangedAt INTEGER,
  conversionProbability REAL DEFAULT 0,
  phaseHoldReason TEXT,
  
  -- Additional fields
  notes TEXT,
  dealValue REAL,
  lostReason TEXT,
  brandKit TEXT, -- JSON object
  scoreBreakdown TEXT, -- JSON object
  outreachCount INTEGER DEFAULT 0,
  conversionAttempts INTEGER DEFAULT 0,
  outreachChannels TEXT, -- JSON array
  campaignTags TEXT -- JSON array
);

-- Assets table - stores media vault assets
CREATE TABLE IF NOT EXISTS assets (
  id TEXT PRIMARY KEY,
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  type TEXT NOT NULL, -- 'pitch', 'lab', 'external', 'image', 'report', 'mockup', 'sonic', 'product'
  timestamp INTEGER NOT NULL,
  content TEXT
);

-- Proposals table - stores generated proposals
CREATE TABLE IF NOT EXISTS proposals (
  id TEXT PRIMARY KEY,
  leadName TEXT NOT NULL,
  niche TEXT NOT NULL,
  pitchText TEXT NOT NULL,
  mockupUrl TEXT,
  videoUrl TEXT,
  timestamp INTEGER NOT NULL,
  status TEXT DEFAULT 'pending' -- 'pending', 'viewed', 'accepted'
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_phase ON leads(currentPhase);
CREATE INDEX IF NOT EXISTS idx_leads_niche ON leads(niche);
CREATE INDEX IF NOT EXISTS idx_leads_lastTouch ON leads(lastTouchAt);
CREATE INDEX IF NOT EXISTS idx_assets_type ON assets(type);
CREATE INDEX IF NOT EXISTS idx_assets_timestamp ON assets(timestamp);
CREATE INDEX IF NOT EXISTS idx_proposals_leadName ON proposals(leadName);
CREATE INDEX IF NOT EXISTS idx_proposals_timestamp ON proposals(timestamp);
