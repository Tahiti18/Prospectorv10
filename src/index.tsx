import { Hono } from 'hono';
import { cors } from 'hono/cors';

type Bindings = {
  DB: D1Database;
  GEMINI_API_KEY: string;
  ASSETS: any;
}

const app = new Hono<{ Bindings: Bindings }>();

// Enable CORS for API routes
app.use('/api/*', cors());

// ===== LEADS API =====

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

app.get('/api/health', (c) => {
  return c.json({ status: 'ok', timestamp: Date.now() });
});

// Serve static files - the @hono/vite-cloudflare-pages plugin handles this automatically
// by serving files from the dist directory via ASSETS binding

app.get('*', async (c) => {
  // For Cloudflare Pages, static assets are automatically served
  // This is handled by the platform, not by our code
  // If a file doesn't exist, return 404
  return c.notFound();
});

export default app;
