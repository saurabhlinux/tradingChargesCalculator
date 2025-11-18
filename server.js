// server.js
import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

const SYMBOL_MAP = {
  "US30": "%5EDJI",
  "NAS100": "%5ENDX"
};

app.get("/price/:symbol", async (req, res) => {
  try {
    const symbol = req.params.symbol.toUpperCase();
    const idx = SYMBOL_MAP[symbol];

    if (!idx) return res.status(400).json({ error: "Invalid symbol" });

    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${idx}?interval=1m`;
    const data = await fetch(url);
    const json = await data.json();

    const price = json?.chart?.result?.[0]?.meta?.regularMarketPrice ?? null;

    return res.json({ symbol, price });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
