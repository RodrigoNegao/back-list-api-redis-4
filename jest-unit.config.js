const config = require("./jest.config");

// Definir que o JEST pegue apenas os testes unitários
config.testMatch = ["**/*.spec.ts"];

module.exports = config;
