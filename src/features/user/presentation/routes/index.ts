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
import {
  PasswordMiddleware,
  UserFieldMiddleware,
  UserMiddleware,
} from "../middlewares";

const makeController = (): MvcController => {
  const repository = new UserRepository();
  const cache = new CacheRepository();
  return new UserController(repository, cache);
};

export default class UserRoutes {
  public init(): Router {
    const routes = Router();

    routes.post(
      "/login",
      [
        middlewareAdapter(new UserFieldMiddleware()),
        middlewareAdapter(new PasswordMiddleware()),
        middlewareAdapter(new UserMiddleware()),
      ],
      routerMvcAdapter(makeController(), EMvc.SHOW)
    );

    routes.post("/signin", routerMvcAdapter(makeController(), EMvc.STORE));

    return routes;
  }
}
