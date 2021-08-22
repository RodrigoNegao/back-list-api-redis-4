import { Router } from "express";
import { CacheRepository } from "../../../../core/infra/repositories/cache.repository";
import {
  EMvc,
  middlewareAdapter,
  MvcController,
  routerMvcAdapter,
} from "../../../../core/presentation";
import UserRepository from "../../infra/repositories/user.repository";
import UserController from "../controllers/user.controller";
import { UserMiddleware } from "../middlewares";

const makeController = (): MvcController => {
  const repository = new UserRepository();
  const cache = new CacheRepository();
  return new UserController(repository, cache);
};

export default class UserRoutes {
  public init(routes: Router): Router {
    //const routes = Router(); // editado para JEST

    routes.post(
      "/login",
      middlewareAdapter(new UserMiddleware()),
      // [
      //   middlewareAdapter(new UserFieldMiddleware()),
      //   middlewareAdapter(new PasswordMiddleware()),
      //   middlewareAdapter(new UserMiddleware()),
      // ],
      routerMvcAdapter(makeController(), EMvc.SHOW)
    );

    routes.post(
      "/signin",
      middlewareAdapter(new UserMiddleware()),
      routerMvcAdapter(makeController(), EMvc.STORE)
    );

    // routes.delete(
    //   "/signin/:uid",
    //   routerMvcAdapter(makeController(), EMvc.DELETE)
    // );

    return routes;
  }
}
