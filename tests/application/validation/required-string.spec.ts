import { RequiredFieldError } from '@/application/errors'
import { RequiredStringValidation } from '@/application/validation'

describe('RequiredStringValidation', () => {
  it('should return RequiredFieldError if value is empty', () => {
    const sut = new RequiredStringValidation('', 'any_field')

    const error = sut.validate()

    expect(error).toEqual(new RequiredFieldError('any_field'))
  })

  it('should return RequiredFieldError if value is null', () => {
    const sut = new RequiredStringValidation(null as any, 'any_field')

    const error = sut.validate()

    expect(error).toEqual(new RequiredFieldError('any_field'))
  })

  it('should return RequiredFieldError if value is undefined', () => {
    const sut = new RequiredStringValidation(undefined as any, 'any_field')

    const error = sut.validate()

    expect(error).toEqual(new RequiredFieldError('any_field'))
  })

  it('should undefined if value is not empty', () => {
    const sut = new RequiredStringValidation('any_value', 'any_field')

    const error = sut.validate()

    expect(error).toBeUndefined()
  })
})
