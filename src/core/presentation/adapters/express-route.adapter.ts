import { Request, Response } from "express";
import { Controller, EMvc, HttpRequest, HttpResponse } from "..";
import { MvcController } from "../contracts";

export const routeAdapter = (controller: Controller) => {
  return async (req: Request, res: Response) => {
    const httpRequest: HttpRequest = {
      body: req.body,
      params: req.params,
    };

    const httpResponse: HttpResponse = await controller.handle(httpRequest);

    if (httpResponse.statusCode >= 200 && httpResponse.statusCode <= 299) {
      res.status(httpResponse.statusCode).json(httpResponse.body);
    } else {
      res.status(httpResponse.statusCode).json({
        error: httpResponse.body.message,
      });
    }
  };
};

export const routerMvcAdapter = (controller: MvcController, type: EMvc) => {
  return async (req: Request, res: Response) => {
    const httpRequest: HttpRequest = {
      body: req.body,
      params: req.params,
    };

    let httpResponse: HttpResponse;

    switch (type) {
      case EMvc.STORE:
        httpResponse = await controller.store(httpRequest);
        break;
      case EMvc.SHOW:
        httpResponse = await controller.show(httpRequest);
        break;
      case EMvc.INDEX:
        httpResponse = await controller.index(httpRequest);
        break;
      case EMvc.UPDATE:
        httpResponse = await controller.update(httpRequest);
        break;
      case EMvc.DELETE:
        httpResponse = await controller.delete(httpRequest);
        break;
    }

    if (httpResponse.statusCode >= 200 && httpResponse.statusCode <= 299) {
      res.status(httpResponse.statusCode).json(httpResponse.body);
    } else {
      res.status(httpResponse.statusCode).json({
        error: httpResponse.body.message,
      });
    }
  };
};
