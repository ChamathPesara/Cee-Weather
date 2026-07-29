const express = require("express");
const { geocode, search } = require("../controllers/weatherController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/geocode", protect, geocode);
router.get("/search", protect, search);

module.exports = router;