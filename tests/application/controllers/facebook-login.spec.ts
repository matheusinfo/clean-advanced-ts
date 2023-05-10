import { MockProxy, mock } from 'jest-mock-extended'
import { AccessToken } from '@/domain/models'
import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthentication } from '@/domain/features'
import { RequiredStringValidator, ValidationComposite } from '@/application/validation'
import { FacebookLoginController } from '@/application/controllers'
import { ServerError, UnauthorizedError } from '@/application/errors'

jest.mock('@/application/validation/composite')

describe('FacebookLoginController', () => {
  let facebookAuth: MockProxy<FacebookAuthentication>
  let sut: FacebookLoginController
  let token: string

  beforeAll(() => {
    facebookAuth = mock<FacebookAuthentication>()
    facebookAuth.perform.mockResolvedValue(new AccessToken('any_token'))
    token = 'any_token'
  })

  beforeEach(() => {
    sut = new FacebookLoginController(facebookAuth)
  })

  it('should return 400 if validation fails', async () => {
    const error = new Error('validation_error')
    const ValidationCompositeSpy = jest.fn().mockImplementationOnce(() => ({
      validate: jest.fn().mockReturnValueOnce(error)
    }))
    jest.mocked(ValidationComposite).mockImplementationOnce(ValidationCompositeSpy)
    const httpResponse = await sut.handle({ token })

    expect(ValidationCompositeSpy).toHaveBeenCalledWith([
      new RequiredStringValidator(token, 'token')
    ])
    expect(httpResponse).toEqual({
      statusCode: 400,
      data: error
    })
  })

  it('should return 401 if authentication fails', async () => {
    facebookAuth.perform.mockResolvedValueOnce(new AuthenticationError())
    const httpResponse = await sut.handle({ token })

    expect(httpResponse).toEqual({
      statusCode: 401,
      data: new UnauthorizedError()
    })
  })

  it('should call FacebookAuthentication with correct params', async () => {
    await sut.handle({ token })

    expect(facebookAuth.perform).toHaveBeenCalledTimes(1)
    expect(facebookAuth.perform).toHaveBeenCalledWith({ token })
  })

  it('should return 200 if authentication succeds', async () => {
    const httpResponse = await sut.handle({ token })

    expect(httpResponse).toEqual({
      statusCode: 200,
      data: {
        accessToken: token
      }
    })
  })

  it('should return 500 if authentication throws', async () => {
    const error = new Error('infra_error')
    facebookAuth.perform.mockRejectedValueOnce(error)
    const httpResponse = await sut.handle({ token })

    expect(httpResponse).toEqual({
      statusCode: 500,
      data: new ServerError(error)
    })
  })
})
