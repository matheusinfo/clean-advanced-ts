import { RequestHandler } from 'express'
import { Controller } from '@/application/controllers'

type Adapter = (controller: Controller) => RequestHandler

// eslint-disable-next-line @typescript-eslint/no-misused-promises
export const adaptExpressRoute: Adapter = controller => async (req, res) => {
  const { data, statusCode } = await controller.handle({ ...req.body })

  if (statusCode >= 200 && statusCode <= 299) {
    res.status(statusCode).json(data)
  } else {
    res.status(statusCode).json({ error: data.message })
  }
}
