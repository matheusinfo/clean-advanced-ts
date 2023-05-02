import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthentication } from '@/domain/features'
import { LoadFacebookUserApi } from '@/data/contracts/api'
import { CreateFacebookAccountRepository, LoadUserAccountRepository, UpdateFacebookAccountRepository } from '@/data/contracts/repository'

export class FacebookAuthenticationService {
  constructor (
    private readonly facebookApi: LoadFacebookUserApi,
    private readonly userAccountRepository: LoadUserAccountRepository & CreateFacebookAccountRepository & UpdateFacebookAccountRepository
  ) {}

  async perform (params: FacebookAuthentication.Params): Promise<FacebookAuthentication.Result> {
    const facebookApiResponse = await this.facebookApi.loadUser({ token: params.token })

    if (!facebookApiResponse) {
      return new AuthenticationError()
    }

    const userAccountResponse = await this.userAccountRepository.load({ email: facebookApiResponse.email })

    if (userAccountResponse) {
      await this.userAccountRepository.updateWithFacebook({
        id: userAccountResponse.id,
        name: userAccountResponse.name || facebookApiResponse.name,
        facebookId: facebookApiResponse.facebookId
      })
    } else {
      await this.userAccountRepository.createFromFacebook({
        email: facebookApiResponse.email,
        name: facebookApiResponse.name,
        facebookId: facebookApiResponse.facebookId
      })
    }

    return new AuthenticationError()
  }
}
