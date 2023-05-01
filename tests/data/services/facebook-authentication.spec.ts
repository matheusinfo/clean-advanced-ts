import { mock, MockProxy } from 'jest-mock-extended'
import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthenticationService } from '@/data/services'
import { LoadFacebookUserApi } from '@/data/contracts/api/facebook'
import { LoadUserAccountRepository, SaveFacebookAccountRepository } from '@/data/contracts/repository'
import { FacebookAccount } from '@/domain/models'

jest.mock('@/domain/models/facebook-account')

describe('FacebookAuthenticationService', () => {
  let facebookApiSpy: MockProxy<LoadFacebookUserApi>
  let userAccountRepositorySpy: MockProxy<LoadUserAccountRepository & SaveFacebookAccountRepository>
  let sut: FacebookAuthenticationService
  const token = 'any_token'

  beforeEach(() => {
    facebookApiSpy = mock()
    facebookApiSpy.loadUser.mockResolvedValue({
      name: 'any_fb_name',
      email: 'any_fb_email',
      facebookId: 'any_fb_id'
    })
    userAccountRepositorySpy = mock()
    userAccountRepositorySpy.load.mockResolvedValue(undefined)

    sut = new FacebookAuthenticationService(facebookApiSpy, userAccountRepositorySpy)
  })

  it('should call LoadFacebookUserApi with correct params', async () => {
    await sut.perform({ token })

    expect(facebookApiSpy.loadUser).toHaveBeenCalledTimes(1)
    expect(facebookApiSpy.loadUser).toHaveBeenCalledWith({ token })
  })

  it('should return AuthenticationError when LoadFacebookUserApi returns undefined', async () => {
    facebookApiSpy.loadUser.mockResolvedValueOnce(undefined)

    const authResult = await sut.perform({ token })

    expect(authResult).toEqual(new AuthenticationError())
  })

  it('should call LoadUserAccountRepository when LoadUserFacebookApi returns data', async () => {
    await sut.perform({ token })

    expect(userAccountRepositorySpy.load).toHaveBeenCalledTimes(1)
    expect(userAccountRepositorySpy.load).toHaveBeenCalledWith({ email: 'any_fb_email' })
  })

  it('should call SaveFacebookAccountRepository with FacebookAccount', async () => {
    const facebookAccountStub = jest.fn().mockImplementation(() => ({
      any: 'any'
    }))
    jest.mocked(FacebookAccount).mockImplementation(facebookAccountStub)

    await sut.perform({ token })

    expect(userAccountRepositorySpy.saveWithFacebook).toHaveBeenCalledTimes(1)
    expect(userAccountRepositorySpy.saveWithFacebook).toHaveBeenCalledWith({
      any: 'any'
    })
  })
})
