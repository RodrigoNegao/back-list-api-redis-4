import { Router } from "express";
import { CacheRepository } from "../../../../core/infra/repositories/cache.repository";
import {
  EMvc,
  middlewareAdapter,
  MvcController,
  routerMvcAdapter,
} from "../../../../core/presentation";
import TodoListRepository from "../../infra/repositories/todoList.repository";
import TodoListController from "../controllers/todoList.controller";
import { UidMiddleware } from "../middlewares/validateUid.middleware";

const makeController = (): MvcController => {
  const repository = new TodoListRepository();
  const cache = new CacheRepository();
  return new TodoListController(repository, cache);
};

export default class TodoListRoutes {
  public init(routes: Router): Router {
    //const routes = Router(); JEST

    routes.get(
      "/messages/:id_user",
      routerMvcAdapter(makeController(), EMvc.INDEX)
    );
    routes.post(
      "/message",
      middlewareAdapter(new UidMiddleware()),
      routerMvcAdapter(makeController(), EMvc.STORE)
    );
    routes.put(
      "/message/:uid",
      middlewareAdapter(new UidMiddleware()),
      routerMvcAdapter(makeController(), EMvc.UPDATE)
    );
    routes.delete(
      "/message/:uid",
      routerMvcAdapter(makeController(), EMvc.DELETE)
    );

    return routes;
  }
}
