import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthentication } from '@/domain/features'
import { LoadFacebookUserApi } from '@/data/contracts/api'
import { LoadUserAccountRepository, SaveFacebookAccountRepository } from '@/data/contracts/repository'

export class FacebookAuthenticationService {
  constructor (
    private readonly facebookApi: LoadFacebookUserApi,
    private readonly userAccountRepository: LoadUserAccountRepository & SaveFacebookAccountRepository
  ) {}

  async perform (params: FacebookAuthentication.Params): Promise<FacebookAuthentication.Result> {
    const facebookApiResponse = await this.facebookApi.loadUser({ token: params.token })

    if (!facebookApiResponse) {
      return new AuthenticationError()
    }

    const userAccountResponse = await this.userAccountRepository.load({ email: facebookApiResponse.email })

    await this.userAccountRepository.saveWithFacebook({
      id: userAccountResponse?.id,
      email: facebookApiResponse.email,
      name: userAccountResponse?.name || facebookApiResponse.name,
      facebookId: facebookApiResponse.facebookId
    })

    return new AuthenticationError()
  }
}
