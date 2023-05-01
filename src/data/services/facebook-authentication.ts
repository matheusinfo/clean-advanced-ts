import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthentication } from '@/domain/features'
import { LoadFacebookUserApi } from '@/data/contracts/api'
import { LoadUserAccountRepository } from '../contracts/repository'

export class FacebookAuthenticationService {
  constructor (
    private readonly loadFacebookUserApi: LoadFacebookUserApi,
    private readonly loadUserAccountRepository: LoadUserAccountRepository
  ) {}

  async perform (params: FacebookAuthentication.Params): Promise<FacebookAuthentication.Result> {
    const facebookApiResponse = await this.loadFacebookUserApi.loadUser({ token: params.token })

    if (facebookApiResponse == null) {
      return new AuthenticationError()
    }

    await this.loadUserAccountRepository.load({ email: facebookApiResponse.email })

    return new AuthenticationError()
  }
}
