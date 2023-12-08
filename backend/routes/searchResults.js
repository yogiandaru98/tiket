// searchResults.js
const path = require("path");
const express = require('express');
const router = express.Router();
const { Paket } = require('../models/Paket');

router.get("/cariPaket", async (req, res) => {
  const { tujuan } = req.query;

  try {
    const paket = await Paket.findAll({
      where: { tujuan },
    });

    // Render the search results page and pass the data
    const cari = path.join(__dirname, "../../public/cari.html");
    res.sendFile(cari);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
