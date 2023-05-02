import { FacebookAccount } from '@/domain/models'
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
    const facebookApiResponse = await this.facebookApi.loadUser(params)

    if (!facebookApiResponse) {
      return new AuthenticationError()
    }

    const userAccountResponse = await this.userAccountRepository.load({ email: facebookApiResponse.email })
    const facebookAccount = new FacebookAccount(facebookApiResponse, userAccountResponse)
    await this.userAccountRepository.saveWithFacebook(facebookAccount)

    return new AuthenticationError()
  }
}
