const express = require("express");
const cors = require("cors");
const { createEntityRouter } = require("./routes/entityRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/desertos", createEntityRouter("desertos"));
app.use("/api/fiscalizacoes", createEntityRouter("fiscalizacoes"));
app.use("/api/indeferimentos", createEntityRouter("indeferimentos"));
app.use("/api/rate-limits", createEntityRouter("rate_limits"));
app.use("/api/users", createEntityRouter("users"));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Erro interno no servidor." });
});

module.exports = app;
