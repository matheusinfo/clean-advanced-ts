import { AccessToken } from '@/domain/entities'
import { AuthenticationError } from '@/domain/entities/errors'
import { RequiredStringValidator } from '@/application/validation'
import { FacebookLoginController } from '@/application/controllers'
import { UnauthorizedError } from '@/application/errors'

describe('FacebookLoginController', () => {
  let facebookAuth: jest.Mock
  let sut: FacebookLoginController
  let token: string

  beforeAll(() => {
    facebookAuth = jest.fn()
    facebookAuth.mockResolvedValue(new AccessToken('any_token'))
    token = 'any_token'
  })

  beforeEach(() => {
    sut = new FacebookLoginController(facebookAuth)
  })

  it('should build validators correctly', async () => {
    const validators = sut.buildValidators({ token })

    expect(validators).toEqual([
      new RequiredStringValidator(token, 'token')
    ])
  })

  it('should return 401 if authentication fails', async () => {
    facebookAuth.mockResolvedValueOnce(new AuthenticationError())
    const httpResponse = await sut.handle({ token })

    expect(httpResponse).toEqual({
      statusCode: 401,
      data: new UnauthorizedError()
    })
  })

  it('should call FacebookAuthentication with correct params', async () => {
    await sut.handle({ token })

    expect(facebookAuth).toHaveBeenCalledTimes(1)
    expect(facebookAuth).toHaveBeenCalledWith({ token })
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
})
