const express = require("express");
const { getHistory, deleteHistoryEntry, clearHistory } = require("../controllers/historyController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getHistory);
router.delete("/:index", protect, deleteHistoryEntry);
router.delete("/", protect, clearHistory);

module.exports = router;