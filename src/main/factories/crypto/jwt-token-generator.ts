import { env } from '@/main/config/env'
import { JwtTokenGenerator } from '@/infra/crypto/jwt-token-generator'

export const makeJwtTokenGenerator = (): JwtTokenGenerator => {
  return new JwtTokenGenerator(env.app.jwtSecret)
}
