const express = require('express');
const router = express.Router();

// POST /api/fraud/behavior-biometrics
router.post('/behavior-biometrics', async (req, res) => {
  const { typing, mouse } = req.body || {};
  // Stub anomaly calculation
  const anomalyScore = Math.min(1, Math.random() * 0.5 + 0.4);
  res.json({ anomaly: anomalyScore, verdict: anomalyScore > 0.7 ? 'Suspicious' : 'Normal' });
});

// GET /api/fraud/social-contagion
router.get('/social-contagion', async (req, res) => {
  // Return a small graph stub
  res.json({
    nodes: [
      { id: 'user:1' },
      { id: 'user:2' },
      { id: 'scam:1' },
    ],
    links: [
      { source: 'scam:1', target: 'user:1' },
      { source: 'user:1', target: 'user:2' },
    ],
  });
});

// POST /api/fraud/deepfake-check
router.post('/deepfake-check', async (req, res) => {
  const { contentUrl, text } = req.body || {};
  const authenticity = Number((Math.random() * 0.4 + 0.6).toFixed(2));
  res.json({ authenticity, verdict: authenticity < 0.8 ? 'Likely Manipulated' : 'Likely Authentic', source: contentUrl || 'text' });
});

module.exports = router;
