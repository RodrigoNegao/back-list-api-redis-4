import { OneToMany } from "typeorm";
import { TodoListEntity } from "../../../../core/infra";
import { TodoList } from "../../domain/models";

export default class TodoListRepository {
  async getTodoLists(id_user: string): Promise<TodoList[]> {
    const todoLists = await TodoListEntity.find({
      where: { id_user: id_user },
    });

    return todoLists.map((todoList) => {
      return {
        uid: todoList.uid,
        title: todoList.title,
        detail: todoList.detail,
        id_user: todoList.id_user,
      } as TodoList;
    });
  }

  async getTodoList(
    uid: string //id_user: string
  ): Promise<TodoList | undefined> {
    const todoList = await TodoListEntity.findOne({
      where: { uid: uid }, //, id_user: id_user
    });

    if (!todoList) return undefined;

    return {
      uid: todoList.uid!,
      title: todoList.title,
      detail: todoList.detail,
      id_user: todoList.id_user,
    };
  }

  async create(params: TodoList): Promise<TodoList> {
    const { title, detail, id_user } = params;

    const todoList = await TodoListEntity.create({
      title,
      detail,
      id_user,
    }).save();

    return Object.assign({}, params, todoList);
  }

  async update(uid: string, params: TodoList): Promise<TodoList | undefined> {
    const { title, detail } = params; //TODO use id_user like filter too

    const todoList = await TodoListEntity.update(uid, {
      title,
      detail,
    });

    return Object.assign({}, params, todoList);
  }

  async delete(uid: string): Promise<TodoList> {
    //const { uid } = params;
    //const exist = await TodoListEntity.findOne(uid);

    const todoList = await TodoListEntity.delete(uid);

    return Object.assign(todoList);
  }
}
