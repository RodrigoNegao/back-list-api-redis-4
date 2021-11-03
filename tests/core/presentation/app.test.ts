import express, { Router, Request, Response } from "express";
import request from "supertest";
import Database from "../../../src/core/infra/data/connections/database";
import App from "../../../src/core/presentation/app";
import UserRoutes from "../../../src/features/user/presentation/routes";

describe("Test the root path", () => {
  test("It should response Status 200 APP", async () => {
    const server = new App().server;
    await new Database().openConnection();
    const router = Router();
    router.get("/", (_: Request, res: Response) => res.send("/api"));
    server.use(express.json());
    server.use(router);

    await request(server)
      .get("/")
      .then((response) => {
        expect(response.statusCode).toBe(200);
      });
  });
});
