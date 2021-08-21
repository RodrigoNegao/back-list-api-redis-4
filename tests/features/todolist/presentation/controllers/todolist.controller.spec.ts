import { TodoListEntity, UserEntity } from "../../../../../src/core/infra";
import { CacheRepository } from "../../../../../src/core/infra/repositories/cache.repository";
import {
  DataNotFoundError,
  HttpRequest,
  notFound,
  ok,
  serverError,
} from "../../../../../src/core/presentation";
import { TodoList } from "../../../../../src/features/todolist/domain/models";
import TodoListRepository from "../../../../../src/features/todolist/infra/repositories/todoList.repository";
import TodoListController from "../../../../../src/features/todolist/presentation/controllers/todoList.controller";

//jest.mock("ioredis");

//LIGAR O REDIS ou mokar .mockResolvedValue
const makeSut = (): TodoListController =>
  new TodoListController(new TodoListRepository(), new CacheRepository());

// const makeUserDB = async (): Promise<UserEntity> =>
//   UserEntity.create({
//     user: "any_user",
//     password: "any_password",
//     uid: "any_id_user",
//   }).save();

const makeRequestStore = (): HttpRequest => ({
  body: {
    title: "any_title",
    detail: "any_detail",
    uid: "any_uid",
  },
  params: {},
});

// startDate: new Date(),
// endDate: new Date(),

const makeTodoListResult = (): TodoList => ({
  uid: "any_uid",
  title: "any_title",
  detail: "any_detail",
  id_user: "any_user",
});

const makeRequestShow = (): HttpRequest => ({
  params: { uid: "any_uid" },
  body: {},
});

const makeTodoListsDB = async (): Promise<TodoListEntity[]> => {
  //const user = await makeUserDB();

  const p1 = await TodoListEntity.create({
    title: "any_title",
    detail: "any_detail",
    id_user: "any_user",
  }).save();

  const p2 = await TodoListEntity.create({
    title: "any_title",
    detail: "any_detail",
    id_user: "any_user",
  }).save();

  return [p1, p2];
};

