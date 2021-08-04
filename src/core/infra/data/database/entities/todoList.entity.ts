import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import UserRoutes from "../../../../../features/user/presentation/routes/index";
import { UserEntity } from "./index";

@Entity({ name: "todo_list", schema: "lista1" })
export class TodoListEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ name: "id" })
  uid?: number;

  @Column({ name: "title" })
  title: string;

  @Column()
  detail: string;

  @Column()
  id_user: number;

  @ManyToOne(() => UserEntity, (users) => users.uid)
  @JoinColumn({ name: "id_user", referencedColumnName: "uid" })
  autor?: UserRoutes;

  constructor(title: string, detail: string, id_user: number, uid?: number) {
    super();
    this.title = title;
    this.detail = detail;
    this.uid = uid;
    this.id_user = id_user;
  }
}
