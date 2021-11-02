import { postLoginPath, postSigninPath } from "./docs/users.path";

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
  paths: {
    "/login": postLoginPath,
    "/signin": postSigninPath,
  },
  schemas: {
    user: userSchema,
    login: loginSchema,
    uid: uidSchema,
    msg: msgSchema,
  },
  /*
  components: {
    badRequest: badRequestComponent,
    serverError: serverErrorComponent,
    notFound: notFoundComponent,
    forbidden: forbiddenComponent,
    securitySchemes: securityComponent,
  },
  */
};