describe("TodoList Controller", () => {
  // Testar o STORE do TodoList Controller
  describe("Store", () => {
    test("Deveria retornar status 500 se houver erro", async () => {
      // Criar um metodo pro JEST ficar espionado um metodo ou resultado
      jest
        .spyOn(TodoListRepository.prototype, "create")
        .mockRejectedValue(new Error());

      // Criar o SUT
      const sut = makeSut();
      const result = await sut.store(makeRequestStore());
      expect(result).toEqual(serverError());
    });

    test("Deveria chamar o Repositorio com valores corretos", async () => {
      const createSpy = jest
        .spyOn(TodoListRepository.prototype, "create")
        .mockResolvedValue(makeTodoListResult());

      const delSpy = jest
        .spyOn(CacheRepository.prototype, "del")
        .mockResolvedValue(true);
      // Criar o SUT
      const sut = makeSut();
      const datastore = makeRequestStore();
      await sut.store(datastore);

      expect(delSpy).toHaveBeenCalledWith("todoList:all");
      expect(createSpy).toHaveBeenCalledWith(makeRequestStore().body);
    });

    test("Deve apagar a Cache REDIS TodoList", async () => {
      const createSpy = jest
        .spyOn(TodoListRepository.prototype, "create")
        .mockResolvedValue(makeTodoListResult());

      const delSpy = jest
        .spyOn(CacheRepository.prototype, "del")
        .mockResolvedValue(true);

      const sut = makeSut();
      const datastore = makeRequestStore();
      await sut.store(datastore);

      expect(delSpy).toHaveBeenCalledWith("todoList:all");
    });
  });

  // Testar o Index do TodoList Controller
  describe("Index", () => {
    test("Deveria ser erro 500", async () => {
      jest
        .spyOn(CacheRepository.prototype, "get")
        .mockRejectedValue(new Error());
      const requestShow = await makeRequestShow();

      // Criar o SUT
      const sut = makeSut();
      const result = await sut.index(requestShow);
      expect(result).toEqual(serverError());
    });

    test("Deveria retornar Lista", async () => {
      jest
        .spyOn(TodoListRepository.prototype, "getTodoLists")
        .mockResolvedValue([makeTodoListResult()]); //makeTodoListsDB

      const getSpy = jest
        .spyOn(CacheRepository.prototype, "get")
        .mockResolvedValue(null);

      const setSpy = jest
        .spyOn(CacheRepository.prototype, "set")
        .mockResolvedValue(null);

      // Criar o SUT
      const sut = makeSut();
      const result = await sut.index(makeRequestShow());

      expect(result).toStrictEqual(ok([makeTodoListResult()]));
      expect(getSpy).toHaveBeenCalledWith("todoList:all");
      expect(setSpy).toHaveBeenCalledWith("todoList:all", [
        makeTodoListResult(),
      ]);
    });

    test("Deveria retornar 200 cache", async () => {
      const getSpy = jest
        .spyOn(CacheRepository.prototype, "get")
        .mockResolvedValue([makeTodoListResult()]);

      // Criar o SUT
      const sut = makeSut();
      const result = await sut.index(makeRequestShow());

      expect(result).toEqual(
        ok([Object.assign({}, makeTodoListResult(), { cache: true })])
      );
    });
  });

  describe("Show", () => {
    test("01 Deveria retornar status 500 se houver erro", async () => {
      // Criar um metodo pro JEST ficar espionado um metodo ou resultado
      jest
        .spyOn(TodoListRepository.prototype, "create")
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
        .spyOn(TodoListRepository.prototype, "getTodoList")
        .mockResolvedValue(undefined);

      // Criar o SUT
      const sut = makeSut();
      const result = await sut.show(makeRequestShow());

      expect(result).toEqual(notFound(new DataNotFoundError()));
    });

    test("03 Deveria retornar 200 se o projeto existir", async () => {
      const getSpy = jest
        .spyOn(CacheRepository.prototype, "get")
        .mockResolvedValue(null);

      jest
        .spyOn(TodoListRepository.prototype, "getTodoList")
        .mockResolvedValue(makeTodoListResult());

      const setSpy = jest
        .spyOn(CacheRepository.prototype, "setex")
        .mockResolvedValue(null);

      const sut = makeSut();
      const result = await sut.show(makeRequestShow());

      expect(result).toEqual(ok(makeTodoListResult()));
      expect(getSpy).toHaveBeenCalledWith(
        `todoList:${makeTodoListResult().uid}`
      );
    });

    test("04 Deveria retornar 200 se o projeto existir com SETEX", async () => {
      const getSpy = jest
        .spyOn(CacheRepository.prototype, "get")
        .mockResolvedValue(null);

      const setSpy = jest
        .spyOn(CacheRepository.prototype, "set") // setex
        .mockResolvedValue(null);

      jest
        .spyOn(TodoListRepository.prototype, "getTodoList")
        .mockResolvedValue(makeTodoListResult());

      const sut = makeSut();
      const result = await sut.show(makeRequestShow());

      expect(result).toEqual(ok(makeTodoListResult()));
      expect(getSpy).toHaveBeenLastCalledWith(
        `todoList:${makeTodoListResult().uid}`
      );
      expect(setSpy).toHaveBeenLastCalledWith(
        `todoList:${makeTodoListResult().uid}`,
        makeTodoListResult()
      ); //,10
    });

    test("05 Deveria retornar 200 se o projeto CACHE existir", async () => {
      const getSpy = jest
        .spyOn(CacheRepository.prototype, "get")
        .mockResolvedValue(makeTodoListResult());

      const sut = makeSut();
      const result = await sut.show(makeRequestShow());

      expect(result).toEqual(
        ok(Object.assign({}, makeTodoListResult(), { cache: true }))
      );

      expect(getSpy).toHaveBeenLastCalledWith(
        `todoList:${makeTodoListResult().uid}`
      );
    });
  });
});
