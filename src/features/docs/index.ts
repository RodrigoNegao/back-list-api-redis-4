import { postLoginPath, postSigninPath } from "./docs/users.path";
import {
  delTodoListPath,
  getTodoListPath,
  postTodoListPath,
  putTodoListPath,
} from "./docs/todoList.path";

import { userSchema } from "./schemas/user.schema";
import { loginSchema } from "./schemas/login.schema";
import { msgSchema } from "./schemas/msg.schema";
import { uidSchema } from "./schemas/uid.schema";

export default {
  openapi: "3.0.0",
  info: {
    title: "Boilerplate TodoList Model",
    description: "API Model PostgreSQL e Redis",
    version: "0.9.0",
  },
  servers: [
    {
      url: "/api",
    },
    {
      url: "https://backapi4.herokuapp.com/api",
    },
  ],
  tags: [
    {
      name: "User",
      description: "Rota de Usuário",
    },
  ],
  paths: {
    "/login": postLoginPath,
    "/signin": postSigninPath,
    "/messages/{id_user}": getTodoListPath,
    "/message": postTodoListPath,
    "/message/{id}": {
      put: putTodoListPath,
      delete: delTodoListPath,
    },
  },
  schemas: {
    user: userSchema,
    login: loginSchema,
    uid: uidSchema,
    msg: msgSchema,
  },
  /*
  components: {
    schemas: {
      user: userSchema,
    },
  },
  components: {
    badRequest: badRequestComponent,
    serverError: serverErrorComponent,
    notFound: notFoundComponent,
    forbidden: forbiddenComponent,
    securitySchemes: securityComponent,
  },
  */
};
