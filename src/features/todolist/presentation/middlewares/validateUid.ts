import express from "express";
import { TodoListEntity } from "../../../../core/infra";
//import { TodoList } from "../../../core/data/database/entities/TodoList";

async function validateUid(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  //console.log("valid Name Middleware");
  const { uid } = req.params;

  const exist = await TodoListEntity.findOne(uid);
  if (!exist) {
    return res.status(404).json({
      msg: "Item não encontrado",
    });
  }

  next();
}

export { validateUid };
