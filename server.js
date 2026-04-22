const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/rates", async (req, res) => {
  try {
    // demo global rates (you can replace later with Iran scraper)
    const rates = {
      IRR: 1,
      USD: 58000,
      EUR: 62000,
      AED: 15800,
      GBP: 72000,
      PKR: 210,
      INR: 700,
      TRY: 1800,
      SAR: 15500,
      CAD: 43000,
      AUD: 39000
    };

    res.json({
      success: true,
      source: "demo",
      rates,
      time: new Date().toISOString()
    });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});