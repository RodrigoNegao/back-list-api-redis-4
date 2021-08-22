import { DeleteResult } from "typeorm";
import { TodoListEntity, UserEntity } from "../../../../../src/core/infra";
import { CacheRepository } from "../../../../../src/core/infra/repositories/cache.repository";
import {
  DataNotFoundError,
  HttpRequest,
  notFound,
  ok,
  serverError,
} from "../../../../../src/core/presentation";
import UserRepository from "../../../../../src/features/user/infra/repositories/user.repository";
import UserController from "../../../../../src/features/user/presentation/controllers/user.controller";

jest.mock("ioredis");

//LIGAR O REDIS ou mokar .mockResolvedValue
const makeSut = (): UserController =>
  new UserController(new UserRepository(), new CacheRepository());

const makeRequestStore = (): HttpRequest => ({
  body: {
    user: "any_user",
    password: "any_password",
  },
  params: {},
});

// const makeUserDB = async (): Promise<UserEntity> =>
//   UserEntity.create({
//     user: "any_user",
//     password: "any_password",
//     uid: "any_id_user",
//   }).save();

const makeUserResult = () => ({
  uid: "any_uid",
  user: "any_user",
  password: "any_password",
});

const makeRequestShow = (): HttpRequest => ({
  params: {},
  body: {
    user: "any_user",
    password: "any_password",
  },
});

const makeRequestUpdate = (): HttpRequest => ({
  body: {
    user: "any_username",
    password: "any_password",
  },
  params: { uid: "any_uid" },
});

// const makeDeleteResult = () => {
//   return {
//     raw: "any_raw",
//     affected: 1 | 0,
//   };
// };

