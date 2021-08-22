import "reflect-metadata";
import Database from "./core/infra/data/connections/database";
import { Redis } from "./core/infra/data/connections/redis";
import App from "./core/presentation/app";

Promise.all([new Database().openConnection(), new Redis().openConnection()])
  .then(() => {
    //console.log("Conectou");
    const app = new App();
    app.init();
    app.start(8080);
  })
  .catch(console.error);
