import { FacebookAuthenticationUsecase } from '@/domain/usecases'
import { makeFacebookApi } from '@/main/factories/api'
import { makeJwtTokenGenerator } from '@/main/factories/crypto'
import { makePgUserAccountRepository } from '@/main/factories/repository'

export const makeFacebookAuthenticationUsecase = (): FacebookAuthenticationUsecase => {
  const facebookApi = makeFacebookApi()
  const postgresUserAccountRepository = makePgUserAccountRepository()
  const jwtTokenGenerator = makeJwtTokenGenerator()
  return new FacebookAuthenticationUsecase(facebookApi, postgresUserAccountRepository, jwtTokenGenerator)
}
