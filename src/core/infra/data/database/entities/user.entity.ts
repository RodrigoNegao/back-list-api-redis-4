import { BaseEntity, Column, Entity, PrimaryColumn } from "typeorm";
import { v4 as uuid } from "uuid";

@Entity({ name: "users" }) //, schema: "lista1"
export class UserEntity extends BaseEntity {
  @PrimaryColumn()
  uid: string;

  @Column({ name: "user" })
  user: string;

  @Column()
  password: string;

  constructor(user: string, password: string, uid?: string) {
    super();
    this.user = user;
    this.password = password;
    this.uid = uuid();
  }
}
