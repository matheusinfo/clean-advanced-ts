import { mock, MockProxy } from 'jest-mock-extended'
import { FacebookAccount } from '@/domain/models'
import { AuthenticationError } from '@/domain/errors'
import { TokeGenerator } from '@/data/contracts/crypto'
import { FacebookAuthenticationService } from '@/data/services'
import { LoadFacebookUserApi } from '@/data/contracts/api/facebook'
import { LoadUserAccountRepository, SaveFacebookAccountRepository } from '@/data/contracts/repository'

jest.mock('@/domain/models/facebook-account')

describe('FacebookAuthenticationService', () => {
  let cryptoSpy: MockProxy<TokeGenerator>
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
    userAccountRepositorySpy.saveWithFacebook.mockResolvedValue({
      id: 'any_account_id'
    })
    userAccountRepositorySpy.load.mockResolvedValue(undefined)
    cryptoSpy = mock()

    sut = new FacebookAuthenticationService(facebookApiSpy, userAccountRepositorySpy, cryptoSpy)
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

  it('should call TokeGenerator with correct params', async () => {
    await sut.perform({ token })

    expect(cryptoSpy.generateToken).toHaveBeenCalledWith({
      key: 'any_account_id'
    })
    expect(cryptoSpy.generateToken).toHaveBeenCalledTimes(1)
  })
})
