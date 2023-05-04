import { mock } from 'jest-mock-extended'
import { FacebookApi } from '@/infra/api'
import { HttpGetClient } from '@/infra/http'

describe('FacebookApi', () => {
  let clientId = 'any_client_id'
  let clientSecret = 'any_client_secret'
  let httpClient: HttpGetClient
  let sut: FacebookApi

  beforeAll(() => {
    httpClient = mock()
  })

  beforeEach(() => {
    clientId = 'any_client_id'
    clientSecret = 'any_client_secret'
    sut = new FacebookApi(httpClient, clientId, clientSecret)
  })

  it('should get app token', async () => {
    await sut.loadUser({
      token: 'any_client_token'
    })

    expect(httpClient.get).toHaveBeenCalledWith({
      url: 'https://graph.facebook.com/oauth/access_token',
      params: {
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'client_credentials'
      }
    })
  })
})
