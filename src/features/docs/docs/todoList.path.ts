export const getTodoListPath = {
  get: {
    tags: ["Todo List"],
    summary: "Lista de TODOs",
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
        description: "Bad Request",
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

export const postTodoListPath = {
  post: {
    tags: ["Todo List"],
    summary: "Cria um TODO",
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
        description: "Bad Request",
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

export const putTodoListPath = {
  tags: ["Todo List"],
  summary: "Atualiza o TODO",
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
      description: "Bad Request",
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
};

export const delTodoListPath = {
  tags: ["Todo List"],
  summary: "Deleta um TODO",
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
      description: "Bad Request",
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
};
