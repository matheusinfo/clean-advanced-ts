import { newDb } from 'pg-mem'
import { LoadUserAccountRepository } from '@/data/contracts/repository'
import { Entity, PrimaryGeneratedColumn, Column, getRepository } from 'typeorm'

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
    it('should return an account if email exists', async () => {
      const db = newDb()
      const connection = await db.adapters.createTypeormConnection({
        type: 'postgres',
        entities: [PostgresUser]
      })
      await connection.synchronize()
      const postgresUserRepository = getRepository(PostgresUser)
      await postgresUserRepository.save({ email: 'existing_email' })
      const sut = new PostgresUserAccountRepository()

      const account = await sut.load({
        email: 'existing_email'
      })

      expect(account).toEqual({
        id: '1'
      })

      await connection.close()
    })

    it('should return undefined if email does not exists', async () => {
      const db = newDb()
      const connection = await db.adapters.createTypeormConnection({
        type: 'postgres',
        entities: [PostgresUser]
      })
      await connection.synchronize()

      const sut = new PostgresUserAccountRepository()

      const account = await sut.load({
        email: 'existing_email'
      })

      expect(account).toBeUndefined()
      await connection.close()
    })
  })
})
