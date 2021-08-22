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
import UserRepository from "../../infra/repositories/user.repository";
//import { v4 } from "uuid";

export default class UserController implements MvcController {
  readonly #repository: UserRepository;
  readonly #cache: CacheRepository;

  constructor(repository: UserRepository, cache: CacheRepository) {
    this.#repository = repository;
    this.#cache = cache;
  }

  public async index() {
    //return res.json("index");
    try {
      const cache = await this.#cache.get("user:all");

      // valido se existe cache
      if (cache) {
        return ok(
          cache.map((user: any) =>
            Object.assign({}, user, {
              cache: true,
            })
          )
        );
      }

      const users = await this.#repository.getUsers();

      await this.#cache.set("user:all", users);

      return ok(users);
    } catch (error) {
      return serverError();
    }
  }

  public async show(request: HttpRequest) {
    const { user, password } = request.body;

    //console.log("params>>>", request.body);
    try {
      // consulto o cache
      const cache = await this.#cache.get(`user:${user}`);
      if (cache) {
        return ok(Object.assign({}, cache, { cache: true }));
        // or return ok({ ...cache, cache: true });
      }
      const result = await this.#repository.getUser(user, password);

      if (!result) {
        return notFound(new DataNotFoundError());
      }

      //salva no redis
      await this.#cache.set(`user:${user}`, result);

      // Expira em X segundos
      //await this.#cache.setex(`user:${uid}`, user, 5);

      return ok(result);
    } catch (error) {
      return serverError();
    }
  }

  async store(request: HttpRequest): Promise<HttpResponse> {
    try {
      const result = await this.#repository.create(request.body);

      await this.#cache.del("user:all");

      return ok(result);
    } catch (error) {
      console.log(error);
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
    const { user } = req.body;
    try {
      const result = await this.#repository.update(uid, req.body);

      await this.#cache.del("user:all");
      await this.#cache.del(`user:${user}`);

      return ok(result);
    } catch (error) {
      return serverError();
    }
  }
}
