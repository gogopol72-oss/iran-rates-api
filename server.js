const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors");

const app = express();
app.use(cors());

// helper: safe fallback response
function fallbackResponse() {
  return {
    success: true,
    source: "fallback",
    iran: {
      USD_IRR: 58000,
    },
    rates: {
      IRR: 1,
      USD: 58000,
      EUR: 62000,
      AED: 15800,
      GBP: 72000,
      PKR: 210,
      INR: 700,
      TRY: 1800,
      SAR: 15500,
    },
    time: new Date().toISOString(),
  };
}

app.get("/rates", async (req, res) => {
  try {
    const url = "https://www.tgju.org/profile/price_dollar_rl";

    const response = await axios.get(url, {
      timeout: 4000,
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
      rates: {
        IRR: 1,
        USD: usdIrr || 58000,
        EUR: Math.round((usdIrr || 58000) * 1.07),
        AED: Math.round((usdIrr || 58000) * 0.27),
        PKR: 210,
      },
      time: new Date().toISOString(),
    });

  } catch (error) {
    return res.json({
      success: true,
      source: "fallback",
      rates: {
        IRR: 1,
        USD: 58000,
        EUR: 62000,
        AED: 15800,
        PKR: 210,
      },
      time: new Date().toISOString(),
    });
  }
});

// IMPORTANT: Railway uses process.env.PORT
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on port", PORT);
});