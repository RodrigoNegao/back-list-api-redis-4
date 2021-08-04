export class DataNotFoundError extends Error {
  constructor() {
    super("No data found");
    this.name = "DataNotFoundError";
  }
}
