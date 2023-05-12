import { getRepository } from 'typeorm'
import { LoadUserAccountRepository, SaveFacebookAccountRepository } from '@/data/contracts/repository'
import { PostgresUser } from '@/infra/postgres/entities'

export class PostgresUserAccountRepository implements LoadUserAccountRepository, SaveFacebookAccountRepository {
  private readonly postgresUserRepository = getRepository(PostgresUser)

  async load ({ email }: LoadUserAccountRepository.Params): Promise<LoadUserAccountRepository.Result> {
    const postgresUser = await this.postgresUserRepository.findOne({ email })

    if (postgresUser) {
      return {
        id: postgresUser.id.toString(),
        name: postgresUser.name ?? undefined
      }
    }
  }

  async saveWithFacebook ({ email, facebookId, name, id }: SaveFacebookAccountRepository.Params): Promise<SaveFacebookAccountRepository.Result> {
    let resultId: string

    if (!id) {
      const postgresUser = await this.postgresUserRepository.save({
        email,
        name,
        facebookId
      })

      resultId = postgresUser.id.toString()
    } else {
      await this.postgresUserRepository.update({
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
