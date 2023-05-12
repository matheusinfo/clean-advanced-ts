
import { PostgresUserAccountRepository } from '@/infra/postgres/repository'

export const makePgUserAccountRepository = (): PostgresUserAccountRepository => {
  return new PostgresUserAccountRepository()
}
