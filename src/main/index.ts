import './config/module-alias'
import 'reflect-metadata'
import { app } from './config/app'
import { env } from './config/env'

app.listen(env.app.port, () => console.log(`Server running at http://localhost:${env.app.port}`))
