import {
  badRequest,
  HttpMiddleware,
  HttpResponse,
  validatorField,
  ok,
  RequireFieldsValidator,
} from "../../../../core/presentation";

export class UserFieldMiddleware {
  async handle(req: HttpMiddleware): Promise<HttpResponse> {
    const { user } = req.body;

    // if (!user) {
    //   return validatorField({ msg: "Campo usuario vazio" });
    // }

    if (user.length < 3) {
      return validatorField({
        msg: "O nome deve conter no minimo 3 caracteres.",
      });
    }
    return ok({});
  }
}
