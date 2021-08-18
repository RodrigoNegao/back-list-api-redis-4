import IORedis from "ioredis";
import { UserEntity } from "../../../../src/core/infra";
import { User } from "../../../../src/features/user/domain/models";
import request from "supertest";
import App from "../../../../src/core/presentation/app";
import Database from "../../../../src/core/infra/data/connections/database";
import express, { Router } from "express";
import UserRoutes from "../../../../src/features/user/presentation/routes";
import { v4 as uuid } from "uuid";

jest.mock("ioredis");

const makeUserDB = async (): Promise<UserEntity> =>
  UserEntity.create({
    user: "any_login",
    password: "any_password",
  }).save();

const makeCreateParams = async (): Promise<User> => {
  const user = await makeUserDB();
  return {
    uid: user.uid,
  };
};

const makeUpdateParams = async (userId: string): Promise<User> => {
  return {
    user: "any_login1",
    password: "any_password1",
  };
};

const makeUsersDB = async (): Promise<UserEntity[]> => {
  const user = await makeUserDB();

  const p1 = await UserEntity.create({
    user: "any_login1",
    password: "any_password1",
  }).save();

  const p2 = await UserEntity.create({
    user: "any_login2",
    password: "any_password2",
  }).save();

  return [p1, p2];
};

// const makeUserDB = async (): Promise<UserEntity> => {
//   const user = await makeUserDB();

//   return await UserEntity.create({
//     name: "any_name",
//     userUid: user.uid,
//   }).save();
// };

describe("User Routes", () => {
  const server = new App().server;
  beforeAll(async () => {
    await new Database().openConnection();
    const router = Router();
    server.use(express.json());
    server.use(router);

    new UserRoutes().init(router);
  });

  beforeEach(async () => {
    await UserEntity.clear();
    await UserEntity.clear();
    jest.resetAllMocks();
  });
  // test("/GET users", async () => {
  //   const users = await makeUsersDB();

  //   jest.spyOn(IORedis.prototype, "get").mockResolvedValue(null);

  //   await request(server)
  //     .get("/users")
  //     .send()
  //     .expect(200)
  //     .expect((res) => {
  //       expect((res.body as []).length).toBe(users.length);
  //       expect(res.body[0].cache).toBeFalsy();
  //     });
  // });

  // test("/GET users - CACHE", async () => {
  //   const users = await makeUsersDB();

  //   jest
  //     .spyOn(IORedis.prototype, "get")
  //     .mockResolvedValue(JSON.stringify(users));

  //   await request(server)
  //     .get("/users")
  //     .send()
  //     .expect(200)
  //     .expect((res) => {
  //       expect((res.body as []).length).toBe(users.length);
  //       expect(res.body[0].cache).toBeTruthy();
  //     });
  // });

  // test("/GET users - Erro 500", async () => {
  //   const users = await makeUsersDB();

  //   jest.spyOn(IORedis.prototype, "get").mockRejectedValue(null);

  //   await request(server).get("/users").send().expect(500);
  // });

  describe("/POST /signin", () => {
    test("Deveria retornar 400 ao tentar salvar um projeto sem user", async () => {
      const user = await makeUserDB();
      await request(server)
        .post("/signin")
        .send({
          password: "any_password",
        })
        .expect(400, { error: "Missing param: user" });
    });

    test("Deveria retornar 200", async () => {
      const user = await makeUserDB();
      await request(server)
        .post("/signin")
        .send({
          user: "any_user",
          password: "any_password",
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.uid).toBeTruthy();
          expect(res.body.user).toBe("any_user");
          expect(res.body.password).toBe("any_password");
        });
    });
  });

  describe("/GET signin/:uid", () => {
    test("Deveria retornar um projeto para um ID válido", async () => {
      const user = await makeUserDB();

      jest.spyOn(IORedis.prototype, "get").mockResolvedValue(null);

      await request(server)
        .get(`/user/${user.uid}`)
        .send()
        .expect(200)
        .expect((res) => {
          expect(res.body.uid).toBe(user.uid);
          expect(res.body.cache).toBeFalsy();
        });
    });

    test("Deve retornar 404 quando o projeto não existir", async () => {
      jest.spyOn(IORedis.prototype, "get").mockResolvedValue(null);
      await request(server).get(`/users/${uuid()}`).send().expect(404);
    });
  });
});
