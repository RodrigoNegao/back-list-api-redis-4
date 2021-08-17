import { UserEntity } from "../../../../../src/core/infra";
import Database from "../../../../../src/core/infra/data/connections/database";
import { v4 as uuid } from "uuid";
import { User } from "../../../../../src/features/user/domain/models";
import UserRepository from "../../../../../src/features/user/infra/repositories/user.repository";

const makeUserDB = async (): Promise<UserEntity> =>
  UserEntity.create({
    user: "any_user",
    password: "any_password",
  }).save();

const makeCreateParams = async (): Promise<User> => {
  //const user = await makeUserDB();
  return {
    user: "any_user",
    password: "any_password",
  };
};

// const makeUpdateParams = async (userId: string): Promise<User> => {
//   return {
//     name: "any_name",
//     description: "updated",
//     startDate: new Date(),
//     endDate: new Date(),
//     userUid: userId,
//   };
// };

const makeUsersDB = async (): Promise<UserEntity[]> => {
  //const user = await makeUserDB();

  const p1 = await UserEntity.create({
    user: "any_name1",
    password: "any_password",
  }).save();

  const p2 = await UserEntity.create({
    user: "any_name2",
    password: "any_password",
  }).save();

  return [p1, p2];
};

describe("User Repository", () => {
  beforeAll(async () => {
    await new Database().openConnection();
  });
  beforeEach(async () => {
    await UserEntity.clear();
    await UserEntity.clear();
  });

  afterAll(async () => {
    await new Database().disconnectDatabase();
  });
  describe("create", () => {
    test("01 Deveria retornar um uid do User", async () => {
      const sut = new UserRepository();
      const params = await makeCreateParams();
      const result = await sut.create(params);

      expect(result).toBeTruthy();
      expect(result.uid).toBeTruthy();
    });

    describe("getUsers", () => {
      test("Deveria retornar uma lista de Users", async () => {
        const sut = new UserRepository();

        const users = await makeUsersDB();
        const result = await sut.getUsers();

        expect(result).toBeTruthy();
        expect(result.length).toBe(users.length);
      });
    });
  });

  // describe("getUser", () => {
  //   test("Deveria retornar undefined quandobuscar um ID inexistente", async () => {
  //     const sut = new UserRepository();
  //     const result = await sut.getUser(uuid(), uuid());

  //     expect(result).toBeFalsy();
  //   });

  //   test("Deveria retornar um projeto para ID valido", async () => {
  //     const sut = new UserRepository();
  //     const user = await makeUserDB();
  //     const result = await sut.getUser(user.user, user.password);

  //     expect(result).toBeTruthy();
  //     expect(result?.uid).toBe(user.uid);
  //     expect(result?.user).toBe(user.user);
  //     expect(result?.password).toBe(user.password);
  //   });
  // });

  // describe("update", () => {
  //   test("Deveria retornar um projeto para um ID válido", async () => {
  //     const sut = new UserRepository();
  //     const user = await makeUserDB();
  //     const params = await makeUpdateParams(user.uid);

  //     const result = await sut.update(user.uid!, params);

  //     expect(result).toBeTruthy();
  //   });
  // });

  // describe("delete", () => {
  //   test("Deveria excluir um projeto para um ID válido", async () => {
  //     const sut = new UserRepository();
  //     const user = await makeUserDB();

  //     const result = await sut.delete(`${user.uid}`);

  //     expect(result).toBeTruthy();
  //   });
  // });
});
