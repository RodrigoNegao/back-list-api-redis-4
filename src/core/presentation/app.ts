import cors from "cors";
import express, { Request, Response, Router } from "express";
import TodoListRoutes from "../../features/todolist/presentation/routes";
import UserRoutes from "../../features/user/presentation/routes";

export default class App {
  readonly #express: express.Application;

  constructor() {
    this.#express = express();
  }

  public get server(): express.Application {
    return this.#express;
  }

  public init(): void {
    this.middlewares();
    this.routes();
  }

  private middlewares(): void {
    this.#express.use(cors());
    this.#express.use(express.json());
    this.#express.use(express.urlencoded({ extended: false }));
  }

  private routes(): void {
    const router = Router();

    this.#express.get("/", (_: Request, res: Response) => res.redirect("/api"));
    this.#express.use("/api", router);

    router.get("/", (_: Request, res: Response) => res.send("API RUNNING..."));

    const todoListRoutes = new TodoListRoutes().init(router);
    this.#express.use(todoListRoutes);

    const userRoutes = new UserRoutes().init(router);
    this.#express.use(userRoutes);
  }

  public start(port: number): void {
    this.#express.listen(port, () =>
      console.log(`Server is running on ${port}`)
    );
  }
}
