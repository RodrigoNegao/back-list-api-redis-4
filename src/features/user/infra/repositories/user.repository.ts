import { OneToMany } from "typeorm";
import { UserEntity } from "../../../../core/infra";
import { User } from "../../domain/models";

export default class UserRepository {
  async getUsers(): Promise<User[]> {
    const users = await UserEntity.find();

    return users.map((user) => {
      return {
        uid: user.uid,
        user: user.user,
        password: user.password,
      } as User;
    });
  }

  async getUser(user: string, password: string): Promise<User | undefined> {
    const result = await UserEntity.findOne({
      where: { user: user, password: password },
    });

    if (!result) return undefined;

    // user: user.user,
    // password: user.password,
    return {
      uid: result.uid,
    };
  }

  async create(params: User): Promise<User> {
    const { user, password } = params;

    const result = await UserEntity.create({
      user,
      password,
    }).save();

    return Object.assign({}, params, result);
  }

  //uid: string,
  async update(uid: string, params: User): Promise<User | undefined> {
    const { user, password } = params;

    //It works https://typeorm.io/#/
    // const user = await UserEntity.findOne(uid);

    if (!uid) return undefined;

    // user.name = name;
    // user.description = description;
    // user.startDate = startDate;
    // user.endDate = endDate;
    // user.userUid = userUid;

    // await user!.save();

    const result = await UserEntity.update(uid, {
      user,
      password,
    });

    return Object.assign({}, params, result);
  }

  async delete(uid: string): Promise<User> {
    //const { uid } = params;
    //const exist = await UserEntity.findOne(uid);

    const user = await UserEntity.delete(uid);

    return Object.assign(user);
  }
}
