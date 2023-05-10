import { mock } from 'jest-mock-extended'

interface Validator {
  validate: () => Error | undefined
}

class ValidationComposite {
  constructor (
    private readonly validators: Validator[]
  ) {}

  validate (): undefined {
    return undefined
  }
}

describe('ValidationComposite', () => {
  it('should return undefined if all Validators returns undefined', () => {
    const firstValidator = mock<Validator>()
    firstValidator.validate.mockReturnValue(undefined)
    const secondValidator = mock<Validator>()
    firstValidator.validate.mockReturnValue(undefined)
    const validators = [firstValidator, secondValidator]
    const sut = new ValidationComposite(validators)

    const error = sut.validate()

    expect(error).toBeUndefined()
  })
})
