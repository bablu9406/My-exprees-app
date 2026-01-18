const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/auth"));
app.use("/api/posts", require("./routes/posts"));

app.get("/", (req, res) => {
  res.send("API RUNNING");
});

app.listen(5000, "0.0.0.0", () => {
  console.log("Server running on port 5000");
});
