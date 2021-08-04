import { Router } from "express";
import { CacheRepository } from "../../../../core/infra/repositories/cache.repository";
import {
  EMvc,
  MvcController,
  routerMvcAdapter,
} from "../../../../core/presentation";
import TodoListRepository from "../../infra/repositories/todoList.repository";
import TodoListController from "../controllers/todoList.controller";
import { validateUid } from "../middlewares/validateUid";

const makeController = (): MvcController => {
  const repository = new TodoListRepository();
  const cache = new CacheRepository();
  return new TodoListController(repository, cache);
};

export default class TodoListRoutes {
  public init(): Router {
    const routes = Router();

    routes.get(
      "/messages/:id_user_string",
      routerMvcAdapter(makeController(), EMvc.INDEX)
    );
    routes.post("/message", routerMvcAdapter(makeController(), EMvc.STORE));
    routes.put(
      "/message/:id_user_string/:uid_string",
      routerMvcAdapter(makeController(), EMvc.UPDATE)
    );
    routes.delete(
      "/message/:uid_string",
      routerMvcAdapter(makeController(), EMvc.DELETE)
    );

    return routes;
  }
}
