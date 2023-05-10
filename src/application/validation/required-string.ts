import { RequiredFieldError } from '@/application/errors'

export class RequiredStringValidation {
  constructor (
    private readonly value: string,
    private readonly fieldName: string
  ) {}

  validate (): Error | undefined {
    return new RequiredFieldError(this.fieldName)
  }
}
