import { MockProxy, mock } from 'jest-mock-extended'

interface Validator {
  validate: () => Error | undefined
}

class ValidationComposite implements Validator {
  constructor (
    private readonly validators: Validator[]
  ) {}

  validate (): Error | undefined {
    for (const validator of this.validators) {
      const error = validator.validate()

      if (error) {
        return error
      }
    }

    return undefined
  }
}

describe('ValidationComposite', () => {
  let firstValidator: MockProxy<Validator>
  let secondValidator: MockProxy<Validator>
  let validators: Validator[]
  let sut: ValidationComposite

  beforeAll(() => {
    firstValidator = mock<Validator>()
    firstValidator.validate.mockReturnValue(undefined)
    secondValidator = mock<Validator>()
    firstValidator.validate.mockReturnValue(undefined)
    validators = [firstValidator, secondValidator]
  })

  beforeEach(() => {
    sut = new ValidationComposite(validators)
  })

  it('should return undefined if all Validators returns undefined', () => {
    const error = sut.validate()

    expect(error).toBeUndefined()
  })

  it('should return the first error', () => {
    firstValidator.validate.mockReturnValueOnce(new Error('first_error'))
    firstValidator.validate.mockReturnValueOnce(new Error('second_error'))
    const error = sut.validate()

    expect(error).toEqual(new Error('first_error'))
  })

  it('should return the unique error', () => {
    firstValidator.validate.mockReturnValueOnce(new Error('second_error'))
    const error = sut.validate()

    expect(error).toEqual(new Error('second_error'))
  })
})
