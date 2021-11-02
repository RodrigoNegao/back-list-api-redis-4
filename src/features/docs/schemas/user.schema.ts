export const userSchema = {
  type: "object",
  properties: {
    uid: {
      type: "string",
      summary: "Uid",
    },
    login: {
      type: "number",
      summary: "Login",
    },
    password: {
      type: "string",
      example: "123456",
    },
  },
};
