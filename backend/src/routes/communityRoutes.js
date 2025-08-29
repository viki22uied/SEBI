const express = require('express');
const router = express.Router();

// POST /api/community/report-fraud
router.post('/report-fraud', (req, res) => {
  const report = { id: Date.now(), status: 'received', ...req.body };
  res.status(201).json({ success: true, report });
});

// POST /api/community/trusted-alert
router.post('/trusted-alert', (req, res) => {
  const alert = { id: Date.now(), channel: req.body?.channel || 'email', status: 'subscribed' };
  res.status(201).json({ success: true, alert });
});

// GET /api/community/sebi-sandbox (stub)
router.get('/sebi-sandbox', (req, res) => {
  res.json({ updates: [{ id: 1, title: 'Advisory on unsolicited messages' }] });
});

module.exports = router;
