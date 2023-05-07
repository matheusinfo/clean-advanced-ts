import { IBackup, IMemoryDb, newDb } from 'pg-mem'
import { getRepository, getConnection, Repository } from 'typeorm'
import { PostgresUser } from '@/infra/postgres/entities'
import { PostgresUserAccountRepository } from '@/infra/postgres/repository'

const makeFakeDb = async (entities?: any[]): Promise<IMemoryDb> => {
  const db = newDb()
  const connection = await db.adapters.createTypeormConnection({
    type: 'postgres',
    entities: entities ?? 'src/infra/postgres/entities/index.ts'
  })
  await connection.synchronize()
  return db
}

describe('PostgresUserAccountRepository', () => {
  describe('load', () => {
    let sut: PostgresUserAccountRepository
    let postgresUserRepository: Repository<PostgresUser>
    let dbBackup: IBackup

    beforeAll(async () => {
      const db = await makeFakeDb([PostgresUser])
      dbBackup = db.backup()
      postgresUserRepository = getRepository(PostgresUser)
    })

    beforeEach(() => {
      dbBackup.restore()
      sut = new PostgresUserAccountRepository()
    })

    afterAll(async () => {
      await getConnection().close()
    })

    it('should return an account if email exists', async () => {
      await postgresUserRepository.save({ email: 'existing_email' })

      const account = await sut.load({
        email: 'existing_email'
      })

      expect(account).toEqual({
        id: '1'
      })
    })

    it('should return undefined if email does not exists', async () => {
      const account = await sut.load({
        email: 'existing_email'
      })

      expect(account).toBeUndefined()
    })
  })
})
