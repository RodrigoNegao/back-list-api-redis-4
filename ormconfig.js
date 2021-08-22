require("dotenv").config();

let config = {};

//process.env.NODE_ENV = null;

var entities = ["dist/core/infra/data/database/entities/**/*"];
var migrations = ["dist/core/infra/data/database/migrations/**/*"];

if (process.env.NODE_ENV.toString() === "dev") {
  entities = ["src/core/infra/data/database/entities/**/*"];
  migrations = ["src/core/infra/data/database/migrations/**/*"];
}

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
      entitiesDir: "src/core/infra/data/database/entities/**/*",
      migrationsDir: "src/core/infra/data/database/migrations/**/*",
    },
    // Order , second
    entities: entities,
    migrations: migrations,
  };
}

module.exports = config;
