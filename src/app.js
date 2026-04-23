const express = require("express");
const cors = require("cors");
const { createEntityRouter } = require("./routes/entityRoutes");
const { testConnection, getSafeDbConfig } = require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/health/db", async (req, res) => {
  try {
    await testConnection();
    return res.json({ status: "ok", database: "connected" });
  } catch (error) {
    return res.status(503).json({
      status: "error",
      database: "disconnected",
      code: error?.code || null,
      message: error?.message || "Falha ao conectar no banco.",
      config: getSafeDbConfig(),
    });
  }
});

app.use("/api/desertos", createEntityRouter("desertos"));
app.use("/api/fiscalizacoes", createEntityRouter("fiscalizacoes"));
app.use("/api/indeferimentos", createEntityRouter("indeferimentos"));
app.use("/api/rate-limits", createEntityRouter("rate_limits"));
app.use("/api/users", createEntityRouter("users"));

app.use((err, req, res, next) => {
  const errorPayload = {
    message: err?.message || "Erro interno no servidor.",
    code: err?.code || null,
    errno: err?.errno || null,
  };

  console.error("Unhandled API error:", {
    path: req.originalUrl,
    method: req.method,
    ...errorPayload,
  });

  res.status(500).json({
    message: "Erro interno no servidor.",
    details: errorPayload,
  });
});

module.exports = app;
