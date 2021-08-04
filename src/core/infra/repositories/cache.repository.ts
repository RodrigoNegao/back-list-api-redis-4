import { stringify } from "querystring";
import { Redis } from "../data/connections/redis";

export class CacheRepository {
  public async set(key: string, value: any): Promise<string | null> {
    const redis = await Redis.getConnection();
    return await redis.set(key, JSON.stringify(value));
  }

  public async setex(
    key: string,
    value: any,
    ttl: number
  ): Promise<string | null> {
    const redis = await Redis.getConnection();
    return await redis.set(key, JSON.stringify(value), "EX", ttl);
  }

  public async get(key: string): Promise<any | null> {
    const redis = await Redis.getConnection();
    const value = await redis.get(key);
    if (!value) return null;

    return JSON.parse(value);
  }

  public async del(key: string): Promise<boolean> {
    const redis = await Redis.getConnection();
    const result = await redis.del(key);
    return result !== 0;
  }
}
