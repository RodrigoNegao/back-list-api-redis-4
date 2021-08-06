import {
  badRequest,
  HttpMiddleware,
  HttpResponse,
  validatorField,
  ok,
  RequireFieldsValidator,
} from "../../../../core/presentation";

export class UserMiddleware {
  async handle(req: HttpMiddleware): Promise<HttpResponse> {
    const { body } = req;

    for (const field of ["user", "password"]) {
      const error = new RequireFieldsValidator(field).validate(body);
      if (error) {
        return badRequest(error);
      }
    }

    return ok({});
  }

  // //testar
  // async validateUser(req: HttpMiddleware): Promise<HttpResponse> {
  //   const { user } = req.body;

  //   if (!user) {
  //     return validatorField({ msg: "Campo usuario vazio" });
  //   }

  //   if (user.length < 3) {
  //     return validatorField({
  //       msg: "O nome deve conter no minimo 3 caracteres.",
  //     });
  //   }

  //   return ok({});
  // }
}
