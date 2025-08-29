const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ name: 'SEBI Guardian AI API', version: '1.0.0' });
});

module.exports = router;
