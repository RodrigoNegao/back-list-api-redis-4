import { CacheRepository } from "../../../../../src/core/infra/repositories/cache.repository";
import {
  DataNotFoundError,
  HttpRequest,
  notFound,
  ok,
  serverError,
} from "../../../../../src/core/presentation";
import TodoListRepository from "../../../../../src/features/todolist/infra/repositories/todoList.repository";
import TodoListController from "../../../../../src/features/todolist/presentation/controllers/todoList.controller";

//LIGAR O REDIS ou mokar .mockResolvedValue
const makeSut = (): TodoListController =>
  new TodoListController(new TodoListRepository(), new CacheRepository());

const makeRequestStore = (): HttpRequest => ({
  body: {
    name: "any_name",
    description: "any_description",
    startDate: new Date("2021-07-22"),
    endDate: new Date("2021-07-22"),
    userUid: "any_uid",
  },
  params: {},
});

// startDate: new Date(),
// endDate: new Date(),

const makeTodoListResult = () => ({
  uid: "any_uid",
  name: "any_name",
  description: "any_description",
  startDate: new Date("2021-07-22"),
  endDate: new Date("2021-07-22"),
  userUid: "any_uid",
});

const makeRequestShow = (): HttpRequest => ({
  params: { uid: "any_uid" },
  body: {},
});

describe("TodoList Controller", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

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
      const createSpy = jest.spyOn(TodoListRepository.prototype, "create");

      const delSpy = jest
        .spyOn(CacheRepository.prototype, "del")
        .mockResolvedValue(true);
      // Criar o SUT
      const sut = makeSut();
      const datastore = makeRequestStore();
      await sut.store(datastore);

      expect(createSpy).toHaveBeenCalledWith(makeRequestStore().body);
    });

    test("Deve apagar a Cache REDIS TodoList", async () => {
      const delSpy = jest.spyOn(CacheRepository.prototype, "del");

      const sut = makeSut();
      const datastore = makeRequestStore();
      await sut.store(datastore);

      expect(delSpy).toHaveBeenCalledWith("todolist:all");
    });
  });

  // Testar o Index do TodoList Controller
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
        .spyOn(TodoListRepository.prototype, "getTodoLists")
        .mockResolvedValue([makeTodoListResult()]);

      const getSpy = jest
        .spyOn(CacheRepository.prototype, "get")
        .mockResolvedValue(null);

      const setSpy = jest
        .spyOn(CacheRepository.prototype, "set")
        .mockResolvedValue(null);

      // Criar o SUT
      const sut = makeSut();
      const result = await sut.index();

      expect(getSpy).toHaveBeenCalledWith("todolist:all");
      expect(setSpy).toHaveBeenCalledWith("todolist:all", [
        makeTodoListResult(),
      ]);
    });

    test("Deveria retornar 200 cache", async () => {
      const getSpy = jest
        .spyOn(CacheRepository.prototype, "get")
        .mockResolvedValue([makeTodoListResult()]);

      // Criar o SUT
      const sut = makeSut();
      const result = await sut.index();

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
        `todolist:${makeTodoListResult().uid}`
      );
    });

    test("04 Deveria retornar 200 se o projeto existir com SETEX", async () => {
      const getSpy = jest
        .spyOn(CacheRepository.prototype, "get")
        .mockResolvedValue(null);

      const setSpy = jest
        .spyOn(CacheRepository.prototype, "setex")
        .mockResolvedValue(null);

      jest
        .spyOn(TodoListRepository.prototype, "getTodoList")
        .mockResolvedValue(makeTodoListResult());

      const sut = makeSut();
      const result = await sut.show(makeRequestShow());

      expect(result).toEqual(ok(makeTodoListResult()));
      expect(getSpy).toHaveBeenLastCalledWith(
        `todolist:${makeTodoListResult().uid}`
      );
      expect(setSpy).toHaveBeenLastCalledWith(
        `todolist:${makeTodoListResult().uid}`,
        makeTodoListResult(),
        10
      );
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
        `todolist:${makeTodoListResult().uid}`
      );
    });
  });
});
