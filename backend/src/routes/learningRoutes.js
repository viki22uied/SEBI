const express = require('express');
const router = express.Router();

// GET /api/learning/quiz/start
router.get('/quiz/start', (req, res) => {
  res.json({
    quizId: 'basic-1',
    questions: [
      { id: 'q1', q: 'What is phishing?', choices: ['A scam', 'A fish'] },
      { id: 'q2', q: 'Report suspicious advisors to?', choices: ['SEBI', 'Twitter'] },
    ],
  });
});

// POST /api/learning/quiz/submit
router.post('/quiz/submit', (req, res) => {
  const { quizId, answers } = req.body || {};
  const score = 2; // stub
  res.json({ quizId, score, badges: ['Vigilant Investor'] });
});

// GET /api/learning/progress
router.get('/progress', (req, res) => {
  res.json({ completed: 3, badges: ['Starter', 'Secure Login', 'Vigilant Investor'] });
});

module.exports = router;
