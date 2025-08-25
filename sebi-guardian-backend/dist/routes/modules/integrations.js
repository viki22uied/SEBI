"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const axios_1 = __importDefault(require("axios"));
const router = (0, express_1.Router)();
router.get("/stock/alpha-vantage", async (req, res) => {
    const symbol = String(req.query.symbol || "RELIANCE.BSE");
    const apiKey = process.env.ALPHAVANTAGE_KEY;
    if (!apiKey)
        return res.status(400).json({ error: "Missing Alpha Vantage key" });
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${encodeURIComponent(symbol)}&apikey=${apiKey}`;
    const { data } = await axios_1.default.get(url);
    res.json(data);
});
router.post("/translate", async (req, res) => {
    const { text, target } = req.body || {};
    if (!text || !target)
        return res.status(400).json({ error: "text, target required" });
    // Placeholder response; wire Google Translate API later
    res.json({ translated: text, target });
});
exports.default = router;
