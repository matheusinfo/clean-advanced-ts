import { mock, MockProxy } from 'jest-mock-extended'
import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthenticationService } from '@/data/services'
import { LoadFacebookUserApi } from '@/data/contracts/api/facebook'

describe('FacebookAuthenticationService', () => {
  let loadFacebookUserApiSpy: MockProxy<LoadFacebookUserApi>
  let sut: FacebookAuthenticationService
  const token = 'any_token'

  beforeEach(() => {
    loadFacebookUserApiSpy = mock()
    sut = new FacebookAuthenticationService(loadFacebookUserApiSpy)
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
})
