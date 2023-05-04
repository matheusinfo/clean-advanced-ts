import { HttpGetClient } from '@/infra/http'
import { LoadFacebookUserApi } from '@/data/contracts/api'

export class FacebookApi {
  private readonly baseUrl = 'https://graph.facebook.com'

  constructor (
    private readonly httpGetClient: HttpGetClient,
    private readonly clientId: string,
    private readonly clientSecret: string
  ) {}

  async loadUser (params: LoadFacebookUserApi.Params): Promise<void> {
    const oAuthResult = await this.httpGetClient.get({
      url: `${this.baseUrl}/oauth/access_token`,
      params: {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: 'client_credentials'
      }
    })

    await this.httpGetClient.get({
      url: `${this.baseUrl}/debug_token`,
      params: {
        access_token: oAuthResult.access_token,
        input_token: params.token
      }
    })
  }
}
