const entities = require("../config/entities");
const crudService = require("../services/genericCrudService");

function sanitizeOutput(entity, row) {
  if (!row || !entity.hiddenOnRead || entity.hiddenOnRead.length === 0) {
    return row;
  }

  const clean = { ...row };
  for (const field of entity.hiddenOnRead) {
    delete clean[field];
  }
  return clean;
}

function sanitizeOutputList(entity, rows) {
  return rows.map((row) => sanitizeOutput(entity, row));
}

function getPrimaryKeyObject(entity, params) {
  const result = {};
  for (const pkColumn of entity.primaryKey) {
    if (!params[pkColumn]) {
      return null;
    }
    result[pkColumn] = params[pkColumn];
  }
  return result;
}

function validateCreatePayload(entity, payload) {
  if (!payload || typeof payload !== "object") {
    return "Payload inválido.";
  }

  const missingRequired = (entity.requiredOnCreate || []).filter(
    (field) => payload[field] === undefined || payload[field] === null || payload[field] === ""
  );

  if (missingRequired.length > 0) {
    return `Campos obrigatórios ausentes: ${missingRequired.join(", ")}`;
  }

  return null;
}

function makeController(entityName) {
  const entity = entities[entityName];
  if (!entity) {
    throw new Error(`Entidade não encontrada: ${entityName}`);
  }

  return {
    async list(req, res, next) {
      try {
        const limit = Math.min(Number(req.query.limit) || 100, 500);
        const offset = Number(req.query.offset) || 0;
        const rows = await crudService.list(entity, { limit, offset });
        res.json(sanitizeOutputList(entity, rows));
      } catch (error) {
        next(error);
      }
    },

    async getOne(req, res, next) {
      try {
        const pkObj = getPrimaryKeyObject(entity, req.params);
        if (!pkObj) {
          return res.status(400).json({ message: "Parâmetros de chave primária inválidos." });
        }

        const row = await crudService.getByPk(entity, pkObj);
        if (!row) {
          return res.status(404).json({ message: "Registro não encontrado." });
        }

        return res.json(sanitizeOutput(entity, row));
      } catch (error) {
        return next(error);
      }
    },

    async create(req, res, next) {
      try {
        const validationError = validateCreatePayload(entity, req.body);
        if (validationError) {
          return res.status(400).json({ message: validationError });
        }

        const row = await crudService.create(entity, req.body);
        return res.status(201).json(sanitizeOutput(entity, row));
      } catch (error) {
        if (error && error.code === "ER_DUP_ENTRY") {
          return res.status(409).json({ message: "Registro já existe ou viola chave única." });
        }
        return next(error);
      }
    },

    async update(req, res, next) {
      try {
        const pkObj = getPrimaryKeyObject(entity, req.params);
        if (!pkObj) {
          return res.status(400).json({ message: "Parâmetros de chave primária inválidos." });
        }

        const row = await crudService.update(entity, pkObj, req.body || {});
        if (!row) {
          return res.status(404).json({ message: "Registro não encontrado." });
        }

        return res.json(sanitizeOutput(entity, row));
      } catch (error) {
        if (error && error.code === "ER_DUP_ENTRY") {
          return res.status(409).json({ message: "Dados de atualização violam chave única." });
        }
        return next(error);
      }
    },

    async remove(req, res, next) {
      try {
        const pkObj = getPrimaryKeyObject(entity, req.params);
        if (!pkObj) {
          return res.status(400).json({ message: "Parâmetros de chave primária inválidos." });
        }

        const ok = await crudService.remove(entity, pkObj);
        if (!ok) {
          return res.status(404).json({ message: "Registro não encontrado." });
        }

        return res.status(204).send();
      } catch (error) {
        return next(error);
      }
    },
  };
}

module.exports = { makeController };
