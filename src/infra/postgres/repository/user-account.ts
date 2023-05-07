import { getRepository } from 'typeorm'
import { LoadUserAccountRepository } from '@/data/contracts/repository'
import { PostgresUser } from '@/infra/postgres/entities'

export class PostgresUserAccountRepository implements LoadUserAccountRepository {
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
}
