import { env } from '@/main/config/env'
import { ConnectionOptions } from 'typeorm'

export const config: ConnectionOptions = {
  type: 'postgres',
  host: env.db.postgresMain.host,
  port: Number(env.db.postgresMain.port),
  username: env.db.postgresMain.username,
  password: env.db.postgresMain.password,
  database: env.db.postgresMain.database,
  entities: ['dist/infra/postgres/entities/index.js']
}
