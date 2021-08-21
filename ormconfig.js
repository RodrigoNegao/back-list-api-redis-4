require("dotenv").config();

let config = {};

//process.env.NODE_ENV = null;

if (process.env.NODE_ENV.toString() === "test") {
  config = {
    name: "default",
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
    schema: "lista1",
    extra: {
      ssl: {
        rejectUnauthorized: false,
      },
    },
    cli: {
      entitiesDir: "src/core/infra/data/database/entities",
      migrationsDir: "src/core/infra/data/database/migrations",
    },
    // Order , second
    entities: ["dist/core/infra/data/database/entities/**/*"],
    migrations: ["dist/core/infra/data/database/migrations/**/*"],
  };
}

module.exports = config;
