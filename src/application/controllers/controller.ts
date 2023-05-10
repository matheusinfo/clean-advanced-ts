import { ValidationComposite, Validator } from '@/application/validation'
import { HttpResponse, badRequest, serverError } from '@/application/helpers'

export abstract class Controller {
  abstract perform (httpRequest: any): Promise<HttpResponse>

  buildValidators (httpRequest: any): Validator[] {
    return []
  }

  async handle (httpRequest: any): Promise<HttpResponse> {
    const error = this.validate(httpRequest)

    if (error) {
      return badRequest(error)
    }

    try {
      return await this.perform(httpRequest)
    } catch (error) {
      return serverError(error)
    }
  }

  private validate (httpRequest: any): Error | undefined {
    return new ValidationComposite(this.buildValidators(httpRequest)).validate()
  }
}
