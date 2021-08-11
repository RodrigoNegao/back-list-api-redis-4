import IORedis from "ioredis";
import "dotenv/config";

export class Redis {
  static #connection: IORedis.Redis;

  public static async getConnection(): Promise<IORedis.Redis> {
    if (!this.#connection) {
      await Redis.prototype.openConnection();
    }

    return this.#connection;
  }

  //https://dev.to/ramko9999/host-and-use-redis-for-free-51if
  //https://docs.redislabs.com/latest/rs/references/client_references/client_ioredis/

  public async openConnection(): Promise<void> {
    if (!Redis.#connection) {
      //teste para localhost
      //Redis.#connection = new IORedis(process.env.REDIS_URL);
      const port = parseInt(process.env.REDIS_PORT ?? "6379");
      Redis.#connection = new IORedis(port, process.env.REDIS_HOST, {
        password: process.env.REDIS_PASSWORD,
      });
    }
  }
}
