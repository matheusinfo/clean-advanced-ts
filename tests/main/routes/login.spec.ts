import request from 'supertest'
import { IBackup } from 'pg-mem'
import { getConnection } from 'typeorm'
import { app } from '@/main/config/app'
import { makeFakeDb } from '@/tests/infra/postgres/mocks'
import { PostgresUser } from '@/infra/postgres/entities'
import { UnauthorizedError } from '@/application/errors'

describe('LoginRoutes', () => {
  describe('POST /login/facebook', () => {
    let dbBackup: IBackup
    const loadUSerspy = jest.fn()

    jest.mock('@/infra/api/facebook', () => ({
      FacebookApi: jest.fn().mockReturnValue({
        loadUser: loadUSerspy
      })
    }))

    beforeAll(async () => {
      const db = await makeFakeDb([PostgresUser])
      dbBackup = db.backup()
    })

    beforeEach(() => {
      dbBackup.restore()
    })

    afterAll(async () => {
      await getConnection().close()
    })

    it('should return 200 with accessToken', async () => {
      loadUSerspy.mockResolvedValueOnce({
        facebookId: 'any_fb_id',
        email: 'any_fb_email',
        name: 'any_fb_name'
      })

      const { status, body } = await request(app)
        .post('/api/login/facebook')
        .send({ token: 'valid_token' })

      expect(status).toBe(200)
      expect(body.accessToken).toBeDefined()
    })

    it('should return 401 with UnauthorizedError', async () => {
      await request(app)
        .post('/api/login/facebook')
        .send({ token: 'invalid_token' })
        .expect(401, { error: new UnauthorizedError().message })
    })
  })
})
