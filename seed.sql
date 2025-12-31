-- Seed data for testing Prospector OS

-- Insert sample leads
INSERT OR IGNORE INTO leads (
  rank, businessName, websiteUrl, niche, city, region,
  visualScore, socialScore, ticketScore, reachabilityScore,
  totalScore, leadScore, scoreConfidence, assetGrade,
  bestAngle, personalizedHook, firstDeliverable,
  currentPhase, status, firstSeenAt, lastTouchAt, phaseChangedAt,
  conversionProbability, notes
) VALUES 
  (
    1, 'Elite Fitness Studios', 'https://elitefitness.example.com', 
    'Fitness & Wellness', 'Limassol', 'Cyprus',
    85, 72, 88, 95,
    340, 85, 92, 'A',
    'Premium brand positioning with outdated digital presence',
    'Transform your elite clientele experience with a world-class digital platform',
    'Website redesign mockup + 30-day social media content calendar',
    'STRATEGIZE', 'in-progress', 1704067200000, 1704153600000, 1704067200000,
    78, 'High-ticket potential. Decision maker is the CEO. Best contact: WhatsApp.'
  ),
  (
    2, 'Coastal Dental Care', 'https://coastaldental.example.com',
    'Healthcare', 'Paphos', 'Cyprus',
    65, 45, 92, 88,
    290, 72, 85, 'B',
    'Medical credibility needs modern patient acquisition funnel',
    'Double your new patient bookings with automated appointment system',
    'Patient acquisition funnel + booking automation setup',
    'SCORE', 'idle', 1704153600000, 1704153600000, 1704153600000,
    65, 'Strong revenue potential. Need to reach practice manager.'
  ),
  (
    3, 'Artisan Bakery Co', 'https://artisanbakery.example.com',
    'Food & Beverage', 'Nicosia', 'Cyprus',
    55, 88, 45, 70,
    258, 64, 75, 'B',
    'Strong social presence but no ecommerce infrastructure',
    'Turn your Instagram followers into delivery revenue',
    'E-commerce website with online ordering system',
    'SCAN', 'idle', 1704240000000, 1704240000000, 1704240000000,
    55, 'Good engagement, lower budget. Instagram is their main channel.'
  );

-- Insert sample assets
INSERT OR IGNORE INTO assets (id, url, title, type, timestamp, content)
VALUES
  ('asset-001', 'https://example.com/pitch-fitness.pdf', 'Elite Fitness Pitch Deck', 'pitch', 1704067200000, 'Comprehensive fitness studio digital transformation proposal'),
  ('asset-002', 'https://example.com/mockup-dental.png', 'Coastal Dental Mockup', 'mockup', 1704153600000, 'Modern dental practice website design'),
  ('asset-003', 'https://example.com/report-bakery.pdf', 'Bakery Market Analysis', 'report', 1704240000000, 'Social media performance and ecommerce opportunity analysis');

-- Insert sample proposals
INSERT OR IGNORE INTO proposals (id, leadName, niche, pitchText, timestamp, status)
VALUES
  (
    'prop-001',
    'Elite Fitness Studios',
    'Fitness & Wellness',
    'Transform your elite brand with a premium digital platform that matches your world-class facilities. Our solution includes: website redesign, automated booking system, member portal, and comprehensive social media strategy.',
    1704067200000,
    'viewed'
  ),
  (
    'prop-002',
    'Coastal Dental Care',
    'Healthcare',
    'Double your new patient acquisition with our proven healthcare marketing system. Includes: patient-friendly website, automated appointment booking, review management, and targeted local advertising.',
    1704153600000,
    'pending'
  );
