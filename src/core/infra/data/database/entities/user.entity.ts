import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "users", schema: "lista1" })
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  uid?: number;

  @Column({ name: "user" })
  user: string;

  @Column()
  password: string;

  constructor(user: string, password: string, uid?: number) {
    super();
    this.user = user;
    this.password = password;
    this.uid = uid;
  }
}
