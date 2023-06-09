import { IBackup } from 'pg-mem'
import { getRepository, getConnection, Repository } from 'typeorm'
import { PostgresUser } from '@/infra/postgres/entities'
import { PostgresUserAccountRepository } from '@/infra/postgres/repository'
import { makeFakeDb } from '@/tests/infra/postgres/mocks'

describe('PostgresUserAccountRepository', () => {
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

  describe('load', () => {
    it('should return an account if email exists', async () => {
      await postgresUserRepository.save({ email: 'existing_email' })

      const account = await sut.load({ email: 'existing_email' })

      expect(account).toEqual({ id: '1' })
    })

    it('should return undefined if email does not exists', async () => {
      const account = await sut.load({ email: 'existing_email' })

      expect(account).toBeUndefined()
    })
  })

  describe('saveWithFacebook', () => {
    it('should create an account if id is undefined', async () => {
      const account = await sut.saveWithFacebook({
        email: 'any_email',
        name: 'any_name',
        facebookId: 'any_fb_id'
      })

      const loadUser = await postgresUserRepository.findOne({ email: 'any_email' })

      expect(loadUser?.id).toBe(1)
      expect(account.id).toBe('1')
    })

    it('should update account if id is undefined', async () => {
      await postgresUserRepository.save({
        email: 'any_email',
        name: 'any_name',
        facebookId: 'any_fb_id'
      })

      const account = await sut.saveWithFacebook({
        id: '1',
        email: 'new_email',
        name: 'new_name',
        facebookId: 'new_fb_id'
      })

      const loadUser = await postgresUserRepository.findOne({ id: 1 })

      expect(loadUser).toEqual({
        id: 1,
        email: 'any_email',
        name: 'new_name',
        facebookId: 'new_fb_id'
      })
      expect(account.id).toBe('1')
    })
  })
})
