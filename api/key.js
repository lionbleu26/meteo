module.exports = (req, res) => {
  res.status(200).json({
    key: process.env.OPENWEATHER_KEY,
  });
};