describe("User Controller", () => {
  beforeEach(async () => {
    await jest.resetAllMocks();
  });

  describe("Store", () => {
    test("Deveria retornar status 500 se houver erro", async () => {
      // Criar um metodo pro JEST ficar espionado um metodo ou resultado
      jest
        .spyOn(UserRepository.prototype, "create")
        .mockRejectedValue(new Error());

      // Criar o SUT
      const sut = makeSut();
      const result = await sut.store(makeRequestStore());
      expect(result).toEqual(serverError());
    });

    test("Deveria chamar o Repositorio com valores corretos", async () => {
      const createSpy = jest
        .spyOn(UserRepository.prototype, "create")
        .mockResolvedValue(makeRequestStore().body);

      const delSpy = jest
        .spyOn(CacheRepository.prototype, "del")
        .mockResolvedValue(true);
      // Criar o SUT
      const sut = makeSut();
      const datastore = makeRequestStore();
      await sut.store(datastore);

      expect(delSpy).toHaveBeenCalledWith("user:all");
      expect(createSpy).toHaveBeenCalledWith(makeRequestStore().body);
    });

    test("Deve apagar a Cache REDIS User", async () => {
      const delSpy = jest
        .spyOn(CacheRepository.prototype, "del")
        .mockResolvedValue(true);

      const sut = makeSut();
      const datastore = makeRequestStore();
      await sut.store(datastore);

      expect(delSpy).toHaveBeenCalledWith("user:all");
    });
  });

  // Testar o Index do User Controller
  describe("Index", () => {
    test("Deveria ser erro 500", async () => {
      jest
        .spyOn(CacheRepository.prototype, "get")
        .mockRejectedValue(new Error());

      // Criar o SUT
      const sut = makeSut();
      const result = await sut.index();
      expect(result).toEqual(serverError());
    });

    test("Deveria retornar Lista", async () => {
      jest
        .spyOn(UserRepository.prototype, "getUsers")
        .mockResolvedValue([makeUserResult()]);

      const getSpy = jest
        .spyOn(CacheRepository.prototype, "get")
        .mockResolvedValue(null);

      const setSpy = jest
        .spyOn(CacheRepository.prototype, "set")
        .mockResolvedValue(null);

      // Criar o SUT
      const sut = makeSut();
      const result = await sut.index();

      expect(result).toStrictEqual(ok([makeUserResult()]));
      expect(getSpy).toHaveBeenCalledWith("user:all");
      expect(setSpy).toHaveBeenCalledWith("user:all", [makeUserResult()]);
    });

    test("Deveria retornar 200 cache", async () => {
      const getSpy = jest
        .spyOn(CacheRepository.prototype, "get")
        .mockResolvedValue([makeUserResult()]);

      // Criar o SUT
      const sut = makeSut();
      const result = await sut.index();

      expect(result).toEqual(
        ok([Object.assign({}, makeUserResult(), { cache: true })])
      );
    });
  });

  describe("Show", () => {
    test("01 Deveria retornar status 500 se houver erro", async () => {
      // Criar um metodo pro JEST ficar espionado um metodo ou resultado
      jest
        .spyOn(UserRepository.prototype, "create")
        .mockRejectedValue(new Error());

      // Criar o SUT
      const sut = makeSut();
      const result = await sut.store(makeRequestShow());
      expect(result).toEqual(serverError());
    });

    test("02 Deveria retornar status 404 se não existir", async () => {
      // Criar um metodo pro JEST ficar espionado um metodo ou resultado
      jest.spyOn(CacheRepository.prototype, "get").mockResolvedValue(null);

      jest
        .spyOn(UserRepository.prototype, "getUser")
        .mockResolvedValue(undefined);

      // Criar o SUT
      const sut = makeSut();
      const result = await sut.show(makeRequestShow());

      expect(result).toEqual(notFound(new DataNotFoundError()));
    });

    test("03 Deveria retornar 200 se o user existir Postgree", async () => {
      const userResult = makeUserResult();

      const getSpy = jest
        .spyOn(CacheRepository.prototype, "get")
        .mockResolvedValue(null);

      jest
        .spyOn(UserRepository.prototype, "getUser")
        .mockResolvedValue(userResult);

      const setSpy = jest
        .spyOn(CacheRepository.prototype, "set")
        .mockResolvedValue(null);

      const sut = makeSut();
      const result = await sut.show(makeRequestShow());

      expect(result).toEqual(ok(userResult));
      //expect(getSpy).toHaveBeenCalledWith(`user:${userResult.user}`);
      //expect(setSpy).toHaveBeenCalledWith(`user:${userResult.user}`, makeUserResult());
    });

    test("04 Deveria retornar 200 se o user existir com SETEX", async () => {
      const getSpy = jest
        .spyOn(CacheRepository.prototype, "get")
        .mockResolvedValue(null);

      jest
        .spyOn(UserRepository.prototype, "getUser")
        .mockResolvedValue(makeUserResult());

      const setSpy = jest
        .spyOn(CacheRepository.prototype, "setex")
        .mockResolvedValue(null);

      const sut = makeSut();
      const result = await sut.show(makeRequestShow());

      expect(result).toEqual(ok(makeUserResult()));
      // expect(getSpy).toHaveBeenLastCalledWith(`user:${makeUserResult().uid}`);
      // expect(setSpy).toHaveBeenLastCalledWith(
      //   `user:${makeUserResult().uid}`,
      //   makeUserResult(),
      //   10
      // );
    });

    test("05 Deveria retornar 200 se o user CACHE existir", async () => {
      const getSpy = jest
        .spyOn(CacheRepository.prototype, "get")
        .mockResolvedValue(makeUserResult().user);

      const sut = makeSut();
      const result = await sut.show(makeRequestShow());

      expect(result).toEqual(
        ok(Object.assign({}, makeUserResult().uid, { cache: true }))
      );

      expect(getSpy).toHaveBeenLastCalledWith(`user:${makeUserResult().user}`);
    });
  });

  describe("Update", () => {
    test("Deveria retornar erro 500", async () => {
      jest
        .spyOn(CacheRepository.prototype, "del")
        .mockRejectedValue(new Error());

      const sut = makeSut();
      const result = await sut.update(makeRequestUpdate());
      expect(result).toEqual(serverError());
    });

    test("Deveria editar um usuario e retornar com status 200", async () => {
      const delSpy = jest
        .spyOn(CacheRepository.prototype, "del")
        .mockResolvedValue(true);

      jest
        .spyOn(UserRepository.prototype, "update")
        .mockResolvedValue(makeUserResult());

      const sut = makeSut();
      const result = await sut.update(makeRequestUpdate());

      expect(result).toStrictEqual(ok(makeUserResult()));
      expect(delSpy).toHaveBeenCalledWith("user:all");
      expect(delSpy).toHaveBeenCalledWith(`user:${makeUserResult().uid}`);
    });
  });

  // describe("Delete", () => {
  //   test("Deveria retornar erro 500", async () => {
  //     jest
  //       .spyOn(CacheRepository.prototype, "del")
  //       .mockRejectedValue(new Error());

  //     const sut = makeSut();
  //     const result = await sut.delete(makeRequestShow());
  //     expect(result).toEqual(serverError());
  //   });

  //   test("Deveria excluir um usuario e retornar com stastus 200", async () => {
  //     const delSpy = jest
  //       .spyOn(CacheRepository.prototype, "del")
  //       .mockResolvedValue(true);

  //     jest
  //       .spyOn(UserRepository.prototype, "delete")
  //       .mockResolvedValue(makeDeleteResult());

  //     const sut = makeSut();
  //     const result = await sut.delete(makeRequestShow());

  //     expect(result).toStrictEqual(ok(makeDeleteResult()));
  //     expect(delSpy).toHaveBeenCalledWith("users:all");
  //     expect(delSpy).toHaveBeenCalledWith(`user:${makeUserResult().uid}`);
  //   });
  // });
});
