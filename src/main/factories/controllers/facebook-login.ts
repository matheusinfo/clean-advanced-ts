import { FacebookLoginController } from '@/application/controllers'
import { makeFacebookAuthenticationUsecase } from '@/main/factories/usecases'

export const makeFacebookLoginController = (): FacebookLoginController => {
  const facebookAuthenticationUsecase = makeFacebookAuthenticationUsecase()
  return new FacebookLoginController(facebookAuthenticationUsecase)
}
