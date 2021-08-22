import request from "supertest";
import App from "../../../src/core/presentation/app";

describe("Test the root path", () => {
  test("It should response the GET method", (done) => {
    const app = new App();
    app.init();
    const appON = app.start(8080);
    request(appON)
      .get("/")
      .then((response) => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});
