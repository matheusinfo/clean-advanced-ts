import { setupFacebookAuthentication, FacebookAuthentication } from '@/domain/usecases'
import { makeFacebookApi } from '@/main/factories/api'
import { makeJwtTokenGenerator } from '@/main/factories/crypto'
import { makePgUserAccountRepository } from '@/main/factories/repository'

export const makeFacebookAuthentication = (): FacebookAuthentication => {
  const facebookApi = makeFacebookApi()
  const postgresUserAccountRepository = makePgUserAccountRepository()
  const jwtTokenGenerator = makeJwtTokenGenerator()
  return setupFacebookAuthentication(facebookApi, postgresUserAccountRepository, jwtTokenGenerator)
}
