import { UserEntity } from "../../../../core/infra";
import {
  HttpMiddleware,
  HttpResponse,
  ok,
  validatorField,
} from "../../../../core/presentation";

export class PasswordMiddleware {
  async handle(req: HttpMiddleware): Promise<HttpResponse> {
    const { password } = req.body;

    if (!password) {
      return validatorField({ msg: "O campo Password esta vazio" });
    }

    const exist = await UserEntity.findOne({ password: password });
    if (!exist) {
      return validatorField({
        msg: "Password dever ser informado corretamente.",
      });
    }

    return ok({});
  }
}
