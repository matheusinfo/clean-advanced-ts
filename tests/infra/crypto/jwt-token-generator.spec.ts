
import jwt from 'jsonwebtoken'
import { TokeGenerator } from '@/data/contracts/crypto'

jest.mock('jsonwebtoken')

class JwtTokenGenerator {
  constructor (
    private readonly secret: string
  ) {}

  async generateToken (params: TokeGenerator.Params): Promise<void> {
    const expirationInSeconds = params.expirationInMs / 1000

    jwt.sign({ key: params.key }, this.secret, { expiresIn: expirationInSeconds })
  }
}

describe('JwtTokenGenerator', () => {
  describe('sign', () => {
    it('should call sign with correct params', async () => {
      const fakeJwt = jwt as jest.Mocked<typeof jwt>
      const sut = new JwtTokenGenerator('any_secret')

      await sut.generateToken({
        key: 'any_key',
        expirationInMs: 1000
      })

      expect(fakeJwt.sign).toHaveBeenCalledWith({ key: 'any_key' }, 'any_secret', { expiresIn: 1 })
      expect(fakeJwt.sign).toHaveBeenCalledTimes(1)
    })
  })
})
