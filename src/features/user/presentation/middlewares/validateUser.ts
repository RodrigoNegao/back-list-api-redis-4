import express from "express";
import { UserEntity } from "../../../../core/infra";

async function validateUser(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  const { user } = req.body;

  if (!user) {
    return res.status(400).json({
      msg: "O User deve ser informado.",
    });
  }

  if (user.length < 3) {
    return res.status(400).json({
      msg: "O nome deve conter no minimo 3 caracteres.",
    });
  }

  next();
}

async function validateExistUser(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  const { user } = req.body;

  const exist = await UserEntity.findOne({ user: user });
  if (exist) {
    return res.status(404).json({ msg: "User já existe" });
  }
  next();
}

async function validateNotExistUser(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  const { user } = req.body;

  const exist = await UserEntity.findOne({ user: user });
  if (!exist) {
    return res.status(404).json({ msg: "Nenhum User encontrado" });
  }
  next();
}

export { validateUser, validateExistUser, validateNotExistUser };
