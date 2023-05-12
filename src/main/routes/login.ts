import { Router } from 'express'
import { makeFacebookLoginController } from '../factories/controllers'
import { adaptExpressRoute } from '@/infra/http'

export default (router: Router): void => {
  const controller = makeFacebookLoginController()
  router.post('/api/login/facebook', adaptExpressRoute(controller))
}
