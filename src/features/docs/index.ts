import { postLoginPath, postSigninPath } from "./docs/users.path";

import { userSchema } from "./schemas/user.schema";
import { loginSchema } from "./schemas/login.schema";
import { errorSchema } from "./schemas/error.schema";

export default {
  openapi: "3.0.0",
  info: {
    title: "TodoList Model",
    description: "API Model PostgreSQL e Redis",
    version: "0.9.0",
  },
  servers: [
    {
      url: "/api",
    },
  ],
  paths: {
    "/login": postLoginPath,
    "/signin": postSigninPath,
  },
  schemas: {
    user: userSchema,
    login: loginSchema,
    error: errorSchema,
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
