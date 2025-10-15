import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { prisma } from '../config/prisma.js'
import { env } from '../config/env.js'

export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body
    const user = await prisma.user.findUnique({ where: { username } })
    if (!user) return res.status(401).json({ error: { code: 'INVALID_CREDENTIALS', message: 'Invalid credentials' } })
    const ok = await bcrypt.compare(password, user.password_hash)
    if (!ok) return res.status(401).json({ error: { code: 'INVALID_CREDENTIALS', message: 'Invalid credentials' } })
    const token = jwt.sign({ id: user.id, role: user.role, username }, env.JWT_SECRET, { expiresIn: '8h' })
    res.json({ accessToken: token, user: { id: user.id, role: user.role, username } })
  } catch (e) { next(e) }
}

export const me = async (req, res) => {
  res.json({ user: { id: req.user.id, role: req.user.role, username: req.user.username } })
}
