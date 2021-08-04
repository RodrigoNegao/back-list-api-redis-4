import { InvalidParamError } from "../errors/invalid-param.error";

export class CompareFieldsValidator {
  readonly #fieldName: string;
  readonly #fieldNameToCompare: string;

  constructor(fieldName: string, fieldNameToCompare: string) {
    this.#fieldName = fieldName;
    this.#fieldNameToCompare = fieldNameToCompare;
  }

  public validate(input: any): Error | undefined {
    if (input[this.#fieldName] !== input[this.#fieldNameToCompare]) {
      return new InvalidParamError(this.#fieldNameToCompare);
    }
  }
}
