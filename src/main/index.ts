import './config/module-alias'
import 'reflect-metadata'
import { app } from './config/app'
import { env } from './config/env'
import { createConnection } from 'typeorm'
import { config } from '@/infra/postgres/helpers'

createConnection(config)
  .then(() => app.listen(env.app.port, () => console.log(`Server running at http://localhost:${env.app.port}`)))
  .catch(console.error)
