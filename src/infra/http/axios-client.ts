import axios from 'axios'
import { HttpGetClient } from './client'

export class AxiosHttpClient implements HttpGetClient {
  async get ({ url, params }: HttpGetClient.Params): Promise<any> {
    const result = await axios.get(url, {
      params
    })

    return result.data
  }
}
