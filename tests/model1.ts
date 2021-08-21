import { UserEntity } from "../src/core/infra";
import { User } from "../src/features/user/domain/models";

export const makeUserDB = async (): Promise<UserEntity> =>
  UserEntity.create({
    user: "any_user",
    password: "any_password",
  }).save();

export const makeCreateParams = async (): Promise<User> => {
  //const user = await makeUserDB();
  return {
    user: "any_user",
    password: "any_password",
  };
};

export const makeUpdateParams = async (userId: string): Promise<User> => {
  return {
    user: "any_user",
    password: "any_password",
    uid: userId,
  };
};

export const makeUsersDB = async (): Promise<UserEntity[]> => {
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
