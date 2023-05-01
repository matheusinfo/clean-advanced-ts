import { mock, MockProxy } from 'jest-mock-extended'
import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthenticationService } from '@/data/services'
import { LoadFacebookUserApi } from '@/data/contracts/api/facebook'
import { CreateFacebookAccountRepository, LoadUserAccountRepository } from '@/data/contracts/repository'

describe('FacebookAuthenticationService', () => {
  let loadFacebookUserApiSpy: MockProxy<LoadFacebookUserApi>
  let loadUserAccountRepositorySpy: MockProxy<LoadUserAccountRepository>
  let createFacebookAccountRepository: MockProxy<CreateFacebookAccountRepository>
  let sut: FacebookAuthenticationService
  const token = 'any_token'

  beforeEach(() => {
    loadFacebookUserApiSpy = mock()
    loadFacebookUserApiSpy.loadUser.mockResolvedValueOnce({
      name: 'any_fb_name',
      email: 'any_fb_email',
      facebookId: 'any_fb_id'
    })
    loadUserAccountRepositorySpy = mock()
    createFacebookAccountRepository = mock()

    sut = new FacebookAuthenticationService(loadFacebookUserApiSpy, loadUserAccountRepositorySpy, createFacebookAccountRepository)
  })

  it('should call LoadFacebookUserApi with correct params', async () => {
    await sut.perform({ token })
    expect(loadFacebookUserApiSpy.loadUser).toHaveBeenCalledTimes(1)
    expect(loadFacebookUserApiSpy.loadUser).toHaveBeenCalledWith({ token })
  })

  it('should return AuthenticationError when LoadFacebookUserApi returns undefined', async () => {
    loadFacebookUserApiSpy.loadUser.mockResolvedValueOnce(undefined)
    const authResult = await sut.perform({ token })
    expect(authResult).toEqual(new AuthenticationError())
  })

  it('should call LoadUserAccountRepository when LoadUserFacebookApi returns data', async () => {
    await sut.perform({ token })
    expect(loadUserAccountRepositorySpy.load).toHaveBeenCalledTimes(1)
    expect(loadUserAccountRepositorySpy.load).toHaveBeenCalledWith({ email: 'any_fb_email' })
  })

  it('should call CreateFacebookAccountRepository when LoadUserAccountRepositoiry returns undefined', async () => {
    loadUserAccountRepositorySpy.load.mockResolvedValueOnce(undefined)
    await sut.perform({ token })
    expect(createFacebookAccountRepository.createFromFacebook).toHaveBeenCalledTimes(1)
    expect(createFacebookAccountRepository.createFromFacebook).toHaveBeenCalledWith({
      email: 'any_fb_email',
      name: 'any_fb_name',
      facebookId: 'any_fb_id'
    })
  })
})
