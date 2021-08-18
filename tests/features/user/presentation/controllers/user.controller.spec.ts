import { UserEntity } from "../../../../../src/core/infra";
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
//   }).save();

const makeUserResult = () => ({
  uid: "any_uid",
});

const makeRequestShow = (): HttpRequest => ({
  params: { uid: "any_uid" },
  body: {},
});

describe("User Controller", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  // Testar o STORE do User Controller
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
      const createSpy = jest.spyOn(UserRepository.prototype, "create");

      const delSpy = jest
        .spyOn(CacheRepository.prototype, "del")
        .mockResolvedValue(true);
      // Criar o SUT
      const sut = makeSut();
      const datastore = makeRequestStore();
      await sut.store(datastore);

      expect(createSpy).toHaveBeenCalledWith(makeRequestStore().body);
    });

    test("Deve apagar a Cache REDIS User", async () => {
      const delSpy = jest.spyOn(CacheRepository.prototype, "del");

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

    test("03 Deveria retornar 200 se o user existir", async () => {
      const getSpy = jest
        .spyOn(CacheRepository.prototype, "get")
        .mockResolvedValue(null);

      jest
        .spyOn(UserRepository.prototype, "getUser")
        .mockResolvedValue(makeUserResult());

      const setSpy = jest
        .spyOn(CacheRepository.prototype, "set")
        .mockResolvedValue(null);

      const sut = makeSut();
      const result = await sut.show(makeRequestShow());

      expect(result).toEqual(ok(makeUserResult()));
      expect(getSpy).toHaveBeenCalledWith(`user:${makeUserResult().uid}`);
    });

    test("04 Deveria retornar 200 se o user existir com SETEX", async () => {
      const getSpy = jest
        .spyOn(CacheRepository.prototype, "get")
        .mockResolvedValue(null);

      const setSpy = jest
        .spyOn(CacheRepository.prototype, "setex")
        .mockResolvedValue(null);

      jest
        .spyOn(UserRepository.prototype, "getUser")
        .mockResolvedValue(makeUserResult());

      const sut = makeSut();
      const result = await sut.show(makeRequestShow());

      expect(result).toEqual(ok(makeUserResult()));
      expect(getSpy).toHaveBeenLastCalledWith(`user:${makeUserResult().uid}`);
      expect(setSpy).toHaveBeenLastCalledWith(
        `user:${makeUserResult().uid}`,
        makeUserResult(),
        10
      );
    });

    test("05 Deveria retornar 200 se o user CACHE existir", async () => {
      const getSpy = jest
        .spyOn(CacheRepository.prototype, "get")
        .mockResolvedValue(makeUserResult());

      const sut = makeSut();
      const result = await sut.show(makeRequestShow());

      expect(result).toEqual(
        ok(Object.assign({}, makeUserResult(), { cache: true }))
      );

      expect(getSpy).toHaveBeenLastCalledWith(`user:${makeUserResult().uid}`);
    });
  });
});
