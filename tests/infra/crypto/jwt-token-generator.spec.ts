
import jwt from 'jsonwebtoken'
import { TokeGenerator } from '@/data/contracts/crypto'

jest.mock('jsonwebtoken')

class JwtTokenGenerator {
  constructor (
    private readonly secret: string
  ) {}

  async generateToken (params: TokeGenerator.Params): Promise<TokeGenerator.Result> {
    const expirationInSeconds = params.expirationInMs / 1000

    return jwt.sign({ key: params.key }, this.secret, { expiresIn: expirationInSeconds })
  }
}

describe('JwtTokenGenerator', () => {
  let sut: JwtTokenGenerator
  let fakeJwt: jest.Mocked<typeof jwt>

  beforeAll(() => {
    fakeJwt = jwt as jest.Mocked<typeof jwt>
    fakeJwt.sign.mockImplementation(() => 'any_token')
  })

  beforeEach(() => {
    sut = new JwtTokenGenerator('any_secret')
  })

  describe('sign', () => {
    it('should call sign with correct params', async () => {
      await sut.generateToken({
        key: 'any_key',
        expirationInMs: 1000
      })

      expect(fakeJwt.sign).toHaveBeenCalledWith({ key: 'any_key' }, 'any_secret', { expiresIn: 1 })
      expect(fakeJwt.sign).toHaveBeenCalledTimes(1)
    })

    it('should return a token', async () => {
      const token = await sut.generateToken({
        key: 'any_key',
        expirationInMs: 1000
      })

      expect(token).toBe('any_token')
    })

    it('should rethrow if sign throws', async () => {
      fakeJwt.sign.mockImplementationOnce(() => { throw new Error('http_error') })

      const promise = sut.generateToken({
        key: 'any_key',
        expirationInMs: 1000
      })

      await expect(promise).rejects.toThrow(new Error('http_error'))
    })
  })
})
