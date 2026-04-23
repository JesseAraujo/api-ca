require("dotenv").config();
const app = require("./app");
const { testConnection } = require("./config/db");

const PORT = Number(process.env.PORT || 3000);
const REQUIRED_DB_ENV = ["DB_HOST", "DB_PORT", "DB_USER", "DB_PASSWORD", "DB_NAME"];

function getMissingEnvVars() {
  return REQUIRED_DB_ENV.filter((envName) => {
    const value = process.env[envName];
    return value === undefined || value === null || String(value).trim() === "";
  });
}

async function startServer() {
  try {
    const missingEnv = getMissingEnvVars();
    if (missingEnv.length > 0) {
      throw new Error(
        `Variáveis ausentes no .env: ${missingEnv.join(", ")}. ` +
          "Crie o arquivo .env na raiz com os dados do banco."
      );
    }

    await testConnection();
    console.log("Banco conectado com sucesso.");

    app.listen(PORT, () => {
      console.log(`API rodando em http://localhost:${PORT}`);
    });
  } catch (error) {
    const detail = error?.message || error?.code || String(error);
    console.error("Falha ao iniciar API:", detail);
    process.exit(1);
  }
}

startServer();
