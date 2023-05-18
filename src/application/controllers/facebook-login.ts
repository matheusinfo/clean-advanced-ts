import { Controller } from './controller'
import { AccessToken } from '@/domain/entities'
import { HttpResponse, success, unauthorized } from '@/application/helpers'
import { ValidationBuilder, Validator } from '@/application/validation'
import { FacebookAuthentication } from '@/domain/usecases'

type HttpRequest = { token: string }

type ModelResponse = Error | { accessToken: string }

export class FacebookLoginController extends Controller {
  constructor (
    private readonly facebookAuthentication: FacebookAuthentication
  ) {
    super()
  }

  async perform ({ token }: HttpRequest): Promise<HttpResponse<ModelResponse>> {
    const result = await this.facebookAuthentication({
      token
    })

    if (result instanceof AccessToken) {
      return success({
        accessToken: result.value
      })
    }

    return unauthorized()
  }

  override buildValidators ({ token }: HttpRequest): Validator[] {
    return [
      ...ValidationBuilder.of({ value: token, fieldName: 'token' }).required().build()
    ]
  }
}
