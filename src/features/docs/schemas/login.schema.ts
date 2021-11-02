export const loginSchema = {
  type: "object",
  properties: {
    user: {
      type: "string",
      example: "user",
    },
    password: {
      type: "string",
      example: "123456",
    },
  },
};
