import { TodoListEntity, UserEntity } from "../../../../../src/core/infra";
import Database from "../../../../../src/core/infra/data/connections/database";
import { TodoList } from "../../../../../src/features/todolist/domain/models";
import TodoListRepository from "../../../../../src/features/todolist/infra/repositories/todoList.repository";
import { v4 as uuid } from "uuid";

const makeUserDB = async (): Promise<UserEntity> =>
  UserEntity.create({
    user: "any_user123",
    password: "any_password",
  }).save();

const makeCreateParams = async (): Promise<TodoList> => {
  const user = await makeUserDB();
  return {
    uid: "any_uid",
    title: "any_title",
    detail: "any_detail",
    id_user: user.uid,
  };
};

const makeUpdateParams = async (userId: string): Promise<TodoList> => {
  const user = await makeUserDB();
  return {
    uid: "any_uid",
    title: "any_detail_update",
    detail: "any_detail_update",
    id_user: user.uid,
  };
};

const makeTodoListsDB = async (): Promise<TodoListEntity[]> => {
  const user = await makeUserDB();

  const p1 = await TodoListEntity.create({
    uid: "any_uid1",
    title: "any_detail_update",
    detail: "any_detail_update",
    id_user: user.uid,
  }).save();

  const p2 = await TodoListEntity.create({
    uid: "any_uid2",
    title: "any_detail_update",
    detail: "any_detail_update",
    id_user: user.uid,
  }).save();

  return [p1, p2];
};

const makeTodoListDB = async (): Promise<TodoListEntity> => {
  const user = await makeUserDB();

  return await TodoListEntity.create({
    uid: "any_uid",
    title: "any_detail_update",
    detail: "any_detail_update",
    id_user: user.uid,
  }).save();
};

describe("TodoList Repository", () => {
  beforeAll(async () => {
    await new Database().openConnection();
  });
  beforeEach(async () => {
    await TodoListEntity.clear();
    await UserEntity.clear();
    jest.resetAllMocks();
  });

  afterAll(async () => {
    await new Database().disconnectDatabase();
  });
  describe("create", () => {
    test("01 Deveria retornar um projeto quando obteve um sucesso", async () => {
      const sut = new TodoListRepository();
      const params = await makeCreateParams();
      const result = await sut.create(params);

      expect(result).toBeTruthy();
      expect(result.uid).toBeTruthy();
      expect(result.title).toBe("any_title");
      expect(result.detail).toBe("any_detail");
      expect(result.id_user).toBe(params.id_user);
    });

    describe("getTodoLists", () => {
      test("Deveria retornar uma lista de TodoLists", async () => {
        const sut = new TodoListRepository();
        //const user = await makeUserDB();

        const todolists = await makeTodoListsDB();
        const result = await sut.getTodoLists(todolists[0].id_user);

        expect(result).toBeTruthy();
        expect(result.length).toBe(todolists.length);
      });
    });
  });

  describe("getTodoList", () => {
    test("Deveria retornar undefined quandobuscar um ID inexistente", async () => {
      const sut = new TodoListRepository();
      const id_user = uuid();
      const result = await sut.getTodoList(id_user);

      expect(result).toBeFalsy();
    });

    test("Deveria retornar um projeto para ID valido", async () => {
      const sut = new TodoListRepository();
      const todolist = await makeTodoListDB();
      const result = await sut.getTodoList(todolist.uid!);

      expect(result).toBeTruthy();
      expect(result?.uid).toBe(todolist.uid);
      expect(result?.title).toBe(todolist.title);
      expect(result?.detail).toBe(todolist.detail);
    });
  });

  describe("update", () => {
    test("Deveria retornar um projeto para um ID válido", async () => {
      const sut = new TodoListRepository();
      const todolist = await makeTodoListDB();
      const params = await makeUpdateParams(todolist.uid!);

      const result = await sut.update(todolist.uid!, params);

      expect(result).toBeTruthy();
    });
  });

  describe("delete", () => {
    test("Deveria excluir um projeto para um ID válido", async () => {
      const sut = new TodoListRepository();
      const todolist = await makeTodoListDB();

      const result = await sut.delete(todolist.uid!);

      expect(result).toBeTruthy();
    });
  });
});
