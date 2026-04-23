const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/", (req, res) => {
  res.json({ status: "OK", message: "API running" });
});

app.get("/rates", async (req, res) => {
  try {
    const url = "https://www.tgju.org/profile/price_dollar_rl";

    const response = await axios.get(url, {
      timeout: 5000,
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });

    const $ = cheerio.load(response.data);
    const priceText = $(".value").first().text().replace(/,/g, "").trim();
    const usdIrr = parseInt(priceText);

    return res.json({
      success: true,
      source: usdIrr ? "TGJU" : "fallback",
      usd: usdIrr || 58000,
      time: new Date().toISOString()
    });

  } catch (e) {
    return res.json({
      success: true,
      source: "fallback",
      usd: 58000,
      time: new Date().toISOString()
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on port", PORT);
});