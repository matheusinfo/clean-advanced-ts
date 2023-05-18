import { AccessToken, FacebookAccount } from '@/domain/entities'
import { AuthenticationError } from '@/domain/entities/errors'
import { FacebookAuthentication } from '@/domain/features'
import { TokeGenerator } from '@/domain/contracts/crypto'
import { LoadFacebookUserApi } from '@/domain/contracts/api'
import { LoadUserAccountRepository, SaveFacebookAccountRepository } from '@/domain/contracts/repository'

export class FacebookAuthenticationUsecase implements FacebookAuthentication {
  constructor (
    private readonly facebookApi: LoadFacebookUserApi,
    private readonly userAccountRepository: LoadUserAccountRepository & SaveFacebookAccountRepository,
    private readonly crypto: TokeGenerator
  ) {}

  async perform ({ token }: FacebookAuthentication.Params): Promise<FacebookAuthentication.Result> {
    const facebookApiResponse = await this.facebookApi.loadUser({ token })

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
