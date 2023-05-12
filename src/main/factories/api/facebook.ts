import { FacebookApi } from '@/infra/api'
import { env } from '@/main/config/env'
import { makeAxiosHttpClient } from '@/main/factories/http'

export const makeFacebookApi = (): FacebookApi => {
  const axiosClient = makeAxiosHttpClient()
  return new FacebookApi(axiosClient, env.facebookApi.clientId, env.facebookApi.clientSecret)
}
