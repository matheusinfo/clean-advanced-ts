import { FacebookAuthenticationService } from '@/domain/services'
import { makeFacebookApi } from '@/main/factories/api'
import { makeJwtTokenGenerator } from '@/main/factories/crypto'
import { makePgUserAccountRepository } from '@/main/factories/repository'

export const makeFacebookAuthenticationService = (): FacebookAuthenticationService => {
  const facebookApi = makeFacebookApi()
  const postgresUserAccountRepository = makePgUserAccountRepository()
  const jwtTokenGenerator = makeJwtTokenGenerator()
  return new FacebookAuthenticationService(facebookApi, postgresUserAccountRepository, jwtTokenGenerator)
}
