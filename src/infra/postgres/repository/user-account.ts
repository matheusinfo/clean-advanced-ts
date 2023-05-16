import { getRepository } from 'typeorm'
import { LoadUserAccountRepository, SaveFacebookAccountRepository } from '@/data/contracts/repository'
import { PostgresUser } from '@/infra/postgres/entities'

export class PostgresUserAccountRepository implements LoadUserAccountRepository, SaveFacebookAccountRepository {
  async load ({ email }: LoadUserAccountRepository.Params): Promise<LoadUserAccountRepository.Result> {
    const postgresUserRepository = getRepository(PostgresUser)
    const postgresUser = await postgresUserRepository.findOne({ email })

    if (postgresUser) {
      return {
        id: postgresUser.id.toString(),
        name: postgresUser.name ?? undefined
      }
    }
  }

  async saveWithFacebook ({ email, facebookId, name, id }: SaveFacebookAccountRepository.Params): Promise<SaveFacebookAccountRepository.Result> {
    const postgresUserRepository = getRepository(PostgresUser)
    let resultId: string

    if (!id) {
      const postgresUser = await postgresUserRepository.save({
        email,
        name,
        facebookId
      })

      resultId = postgresUser.id.toString()
    } else {
      await postgresUserRepository.update({
        id: parseInt(id)
      }, {
        name,
        facebookId
      })

      resultId = id
    }

    return {
      id: resultId
    }
  }
}
