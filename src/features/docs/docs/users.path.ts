export const postLoginPath = {
  post: {
    tags: ["User"],
    summary: "Login",
    security: [
      {
        ApiKeyAuth: [],
      },
    ],
    requestBody: {
      content: {
        "application/json": {
          schema: {
            $ref: "#/schemas/login",
          },
        },
      },
    },
    parameters: [],
    responses: {
      200: {
        description: "Success",
        content: {
          "application/json": {
            schema: {
              $ref: "#/schemas/user",
            },
          },
        },
      },
      500: {
        description: "Error",
        content: {
          "application/json": {
            schema: {
              $ref: "#/schemas/error",
            },
          },
        },
      },
    },
  },
};

export const postSigninPath = {
  post: {
    tags: ["User"],
    summary: "API para gerenciar usuário",
    security: [
      {
        ApiKeyAuth: [],
      },
    ],
    parameters: [
      {
        name: "id",
        in: "path",
        description: "UID do usuário",
        required: true,
        schema: {
          type: "string",
          format: "uuid",
        },
      },
    ],
    responses: {
      200: {
        description: "Success",
        content: {
          "application/json": {
            schema: {
              $ref: "#/schemas/user",
            },
          },
        },
      },
    },
  },
};
