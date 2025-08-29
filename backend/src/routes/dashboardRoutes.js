const express = require('express');
const router = express.Router();
const yahooFinance = require('yahoo-finance2').default;

// GET /api/dashboard/risk-score
router.get('/risk-score', async (req, res) => {
  res.json({ score: 72, level: 'Medium' });
});

// GET /api/dashboard/alerts
router.get('/alerts', async (req, res) => {
  res.json([
    { id: 1, type: 'Phishing', msg: 'Suspicious SMS' },
    { id: 2, type: 'PumpDump', msg: 'Unusual spike detected' },
  ]);
});

// POST /api/dashboard/actions/report
router.post('/actions/report', async (req, res) => {
  const report = { id: Date.now(), ...req.body, status: 'received' };
  res.status(201).json({ success: true, report });
});

// POST /api/dashboard/actions/verify-advice
router.post('/actions/verify-advice', async (req, res) => {
  try {
    const { symbol, advice } = req.body || {};
    if (!symbol || !advice) return res.status(400).json({ error: 'symbol and advice are required' });

    const quote = await yahooFinance.quote(symbol);
    // Simple validation: if advice is 'buy' and price change positive -> valid
    const price = quote?.regularMarketPrice;
    const change = quote?.regularMarketChange;
    const valid = advice.toLowerCase() === 'buy' ? change > 0 : advice.toLowerCase() === 'sell' ? change < 0 : false;

    res.json({ symbol, price, valid: Boolean(valid) });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch quote', details: err.message });
  }
});

// POST /api/dashboard/actions/check-source (SEBI/NSE/BSE sandbox stub)
router.post('/actions/check-source', async (req, res) => {
  const { name, regNo, type } = req.body || {};
  // Stub: in future call SEBI/NSE/BSE registries
  const isRegistered = Boolean(regNo && regNo.toString().length >= 5);
  res.json({ name, regNo, type: type || 'advisor', isRegistered, source: 'SEBI-SANDBOX' });
});

module.exports = router;
