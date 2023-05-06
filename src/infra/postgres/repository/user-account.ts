import { getRepository } from 'typeorm'
import { LoadUserAccountRepository, SaveFacebookAccountRepository } from '@/data/contracts/repository'
import { PostgresUser } from '@/infra/postgres/entities'

export class PostgresUserAccountRepository implements LoadUserAccountRepository, SaveFacebookAccountRepository {
  async load (params: LoadUserAccountRepository.Params): Promise<LoadUserAccountRepository.Result> {
    const postgresUserRepository = getRepository(PostgresUser)
    const postgresUser = await postgresUserRepository.findOne({ email: params.email })

    if (postgresUser) {
      return {
        id: postgresUser.id.toString(),
        name: postgresUser.name ?? undefined
      }
    }
  }

  async saveWithFacebook (params: SaveFacebookAccountRepository.Params): Promise<SaveFacebookAccountRepository.Result> {
    const postgresUserRepository = getRepository(PostgresUser)

    if (!params.id) {
      await postgresUserRepository.save({
        email: params.email,
        name: params.name,
        facebookId: params.facebookId
      })
    } else {
      await postgresUserRepository.update({
        id: parseInt(params.id)
      }, {
        name: params.name,
        facebookId: params.facebookId
      })
    }

    return null as any
  }
}
