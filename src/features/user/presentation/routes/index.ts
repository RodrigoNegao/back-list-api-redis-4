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
import {
  validateExistPassword,
  validatePassword,
} from "../middlewares/validatePassword";
import {
  validateExistUser,
  validateNotExistUser,
  validateUser,
} from "../middlewares/validateUser";

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
      middlewareAdapter(new UserMiddleware()),
      routerMvcAdapter(makeController(), EMvc.SHOW)
    );
    //TODO'/categorias', colocar Middleware
    routes.post("/signin", routerMvcAdapter(makeController(), EMvc.STORE));
    // TODO colocar Middleware
    //routes.put('/user/:id', userController.update);
    //routes.delete('/user/:id', userController.delete);

    return routes;
  }
}
