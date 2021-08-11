import {
  badRequest,
  HttpMiddleware,
  HttpResponse,
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
}
