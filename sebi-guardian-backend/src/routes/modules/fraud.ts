import { Router } from "express";

const router = Router();

router.post("/behavioral", (req, res) => {
  const data = req.body;
  const anomalyScore = Math.min(1, Math.max(0, (JSON.stringify(data).length % 100) / 100));
  res.json({ anomalyScore });
});

router.get("/social-network/:userId", (req, res) => {
  const { userId } = req.params;
  const nodes = [
    { id: userId, label: "You", risk: 0.2 },
    { id: "n1", label: "Contact A", risk: 0.6 },
    { id: "n2", label: "Contact B", risk: 0.1 },
  ];
  const edges = [
    { from: userId, to: "n1" },
    { from: userId, to: "n2" },
  ];
  res.json({ nodes, edges });
});

router.post("/deepfake-check", (req, res) => {
  const score = 0.35; // placeholder
  res.json({ deepfakeScore: score });
});

export default router;

