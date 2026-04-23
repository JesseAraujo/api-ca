const mysql = require("mysql2");
const { pool } = require("../config/db");

function escapeId(id) {
  return mysql.escapeId(id);
}

function buildSelectColumns(columns) {
  return columns.map((column) => escapeId(column)).join(", ");
}

function pickAllowed(payload, allowedColumns) {
  const result = {};
  for (const column of allowedColumns) {
    if (Object.prototype.hasOwnProperty.call(payload, column)) {
      result[column] = payload[column];
    }
  }
  return result;
}

function buildPkWhere(primaryKey) {
  return primaryKey.map((column) => `${escapeId(column)} = ?`).join(" AND ");
}

function readPkValuesFromObject(primaryKey, obj) {
  return primaryKey.map((column) => obj[column]);
}

async function list(entity, { limit = 100, offset = 0 } = {}) {
  const columns = buildSelectColumns(entity.columns);
  const sql = `SELECT ${columns} FROM ${escapeId(entity.table)} LIMIT ? OFFSET ?`;
  const [rows] = await pool.query(sql, [limit, offset]);
  return rows;
}

async function getByPk(entity, pkObj) {
  const columns = buildSelectColumns(entity.columns);
  const where = buildPkWhere(entity.primaryKey);
  const sql = `SELECT ${columns} FROM ${escapeId(entity.table)} WHERE ${where} LIMIT 1`;
  const pkValues = readPkValuesFromObject(entity.primaryKey, pkObj);
  const [rows] = await pool.query(sql, pkValues);
  return rows[0] || null;
}

async function create(entity, payload) {
  const writableColumns = entity.columns.filter(
    (column) => !["updated"].includes(column)
  );
  const data = pickAllowed(payload, writableColumns);
  const keys = Object.keys(data);

  if (keys.length === 0) {
    throw new Error("Nenhum campo válido enviado para criação.");
  }

  const fieldsSql = keys.map((key) => escapeId(key)).join(", ");
  const placeholders = keys.map(() => "?").join(", ");
  const values = keys.map((key) => data[key]);
  const insertSql = `INSERT INTO ${escapeId(entity.table)} (${fieldsSql}) VALUES (${placeholders})`;

  await pool.query(insertSql, values);

  const pkObj = {};
  for (const pkColumn of entity.primaryKey) {
    pkObj[pkColumn] = data[pkColumn];
  }

  return getByPk(entity, pkObj);
}

async function update(entity, pkObj, payload) {
  const data = pickAllowed(payload, entity.updatableColumns || []);
  const keys = Object.keys(data);
  if (keys.length === 0) {
    return getByPk(entity, pkObj);
  }

  const setSql = keys.map((key) => `${escapeId(key)} = ?`).join(", ");
  const values = keys.map((key) => data[key]);
  const where = buildPkWhere(entity.primaryKey);
  const pkValues = readPkValuesFromObject(entity.primaryKey, pkObj);

  const sql = `UPDATE ${escapeId(entity.table)} SET ${setSql} WHERE ${where}`;
  const [result] = await pool.query(sql, [...values, ...pkValues]);

  if (result.affectedRows === 0) {
    return null;
  }

  return getByPk(entity, pkObj);
}

async function remove(entity, pkObj) {
  const where = buildPkWhere(entity.primaryKey);
  const pkValues = readPkValuesFromObject(entity.primaryKey, pkObj);
  const sql = `DELETE FROM ${escapeId(entity.table)} WHERE ${where}`;
  const [result] = await pool.query(sql, pkValues);
  return result.affectedRows > 0;
}

module.exports = { list, getByPk, create, update, remove };
