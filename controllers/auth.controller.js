const jwt = require("jsonwebtoken");

// REGISTER
exports.register = async (req, res) => {
  res.json({ message: "Register OK" });
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const token = jwt.sign(
      { id: "123" }, // बाद में real user id आएगा
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login OK",
      token,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
