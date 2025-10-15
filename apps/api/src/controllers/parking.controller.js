import { checkinService, checkoutService } from '../services/parking.service.js'

export const checkin = async (req, res, next) => {
  try {
    const result = await checkinService(req.body, req.user)
    res.status(201).json(result)
  } catch (e) { next(e) }
}

export const checkout = async (req, res, next) => {
  try {
    const result = await checkoutService(req.body, req.user)
    res.json(result)
  } catch (e) { next(e) }
}
