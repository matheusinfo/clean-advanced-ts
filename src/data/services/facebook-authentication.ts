import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthentication } from '@/domain/features'
import { LoadFacebookUserApi } from '@/data/contracts/api'
import { CreateFacebookAccountRepository, LoadUserAccountRepository } from '@/data/contracts/repository'

export class FacebookAuthenticationService {
  constructor (
    private readonly loadFacebookUserApi: LoadFacebookUserApi,
    private readonly loadUserAccountRepository: LoadUserAccountRepository,
    private readonly createFacebookAccountRepository: CreateFacebookAccountRepository
  ) {}

  async perform (params: FacebookAuthentication.Params): Promise<FacebookAuthentication.Result> {
    const facebookApiResponse = await this.loadFacebookUserApi.loadUser({ token: params.token })

    if (!facebookApiResponse) {
      return new AuthenticationError()
    }

    await this.loadUserAccountRepository.load({ email: facebookApiResponse.email })

    await this.createFacebookAccountRepository.createFromFacebook({
      email: facebookApiResponse.email,
      name: facebookApiResponse.name,
      facebookId: facebookApiResponse.facebookId
    })

    return new AuthenticationError()
  }
}
