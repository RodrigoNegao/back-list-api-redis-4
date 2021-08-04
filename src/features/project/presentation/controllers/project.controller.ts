import { Request, Response } from "express";
import { CacheRepository } from "../../../../core/infra/repositories/cache.repository";
import {
  DataNotFoundError,
  HttpRequest,
  HttpResponse,
  MvcController,
  notFound,
  ok,
  serverError,
} from "../../../../core/presentation";
import ProjectRepository from "../../infra/repositories/project.repository";

export class ProjectController implements MvcController {
  readonly #repository: ProjectRepository;
  readonly #cache: CacheRepository;

  constructor(repository: ProjectRepository, cache: CacheRepository) {
    this.#repository = repository;
    this.#cache = cache;
  }

  public async index() {
    //return res.json("index");
    try {
      const cache = await this.#cache.get("project:all");

      // valido se existe cache
      if (cache) {
        return ok(
          cache.map((project: any) =>
            Object.assign({}, project, {
              cache: true,
            })
          )
        );
      }

      const projects = await this.#repository.getProjects();

      await this.#cache.set("project:all", projects);

      return ok(projects);
    } catch (error) {
      return serverError();
    }
  }

  public async show(request: HttpRequest) {
    const { uid } = request.params;

    try {
      // consulto o cache
      const cache = await this.#cache.get(`project:${uid}`);
      if (cache) {
        return ok(Object.assign({}, cache, { cache: true }));
      }
      const project = await this.#repository.getProject(uid);

      if (!project) {
        return notFound(new DataNotFoundError());
      }

      //salva no redis
      await this.#cache.set(`project:${uid}`, project);

      // Expira em X segundos
      //await this.#cache.setex(`project:${uid}`, project, 5);

      return ok(project);
    } catch (error) {
      return serverError();
    }
  }

  async delete(req: HttpRequest): Promise<HttpResponse> {
    const { uid } = req.params;
    try {
      const result = await this.#repository.delete(uid);
      return ok(result);
    } catch (error) {
      return serverError();
    }
  }

  async update(req: HttpRequest): Promise<HttpResponse> {
    const { uid } = req.params;
    //const { name, description, startDate, endDate, userUid } = req.body;
    try {
      //It works
      // const result = await this.#repository.update(uid);
      // //if (!result) return undefined;
      // result!.name = name;
      // result!.description = description;
      // result!.startDate = startDate;
      // result!.endDate = endDate;
      // result!.userUid = userUid;

      //problema se escreve o objeto
      const result = await this.#repository.update(uid, req.body);

      await this.#cache.del("project:all");

      return ok(result);
    } catch (error) {
      return serverError();
    }
  }

  async store(request: HttpRequest): Promise<HttpResponse> {
    try {
      const result = await this.#repository.create(request.body);

      await this.#cache.del("project:all");

      return ok(result);
    } catch (error) {
      return serverError();
    }
  }
}
