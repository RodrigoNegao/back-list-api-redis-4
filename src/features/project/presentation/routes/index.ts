import { Router, Request, Response } from "express";
import { CacheRepository } from "../../../../core/infra/repositories/cache.repository";
import {
  EMvc,
  middlewareAdapter,
  MvcController,
  routerMvcAdapter,
} from "../../../../core/presentation";
import ProjectRepository from "../../infra/repositories/project.repository";
import { ProjectController } from "../controllers";
import { ProjectMiddleware } from "../middlewares";

const makeController = (): MvcController => {
  const repository = new ProjectRepository();
  const cache = new CacheRepository();
  return new ProjectController(repository, cache);
};

export default class ProjectRoutes {
  public init(): Router {
    const routes = Router();

    routes.get("/projects", routerMvcAdapter(makeController(), EMvc.INDEX));
    routes.get("/project/:uid", routerMvcAdapter(makeController(), EMvc.SHOW));
    routes.post(
      "/projects",
      middlewareAdapter(new ProjectMiddleware()),
      routerMvcAdapter(makeController(), EMvc.STORE)
    );
    routes.put(
      "/project/:uid",
      middlewareAdapter(new ProjectMiddleware()),
      routerMvcAdapter(makeController(), EMvc.UPDATE)
    );
    routes.delete(
      "/project/:uid",
      routerMvcAdapter(makeController(), EMvc.DELETE)
    );
    //(_: Request, res: Response) => res.send("Project RUNNING..."));

    return routes;
  }
}
