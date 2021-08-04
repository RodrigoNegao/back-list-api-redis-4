import { InvalidParamError } from "../errors/invalid-param.error";
import { isValidCPF } from "../../../utils";

export class CPFValidator {
  readonly #fieldName: string;

  constructor(fieldName: string) {
    this.#fieldName = fieldName;
  }

  public validate(input: any): Error | undefined {
    if (!isValidCPF(input[this.#fieldName])) {
      return new InvalidParamError(this.#fieldName);
    }
  }
}
