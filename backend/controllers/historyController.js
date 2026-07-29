const User = require("../models/User");

const getHistory = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.json(user.searchHistory);
  } catch (error) {
    next(error);
  }
};

const deleteHistoryEntry = async (req, res, next) => {
  try {
    const index = parseInt(req.params.index, 10);
    const user = await User.findById(req.user._id);

    if (Number.isNaN(index) || index < 0 || index >= user.searchHistory.length) {
      res.status(404);
      throw new Error("History entry not found");
    }

    user.searchHistory.splice(index, 1);
    await user.save();
    res.json(user.searchHistory);
  } catch (error) {
    next(error);
  }
};

const clearHistory = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    user.searchHistory = [];
    await user.save();
    res.json([]);
  } catch (error) {
    next(error);
  }
};

module.exports = { getHistory, deleteHistoryEntry, clearHistory };