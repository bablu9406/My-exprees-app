const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend running ✅");
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (email === "test@gmail.com" && password === "123456") {
    return res.json({
      token: "dummy-token-123",
      user: {
        email
      }
    });
  }

  res.status(401).json({ message: "Invalid credentials" });
});

const PORT = 5000;
app.listen(5000, "0.0.0.0", () => {
  console.log("Server running on port 5000");
});

