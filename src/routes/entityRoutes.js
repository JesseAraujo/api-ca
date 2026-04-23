const { Router } = require("express");
const entities = require("../config/entities");
const { makeController } = require("../controllers/genericCrudController");

function buildPrimaryKeyPath(primaryKey) {
  return primaryKey.map((column) => `/:${column}`).join("");
}

function createEntityRouter(entityName) {
  const entity = entities[entityName];
  if (!entity) {
    throw new Error(`Entidade inválida para rota: ${entityName}`);
  }

  const controller = makeController(entityName);
  const router = Router();
  const pkPath = buildPrimaryKeyPath(entity.primaryKey);

  router.get("/", controller.list);
  router.get(pkPath, controller.getOne);
  router.post("/", controller.create);
  router.put(pkPath, controller.update);
  router.delete(pkPath, controller.remove);

  return router;
}

module.exports = { createEntityRouter };
