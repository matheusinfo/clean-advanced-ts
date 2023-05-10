import { Controller } from './controller'
import { AccessToken } from '@/domain/models'
import { FacebookAuthentication } from '@/domain/features'
import { HttpResponse, success, unauthorized } from '@/application/helpers'
import { ValidationBuilder, Validator } from '@/application/validation'

type HttpRequest = {
  token: string
}

type ModelResponse = Error | {
  accessToken: string
}

export class FacebookLoginController extends Controller {
  constructor (
    private readonly facebookAuthentication: FacebookAuthentication
  ) {
    super()
  }

  async perform (httpRequest: HttpRequest): Promise<HttpResponse<ModelResponse>> {
    const result = await this.facebookAuthentication.perform({
      token: httpRequest.token
    })

    if (result instanceof AccessToken) {
      return success({
        accessToken: result.value
      })
    }

    return unauthorized()
  }

  override buildValidators (httpRequest: HttpRequest): Validator[] {
    return [
      ...ValidationBuilder.of({ value: httpRequest.token, fieldName: 'token' }).required().build()
    ]
  }
}
