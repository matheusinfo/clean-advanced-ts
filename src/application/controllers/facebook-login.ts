import { AccessToken } from '@/domain/models'
import { FacebookAuthentication } from '@/domain/features'
import { HttpResponse, badRequest, serverError, success, unauthorized } from '@/application/helpers'
import { RequiredStringValidation } from '@/application/validation'

type HttpRequest = {
  token: string
}

type ModelResponse = Error | {
  accessToken: string
}

export class FacebookLoginController {
  constructor (
    private readonly facebookAuthentication: FacebookAuthentication
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse<ModelResponse>> {
    try {
      const error = this.validate(httpRequest)

      if (error) {
        return badRequest(error)
      }

      const result = await this.facebookAuthentication.perform({
        token: httpRequest.token
      })

      if (result instanceof AccessToken) {
        return success({
          accessToken: result.value
        })
      }

      return unauthorized()
    } catch (error) {
      return serverError(error)
    }
  }

  private validate (httpRequest: HttpRequest): Error | undefined {
    const validator = new RequiredStringValidation(httpRequest.token, 'token')
    return validator.validate()
  }
}
