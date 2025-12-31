import { Hono } from 'hono';
import { cors } from 'hono/cors';

type Bindings = {
  DB: D1Database;
  GEMINI_API_KEY: string;
}

const app = new Hono<{ Bindings: Bindings }>();

// Enable CORS for API routes
app.use('/api/*', cors());

// ===== LEADS API =====

// Get all leads
app.get('/api/leads', async (c) => {
  try {
    const { results } = await c.env.DB.prepare(`
      SELECT * FROM leads ORDER BY lastTouchAt DESC
    `).all();
    return c.json(results || []);
  } catch (error) {
    console.error('Error fetching leads:', error);
    return c.json({ error: 'Failed to fetch leads' }, 500);
  }
});

// Get single lead by rank
app.get('/api/leads/:rank', async (c) => {
  try {
    const rank = parseInt(c.req.param('rank'));
    const result = await c.env.DB.prepare(`
      SELECT * FROM leads WHERE rank = ?
    `).bind(rank).first();
    
    if (!result) {
      return c.json({ error: 'Lead not found' }, 404);
    }
    return c.json(result);
  } catch (error) {
    console.error('Error fetching lead:', error);
    return c.json({ error: 'Failed to fetch lead' }, 500);
  }
});

// Create new lead
app.post('/api/leads', async (c) => {
  try {
    const lead = await c.req.json();
    const now = Date.now();
    
    await c.env.DB.prepare(`
      INSERT INTO leads (
        rank, businessName, websiteUrl, niche, city, region,
        phone, email, contactUrl, linkedinUrl, whatsappNumber,
        instagram, tiktok, youtube, decisionMaker, campaignName,
        visualScore, socialScore, ticketScore, reachabilityScore,
        totalScore, leadScore, scoreConfidence, visualProof,
        socialGap, assetGrade, bestAngle, personalizedHook,
        firstDeliverable, currentPhase, status, firstSeenAt,
        lastTouchAt, phaseChangedAt, conversionProbability, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      lead.rank || 0,
      lead.businessName || '',
      lead.websiteUrl || '',
      lead.niche || '',
      lead.city || '',
      lead.region || '',
      lead.phone || '',
      lead.email || '',
      lead.contactUrl || '',
      lead.linkedinUrl || '',
      lead.whatsappNumber || '',
      lead.instagram || '',
      lead.tiktok || '',
      lead.youtube || '',
      lead.decisionMaker || '',
      lead.campaignName || '',
      lead.visualScore || 0,
      lead.socialScore || 0,
      lead.ticketScore || 0,
      lead.reachabilityScore || 0,
      lead.totalScore || 0,
      lead.leadScore || 0,
      lead.scoreConfidence || 0,
      lead.visualProof || '',
      lead.socialGap || '',
      lead.assetGrade || 'C',
      lead.bestAngle || '',
      lead.personalizedHook || '',
      lead.firstDeliverable || '',
      lead.currentPhase || 'SCAN',
      lead.status || 'idle',
      now,
      now,
      now,
      lead.conversionProbability || 0,
      lead.notes || ''
    ).run();
    
    return c.json({ success: true, rank: lead.rank });
  } catch (error) {
    console.error('Error creating lead:', error);
    return c.json({ error: 'Failed to create lead' }, 500);
  }
});

// Update lead
app.put('/api/leads/:rank', async (c) => {
  try {
    const rank = parseInt(c.req.param('rank'));
    const lead = await c.req.json();
    const now = Date.now();
    
    await c.env.DB.prepare(`
      UPDATE leads SET
        businessName = ?, websiteUrl = ?, niche = ?, city = ?, region = ?,
        phone = ?, email = ?, contactUrl = ?, linkedinUrl = ?, whatsappNumber = ?,
        instagram = ?, tiktok = ?, youtube = ?, decisionMaker = ?, campaignName = ?,
        visualScore = ?, socialScore = ?, ticketScore = ?, reachabilityScore = ?,
        totalScore = ?, leadScore = ?, scoreConfidence = ?, visualProof = ?,
        socialGap = ?, assetGrade = ?, bestAngle = ?, personalizedHook = ?,
        firstDeliverable = ?, currentPhase = ?, status = ?, lastTouchAt = ?,
        conversionProbability = ?, notes = ?
      WHERE rank = ?
    `).bind(
      lead.businessName, lead.websiteUrl, lead.niche, lead.city, lead.region,
      lead.phone, lead.email, lead.contactUrl, lead.linkedinUrl, lead.whatsappNumber,
      lead.instagram, lead.tiktok, lead.youtube, lead.decisionMaker, lead.campaignName,
      lead.visualScore, lead.socialScore, lead.ticketScore, lead.reachabilityScore,
      lead.totalScore, lead.leadScore, lead.scoreConfidence, lead.visualProof,
      lead.socialGap, lead.assetGrade, lead.bestAngle, lead.personalizedHook,
      lead.firstDeliverable, lead.currentPhase, lead.status, now,
      lead.conversionProbability, lead.notes, rank
    ).run();
    
    return c.json({ success: true });
  } catch (error) {
    console.error('Error updating lead:', error);
    return c.json({ error: 'Failed to update lead' }, 500);
  }
});

// Delete lead
app.delete('/api/leads/:rank', async (c) => {
  try {
    const rank = parseInt(c.req.param('rank'));
    await c.env.DB.prepare(`DELETE FROM leads WHERE rank = ?`).bind(rank).run();
    return c.json({ success: true });
  } catch (error) {
    console.error('Error deleting lead:', error);
    return c.json({ error: 'Failed to delete lead' }, 500);
  }
});

// ===== ASSETS API =====

// Get all assets
app.get('/api/assets', async (c) => {
  try {
    const { results } = await c.env.DB.prepare(`
      SELECT * FROM assets ORDER BY timestamp DESC
    `).all();
    return c.json(results || []);
  } catch (error) {
    console.error('Error fetching assets:', error);
    return c.json({ error: 'Failed to fetch assets' }, 500);
  }
});

// Create new asset
app.post('/api/assets', async (c) => {
  try {
    const asset = await c.req.json();
    const id = crypto.randomUUID();
    
    await c.env.DB.prepare(`
      INSERT INTO assets (id, url, title, type, timestamp, content)
      VALUES (?, ?, ?, ?, ?, ?)
    `).bind(id, asset.url, asset.title, asset.type, Date.now(), asset.content || '').run();
    
    return c.json({ success: true, id });
  } catch (error) {
    console.error('Error creating asset:', error);
    return c.json({ error: 'Failed to create asset' }, 500);
  }
});

// Delete asset
app.delete('/api/assets/:id', async (c) => {
  try {
    const id = c.req.param('id');
    await c.env.DB.prepare(`DELETE FROM assets WHERE id = ?`).bind(id).run();
    return c.json({ success: true });
  } catch (error) {
    console.error('Error deleting asset:', error);
    return c.json({ error: 'Failed to delete asset' }, 500);
  }
});

// ===== PROPOSALS API =====

// Get all proposals
app.get('/api/proposals', async (c) => {
  try {
    const { results } = await c.env.DB.prepare(`
      SELECT * FROM proposals ORDER BY timestamp DESC
    `).all();
    return c.json(results || []);
  } catch (error) {
    console.error('Error fetching proposals:', error);
    return c.json({ error: 'Failed to fetch proposals' }, 500);
  }
});

// Create new proposal
app.post('/api/proposals', async (c) => {
  try {
    const proposal = await c.req.json();
    const id = crypto.randomUUID();
    
    await c.env.DB.prepare(`
      INSERT INTO proposals (id, leadName, niche, pitchText, mockupUrl, videoUrl, timestamp, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      id,
      proposal.leadName,
      proposal.niche,
      proposal.pitchText,
      proposal.mockupUrl || '',
      proposal.videoUrl || '',
      Date.now(),
      proposal.status || 'pending'
    ).run();
    
    return c.json({ success: true, id });
  } catch (error) {
    console.error('Error creating proposal:', error);
    return c.json({ error: 'Failed to create proposal' }, 500);
  }
});

// Delete proposal
app.delete('/api/proposals/:id', async (c) => {
  try {
    const id = c.req.param('id');
    await c.env.DB.prepare(`DELETE FROM proposals WHERE id = ?`).bind(id).run();
    return c.json({ success: true });
  } catch (error) {
    console.error('Error deleting proposal:', error);
    return c.json({ error: 'Failed to delete proposal' }, 500);
  }
});

// Health check
app.get('/api/health', (c) => {
  return c.json({ status: 'ok', timestamp: Date.now() });
});

// Serve the main HTML
app.get('/', (c) => {
  return c.html(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Prospector OS | Lead Intel Engine - API Backend</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-900 text-white p-8">
    <div class="max-w-4xl mx-auto">
        <h1 class="text-4xl font-bold mb-6 text-indigo-400">🎯 Prospector OS | Lead Intel Engine</h1>
        <p class="text-lg mb-8 text-slate-300">Backend API is running successfully with Cloudflare D1 database.</p>
        
        <div class="bg-slate-800 rounded-lg p-6 mb-6">
            <h2 class="text-2xl font-bold mb-4 text-emerald-400">✅ Available API Endpoints:</h2>
            <ul class="space-y-2 font-mono text-sm">
                <li class="text-slate-300"><span class="text-blue-400">GET</span> /api/health - Health check</li>
                <li class="text-slate-300"><span class="text-blue-400">GET</span> /api/leads - Get all leads</li>
                <li class="text-slate-300"><span class="text-blue-400">GET</span> /api/leads/:rank - Get specific lead</li>
                <li class="text-slate-300"><span class="text-green-400">POST</span> /api/leads - Create new lead</li>
                <li class="text-slate-300"><span class="text-yellow-400">PUT</span> /api/leads/:rank - Update lead</li>
                <li class="text-slate-300"><span class="text-red-400">DELETE</span> /api/leads/:rank - Delete lead</li>
                <li class="text-slate-300"><span class="text-blue-400">GET</span> /api/assets - Get all assets</li>
                <li class="text-slate-300"><span class="text-green-400">POST</span> /api/assets - Create asset</li>
                <li class="text-slate-300"><span class="text-red-400">DELETE</span> /api/assets/:id - Delete asset</li>
                <li class="text-slate-300"><span class="text-blue-400">GET</span> /api/proposals - Get all proposals</li>
                <li class="text-slate-300"><span class="text-green-400">POST</span> /api/proposals - Create proposal</li>
                <li class="text-slate-300"><span class="text-red-400">DELETE</span> /api/proposals/:id - Delete proposal</li>
            </ul>
        </div>
        
        <div class="bg-slate-800 rounded-lg p-6">
            <h2 class="text-2xl font-bold mb-4 text-amber-400">📋 Quick Test:</h2>
            <pre class="bg-slate-900 p-4 rounded overflow-x-auto"><code>curl https://3000-i0cpklycmklcu6n1lnlbc-de59bda9.sandbox.novita.ai/api/health
curl https://3000-i0cpklycmklcu6n1lnlbc-de59bda9.sandbox.novita.ai/api/leads</code></pre>
        </div>
        
        <div class="mt-8 text-sm text-slate-400">
            <p>📦 Database: Cloudflare D1 (SQLite)</p>
            <p>🚀 Framework: Hono + TypeScript</p>
            <p>☁️ Deployment: Cloudflare Pages/Workers</p>
        </div>
    </div>
</body>
</html>`);
});

export default app;
