const User = require("../models/User");

const getFavorites = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.json(user.savedCities);
  } catch (error) {
    next(error);
  }
};

const addFavorite = async (req, res, next) => {
  try {
    const { name, country, lat, lon } = req.body;

    if (!name || lat === undefined || lon === undefined) {
      res.status(400);
      throw new Error("Provide name, lat, and lon");
    }

    const user = await User.findById(req.user._id);

    const alreadySaved = user.savedCities.some(
      (city) => Math.abs(city.lat - lat) < 0.01 && Math.abs(city.lon - lon) < 0.01
    );
    if (alreadySaved) {
      res.status(400);
      throw new Error("This location is already saved");
    }

    user.savedCities.push({ name, country, lat, lon, addedAt: new Date() });
    await user.save();
    res.status(201).json(user.savedCities);
  } catch (error) {
    next(error);
  }
};

const removeFavorite = async (req, res, next) => {
  try {
    const index = parseInt(req.params.index, 10);
    const user = await User.findById(req.user._id);

    if (Number.isNaN(index) || index < 0 || index >= user.savedCities.length) {
      res.status(404);
      throw new Error("Saved city not found");
    }

    user.savedCities.splice(index, 1);
    await user.save();
    res.json(user.savedCities);
  } catch (error) {
    next(error);
  }
};

module.exports = { getFavorites, addFavorite, removeFavorite };