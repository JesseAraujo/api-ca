const mysql = require("mysql2/promise");
require("dotenv").config();

function toBool(value) {
  return String(value).toLowerCase() === "true";
}

function getPoolConfig() {
  const useSsl = toBool(process.env.DB_SSL || "false");
  return {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    // Serverless can create multiple instances; keep this small.
    connectionLimit: Number(process.env.DB_CONNECTION_LIMIT || 3),
    queueLimit: 0,
    connectTimeout: Number(process.env.DB_CONNECT_TIMEOUT_MS || 10000),
    ssl: useSsl ? { rejectUnauthorized: false } : undefined,
  };
}

function getSafeDbConfig() {
  return {
    host: process.env.DB_HOST || null,
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || null,
    database: process.env.DB_NAME || null,
    ssl: toBool(process.env.DB_SSL || "false"),
  };
}

const pool = mysql.createPool(getPoolConfig());

async function testConnection() {
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.ping();
    return true;
  } catch (error) {
    const wrapped = new Error(error?.message || "Falha de conexão com o banco.");
    wrapped.code = error?.code;
    wrapped.errno = error?.errno;
    throw wrapped;
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

module.exports = { pool, testConnection, getSafeDbConfig };
