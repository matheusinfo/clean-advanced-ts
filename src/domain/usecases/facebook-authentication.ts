import { AccessToken, FacebookAccount } from '@/domain/entities'
import { AuthenticationError } from '@/domain/entities/errors'
import { TokeGenerator } from '@/domain/contracts/crypto'
import { LoadFacebookUserApi } from '@/domain/contracts/api'
import { LoadUserAccountRepository, SaveFacebookAccountRepository } from '@/domain/contracts/repository'

type Setup = (
  facebookApi: LoadFacebookUserApi,
  userAccountRepository: LoadUserAccountRepository & SaveFacebookAccountRepository,
  crypto: TokeGenerator
) => FacebookAuthentication

export type FacebookAuthentication = (params: { token: string }) => Promise<{ accessToken: string }>

export const setupFacebookAuthentication: Setup = (facebookApi, userAccountRepository, crypto) => async params => {
  const facebookApiResponse = await facebookApi.loadUser(params)

  if (!facebookApiResponse) {
    throw new AuthenticationError()
  }

  const loadAccountResponse = await userAccountRepository.load({ email: facebookApiResponse.email })
  const facebookAccount = new FacebookAccount(facebookApiResponse, loadAccountResponse)
  const saveAccountResponse = await userAccountRepository.saveWithFacebook(facebookAccount)
  const accessToken = await crypto.generateToken({ key: saveAccountResponse.id, expirationInMs: AccessToken.expirationInMs })
  return { accessToken }
}
