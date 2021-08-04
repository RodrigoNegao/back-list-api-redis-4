import express from "express";
import { UserEntity } from "../../../../core/infra";

async function validatePassword(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  const { password } = req.body;

  //console.log("valid Name Middleware");
  const exist = await UserEntity.findOne({ password: password });
  if (!exist) {
    return res.status(400).json({
      msg: "Password dever ser informado corretamente.",
    });
  }

  next();
}

async function validateExistPassword(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({
      msg: "O campo Password esta vazio.",
    });
  }

  next();
}

export { validatePassword, validateExistPassword };
