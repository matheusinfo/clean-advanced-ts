import { mock, MockProxy } from 'jest-mock-extended'
import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthenticationService } from '@/data/services'
import { LoadFacebookUserApi } from '@/data/contracts/api/facebook'
import { LoadUserAccountRepository } from '@/data/contracts/repository'

describe('FacebookAuthenticationService', () => {
  let loadFacebookUserApiSpy: MockProxy<LoadFacebookUserApi>
  let loadUserAccountRepositorySpy: MockProxy<LoadUserAccountRepository>
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

    sut = new FacebookAuthenticationService(loadFacebookUserApiSpy, loadUserAccountRepositorySpy)
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
})
