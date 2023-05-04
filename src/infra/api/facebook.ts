import { HttpGetClient } from '@/infra/http'
import { LoadFacebookUserApi } from '@/data/contracts/api'

export class FacebookApi {
  private readonly baseUrl = 'https://graph.facebook.com'

  constructor (
    private readonly httpGetClient: HttpGetClient,
    private readonly clientId: string,
    private readonly clientSecret: string
  ) {}

  async loadUser (params: LoadFacebookUserApi.Params): Promise<LoadFacebookUserApi.Result> {
    const oAuthResult = await this.httpGetClient.get({
      url: `${this.baseUrl}/oauth/access_token`,
      params: {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: 'client_credentials'
      }
    })

    const debugTokenResult = await this.httpGetClient.get({
      url: `${this.baseUrl}/debug_token`,
      params: {
        access_token: oAuthResult.access_token,
        input_token: params.token
      }
    })

    const userInfoResult = await this.httpGetClient.get({
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      url: `${this.baseUrl}/${debugTokenResult.data.user_id}`,
      params: {
        fields: ['id', 'name', 'email'].join(','),
        access_token: params.token
      }
    })

    return {
      facebookId: userInfoResult.id,
      name: userInfoResult.name,
      email: userInfoResult.email
    }
  }
}
