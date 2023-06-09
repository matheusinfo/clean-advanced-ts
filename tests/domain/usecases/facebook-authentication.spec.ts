import { mock, MockProxy } from 'jest-mock-extended'
import { AccessToken, FacebookAccount } from '@/domain/entities'
import { AuthenticationError } from '@/domain/entities/errors'
import { TokeGenerator } from '@/domain/contracts/crypto'
import { setupFacebookAuthentication, FacebookAuthentication } from '@/domain/usecases'
import { LoadFacebookUserApi } from '@/domain/contracts/api/facebook'
import { LoadUserAccountRepository, SaveFacebookAccountRepository } from '@/domain/contracts/repository'

jest.mock('@/domain/entities/facebook-account')

describe('FacebookAuthentication', () => {
  let cryptoSpy: MockProxy<TokeGenerator>
  let facebookApiSpy: MockProxy<LoadFacebookUserApi>
  let userAccountRepositorySpy: MockProxy<LoadUserAccountRepository & SaveFacebookAccountRepository>
  let sut: FacebookAuthentication
  let token: string

  beforeAll(() => {
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
    cryptoSpy.generateToken.mockResolvedValue('any_generated_token')
    token = 'any_token'
  })

  beforeEach(() => {
    sut = setupFacebookAuthentication(facebookApiSpy, userAccountRepositorySpy, cryptoSpy)
  })

  it('should call LoadFacebookUserApi with correct params', async () => {
    await sut({ token })

    expect(facebookApiSpy.loadUser).toHaveBeenCalledTimes(1)
    expect(facebookApiSpy.loadUser).toHaveBeenCalledWith({ token })
  })

  it('should throw AuthenticationError when LoadFacebookUserApi returns undefined', async () => {
    facebookApiSpy.loadUser.mockResolvedValueOnce(undefined)

    const authResult = sut({ token })

    await expect(authResult).rejects.toThrow(new AuthenticationError())
  })

  it('should rethrow if LoadFacebookUserApi throws', async () => {
    facebookApiSpy.loadUser.mockRejectedValueOnce(new Error('fb_error'))

    const promise = sut({ token })

    await expect(promise).rejects.toThrow(new Error('fb_error'))
  })

  it('should call LoadUserAccountRepository when LoadUserFacebookApi returns data', async () => {
    await sut({ token })

    expect(userAccountRepositorySpy.load).toHaveBeenCalledTimes(1)
    expect(userAccountRepositorySpy.load).toHaveBeenCalledWith({ email: 'any_fb_email' })
  })

  it('should rethrow if LoadUserAccountRepository throws', async () => {
    userAccountRepositorySpy.load.mockRejectedValueOnce(new Error('load_error'))

    const promise = sut({ token })

    await expect(promise).rejects.toThrow(new Error('load_error'))
  })

  it('should call SaveFacebookAccountRepository with FacebookAccount', async () => {
    const facebookAccountStub = jest.fn().mockImplementation(() => ({
      any: 'any'
    }))
    jest.mocked(FacebookAccount).mockImplementation(facebookAccountStub)

    await sut({ token })

    expect(userAccountRepositorySpy.saveWithFacebook).toHaveBeenCalledTimes(1)
    expect(userAccountRepositorySpy.saveWithFacebook).toHaveBeenCalledWith({
      any: 'any'
    })
  })

  it('should rethrow if SaveFacebookAccountRepository throws', async () => {
    userAccountRepositorySpy.saveWithFacebook.mockRejectedValueOnce(new Error('save_error'))

    const promise = sut({ token })

    await expect(promise).rejects.toThrow(new Error('save_error'))
  })

  it('should call TokeGenerator with correct params', async () => {
    await sut({ token })

    expect(cryptoSpy.generateToken).toHaveBeenCalledWith({
      key: 'any_account_id',
      expirationInMs: AccessToken.expirationInMs
    })
    expect(cryptoSpy.generateToken).toHaveBeenCalledTimes(1)
  })

  it('should rethrow if TokeGenerator throws', async () => {
    cryptoSpy.generateToken.mockRejectedValueOnce(new Error('token_error'))

    const promise = sut({ token })

    await expect(promise).rejects.toThrow(new Error('token_error'))
  })

  it('should return an AccessToken on success', async () => {
    const authResult = await sut({ token })

    expect(authResult).toEqual({ accessToken: 'any_generated_token' })
  })
})
