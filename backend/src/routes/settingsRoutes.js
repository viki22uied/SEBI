const express = require('express');
const router = express.Router();
const config = require('../../config/config');

// In-memory stub store per session (for demo only)
const state = { profile: {}, notifications: { email: true, sms: false } };

// GET/PUT /api/settings/profile
router.get('/profile', (req, res) => {
  res.json({ profile: state.profile });
});
router.put('/profile', (req, res) => {
  state.profile = { ...state.profile, ...req.body };
  res.json({ success: true, profile: state.profile });
});

// GET/PUT /api/settings/notifications
router.get('/notifications', (req, res) => {
  res.json({ notifications: state.notifications });
});
router.put('/notifications', (req, res) => {
  state.notifications = { ...state.notifications, ...req.body };
  res.json({ success: true, notifications: state.notifications });
});

// PUT /api/settings/language (Google Translate API stub)
router.put('/language', async (req, res) => {
  const { targetLang = 'en', text = 'Welcome to SEBI Guardian AI' } = req.body || {};
  // TODO: integrate Google Translate API
  res.json({ targetLang, translated: text, note: 'Stub translation. Integrate Google Translate API.' });
});

// PUT /api/settings/privacy
router.put('/privacy', (req, res) => {
  state.profile.privacy = { ...(state.profile.privacy || {}), ...req.body };
  res.json({ success: true, privacy: state.profile.privacy });
});

module.exports = router;
