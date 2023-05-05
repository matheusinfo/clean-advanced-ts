import { sign } from 'jsonwebtoken'
import { TokeGenerator } from '@/data/contracts/crypto'

export class JwtTokenGenerator {
  constructor (
    private readonly secret: string
  ) {}

  async generateToken (params: TokeGenerator.Params): Promise<TokeGenerator.Result> {
    const expirationInSeconds = params.expirationInMs / 1000

    return sign({ key: params.key }, this.secret, { expiresIn: expirationInSeconds })
  }
}
