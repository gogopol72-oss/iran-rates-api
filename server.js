const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/rates", async (req, res) => {
  try {
    const url = "https://www.tgju.org/profile/price_dollar_rl";

    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    // TGJU selector (may change if site updates)
    const priceText = $(".value").first().text().replace(/,/g, "").trim();

    const usdIrr = parseInt(priceText);

    if (!usdIrr) throw new Error("Failed to fetch real rate");

    res.json({
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
        PKR: 210,
      },
      time: new Date().toISOString(),
    });

  } catch (error) {
    console.log("Error:", error.message);

    // fallback if scraping fails
    res.json({
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

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});