import { mock, MockProxy } from 'jest-mock-extended'
import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthenticationService } from '@/data/services'
import { LoadFacebookUserApi } from '@/data/contracts/api/facebook'
import { CreateFacebookAccountRepository, LoadUserAccountRepository, UpdateFacebookAccountRepository } from '@/data/contracts/repository'

describe('FacebookAuthenticationService', () => {
  let facebookApiSpy: MockProxy<LoadFacebookUserApi>
  let userAccountRepositorySpy: MockProxy<LoadUserAccountRepository & CreateFacebookAccountRepository & UpdateFacebookAccountRepository>
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

  it('should call CreateFacebookAccountRepository when LoadUserAccountRepositoiry returns undefined', async () => {
    await sut.perform({ token })

    expect(userAccountRepositorySpy.createFromFacebook).toHaveBeenCalledTimes(1)
    expect(userAccountRepositorySpy.createFromFacebook).toHaveBeenCalledWith({
      email: 'any_fb_email',
      name: 'any_fb_name',
      facebookId: 'any_fb_id'
    })
  })

  it('should call UpdateFacebookAccountRepository when LoadUserAccountRepositoiry returns data without name', async () => {
    userAccountRepositorySpy.load.mockResolvedValueOnce({
      id: 'any_id',
      name: ''
    })

    await sut.perform({ token })

    expect(userAccountRepositorySpy.updateWithFacebook).toHaveBeenCalledTimes(1)
    expect(userAccountRepositorySpy.updateWithFacebook).toHaveBeenCalledWith({
      id: 'any_id',
      name: 'any_fb_name',
      facebookId: 'any_fb_id'
    })
  })

  it('should call UpdateFacebookAccountRepository when LoadUserAccountRepositoiry returns data with name', async () => {
    userAccountRepositorySpy.load.mockResolvedValueOnce({
      id: 'any_id',
      name: 'any_name'
    })

    await sut.perform({ token })

    expect(userAccountRepositorySpy.updateWithFacebook).toHaveBeenCalledTimes(1)
    expect(userAccountRepositorySpy.updateWithFacebook).toHaveBeenCalledWith({
      id: 'any_id',
      name: 'any_name',
      facebookId: 'any_fb_id'
    })
  })
})
