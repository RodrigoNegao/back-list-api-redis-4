import IORedis from "ioredis";
import { TodoListEntity, UserEntity } from "../../../../../src/core/infra";
import { TodoList } from "../../../../../src/features/todolist/domain/models";
import request from "supertest";
import App from "../../../../../src/core/presentation/app";
import Database from "../../../../../src/core/infra/data/connections/database";
import express, { Router } from "express";
import TodoListRoutes from "../../../../../src/features/todolist/presentation/routes";
import { v4 as uuid } from "uuid";

jest.mock("ioredis");

const makeUserDB = async (): Promise<UserEntity> => {
  return await UserEntity.create({
    user: "any_user",
    password: "any_password",
  }).save();
};

const makeCreateParams = async (): Promise<TodoList> => {
  const user = await makeUserDB();
  return {
    uid: "any_uid1",
    title: "any_title",
    detail: "any_detail",
    id_user: user.uid,
  };
};

const makeUpdateParams = async (userId: string): Promise<TodoList> => {
  const user = await makeUserDB();
  return {
    uid: "any_uid2",
    title: "any_title",
    detail: "any_detail",
    id_user: user.uid,
  };
};

const makeTodoListsDB = async (): Promise<TodoListEntity[]> => {
  const user = await makeUserDB();

  const p1 = await TodoListEntity.create({
    title: "any_title",
    detail: "any_detail",
    id_user: user.uid,
  }).save();

  const p2 = await TodoListEntity.create({
    title: "any_title",
    detail: "any_detail",
    id_user: user.uid,
  }).save();

  return [p1, p2];
};

const makeTodoListDB = async (): Promise<TodoListEntity> => {
  const user = await makeUserDB();

  return await TodoListEntity.create({
    title: "any_title",
    detail: "any_detail",
    id_user: user.uid,
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
    await jest.resetAllMocks();
  });

  afterAll(async () => {
    await new Database().disconnectDatabase();
  });
  describe("/GET :uid", () => {
    test("/GET messages", async () => {
      const todolists = await makeTodoListsDB();

      jest.spyOn(IORedis.prototype, "get").mockResolvedValue(null);

      await request(server)
        .get(`/messages/${todolists[0].id_user}`)
        .send()
        .expect(200)
        .expect((res) => {
          expect((res.body as []).length).toBe(todolists.length);
          expect(res.body[0].cache).toBeFalsy();
        });
    });

    test("/GET messages - CACHE", async () => {
      const user = await makeUserDB();
      const todolists = await makeTodoListsDB();

      jest
        .spyOn(IORedis.prototype, "get")
        .mockResolvedValue(JSON.stringify(todolists));

      await request(server)
        .get(`/messages/${user.uid}`)
        .send()
        .expect(200)
        .expect((res) => {
          expect((res.body as []).length).toBe(todolists.length);
          expect(res.body[0].cache).toBeTruthy();
        });
    });

    test("/GET messages - Erro 500", async () => {
      const todolists = await makeTodoListsDB();

      jest.spyOn(IORedis.prototype, "get").mockRejectedValue(null);

      await request(server)
        .get(`/messages/${todolists[0].id_user}`)
        .send()
        .expect(500);
    });
  });

  describe("/POST message", () => {
    test("Deveria retornar 400 ao tentar salvar um Todo sem Title", async () => {
      const user = await makeUserDB();
      await request(server)
        .post("/message")
        .send({
          //uid: "any_uid",
          //title: "any_title",
          detail: "any_detail",
          id_user: user.uid,
        })
        .expect(400, { error: "Missing param: title" });
    });

    test("Deveria retornar 400 ao tentar salvar um Todo sem Title Vazio", async () => {
      const user = await makeUserDB();
      await request(server)
        .post("/message")
        .send({
          title: "",
          detail: "any_detail",
          id_user: user.uid,
        })
        .expect(400, { error: "Missing param: title" });
    });

    test("Deveria retornar 200", async () => {
      const user = await makeUserDB();
      await request(server)
        .post("/message")
        .send({
          uid: "any_uid",
          title: "any_title",
          detail: "any_detail",
          id_user: user.uid,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.uid).toBeTruthy();
          expect(res.body.title).toBe("any_title");
          expect(res.body.id_user).toBe(user.uid);
        });
    });
  });

  describe("PUT /message/:uid", () => {
    test("Deveria alterar um ToDo", async () => {
      const user = await makeUserDB();
      const todolist = await makeTodoListDB();

      jest.spyOn(IORedis.prototype, "del").mockResolvedValue(null);

      await request(server)
        .put(`/message/${todolist.uid}`)
        .send({
          title: "any_title_update",
          detail: "any_detail_update",
          //id_user: user.uid,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.title).toBe("any_title_update");
          expect(res.body.detail).toBe("any_detail_update");
        });
    });

    test("Deveria retornar status 400 ao tentar salvar um usuario sem uid", async () => {
      const user = await makeUserDB();
      const todolist = await makeTodoListDB();

      await request(server)
        .put(`/message/${todolist.uid}`)
        .send({
          //title: "any_title",
          detail: "any_detail",
          id_user: user.uid,
        })
        .expect(400, { error: "Missing param: title" });
    });

    test("Deveria retornar status 400 ao tentar salvar um user sem detail", async () => {
      const user = await makeUserDB();
      const todolist = await makeTodoListDB();

      await request(server)
        .put(`/message/${todolist.uid}`)
        .send({
          uid: "any_uid",
          title: "any_title",
          id_user: user.uid,
        })
        .expect(400, { error: "Missing param: detail" });
    });
  });

  describe("DELETE /message/:uid", () => {
    test("Deveria excluir um ToDo", async () => {
      const todolist = await makeTodoListDB();

      await request(server)
        .delete(`/message/${todolist.uid}`)
        .send()
        .expect(200)
        .expect((res) => {
          expect(res.body.raw).toStrictEqual([]);
        });
    });
  });
});
