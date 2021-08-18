import IORedis from "ioredis";
import { TodoListEntity, UserEntity } from "../../../../src/core/infra";
import { TodoList } from "../../../../src/features/todolist/domain/models";
import request from "supertest";
import App from "../../../../src/core/presentation/app";
import Database from "../../../../src/core/infra/data/connections/database";
import express, { Router } from "express";
import TodoListRoutes from "../../../../src/features/todolist/presentation/routes";
import { v4 as uuid } from "uuid";

jest.mock("ioredis");

const makeUserDB = async (): Promise<UserEntity> =>
  UserEntity.create({
    user: "any_user",
    password: "any_password",
  }).save();

const makeCreateParams = async (): Promise<TodoList> => {
  const user = await makeUserDB();
  return {
    name: "any_name",
    description: "any_description",
    startDate: new Date(),
    endDate: new Date(),
    userUid: user.uid,
  };
};

const makeUpdateParams = async (userId: string): Promise<TodoList> => {
  return {
    name: "any_name",
    description: "updated",
    startDate: new Date(),
    endDate: new Date(),
    userUid: userId,
  };
};

const makeTodoListsDB = async (): Promise<TodoListEntity[]> => {
  const user = await makeUserDB();

  const p1 = await TodoListEntity.create({
    name: "any_name",
    userUid: user.uid,
  }).save();

  const p2 = await TodoListEntity.create({
    name: "any_name",
    userUid: user.uid,
  }).save();

  return [p1, p2];
};

const makeTodoListDB = async (): Promise<TodoListEntity> => {
  const user = await makeUserDB();

  return await TodoListEntity.create({
    name: "any_name",
    userUid: user.uid,
  }).save();
};

describe("TodoList Routes", () => {
  const server = new App().server;
  beforeAll(async () => {
    await new Database().openConnection();
    const router = Router();
    server.use(express.json());
    server.use(router);

    new TodoListRoutes().init(router);
  });

  beforeEach(async () => {
    await TodoListEntity.clear();
    await UserEntity.clear();
    jest.resetAllMocks();
  });
  test("/GET todolists", async () => {
    const todolists = await makeTodoListsDB();

    jest.spyOn(IORedis.prototype, "get").mockResolvedValue(null);

    await request(server)
      .get("/todolists")
      .send()
      .expect(200)
      .expect((res) => {
        expect((res.body as []).length).toBe(todolists.length);
        expect(res.body[0].cache).toBeFalsy();
      });
  });

  test("/GET todolists - CACHE", async () => {
    const todolists = await makeTodoListsDB();

    jest
      .spyOn(IORedis.prototype, "get")
      .mockResolvedValue(JSON.stringify(todolists));

    await request(server)
      .get("/todolists")
      .send()
      .expect(200)
      .expect((res) => {
        expect((res.body as []).length).toBe(todolists.length);
        expect(res.body[0].cache).toBeTruthy();
      });
  });

  test("/GET todolists - Erro 500", async () => {
    const todolists = await makeTodoListsDB();

    jest.spyOn(IORedis.prototype, "get").mockRejectedValue(null);

    await request(server).get("/todolists").send().expect(500);
  });

  describe("/POST todolist", () => {
    test("Deveria retornar 400 ao tentar salvar um projeto sem nome", async () => {
      const user = await makeUserDB();
      await request(server)
        .post("/todolists")
        .send({
          description: "any_description",
          startDate: new Date(),
          endDate: new Date(),
          userUid: user.uid,
        })
        .expect(400, { error: "Missing param: name" });
    });

    test("Deveria retornar 200", async () => {
      const user = await makeUserDB();
      await request(server)
        .post("/todolists")
        .send({
          name: "any_name",
          description: "any_description",
          startDate: new Date(),
          endDate: new Date(),
          userUid: user.uid,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.uid).toBeTruthy();
          expect(res.body.name).toBe("any_name");
          expect(res.body.userUid).toBe(user.uid);
        });
    });
  });

  describe("/GET todolists/:uid", () => {
    test("Deveria reotrnar um projeto para um ID válido", async () => {
      const todolist = await makeTodoListDB();

      jest.spyOn(IORedis.prototype, "get").mockResolvedValue(null);

      await request(server)
        .get(`/todolist/${todolist.uid}`)
        .send()
        .expect(200)
        .expect((res) => {
          expect(res.body.uid).toBe(todolist.uid);
          expect(res.body.cache).toBeFalsy();
        });
    });

    test("Deve retornar 404 quando o projeto não existir", async () => {
      jest.spyOn(IORedis.prototype, "get").mockResolvedValue(null);
      await request(server).get(`/todolists/${uuid()}`).send().expect(404);
    });
  });
});
