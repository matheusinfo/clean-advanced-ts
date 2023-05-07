import { IBackup, newDb } from 'pg-mem'
import { LoadUserAccountRepository } from '@/data/contracts/repository'
import { Entity, PrimaryGeneratedColumn, Column, getRepository, getConnection, Repository } from 'typeorm'

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

@Entity({ name: 'usuarios' })
export class PostgresUser {
  @PrimaryGeneratedColumn()
    id!: number

  @Column({ name: 'nome', nullable: true })
    name?: string

  @Column()
    email!: string

  @Column({ name: 'id_facebook', nullable: true })
    facebookId?: string
}

describe('PostgresUserAccountRepository', () => {
  describe('load', () => {
    let sut: PostgresUserAccountRepository
    let postgresUserRepository: Repository<PostgresUser>
    let dbBackup: IBackup

    beforeAll(async () => {
      const db = newDb()
      const connection = await db.adapters.createTypeormConnection({
        type: 'postgres',
        entities: [PostgresUser]
      })
      await connection.synchronize()
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
