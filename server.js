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
      timeout: 5000,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });

    const $ = cheerio.load(response.data);

    const priceText = $(".value").first().text().replace(/,/g, "").trim();

    const usdIrr = parseInt(priceText);

    if (!usdIrr || isNaN(usdIrr)) {
      console.log("Invalid TGJU data → fallback used");
      return res.json(fallbackResponse());
    }

    return res.json({
      success: true,
      source: "TGJU",
      iran: {
        USD_IRR: usdIrr,
      },
      rates: {
        IRR: 1,
        USD: usdIrr,
        EUR: Math.round(usdIrr * 1.07),
        AED: Math.round(usdIrr * 0.27),
        GBP: Math.round(usdIrr * 1.25),
        PKR: 210,
        INR: 700,
        TRY: 1800,
        SAR: 15500,
      },
      time: new Date().toISOString(),
    });

  } catch (error) {
    console.log("Error fetching TGJU:", error.message);
    return res.json(fallbackResponse());
  }
});

// IMPORTANT: Railway uses process.env.PORT
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});