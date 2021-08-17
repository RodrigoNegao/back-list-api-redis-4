require("dotenv").config();

let config = {};

//process.env.NODE_ENV = null;

if (process.env.NODE_ENV.toString() === "test") {
  config = {
    type: "sqlite",
    database: "./testdb.db",
    entities: ["src/core/infra/data/database/entities/**/*"],
    migrations: ["src/core/infra/data/database/migrations/**/*"],
  };
} else {
  config = {
    type: "postgres",
    url: process.env.DATABASE_URL,
    synchronize: false,
    logging: false,
    schema: "lista1", //TODO fazer um if caso não exista
    extra: {
      ssl: {
        rejectUnauthorized: false,
      },
    },
    // TODO dist para produção
    entities: ["src/core/infra/data/database/entities/**/*"],
    migrations: ["src/core/infra/data/database/migrations/**/*"],
    cli: {
      entitiesDir: "src/core/infra/data/database/entities",
      migrationsDir: "src/core/infra/data/database/migrations",
    },
  };
}

module.exports = config;
