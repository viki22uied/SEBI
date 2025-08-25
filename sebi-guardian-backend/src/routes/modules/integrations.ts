import { Router } from "express";
import axios from "axios";

const router = Router();

router.get("/stock/alpha-vantage", async (req, res) => {
  const symbol = String(req.query.symbol || "RELIANCE.BSE");
  const apiKey = process.env.ALPHAVANTAGE_KEY;
  if (!apiKey) return res.status(400).json({ error: "Missing Alpha Vantage key" });
  const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${encodeURIComponent(symbol)}&apikey=${apiKey}`;
  const { data } = await axios.get(url);
  res.json(data);
});

router.post("/translate", async (req, res) => {
  const { text, target } = req.body || {};
  if (!text || !target) return res.status(400).json({ error: "text, target required" });
  // Placeholder response; wire Google Translate API later
  res.json({ translated: text, target });
});

export default router;

