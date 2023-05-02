import { AccessToken, FacebookAccount } from '@/domain/models'
import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthentication } from '@/domain/features'
import { TokeGenerator } from '@/data/contracts/crypto'
import { LoadFacebookUserApi } from '@/data/contracts/api'
import { LoadUserAccountRepository, SaveFacebookAccountRepository } from '@/data/contracts/repository'

export class FacebookAuthenticationService {
  constructor (
    private readonly facebookApi: LoadFacebookUserApi,
    private readonly userAccountRepository: LoadUserAccountRepository & SaveFacebookAccountRepository,
    private readonly crypto: TokeGenerator
  ) {}

  async perform (params: FacebookAuthentication.Params): Promise<FacebookAuthentication.Result> {
    const facebookApiResponse = await this.facebookApi.loadUser(params)

    if (!facebookApiResponse) {
      return new AuthenticationError()
    }

    const loadAccountResponse = await this.userAccountRepository.load({ email: facebookApiResponse.email })
    const facebookAccount = new FacebookAccount(facebookApiResponse, loadAccountResponse)
    const saveAccountResponse = await this.userAccountRepository.saveWithFacebook(facebookAccount)
    const generatedToken = await this.crypto.generateToken({ key: saveAccountResponse.id, expirationInMs: AccessToken.expirationInMs })

    return new AccessToken(generatedToken)
  }
}
