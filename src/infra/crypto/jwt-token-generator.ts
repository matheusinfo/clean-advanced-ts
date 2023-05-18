import { sign } from 'jsonwebtoken'
import { TokeGenerator } from '@/domain/contracts/crypto'

export class JwtTokenGenerator implements JwtTokenGenerator {
  constructor (
    private readonly secret: string
  ) {}

  async generateToken ({ expirationInMs, key }: TokeGenerator.Params): Promise<TokeGenerator.Result> {
    const expirationInSeconds = expirationInMs / 1000

    return sign({ key }, this.secret, { expiresIn: expirationInSeconds })
  }
}
