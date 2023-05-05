import axios from 'axios'
import { HttpGetClient } from './client'

export class AxiosHttpClient {
  async get ({ url, params }: HttpGetClient.Params): Promise<any> {
    const result = await axios.get(url, {
      params
    })

    return result.data
  }
}
