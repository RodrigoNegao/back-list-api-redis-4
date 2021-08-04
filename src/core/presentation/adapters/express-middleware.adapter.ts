import { NextFunction, Response, Request } from "express";
import { HttpMiddleware, HttpResponse } from "../models";

export const middlewareAdapter = (middleware: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const request: HttpMiddleware = {
      headers: req.headers,
      body: req.body,
    };

    const httpResponse: HttpResponse = await middleware.handle(request);

    if (httpResponse.statusCode === 200) {
      Object.assign(req, httpResponse.body);
      next();
    } else {
      res.status(httpResponse.statusCode).json({
        error: httpResponse.body.message,
      });
    }
  };
};
