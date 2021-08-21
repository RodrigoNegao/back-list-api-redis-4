import {
  BaseEntity,
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from "typeorm";
import UserRoutes from "../../../../../features/user/presentation/routes/index";
import { UserEntity } from "./index";
import { v4 as uuid } from "uuid";

@Entity({ name: "todo_list" }) //, schema: "lista1"
export class TodoListEntity extends BaseEntity {
  @PrimaryColumn({ name: "id" })
  uid?: string;

  @Column({ name: "title" })
  title: string;

  @Column()
  detail: string;

  @Column()
  id_user: string;

  @ManyToOne(() => UserEntity, (users) => users.uid)
  @JoinColumn({ name: "id_user", referencedColumnName: "uid" })
  user?: UserEntity;

  constructor(title: string, detail: string, id_user: string) {
    super();
    this.title = title;
    this.detail = detail;
    this.id_user = id_user;
  }

  @BeforeInsert()
  private beforeInsert() {
    this.uid = uuid();
  }
}
