import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthenticationService } from '@/data/services'
import { LoadFacebookUserApi } from '@/data/contracts/api/facebook'

class LoadFacebookUserApiSpy implements LoadFacebookUserApi {
  token?: string
  result = undefined

  async loadUser (params: LoadFacebookUserApi.Params): Promise<LoadFacebookUserApi.Result> {
    this.token = params.token
    return this.result
  }
}

type SutTypes = {
  sut: FacebookAuthenticationService
  loadFacebookUserApiSpy: LoadFacebookUserApiSpy
}

const makeSut = (): SutTypes => {
  const loadFacebookUserApiSpy = new LoadFacebookUserApiSpy()
  const sut = new FacebookAuthenticationService(loadFacebookUserApiSpy)

  return {
    sut,
    loadFacebookUserApiSpy
  }
}

describe('FacebookAuthenticationService', () => {
  it('should call LoadFacebookUserApi with correct params', async () => {
    const { sut, loadFacebookUserApiSpy } = makeSut()
    await sut.perform({ token: 'any_token' })
    expect(loadFacebookUserApiSpy.token).toBe('any_token')
  })

  it('should return AuthenticationError when LoadFacebookUserApi returns undefined', async () => {
    const { sut, loadFacebookUserApiSpy } = makeSut()
    jest.spyOn(loadFacebookUserApiSpy, 'loadUser').mockResolvedValueOnce(undefined)
    const authResult = await sut.perform({ token: 'any_token' })
    expect(authResult).toEqual(new AuthenticationError())
  })
})
