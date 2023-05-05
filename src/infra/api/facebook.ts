import { HttpGetClient } from '@/infra/http'
import { LoadFacebookUserApi } from '@/data/contracts/api'

type AppToken = {
  access_token: string
}

type DebugToken = {
  data: {
    user_id: string
  }
}

type UserInfo = {
  id: string
  name: string
  email: string
}

export class FacebookApi {
  private readonly baseUrl = 'https://graph.facebook.com'

  constructor (
    private readonly httpGetClient: HttpGetClient,
    private readonly clientId: string,
    private readonly clientSecret: string
  ) {}

  async loadUser (params: LoadFacebookUserApi.Params): Promise<LoadFacebookUserApi.Result> {
    const userInfoResult = await this.getUserInfo(params.token)

    return {
      facebookId: userInfoResult.id,
      name: userInfoResult.name,
      email: userInfoResult.email
    }
  }

  private async getAppToken (): Promise<AppToken> {
    return this.httpGetClient.get({
      url: `${this.baseUrl}/oauth/access_token`,
      params: {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: 'client_credentials'
      }
    })
  }

  private async getDebugToken (clientToken: string): Promise<DebugToken> {
    const oAuthResult = await this.getAppToken()

    return this.httpGetClient.get({
      url: `${this.baseUrl}/debug_token`,
      params: {
        access_token: oAuthResult.access_token,
        input_token: clientToken
      }
    })
  }

  private async getUserInfo (clientToken: string): Promise<UserInfo> {
    const debugTokenResult = await this.getDebugToken(clientToken)

    return this.httpGetClient.get({
      url: `${this.baseUrl}/${debugTokenResult.data.user_id}`,
      params: {
        fields: ['id', 'name', 'email'].join(','),
        access_token: clientToken
      }
    })
  }
}
