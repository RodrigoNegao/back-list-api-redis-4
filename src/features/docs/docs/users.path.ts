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

export const postSigninPath = {
  post: {
    tags: ["User"],
    summary: "Signin",
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
              $ref: "#/schemas/msg",
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
