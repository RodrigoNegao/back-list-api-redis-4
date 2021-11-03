export const getTodoListPath = {
  get: {
    tags: ["Todo List"],
    summary: "Lista de Usuário",
    security: [
      {
        ApiKeyAuth: [],
      },
    ],
    parameters: [],
    responses: {
      200: {
        description: "Success",
        content: {
          "application/json": {
            schema: {
              $ref: "#/schemas/uid",
            },
          },
        },
      },
      400: {
        description: "Bad Resquest",
        content: {
          "application/json": {
            schema: {
              $ref: "#/schemas/msg",
            },
          },
        },
      },
      500: {
        description: "Error",
        content: {
          "application/json": {
            schema: {
              $ref: "#/schemas/msg",
            },
          },
        },
      },
    },
  },
};
