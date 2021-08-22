import { Request, Response } from "express";
import { TodoListEntity } from "../../../../core/infra";
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
import TodoListRepository from "../../infra/repositories/todoList.repository";

//Tips Find - https://orkhan.gitbook.io/typeorm/docs/find-options

export default class TodoListController implements MvcController {
  readonly #repository: TodoListRepository;
  readonly #cache: CacheRepository;

  constructor(repository: TodoListRepository, cache: CacheRepository) {
    this.#repository = repository;
    this.#cache = cache;
  }

  public async index(request: HttpRequest) {
    const { id_user } = request.params;
    try {
      const cache = await this.#cache.get("todoList:all");

      //console.log("string>>>", id_user_string);
      //const id_user = parseInt(id_user_string);
      // console.log("number>>>", id_user);

      // valido se existe cache
      if (cache) {
        return ok(
          cache.map((todoList: any) =>
            Object.assign({}, todoList, {
              cache: true,
            })
          )
        );
      }

      const todoLists = await this.#repository.getTodoLists(id_user);

      await this.#cache.set("todoList:all", todoLists);

      return ok(todoLists);
    } catch (error) {
      console.log(error);
      return serverError();
    }
  }

  public async show(request: HttpRequest) {
    const { uid } = request.params; //id_user

    //const id_user = parseInt(id_user_string);
    //const uid = parseInt(uid_string);

    try {
      // consulto o cache
      const cache = await this.#cache.get(`todoList:${uid}`);
      if (cache) {
        return ok(Object.assign({}, cache, { cache: true }));
      }
      const todoList = await this.#repository.getTodoList(uid); //id_user

      if (!todoList) {
        return notFound(new DataNotFoundError());
      }

      //salva no redis
      await this.#cache.set(`todoList:${uid}`, todoList);

      // Expira em X segundos
      //await this.#cache.setex(`todoList:${uid}`, todoList, 5);

      return ok(todoList);
    } catch (error) {
      return serverError();
    }
  }

  async delete(request: HttpRequest): Promise<HttpResponse> {
    const { uid } = request.params;

    //id_user_string
    //const id_user = parseInt(id_user_string);
    //const uid = parseInt(uid_string);
    //id_user
    try {
      await this.#cache.del(`todoList:${uid}`);
      await this.#cache.del("todoList:all");
      const result = await this.#repository.delete(uid);
      return ok(result);
    } catch (error) {
      return serverError();
    }
  }

  async update(request: HttpRequest): Promise<HttpResponse> {
    const { uid } = request.params;
    //const { id_user } = request.params;

    //id_user_string
    //const id_user = parseInt(id_user_string);
    //const uid = parseInt(uid_string);

    try {
      //TODO id_user
      const result = await this.#repository.update(uid, request.body);

      await this.#cache.del("todoList:all");

      return ok(result);
    } catch (error) {
      console.log(error);
      return serverError();
    }
  }

  async store(request: HttpRequest): Promise<HttpResponse> {
    try {
      const result = await this.#repository.create(request.body);

      await this.#cache.del("todoList:all");

      return ok(result);
    } catch (error) {
      console.log(error);
      return serverError();
    }
  }
}
